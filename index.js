import express from "express";
import cors from "cors";
import { teamName, teamNameLocalized } from "./config.js";

const app = express();
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
    return res.send({
      response: {
        text: "Привет вездекодерам",
        tts: "Привет вездек+одерам",
        end_session: false,
      },
      session,
      version,
    });
  }
  return res.send({
    response: {
      text: "Повторите ваш запрос :(",
      tts: "Повторите ваш запрос",
      end_session: false,
    },
    session,
    version,
  });
});

app.listen(port, () => {
  console.log(`Server started at ${port}`);
});
