import { stat } from "fs";
import { answerMapping } from "../utils/marusya_encoding.js";
import { quizResultsText } from "./quizResults.js";

class Quiz {
  questions = [
    {
      text: `
      Laravel - это
      1 - Синоним слова любовь
      2 - Фреймворк для backend разработки на PHP,
      3 - Библиотека для фронтенда
      `,
      tts: `
      Laravel - это
      1 - Синоним сл+ова любовь
      2 - Фреймворк для backend разработки на PHP,
      3 - Библиотека для фронтенда
      `,
      rightAnswer: 2,
      category: "Backend",
    },
    {
      text: `
      Почему популярен TypeScript?
      1 - Наличие статической типизации
      2 - Генерация кода искусственным интеллектом
      3 - Красивое название
      `,
      tts: `
      Почему популярен TypeScript?
      1 - Наличие статической типизации
      2 - Генерация кода искусственным интеллектом
      3 - Красивое название
      `,
      rightAnswer: 1,
      category: "Web",
    },
    {
      text: `
      Приложения для iOS разрабатывают на языке:
      1 - Kotlin
      2 - Go
      3 - Swift
      `,
      tts: `
      Приложения для iOS разрабатывают на языке:
      1 - Kotlin
      2 - Go
      3 - Swift
      `,
      rightAnswer: 3,
      category: "Mobile",
    },
    {
      text: `
      Чаще всего для дизайна интерфейсов используют:
      1 - Gimp
      2 - Illustrator
      3 - Figma
      `,
      tts: `
      Чаще всего для дизайна интерфейсов используют:
      1 - Gimp
      2 - Illustrator
      3 - Figma
      `,
      rightAnswer: 3,
      category: "Дизайн интерфейсов",
    },
    {
      text: `
      Как называется документ, в котором описывают разрабатываемую игру?
      1 - Дизайн - документ
      2 - Игровой документ
      3 - Не знаю, простите
      `,
      tts: `
      Как называется документ, в котором описывают разрабатываемую игру?
      1 - Дизайн - документ
      2 - Игровой документ
      3 - Не знаю, простите
      `,
      rightAnswer: 1,
      category: "GameDev",
    },
    {
      text: `
      Какой фреймворк используется при создании мини-приложений ВКонтакте?
      1 - Angular
      2 - Vue
      3 - React
      `,
      tts: `
      Какой фреймворк используется при создании мини-приложений ВКонтакте?
      1 - ангуляр
      2 - вью
      3 - реакт
      `,
      rightAnswer: 3,
      category: "VK MiniApps",
    },
    {
      text: `
      Какой символ используется для постановки ударения в голосовом ответе Маруси?
      1 - *
      2 - /
      3 - +
      `,
      tts: `
      Какой символ используется для постановки ударения в голосовом ответе Маруси?
      1 - звездочка
      2 - слэш
      3 - плюс
      `,
      rightAnswer: 3,
      category: "Маруся",
    },
    {
      text: `
      OpenCV - это:
      1 - Формат файла
      2 - Библиотека для Computer Vision на Python
      3 - Фреймворк для веб - разработки
      `,
      tts: `
      open си ви - это:
      1 - Формат файла
      2 - Библиотека для Computer Vision на Python
      3 - Фреймворк для веб - разработки
      `,
      rightAnswer: 2,
      category: "Computer vision",
    },
  ];

  session_ids = [];

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
