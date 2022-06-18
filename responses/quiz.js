import { stat } from "fs";
import { answerMapping } from "../utils/marusya_encoding.js";
import { quizResultsText } from "./quizResults.js";

class Quiz {
  questions = [
    {
      question: `Laravel - это\n1 - Синоним слова любовь\n2 - Фреймворк для backend разработки на PHP,\n3 - Библиотека для фронтенда`,
      rightAnswer: 2,
      category: "Backend",
    },
    {
      question: `Почему популярен TypeScript?\n1 - Наличие статической типизации\n2 - Генерация кода искусственным интелектом\n3 - Красивое название`,
      rightAnswer: 1,
      category: "Web",
    },
    {
      question: `Приложения для iOS разрабатывают на языке:\n1 - Kotlin\n2 - Go\n3 - Swift`,
      rightAnswer: 3,
      category: "Mobile",
    },
    {
      question: `Чаще всего для дизайна интерфейсов используют:\n1 - Gimp\n2 - Illustrator\n3 - Figma`,
      rightAnswer: 3,
      category: "Дизайн интерфейсов",
    },
    {
      question: `Как называется документ, в котором описывают разраатываемую игру?\n1 - Дизайн - документ\n2 - Игровой документ\n3 - Не знаю, простите`,
      rightAnswer: 1,
      category: "GameDev",
    },
    {
      question: `Какой фреймворк используется при создании мини-приложений ВКонтакте?\n1 - Angular\n2 - Vue\n3 - React`,
      rightAnswer: 3,
      category: "VK MiniApps",
    },
    {
      question: `Какой символ используется для постановки ударения в голосовом ответе Маруси?\n1 - *\n2 - /\n3 - +`,
      rightAnswer: 3,
      category: "Маруся",
    },
    {
      question: `OpenCV - это:\n1 - Формат файла\n2 - Библиотека для Computer Vision на Python\n3 - Фреймворк для веб - разработки`,
      rightAnswer: 2,
      category: "Computer vision",
    },
  ];

  constructor() {}
  /*
  state: {
    question: (number),
    answers: {
      category_name (string): isRight (boolean) 
    }
    current_category: (string)
  }
   */
  updateState(state, category, answer) {
    const mappedAnswer = answerMapping[answer];
    if (mappedAnswer == undefined || null) {
      throw new SyntaxError("Попробовать бы еще раз");
    }
    state.answers[category] =
      this.questions[state.question].rightAnswer === mappedAnswer;
    state.question++;
    if (state.question < 8)
      state.current_category = this.questions[state.question].category;
    return state;
  }

  recommendation(state) {
    let idx = 1;
    let categories = [];
    let resText = `
    Твои результаты говорят, что:
    `;
    for (let ans in state.answers) {
      if (state.answers[ans]) categories.push(ans);
      continue;
    }

    if (categories.length == 0) {
      resText +=
        "Ты заинтересован(a) в IT, что уже делает тебя крутым, взгляни на каждую из категорий, ведь крутые решения не всегда зависят от направления\n";
      return resText;
    }

    if (categories.length == 8) {
      resText +=
        "Ого, да ты прямо любишь свою профессиональную сферу, испытай свои силы во всех категориях и поборись за звание лучшего!\n";
      return resText;
    }

    if (categories.length < 4) {
      categories.forEach((element) => {
        resText += quizResultsText[element];
      });
    } else {
      resText += "Teбе могут подойти следующие категории:\n";
      categories.forEach((element) => {
        resText += element + "\n";
      });
    }

    resText +=
      "\nНе забывай, что ты можешь решить задачи даже из тех сфер, которые тебе мало знакомы, главное пробуй!";
    return resText;
  }
}

export { Quiz };
