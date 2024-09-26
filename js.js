let quiz = {
// PROPERTIES
// QUESTIONS & ANSWERS
// Q = QUESTION, O = OPTIONS, A = CORRECT ANSWER
data: [
  {
  q: "Как назвается скамейка в митино ?",
  o: [
  "Старая",
  "Новая",
  "Историческая",
  ],
  a: 0,
  score: 1
  },
  {
  q: "Кто признан лучшим вратарём в 2019 году по версии ФИФА?",
  o: [
  "Давид де Хеа",
  "Алиссон",
  "Тибо Куртуа",
  ],
  a: 0,
  score: 3
  },
  {
  q: "Кто является лучшим бомбардиром за всю историю сборной Португалии?",
  o: [
  "Матийс де Лигт",
  "Лионель Месси",
  "Криштиану Роналду",
  "Вирджил ван Дейк",
  ],
  a: 0,
  score: 4
  },
  {
  q: "В какой стране впервые проходил Кубок мира ФИФА?",
  o: [
  "Уругвай",
  "Франция",
  ],
  a: 0,
  score: 1
  }
],
// HTML ELEMENTS
hWrap: null, // HTML quiz container
hQn: null, // HTML question wrapper
hAns: null, // HTML answers wrapper
// GAME FLAGS
now: 0, // current question
score: 0, // current score
correctAnswers : 0,
currentCommand : "",
// INIT QUIZ HTML
init: () => {
  // WRAPPER

  document.getElementById('btn-try-again').addEventListener('click', () => window.location.reload() );

  let commands = document.getElementById("commands");
  let commandNames = ['Команда 1', 'Команда 2', 'Команда 3', 'Команда 43'];
  commandNames.forEach(value =>  {
    let command = document.createElement("div");
    command.id = "command";
    command.className = "command";
    command.name = value;
    command.innerHTML = `${value}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Cчет: 0`;

    command.addEventListener("click", () => {
      let all = commands.getElementsByClassName("command");
      for (let control of all) {
        if (control == command)
        {
           control.classList.add("correct");
           currentCommand = control.name;
        }
        else
        {
          control.classList.remove("correct");
        }
      }
    });

    commands.appendChild(command);
  });

  quiz.hWrap = document.getElementById("quizWrap");
  // QUESTIONS SECTION
  quiz.hQn = document.createElement("div");
  quiz.hQn.id = "quizQn";
  quiz.hWrap.appendChild(quiz.hQn);
  // ANSWERS SECTION
  quiz.hAns = document.createElement("div");
  quiz.hAns.id = "quizAns";
  quiz.hWrap.appendChild(quiz.hAns);
  // GO!
  quiz.draw();
},

// DRAW QUESTION
draw: () => {
  // QUESTION
  quiz.hQn.innerHTML = quiz.data[quiz.now].q;
  // OPTIONS
  quiz.hAns.innerHTML = "";
  for (let i in quiz.data[quiz.now].o) {
    let radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "quiz";
    radio.id = "quizo" + i;
    quiz.hAns.appendChild(radio);
    let label = document.createElement("label");
    label.innerHTML = quiz.data[quiz.now].o[i];
    label.setAttribute("for", "quizo" + i);
    label.dataset.idx = i;
    label.addEventListener("click", () => {
      quiz.select(label);
      });
    quiz.hAns.appendChild(label);
  }
},

// OPTION SELECTED
select: (option) => {
  //  DETACH ALL ONCLICK
  let all = quiz.hAns.getElementsByTagName("label");
  for (let label of all) {
    label.removeEventListener("click", quiz.select);
  }
  // CHECK IF CORRECT
  let correct = option.dataset.idx == quiz.data[quiz.now].a;
  if (correct) {
    quiz.score += quiz.data[quiz.now].score;
    quiz.correctAnswers ++;

    option.classList.add("correct");


    let commands = document.getElementById("commands");
    let all = commands.getElementsByClassName("command");
    for (let control of all) {
      if (control.name == currentCommand) {

        control.innerHTML = `${control.name}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Cчет: ${quiz.score}`;
      }
    }



    } else {
    option.classList.add("wrong");
  }
  // NEXT QUESTION OR END GAME
  quiz.now++;
  setTimeout(() => {
    if (quiz.now < quiz.data.length) { quiz.draw(); }
    else {
    quiz.hQn.innerHTML = `Вы ответили на ${quiz.score} из ${quiz.data.length} правильно.`;
    quiz.hAns.innerHTML = "";
    quiz.reset();
  }
  }, 500);
},

// RESTART QUIZ
reset : () => {

  document.getElementById('currentCommand').innerHTML = currentCommand;
  document.getElementById('correct-answer').innerHTML = quiz.correctAnswers;
  document.getElementById('number-of-all-questions').innerHTML = quiz.data.length;
  document.getElementById('score').innerHTML = quiz.score;

  
  document.querySelector('.quiz-over-modal').classList.add('active')

  quiz.now = 0;
  quiz.score = 0;
  quiz.draw();
}
};


window.addEventListener("load", quiz.init);