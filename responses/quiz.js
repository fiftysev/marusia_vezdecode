import { stat } from "fs";
import { answerMapping } from "../utils/marusya_encoding.js";

class Quiz {
  questions = [
    {
      question: `
      Laravel - это
      1 - Синоним слова любовь
      2 - Фреймворк для backend разработки на PHP,
      3 - Библиотека для фронтенда
      `,
      rightAnswer: 2,
      category: "Backend",
    },
    {
      question: `
      Почему популярен TypeScript?
      1 - Наличие статической типизации
      2 - Генерация кода искусственным интелектом
      3 - Красивое название
      `,
      rightAnswer: 1,
      category: "Web",
    },
    {
      question: `
      Приложения для iOS разрабатывают на языке:
      1 - Kotlin
      2 - Go
      3 - Swift
      `,
      rightAnswer: 3,
      category: "Mobile",
    },
    {
      question: `
      Чаще всего для дизайна интерфейсов используют:
      1 - Gimp
      2 - Illustrator
      3 - Figma
      `,
      rightAnswer: 3,
      category: "Дизайн интерфейсов",
    },
    {
      question: `
      Как называется документ, в котором описывают разраатываемую игру?
      1 - Дизайн - документ
      2 - Игровой документ
      3 - Не знаю, простите
      `,
      rightAnswer: 1,
      category: "GameDev",
    },
    {
      question: `
      Какой фреймворк используется при создании мини-приложений ВКонтакте?
      1 - Angular
      2 - Vue
      3 - React
      `,
      rightAnswer: 3,
      category: "VK MiniApps",
    },
    {
      question: `
      Какой символ используется для постановки ударения в голосовом ответе Маруси?
      1 - *
      2 - /
      3 - +
      `,
      rightAnswer: 3,
      category: "Маруся",
    },
    {
      question: `
      OpenCV - это:
      1 - Формат файла
      2 - Библиотека для Computer Vision на Python
      3 - Фреймворк для веб - разработки
      `,
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

    if (categories.includes("Web") || categories.includes("Backend")) {
      resText +=
        "Ты знаешь что-то о веб-разработке, обрати внимания на задания Web и Backend :)\n";
    }

    if (categories.includes("Mobile"))
      resText +=
        "У тебя есть интерес к мобильной разработке, можешь попробовать свои силы в категории Mobile ;)\n";

    if (categories.includes("Computer Vision")) {
      resText +=
        "Кажется, задания категорий Анализ данных и Computer Vision могли бы заинтересовать тебя:)\n";
    }

    if (categories.includes("Маруся")) {
      resText +=
        "Не все еще освоили работу с Марусей (и зря), дерзай, категория Маруся для тебя!\n";
    }

    if (categories.includes("VK MiniApps"))
      resText += "Мини-приложения - это очень интересно, попробуй!\n";
    if (categories.includes("GameDev"))
      resText +=
        "Попробуй увлечь своей историей и визуалом, сделай пару заданий в GameDev []_[]!\n";
    if (categories.includes("Дизайн интерфейсов"))
      resText +=
        "Кажется, у тебя есть знания про UI/UX, взгляни на задания категории Дизайн интерфейсов ;)\n";
    resText +=
      "\nНе забывай, что ты можешь решить задачи даже из тех сфер, которые тебе мало знакомы, главное пробуй!";
    return resText;
  }
}

export { Quiz };
