import express from "express";
import cors from "cors";
import _ from "lodash";
import { teamName, teamNameLocalized, skillName } from "./config.js";
import { makeResponse } from "./utils/makeResponse.js";
import { greeting, greetingTTS } from "./responses/greeting.js";
import {
  quitSkillTriggers,
  quizAnswerTrigger,
  quizQuitTriggers,
  quizTrigger,
} from "./utils/triggers.js";
import { Quiz } from "./responses/quiz.js";

const app = express();
const quizController = new Quiz();
const port = 3000;

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cors());

app.post("/hook", ({ body }, res) => {
  const session = body.session;

  const version = body.version;
  const parsedRequest = body.request;
  const command = parsedRequest.command.toLowerCase();

  let state = quizController.session_ids.includes(session.session_id)
    ? body.state.session
    : {};
  if (
    (command.includes(teamName) || command.includes(teamNameLocalized)) &&
    (command.includes("вездекод") || command.includes("вездеход"))
  ) {
    return res.send(
      makeResponse(greeting, greetingTTS, false, session, version, state)
    );
  }

  if (
    quizQuitTriggers.includes(command.toLowerCase()) &&
    state.answers != undefined
  ) {
    _.remove(quizController.session_ids, session_id);
    return res.send(
      makeResponse(
        `Завершаю викторину!`,
        "Завершаю викторину",
        false,
        session,
        version,
        {}
      )
    );
  }
  if (quizTrigger.includes(command.toLowerCase())) {
    if (state.answers != undefined) {
      return res.send(
        makeResponse(
          `Вы уже начинали викторину, вы можете продолжить её, или выйти командой Завершить или Закончить`,
          "Вы уже начинали викторину, вы можете продолжить её, или выйти командой Завершить или Закончить",
          false,
          session,
          version,
          state
        )
      );
    }
    quizController.session_ids.push(session.session_id);
    const firstQuestion = quizController.questions[0];
    return res.send(
      makeResponse(
        `Начинаем викторину!
    Ответы должны быть в формате 1, 2, 3 (цифра или числительное)

    Первый вопрос:
    ${firstQuestion.text}`,
        `
        Начинаем викторину! Ответы должны быть в формате 1, 2, 3 (цифра или числительное) Первый вопрос
        ${firstQuestion.tts}
        `,
        false,
        session,
        version,
        {
          question: 0,
          answers: {},
          current_category: firstQuestion.category,
        }
      )
    );
  }
  if (quizAnswerTrigger.includes(command)) {
    if (state.answers == undefined) {
      return res.send(
        makeResponse(
          `Повторите ваш запрос:(
          Список доступных команд:
          --- ${teamName} вездекод - Приветствие
          --- опрос, квиз, викторина - Запущу викторину по IT вопросам, остановить ее можно командой завершить или закончить`,
          `
            Повторите ваш запрос:(
            Список доступных команд:
            --- ${teamName} вездекод - Приветствие
            --- опрос, квиз, викторина - Запущу викторину по IT вопросам, остановить ее можно командой завершить или закончить`,
          false,
          session,
          version,
          state
        )
      );
    }
    if (state.question < 7 && state.question > -1) {
      const newState = quizController.updateState(
        state,
        state.current_category,
        command
      );
      const nextQuestion = quizController.questions[newState.question];
      return res.send(
        makeResponse(
          `Следующий вопрос:
      ${nextQuestion.text}`,
          `${
            newState.lastAnswerResult
              ? "<speaker audio=marusia-sounds/game-powerup-2>"
              : "<speaker audio=marusia-sounds/game-loss-3>"
          } 
          Следующий вопрос
          ${nextQuestion.tts}
          `,
          false,
          session,
          version,
          newState,
          {
            type: "BigImage",
            image_id: "457239017",
          }
        )
      );
    }
    const lastState = quizController.updateState(
      state,
      state.current_category,
      command
    );
    const recommendation = quizController.recommendation(lastState);
    return res.send(
      makeResponse(
        `Викторина окончена!
      ${recommendation}
      `,
        "<speaker audio=marusia-sounds/game-win-2>" + recommendation,
        false,
        session,
        version
      )
    );
  }
  if (quitSkillTriggers.includes(command.toLowerCase)) {
    return res.send(
      makeResponse(
        "До скорых встреч",
        "До скорых встреч",
        true,
        session,
        version
      )
    );
  }
  return res.send(
    makeResponse(
      `Повторите ваш запрос:(
      Список доступных команд:
      --- ${teamName} вездекод - Приветствие
      --- опрос, квиз, викторина - Запущу викторину по IT вопросам, остановить ее можно командой завершить или закончить
        `,
      `
        Повторите ваш запрос:(
        Список доступных команд:
        --- ${teamName} вездекод - Приветствие
        --- опрос, квиз, викторина - Запущу викторину по IT вопросам, остановить ее можно командой завершить или закончить`,
      false,
      session,
      version,
      state
    )
  );
});

app.listen(port, () => {
  console.log(`Server started at ${port}`);
});
