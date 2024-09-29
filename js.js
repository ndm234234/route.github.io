let quiz = {
// PROPERTIES
// QUESTIONS & ANSWERS
// Q = QUESTION, O = OPTIONS, A = CORRECT ANSWER
data: [
  {
    q: "Где расположен Храм Рождества Христова?",
    o: [
    "Пос. Новобратцево ",
    "Село Рождествено",
    "Ул. Генерала Белобородова",
    "Ул. Пятницкое шоссе",
    ],
    a: 2,
    score: 30,
    cat : "Достопримечательности"
  },
  {
    q: "В честь кого из героев Митино названа одна из школ Митино?",
    o: [
    "Рокоссовский ",
    "Жуков",
    "Белобородов",
    "Конев",
    ],
    a: 3,
    score: 30,
    cat : "Герои Митино"
    },
    {
      q: "В каком году впервые упоминается деревня «Митино» ?",
      o: [
      "В 1389 в завещании Дмитрия Донского",
      "В летописях в 1646 года",
      "В постановлении 1985 о вхождении в состав Москвы",
      "В 1997 при создании герба",
      ],
      a: 1,
      score: 30,
      cat : "История Митино"
      },
  {
  q: "Как назвается скамейка в Митино ?",
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
  q: "Как назвается скамейка в Митино 2 ?",
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
currentCommand : "",
playCommands : new Map(),
queries : null,
maxCommandsCount : 0,

setScore: (control, name, value, correctAnswers, totalQuestion) => {
  let text = `${name}<br>Cчет: ${value}`;
  if (correctAnswers > 0 || totalQuestion > 0)
  {
    text += "<br>Ответы: правильных " + correctAnswers + ", неправильных " + (totalQuestion - correctAnswers);
  }
  control.innerHTML = text;
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

  var mapColumns = new Set();
  for (let entry of queries) {
    for (let columns of entry[1]) {
      mapColumns.add(columns[0]);
    }
  }
  var sortedColumns = [];
  for (let mapColumn of mapColumns) {
    sortedColumns.push(mapColumn);
  }
  sortedColumns.sort(function(a,b){
    return a - b;
  });

  for (let entry of queries) {

    if (entry[1].size > 0) {
      const tr = tbl.insertRow();
      const td = tr.insertCell();
      td.appendChild(document.createTextNode(entry[0]));
      td.style.border = '0px solid black';

      for (let column of sortedColumns) {
        const td1 = tr.insertCell();
        var exist = false;
        for (let scores of entry[1]) {
          if (scores[0] == column) {
            td1.appendChild(document.createTextNode(scores[0]));
            td1.style.border = '0px solid black';
            td1.addEventListener('click', () => quiz.showQuestion(td.innerText, scores[0]));
            exist = true;
            break;
          }
        }
        if (!exist) {
          td1.appendChild(document.createTextNode("-"));
          td1.style.border = '0px solid black';
        }
      }
    }
  }
},

// INIT QUIZ HTML
init: (commandNames) => {
  // WRAPPER

  currentCommand = "";
  quiz.hWrap = document.querySelector('.quizWrap');
 
  var jsonData = JSON.stringify(quiz.data, null, 2);

  console.log(jsonData);

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

  const commands = document.getElementById("top_commands");

  document.querySelectorAll(".command_item").forEach(el => el.remove());

  commandNames.forEach(value =>  {
    quiz.playCommands.set(value, { questions : 0, score : 0, correctAnswers : 0});

    let command = document.createElement("div");
    command.id = "command_item";
    command.className = "command_item";
    command.name = value;
    quiz.setScore(command, value, 0, 0, 0 );

    command.addEventListener("click", () => {
      let all = commands.getElementsByClassName("command_item");
      for (let control of all) {
        if (control == command)
        {
          control.classList.add("correct");
          control.classList.remove("disable"); 

          if (currentCommand != control.name)
          {
            currentCommand = control.name;
            document.querySelector('.quizWrap').classList.remove("active");
            quiz.fillTable();
          }
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

      function getRandomItem(set) {
        let items = Array.from(set);
        return items[Math.floor(Math.random() * items.length)];
      }

      const selectedRandomQuery = getRandomItem(queries.get(cat).get(scoreValue).values());
      queries.get(cat).get(scoreValue).delete(selectedRandomQuery);

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
      quiz.draw(selectedRandomQuery);

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
  quiz.hQn.innerHTML = query.query + "  (" + query.score + " баллов)";
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
 
  quiz.playCommands.get(currentCommand).questions ++;
  // CHECK IF CORRECT
  if (correct) {
    quiz.playCommands.get(currentCommand).score += query.score;
    quiz.playCommands.get(currentCommand).correctAnswers ++;

    option.classList.add("correct");
    } else {
      option.classList.add("wrong");
  }

  let commands = document.getElementById("top_commands");
  for (let control of commands.getElementsByClassName("command_item")) {
    if (control.name == currentCommand) {
      quiz.setScore(control, currentCommand, quiz.playCommands.get(currentCommand).score, quiz.playCommands.get(currentCommand).correctAnswers, quiz.playCommands.get(currentCommand).questions);
    }
  }

  let all1 = commands.getElementsByClassName("command_item");
  for (let control of all1) {
    control.classList.remove("correct");
    control.classList.remove("disable"); 
  }

  setTimeout(() => {
    if (queries.size > 0)
      { 
        document.querySelector('.quizWrap').classList.remove("active");
        currentCommand = "";

   //     document.getElementById('quizTable').classList.add("active");
//        quiz.fillTable();
        // quiz.draw(); 
      }
    else {
    quiz.hQn.innerHTML = "";
    quiz.hAns.innerHTML = "";
    quiz.reset(quiz.playCommands);
  }
  }, 500);
 
},

// RESTART QUIZ
reset : (playCommandsValues) => {

  document.getElementById('quizTable').classList.remove("active");

  document.querySelector('.quizWrap').classList.remove("active");
  if (playCommandsValues == null || playCommandsValues.size == 0)
  {
      return;
  }
  
  var yourListMaps = [];
  for (let cmd of playCommandsValues) {
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

  var index = 0;
  for (let cmd of yourListMaps) {
    var str = ++index + ". Команда " + cmd.command + 
              " ответила на " + cmd.correctAnswers + " вопросов из " + cmd.questions + 
              " на " + cmd.score + " баллов!";

    results.push(str);
  }

  var strResult = results.length == 0 ? "Никто не играл:(" : results.join("<br><br>");

  document.getElementById('info').innerHTML = "<br>" + strResult + "<br><br><br>";
  document.querySelector('.quiz-over-modal').classList.add('active')
},

showGameMenu : (value) => {
  if (value) {
  document.getElementById('force_finish').classList.add("active");
  document.getElementById('new_game').classList.add("active");
  }
  else {
    document.getElementById('force_finish').classList.remove("active");
    document.getElementById('new_game').classList.remove("active");
  }
},

createCommand: (name) => {
  var input = document.createElement("input");
  input.value = name ;
  input.type = "text";

  var span = document.createElement("span");
  span.appendChild(input);

  var div = document.createElement("div");
  div.setAttribute("class", "crossImageButton");
  var img = document.createElement("img");
  img.src = "cross.jpg";
  img.setAttribute("width", "40px");
  img.setAttribute("height", "40px");
  img.setAttribute("alt", "Icon");

  img.addEventListener("click", function() {
    if (document.querySelector('.fields').children.length > 1)
    {
      document.querySelector('.fields').removeChild(span);
    }
  });

  div.appendChild(img);
  span.appendChild(div);

  document.querySelector('.fields').appendChild(span);
}

};

window.addEventListener("load", () => { 

  document.querySelector('.containerCommands').classList.add("active");

  const add_command = document.getElementById("add_command");
  add_command.addEventListener("click", function() {
    const commandInputs = Array.from(document.getElementById("join-us").getElementsByTagName("input")).filter(t => { return t.type == "text"});

    if (commandInputs.length > quiz.maxCommandsCount)  {
      quiz.maxCommandsCount = commandInputs.length + 1;
    }
    else    {
      quiz.maxCommandsCount ++;
    }
    quiz.createCommand("Команда " + (quiz.maxCommandsCount));
  });

  const start_command = document.getElementById("start_command");
  start_command.addEventListener("click", function() {

    document.getElementById('top_commands').classList.add("active");
    document.querySelector('.containerCommands').classList.remove("active");
    
    quiz.showGameMenu(true);
    
    commandInputs = Array.from(document.getElementById("join-us").getElementsByTagName("input")).filter(t => { return t.type == "text"});
    commands = commandInputs.map(t => { return t.value});
    quiz.init(commands);
  });

  const force_finish = document.getElementById("force_finish");
  force_finish.addEventListener("click", function() {
    quiz.showGameMenu();
    quiz.reset(quiz.playCommands);
  });

  const new_game = document.getElementById("new_game");
  new_game.addEventListener("click", function() {

    const commands = Array.from(quiz.playCommands.keys());

    document.querySelector('.quizWrap').classList.remove("active");
    document.getElementById('quizTable').classList.remove("active");
    document.getElementById("top_commands").classList.remove("active");

    quiz.showGameMenu(false);

    document.getElementById("fields").innerHTML = "";
    
    for(let command of commands) {
      quiz.createCommand(command);
    }

    document.querySelector('.containerCommands').classList.add("active");
  } );

  document.getElementById('btn-try-again').addEventListener('click', () => {
    // window.location.reload()
    document.querySelector('.quiz-over-modal').classList.remove("active");
    document.getElementById('new_game').click();
  });

  quiz.createCommand("Команда 1");
 });
