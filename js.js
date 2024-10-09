let quiz = {
data : { 
title: "Митино",
items:
[
  {
    question: "Что дало название Спасским мостам через Москву-реку на 67 км МКАД в районе Митино?",
    options: [
    "Село Спас",
    "Праздник Яблочный спас",
    "Спасская башня Московского Кремля",
    "Спасо-Андроников монастырь на реке Яуза",
    ],
    answers: [0],
    info : "Спасские мосты — два трехпролетных автодорожных моста через реку Москву, расположенные на северо-западе Москвы в районе Митино на 67-м км Московской кольцевой автомобильной дороги (МКАД) и 44,7 км реки Москвы. Названы по находившемуся здесь ранее селу Спас. Первый мост (нижний) имеет арочную конструкцию и сооружен в 1962 году при строительстве кольцевой автодороги. Длина моста — 203,9 м, ширина — 24 м. Второй мост, имеющий балочную конструкцию, сооружен в 1997 году при реконструкции и расширении кольцевой автодороги. Он расположен выше по течению реки на 40 метров от оси первого моста. Судоходные пролеты — средние, их ширина — 90 метров, ширина судового хода в пролетах — 60 метров, высота пролетов в пределах судового хода — 10,5 метров от НПУ (нормальный подпорный уровень).",
    score: 100,
    category: "Мосты и шлюзы Москвы-реки"
  },
  {
    question: "Тестовый вопрос номер 1?",
    options: [
    "Правильный 1",
    "Неправильный",
    "Правильный 1",
    "Правильный 1",
    ],
    answers: [0, 2, 3],
    score: 50,
    category: "Тестовые вопросы"
  },
  {
    question: "Где расположен Храм Рождества Христова?",
    options: [
    "Пос. Новобратцево ",
    "Село Рождествено",
    "Ул. Генерала Белобородова",
    "Ул. Пятницкое шоссе",
    ],
    answers: [2],
    score: 30,
    category: "Достопримечательности"
  },
  {
    question: "В честь кого из героев Митино названа одна из школ Митино?",
    options: [
    "Рокоссовский ",
    "Жуков",
    "Белобородов",
    "Конев",
    ],
    answers: [3],
    score: 30,
    category: "Герои Митино"
    },
    {
      question: "В каком году впервые упоминается деревня «Митино» ?",
      options: [
      "В 1389 в завещании Дмитрия Донского",
      "В летописях в 1646 года",
      "В постановлении 1985 о вхождении в состав Москвы",
      "В 1997 при создании герба",
      ],
      answers: [1],
      score: 30,
      category: "История Митино"
      },
  {
  question: "Как назвается скамейка в Митино ?",
  options: [
  "Старая",
  "Новая",
  "Историческая",
  ],
  answers: [0,2],
  score: 10,
  category: "История Митино"
  },
  {
  question: "Как назвается скамейка в Митино 2 ?",
  options: [
  "Старая",
  "Новая",
  "Историческая",
  ],
  answers: [0],
  score: 10,
  category: "История Митино"
  },
  {
  question: "Кто признан лучшим вратарём в 2019 году по версии ФИФА?",
  options: [
  "Давид де Хеа",
  "Алиссон",
  "Тибо Куртуа",
  ],
  answers: [0],
  score: 30,
  category: "История Митино"
  },
  {
  question: "Кто является лучшим бомбардиром за всю историю сборной Португалии?",
  options: [
  "Матийс де Лигт",
  "Лионель Месси",
  "Криштиану Роналду",
  "Вирджил ван Дейк",
  ],
  answers: [0],
  score: 40,
  category: "Природа"
  },
  {
  question: "В какой стране впервые проходил Кубок мира ФИФА?",
  options: [
  "Уругвай",
  "Франция",
  ],
  answers: [0],
  score: 10,
  category: "Экономика"
  }
]
},
// HTML ELEMENTS
hWrap: null, // HTML quiz container
hQn: null, // HTML question wrapper
hAns: null, // HTML answers wrapper
selectedRandomQuery : null,
// GAME FLAGS
currentCommand : "",
playCommands : new Map(),
queries : null,
maxCommandsCount : 0,
currentCommandIndex : 0,
queryAnswers : null,
questionNumber: 0,

setScore: (control, name, value, correctAnswers, totalQuestion) => {
  let text = `${name}<br>Cчет: ${value}`;
  if (correctAnswers > 0 || totalQuestion > 0)
  {
    text += "<br>Ответы: правильных " + correctAnswers + ", неправильных " + (totalQuestion - correctAnswers);
  }
 // control.innerHTML = text;

 let divs  = control.getElementsByTagName('div');
 for (const div of divs) {
 let spans  = div.getElementsByTagName('span');
 for (const span of spans) {
  let className  = span.class;
  if (className == "span_command_name") {
    span.innerHTML = name;
  }
  if (className == "span_command_score") {
    span.innerHTML = "Счет: " + value;
  }
  if (className == "span_custom_info" &&  (correctAnswers > 0 || totalQuestion > 0)) {
    span.innerHTML = "Ответы: правильных " + correctAnswers + ", неправильных " + (totalQuestion - correctAnswers);
  }
}

}
 
},

JSONToFile : (obj, filename) => {
  const blob = new Blob([JSON.stringify(obj, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.txt`;
  a.click();
  URL.revokeObjectURL(url);
},

fillTable: () => {
 
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

  quiz.showQuizTable(true);
},

commandGame: (commandIndex) => {
  var index = 0;
  document.querySelectorAll(".command_item").forEach(control => {
    if (commandIndex == index)  {
      control.classList.add("correct");
      control.classList.remove("disable"); 

      if (quiz.currentCommand != control.name)  {
        currentCommand = control.name;
        quiz.showQuestionPanel(false);
        quiz.fillTable();
      }
    }
    else
    {
      control.classList.remove("correct");
      control.classList.add("disable"); 
    }
    ++ index;
  });
},

// INIT QUIZ HTML
init: (commandNames) => {
  // WRAPPER

  quiz.questionNumber = 0;
  quiz.currentCommand = "";
  quiz.currentCommandIndex = 0;
  quiz.hWrap = document.querySelector('.quizWrap');
 
  var jsonData = JSON.stringify(quiz.data, null, 2);
  console.log(jsonData);

  document.title = quiz.data.title;

  document.getElementById('game_title').innerHTML = quiz.data.title;

  queries = new Map();
  for (let i = 0; i < quiz.data.items.length; i++) {

    query = { query : quiz.data.items[i].question, 
              options : quiz.data.items[i].options,
              answers : new Set(quiz.data.items[i].answers),
              score : quiz.data.items[i].score,
              info :  quiz.data.items[i].info
            };

    if (queries.has(quiz.data.items[i].category)) {
      if (queries.get(quiz.data.items[i].category).has(quiz.data.items[i].score)) {
        queries.get(quiz.data.items[i].category).get(quiz.data.items[i].score).add(query );
      }
      else
      {
        queries.get(quiz.data.items[i].category).set(quiz.data.items[i].score, new Set());
        queries.get(quiz.data.items[i].category).get(quiz.data.items[i].score).add(query);
      }
    }
    else {
      const mapItems = new Map();
      mapItems.set(quiz.data.items[i].score, new Set());
      mapItems.get(quiz.data.items[i].score).add(query);
      queries.set(quiz.data.items[i].category, mapItems);
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
    commands.appendChild(command);

    let commandDiv = document.createElement("div");
    commandDiv.id = "name_score_div";
    command.appendChild(commandDiv);
    let spanCommandName = document.createElement("span");
    spanCommandName.class = "span_command_name";
    spanCommandName.id = "span_command_name";
    commandDiv.appendChild(spanCommandName);
    let spanCommandScore = document.createElement("span");
    spanCommandScore.class = "span_command_score";
    spanCommandScore.id = "span_command_score";
    commandDiv.appendChild(spanCommandScore);

    let customDifInfo = document.createElement("div");
    customDifInfo.id = "custom_div";
    let spanCustomInfo = document.createElement("span");
    spanCustomInfo.class = "span_custom_info";
    spanCustomInfo.id = "span_custom_info";
    customDifInfo.appendChild(spanCustomInfo);

    command.appendChild(customDifInfo);

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
            quiz.showQuestionPanel(false);
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



    quiz.commandGame(0);

  });
},

showQuestion: (cat, scoreValue) => { 
  if (queries.has(cat)) {
    if (queries.get(cat).has(scoreValue)) {

      function getRandomItem(set) {
        let items = Array.from(set);
        return items[Math.floor(Math.random() * items.length)];
      }

      quiz.selectedRandomQuery = getRandomItem(queries.get(cat).get(scoreValue).values());
      queries.get(cat).get(scoreValue).delete(quiz.selectedRandomQuery);

      quiz.showQuizTable(false);
      quiz.showQuestionPanel(true);
      
      quiz.hWrap.innerHTML = "";

      let category = document.createElement("div");
      category.id = "quizQnCategory";
      category.innerHTML = cat;
      quiz.hWrap.appendChild(category)

      // QUESTIONS SECTION
      quiz.hQn = document.createElement("div");
      quiz.hQn.id = "quizQn";
      quiz.hWrap.appendChild(quiz.hQn);

      // ANSWERS SECTION
      quiz.hAns = document.createElement("div");
      quiz.hAns.id = "quizAns";
      quiz.hWrap.appendChild(quiz.hAns);

      quiz.hAnsButtons = document.createElement("div");
      quiz.hAnsButtons.id = "quizAnsButtons";
      quiz.hWrap.appendChild(quiz.hAnsButtons);
      
      // GO!
      quiz.queryAnswers = new Set();
      quiz.draw(quiz.selectedRandomQuery);

      if (queries.get(cat).get(scoreValue).size == 0) {
        queries.get(cat).delete(scoreValue);
      }
      if (queries.get(cat).size == 0) {
        queries.delete(cat);
      }
    }
  }
},

processAnswer : () => {     
  quiz.playCommands.get(currentCommand).questions ++;

  if (quiz.isCorrectAnswers()) {
    quiz.playCommands.get(currentCommand).score += quiz.selectedRandomQuery.score;
    quiz.playCommands.get(currentCommand).correctAnswers ++;
  }

  let commands = document.getElementById("top_commands");
  for (let control of commands.getElementsByClassName("command_item")) {
  if (control.name == currentCommand) {
    quiz.setScore(control, 
      currentCommand, quiz.playCommands.get(currentCommand).score, quiz.playCommands.get(currentCommand).correctAnswers, quiz.playCommands.get(currentCommand).questions);
    }
  }

  quiz.showQuestionPanel(false);
  quiz.currentCommand = "";
  
  if (queries.size > 0) { 
      const commands = document.querySelectorAll(".command_item");
      if (++quiz.currentCommandIndex == commands.length)
      {
        quiz.currentCommandIndex = 0;
      }
      quiz.commandGame(quiz.currentCommandIndex);
  } else {
    quiz.hQn.innerHTML = "";
    quiz.hAns.innerHTML = "";
    quiz.reset(quiz.playCommands);
  }

  /*

  const commands = document.getElementById("top_commands");
  let all = commands.getElementsByClassName("command_item");
  for (let control of all) {
    control.classList.remove("correct");
    control.classList.remove("disable"); 
  }*/
 },

isCorrectAnswers : () => {
  if (quiz.queryAnswers != null) {
    let answers = quiz.queryAnswers;
    let correctAnswers = quiz.selectedRandomQuery.answers;
    return (correctAnswers.difference(answers).size == 0 && answers.difference(correctAnswers).size == 0);
  }
  return false;
},

// DRAW QUESTION
draw: (query) => {

  quiz.questionNumber ++;
  // QUESTION
  quiz.hQn.innerHTML = query.query;
  // OPTIONS
  quiz.hAns.innerHTML = "";
  var index = 0;
  for (let option of query.options) {
    let radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "quiz";
//    radio.id = "quizo" + i;
    quiz.hAns.appendChild(radio);
    let label = document.createElement("label");
    label.innerHTML = option;
    label.id = index;
    label.className = "label_question";
    //label.setAttribute("for", "quizo" + i);
    //label.dataset.query = "ZZZ";
    let s = index;

    const myCallback = () => {
      quiz.select(label, query, s);
      label.removeEventListener("click", myCallback);
    };
    label.addEventListener("click", myCallback);

    index ++;
    quiz.hAns.appendChild(label);
  }

  let button = document.createElement("input");
  button.setAttribute("class", "submit");
  button.id = "button_show_answer";
  button.value = "Показать ответ";
  button.type = "button";
  button.addEventListener('click', () =>  {

    let answers = quiz.hAns.getElementsByClassName("label_question");
    for (let answer of answers) {
      if (quiz.selectedRandomQuery.answers.has(parseInt(answer.id))) {
        answer.classList.add("correct")
      }
      else {
        answer.classList.add("worng")
      }
    }

    if (!quiz.isCorrectAnswers()) {
      quiz.queryAnswers = null;
    }
    quiz.showButtonNext(true);

    //if (query.info != null) 
      {
      document.getElementById('question_panel_data_information').innerHTML =  query.info != null ? query.info : "Внесите дополнительную информацию о вопросе.";
      quiz.showInformation(true);
    }
  });

  quiz.hAnsButtons.appendChild(button);

  let buttonNext = document.createElement("input");
  buttonNext.setAttribute("class", "submit");
  buttonNext.id = "button_next";
  buttonNext.value = "Далее";
  buttonNext.type = "button";
  buttonNext.classList.add("disable");

  buttonNext.addEventListener('click', () =>  {
    quiz.processAnswer();
  });

  quiz.hAnsButtons.appendChild(buttonNext);

  document.getElementById('question_info').innerHTML = "Вопрос " + quiz.questionNumber.toString() + " из  " +  quiz.data.items.length.toString();
  document.getElementById('question_score').innerHTML = query.score.toString() + " баллов";
},

showButtonAnswer: (value) => {

  if (value) {
    document.getElementById("button_show_answer").classList.remove("disable");
  } else {
    document.getElementById("button_show_answer").classList.add("disable");
  }
},

showButtonNext: (value) => {

  if (value) {
    document.getElementById("button_next").classList.remove("disable");
  } else {
    document.getElementById("button_next").classList.add("disable");
  }
},

// OPTION SELECTED
select: (option, query, index) => {

  if (quiz.queryAnswers != null) {
    quiz.queryAnswers.add(index);
  }
  let correct = false;
  for (let i = 0; i < quiz.data.items.length; i++) {
    if (query.query == quiz.data.items[i].question) {
      let answers = new Set(quiz.data.items[i].answers);
      if (answers.has(index)) { 
        correct = true;
        break;
      }
    }
  }
  if (correct) {
     option.classList.add("correct");
  } else {
     option.classList.add("wrong");
  }

  setTimeout(() => {
    quiz.showButtonNext(true);
  }, 500); 
},

// RESTART QUIZ
reset : (playCommandsValues) => {

  quiz.showGameMenu(false);
  quiz.showTopPanel(false);
  quiz.showQuizTable(false);
  quiz.showQuestionPanel(false);

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
    var str = ++index + ". Команда <b>\"" + cmd.command + 
              "\"</b> ответила на " + cmd.correctAnswers + " вопросов из " + cmd.questions + 
              " на " + cmd.score + " баллов!";

    results.push(str);
  }

  var strResult = results.length == 0 ? "Никто не играл:(" : results.join("<br><br>");

  document.getElementById('info').innerHTML = "<br>" + strResult + "<br><br><br>";
  document.querySelector('.quiz-over-modal').classList.add('active')
},

showQuizTable : (value) => {
  if (value) {
  document.querySelector('.quizTableContainer').classList.add("active");
  }
  else {
    document.querySelector('.quizTableContainer').classList.remove("active");
  }
},

showInformation: (value) => {
  if (value) {
    document.querySelector('.question_panel_data').classList.add("active");
    document.querySelector('.question_panel').classList.add("collapse");
  }
  else {
   document.querySelector('.question_panel_data').classList.remove("active");
   document.querySelector('.question_panel').classList.remove("collapse");
  }
},

showQuestionPanel: (value) => {
  if (value) {
    document.querySelector('.question_panel_all').classList.add("active");
    document.querySelector('.quizWrap').classList.add("active");
  }
  else {
      document.querySelector('.question_panel_all').classList.remove("active");
      document.querySelector('.quizWrap').classList.remove("active");
  }

  quiz.showInformation(false);
},

showGameMenu : (value) => {
  if (value) {
    document.getElementById('load_game').classList.add("active");
    document.getElementById('force_finish').classList.add("active");
  document.getElementById('new_game').classList.add("active");
  }
  else {
    document.getElementById('load_game').classList.remove("active");
    document.getElementById('force_finish').classList.remove("active");
    document.getElementById('new_game').classList.remove("active");
  }
},

showTopPanel: (value) => {
  if (value) {
    document.getElementById('top_panel').classList.add("active");
    document.getElementById('top_commands').classList.add("active");
  }
  else {
    document.getElementById('top_panel').classList.remove("active");
    document.getElementById('top_commands').classList.remove("active");
  }
},

createCommand: (name) => {
  var input = document.createElement("input");
  input.value = name ;
  input.type = "text";

  var span = document.createElement("span");
  span.appendChild(input);

  var div = document.createElement("div");
  div.setAttribute("class", "divCrossImageButton");
  var img = document.createElement("img");
  img.src = "cross.jpg";
  img.setAttribute("class", "crossImageButton");
  img.setAttribute("width", "44px");
  img.setAttribute("height", "44px");
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

  const scrollToBottom = (id) => {
    const element = document.getElementById(id);
    element.scrollTop = element.scrollHeight;
  }

  scrollToBottom("fields");

//  input.focus();
//  input.select();
},

getCommandInputs : () => {
  return  Array.from(document.getElementById("join-us").getElementsByTagName("input")).filter(t => { return t.type == "text"});
}

};

window.addEventListener("load", () => { 

  document.querySelector('.containerCommands').classList.add("active");

  const add_command = document.getElementById("add_command");
  add_command.addEventListener("click", function() {
    const commandInputs = quiz.getCommandInputs();
    if (commandInputs.length >= 7)
    {
      return;
    }

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

    quiz.showTopPanel(true);
    document.querySelector('.containerCommands').classList.remove("active");
    
    quiz.showGameMenu(true);
    
    commandInputs = quiz.getCommandInputs();
    commands = commandInputs.map(t => { return t.value});

    function shuffleArray(array) {
      for (var i = array.length - 1; i > 0; i--) { 
     
          // Generate random number 
          var j = Math.floor(Math.random() * (i + 1));
                     
          var temp = array[i];
          array[i] = array[j];
          array[j] = temp;
      }
         
      return array;
    };
    quiz.init(shuffleArray(commands));
  });

  const force_finish = document.getElementById("force_finish");
  force_finish.addEventListener("click", function() {
    quiz.showGameMenu();
    quiz.reset(quiz.playCommands);
  });

  const new_game = document.getElementById("new_game");
  new_game.addEventListener("click", function() {

    const commands = Array.from(quiz.playCommands.keys());

    quiz.showQuestionPanel(false);
    quiz.showQuizTable(false);
    quiz.showTopPanel(false);

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
  quiz.createCommand("Команда 2");

  //document.addEventListener('contextmenu', event => event.preventDefault());

  const loadFileButton = document.getElementById('load_file');

  document.getElementById('load_game').addEventListener('click', () => {
    //quiz.JSONToFile(quiz.data, "Mitino");
    loadFileButton.click();
  });

  loadFileButton.addEventListener("change", function() {
    if (loadFileButton.value) {

      let file = loadFileButton.files[0];

      var r = new FileReader();
      r.onload = function(e) { 
          var contents = e.target.result;
          quiz.data = JSON.parse(contents);

          commandInputs = quiz.getCommandInputs();
          commands = commandInputs.map(t => { return t.value});
     
          quiz.init(commands);
        }
      r.readAsText(file);
    } else {
    }
  }); 

  const closeButton = document.getElementById("question_panel_data_information_button");
  closeButton.addEventListener("click", function() {
    quiz.showInformation(false);
  });
}
);
