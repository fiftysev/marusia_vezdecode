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

  updateState(state, category, answer) {
    const mappedAnswer = answerMapping[answer];
    if (mappedAnswer == undefined || null) {
      throw new SyntaxError("Попробовать бы еще раз");
    }
    state.answers[category] =
      this.questions[this.state.question] === mappedAnswer;
    return state;
  }
}

export { Quiz };
