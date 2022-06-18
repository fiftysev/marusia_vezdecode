import express from "express";
import cors from "cors";
import { teamName, teamNameLocalized } from "./config.js";
import { makeResponse } from "./utils/makeResponse.js";
import { greeting, greetingTTS } from "./responses/greeting.js";
import { quizTrigger } from "./utils/triggers.js";
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
  if (
    (command.includes(teamName) || command.includes(teamNameLocalized)) &&
    (command.includes("вездекод") || command.includes("вездеход"))
  ) {
    return res.send(
      makeResponse(greeting, greetingTTS, false, session, version)
    );
  }
  if (quizTrigger.includes(command)) {
    const firstQuestion = quizController.questions[0];
    res.send(
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
          answers: {},
          current_category: firstQuestion.category,
        }
      )
    );
  }
  return res.send(
    makeResponse(
      "Повторите ваш запрос:(",
      "Повторите ваш запрос",
      false,
      session,
      version,
      {}
    )
  );
});

app.listen(port, () => {
  console.log(`Server started at ${port}`);
});
