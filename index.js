import express from "express";
import cors from "cors";
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
  const command = parsedRequest.command;

  let state = body.state.session;
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
    return res.send(
      makeResponse(`Завершаю викторину!`, "", false, session, version, {})
    );
  }
  if (quizTrigger.includes(command)) {
    if (state.answers != undefined) {
      return res.send(
        makeResponse(
          `Вы уже начинали опрос, вы можете продолжить его, или выйти командой завершить или закончить`,
          "",
          false,
          session,
          version,
          state
        )
      );
    }
    const firstQuestion = quizController.questions[0];
    return res.send(
      makeResponse(
        `
    Начинаем викторину!
    Ответы должны быть в формате 1, 2, 3 (цифра или числительное)
    Первый вопрос:
    ${firstQuestion.question}
    `,
        "",
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
          `
        Повторите ваш запрос:(
        Список доступных команд:
        --- ${teamName} вездекод - Приветствие
        --- опрос, квиз, викторина - Запущу викторину по IT вопросам
          `,
          "Повторите ваш запрос",
          false,
          session,
          version,
          {}
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
          `
      Следующий вопрос:
      ${nextQuestion.question}
      `,
          "",
          false,
          session,
          version,
          newState
        )
      );
    }
    const lastState = quizController.updateState(
      state,
      state.current_category,
      command
    );
    return res.send(
      makeResponse(
        `
      Викторина окончена!
      ${quizController.recommendation(lastState)}
      `,
        "",
        false,
        session,
        version
      )
    );
  }
  if (quitSkillTriggers.includes(command.toLowerCase)) {
    return res.send(
      makeResponse("До скорых встреч", "", true, session, version)
    );
  }
  return res.send(
    makeResponse(
      `
      Повторите ваш запрос:(
      Список доступных команд:
      --- ${teamName} вездекод - Приветствие
      --- опрос, квиз, викторина - Запущу викторину по IT вопросам, остановить ее можно командой завершить или закончить
        `,
      `
        Повторите ваш запрос:(
        Список доступных команд:
        --- ${teamName} вездекод - Приветствие
        --- опрос, квиз, викторина - Запущу викторину по IT вопросам, остановить ее можно командой завершить или закончить
          `,
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
