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
  score: 10,
  cat : "История Митино"
  },
  {
  q: "Как назвается скамейка в митино 2 ?",
  o: [
  "Старая",
  "Новая",
  "Историческая",
  ],
  a: 0,
  score: 10,
  cat : "История Митино"
  },
  {
  q: "Кто признан лучшим вратарём в 2019 году по версии ФИФА?",
  o: [
  "Давид де Хеа",
  "Алиссон",
  "Тибо Куртуа",
  ],
  a: 0,
  score: 30,
  cat : "История Митино"
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
  score: 40,
  cat : "Природа"
  },
  {
  q: "В какой стране впервые проходил Кубок мира ФИФА?",
  o: [
  "Уругвай",
  "Франция",
  ],
  a: 0,
  score: 10,
  cat : "Экономика"
  }
],
// HTML ELEMENTS
hWrap: null, // HTML quiz container
hQn: null, // HTML question wrapper
hAns: null, // HTML answers wrapper
// GAME FLAGS
now: 0, // current question
currentCommand : "",
playCommands : null,
queries : null,

setScore: (control, name, value) => {
  control.innerHTML = `${name}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Cчет: ${value}`;
},

JSONToFile : (obj, filename) => {
  const blob = new Blob([JSON.stringify(obj, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.json`;
  a.click();
  URL.revokeObjectURL(url);
},

fillTable: () => {

  document.getElementById('quizTable').classList.add("active");
  
  var tbl = document.getElementById('quizTable').getElementsByTagName('tbody')[0];
  tbl.innerHTML = "";

  for (let entry of queries) {

    if (entry[1].size > 0) {
      const tr = tbl.insertRow();
      const td = tr.insertCell();
      td.appendChild(document.createTextNode(entry[0]));
      td.style.border = '0px solid black';

      for (let scores of entry[1]) {
          const td1 = tr.insertCell();
          td1.appendChild(document.createTextNode(scores[0]));
          td1.style.border = '0px solid black';
          td1.addEventListener('click', () => quiz.showQuestion(td.innerText, scores[0]));
      }
    }
  }
},

// INIT QUIZ HTML
init: () => {
  // WRAPPER

  quiz.hWrap = document.querySelector('.quizWrap');
 
  var jsonData = JSON.stringify(quiz.data);

  queries = new Map();
  for (let i = 0; i < quiz.data.length; i++) {

    query = { query : quiz.data[i].q, 
              answers : quiz.data[i].o,
              answer : quiz.data[i].a,
              score : quiz.data[i].score
            };

    if (queries.has(quiz.data[i].cat)) {
      if (queries.get(quiz.data[i].cat).has(quiz.data[i].score)) {
        queries.get(quiz.data[i].cat).get(quiz.data[i].score).add(query );
      }
      else
      {
        queries.get(quiz.data[i].cat).set(quiz.data[i].score, new Set());
        queries.get(quiz.data[i].cat).get(quiz.data[i].score).add(query);
      }
    }
    else {
      const mapItems = new Map();
      mapItems.set(quiz.data[i].score, new Set());
      mapItems.get(quiz.data[i].score).add(query);
      queries.set(quiz.data[i].cat, mapItems);
    }
  }

  document.getElementById('btn-try-again').addEventListener('click', () => window.location.reload() );

  let commands = document.getElementById("commands");
  let commandNames = ['Команда 1', 'Команда 2', 'Команда 3', 'Команда 4'];

  playCommands = new Map();
  commandNames.forEach(value =>  {
    playCommands.set(value, { questions : 0, score : 0, correctAnswers : 0});

    let command = document.createElement("div");
    command.id = "command";
    command.className = "command";
    command.name = value;
    quiz.setScore(command, value, 0 );

    command.addEventListener("click", () => {
      let all = commands.getElementsByClassName("command");
      for (let control of all) {
        if (control == command)
        {
          control.classList.add("correct");
          control.classList.remove("disable"); 

          currentCommand = control.name;

           quiz.fillTable();
           /*
           document.querySelector('.quizWrap').classList.add('active');
           quiz.hWrap.innerHTML = "";
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
           */
        }
        else
        {
          control.classList.remove("correct");
          control.classList.add("disable"); 
        }
      }
    });

    commands.appendChild(command);
  });

},

showQuestion: (cat, scoreValue) => { 
  if (queries.has(cat)) {
    if (queries.get(cat).has(scoreValue)) {

      z = queries.get(cat).get(scoreValue).values().next().value;
      queries.get(cat).get(scoreValue).delete(z);

      document.getElementById('quizTable').classList.remove("active");
      document.querySelector('.quizWrap').classList.add('active');
      
      quiz.hWrap.innerHTML = "";
      // QUESTIONS SECTION
      quiz.hQn = document.createElement("div");
      quiz.hQn.id = "quizQn";
      quiz.hWrap.appendChild(quiz.hQn);
      // ANSWERS SECTION
      quiz.hAns = document.createElement("div");
      quiz.hAns.id = "quizAns";
      quiz.hWrap.appendChild(quiz.hAns);
      // GO!
      quiz.draw(z);

      if (queries.get(cat).get(scoreValue).size == 0) {
        queries.get(cat).delete(scoreValue);
      }
      if (queries.get(cat).size == 0) {
        queries.delete(cat);
      }

    }
  }
},

// DRAW QUESTION
draw: (query) => {
  // QUESTION
  quiz.hQn.innerHTML = query.query + "( " + query.score + " баллов)";
  // OPTIONS
  quiz.hAns.innerHTML = "";
  var index = 0;
  for (let answer of query.answers) {
    let radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "quiz";
//    radio.id = "quizo" + i;
    quiz.hAns.appendChild(radio);
    let label = document.createElement("label");
    label.innerHTML = answer;
    //label.setAttribute("for", "quizo" + i);
    //label.dataset.query = "ZZZ";
    let s = index;
    label.addEventListener("click", () => {
      quiz.select(label, query, s);
      });
    index ++;
    quiz.hAns.appendChild(label);
  }
},

// OPTION SELECTED
select: (option, query, index) => {
  //  DETACH ALL ONCLICK
  let all = quiz.hAns.getElementsByTagName("label");
  for (let label of all) {
    label.removeEventListener("click", quiz.select);
  }

  let correct = false;
  for (let i = 0; i < quiz.data.length; i++) {
    if (query.query == quiz.data[i].q &&  index == quiz.data[i].a) {
        correct = true;
        break;
    }
  }
 
  playCommands.get(currentCommand).questions ++;
  // CHECK IF CORRECT
  if (correct) {
    playCommands.get(currentCommand).score += query.score;
    playCommands.get(currentCommand).correctAnswers ++;

    option.classList.add("correct");


    let commands = document.getElementById("commands");
    let all = commands.getElementsByClassName("command");
    for (let control of all) {
      if (control.name == currentCommand) {
        quiz.setScore(control, currentCommand, playCommands.get(currentCommand).score );
      }
    }
    } else {
    option.classList.add("wrong");
  }

  let commands = document.getElementById("commands");
  let all1 = commands.getElementsByClassName("command");
  for (let control of all1) {
    control.classList.remove("disable");
  }

  setTimeout(() => {
    if (queries.size > 0)
      { 
        document.querySelector('.quizWrap').classList.remove("active");
        document.getElementById('quizTable').classList.add("active");
        quiz.fillTable();
        // quiz.draw(); 
      }
    else {
    quiz.hQn.innerHTML = `Вы ответили на ${quiz.score} из ${quiz.data.length} правильно.`;
    quiz.hAns.innerHTML = "";
    quiz.reset();
  }
  }, 500);
 
},

// RESTART QUIZ
reset : () => {

  var yourListMaps = [];
  for (let cmd of playCommands) {
    if (cmd[1].questions > 0) {
      yourListMaps.push( { command : cmd[0], 
                          questions : cmd[1].questions, 
                          correctAnswers : cmd[1].correctAnswers,
                          score : cmd[1].score });
    }
  }

  yourListMaps.sort(function(a,b){
      return b.score - a.score;
  });

  var results = [];

  for (let cmd of yourListMaps) {
    var str = "Команда " + cmd.command + 
              " ответила на " + cmd.correctAnswers + " вопросов из " + cmd.questions + 
              " на " + cmd.score + " баллов!";

    results.push(str);
  }

  document.getElementById('info').innerHTML = "<br>" + results.join("<br><br>") + "<br><br><br>";
  
  document.querySelector('.quiz-over-modal').classList.add('active')

  quiz.now = 0;
  quiz.score = 0;
  //quiz.draw();
}
};

window.addEventListener("load", quiz.init);