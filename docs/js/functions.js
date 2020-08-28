"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

/**
 * * Generate a random number between 0 and 3 included, this represents Simon colours
 * @param {array} arr receive the array of game.sequence 
 */
var sequence = function sequence(arr) {
  var newArr = _toConsumableArray(arr);

  var rdn = Math.floor(Math.random() * 4);
  newArr.push(rdn);
  return newArr;
};
/**
 * * Light up the button 
 * @param {number} number of the button that should be activated
 */


var activeColor = function activeColor(number) {
  var time = game.difficulty.time / 2;
  boardColors.forEach(function (e) {
    if (e.getAttribute('data-value') == number) {
      e.classList.add('active');
    }

    setTimeout(function () {
      e.classList.remove('active');
    }, time);
  });
};
/**
 * * Play the audio
 * @param {number} audio is a number with the position of the audio in the array
 */


var playAudio = function playAudio(audio) {
  return new Audio("audio/".concat(game.audio[audio])).play();
};
/**
 * * Check the Simon sequence with the user and return true if both are equal and false if are different
 * @param {array} simonSequence array with Simon sequence
 * @param {array} userSequence array with user sequence
 */


var checkSequence = function checkSequence(simonSequence, userSequence) {
  var _long = game.user.sequence.length - 1;

  var simon = simonSequence[_long];
  var user = userSequence[_long];
  return simon === user;
};
/**
 * * Fill the array of game.sequence, with 1 number per level. Level 1 = [n], Level 2 = [n,n] ... 
 */


var startRound = function startRound() {
  var infoLevel = document.getElementById('info-level');
  var time = game.difficulty.time;
  var sequenceLength;
  var count = 0;
  game.sequence = sequence(game.sequence);
  sequenceLength = game.sequence.length;
  infoLevel.textContent = "Level ".concat(game.level);
  game.user.userTurn = false; //Block the user turn

  (function loop(sequenceLength) {
    setTimeout(function () {
      activeColor(game.sequence[count]);
      playAudio(game.sequence[count]);
      count++;
      --sequenceLength ? loop(sequenceLength) : game.user.userTurn = true;
    }, time);
  })(sequenceLength);
};
/**
 *  *Change the difficulty of the game
 */


var selectDifficulty = function selectDifficulty() {
  var selectDifficulty = document.getElementById('game-difficulty').value;
  var result;

  switch (selectDifficulty) {
    case 'hard':
      game.difficulty = {
        time: 700,
        multiplier: 1.3
      };
      result = game.difficulty;
      break;

    case 'epic':
      game.difficulty = {
        time: 500,
        multiplier: 1.5
      };
      result = game.difficulty;
      break;

    default:
      game.difficulty = {
        time: 1000,
        multiplier: 1
      };
      result = game.difficulty;
      break;
  }

  return result;
};
/**
 * * Reset the user sequence when the round ends
 */


var reset = function reset() {
  game.user.sequence = [];
};
/**
 * * Reset all parameters of the game
 */


var endGame = function endGame() {
  game.sequence = [];
  game.user.sequence = [];
  game.user.score = 0;
  game.compareSequence = true;
  game.level = 1;
  game.playing = false;
  btnStartGame.removeAttribute('disabled');
  btnStartGame.classList.remove('game__button--disabled');
  gameDifficulty.removeAttribute('disabled');
};
/**
 * * Update the score when each round ends
 */


var updateScore = function updateScore() {
  game.user.score += game.scoreBase * game.difficulty.multiplier;
  infoScore.textContent = game.user.score.toString().padStart(6, '0');
};
/**
 * * Save in the local storage the ranking of the user, save(id, username, level, score and date) for each round
 * @param {object} game The object where the game saves all parameters 
 */


var saveRanking = function saveRanking(game) {
  var myDate = new Date();
  var day = myDate.getDate();
  var month = myDate.getMonth() + 1;
  var year = myDate.getFullYear();
  var userRanking = {
    id: game.id,
    username: game.user.username,
    level: game.level,
    score: game.user.score,
    date: "".concat(day, "/").concat(month, "/").concat(year)
  };

  if (JSON.parse(localStorage.getItem('simonRanking')) === null) {
    localStorage.setItem('simonRanking', JSON.stringify([]));
  }

  var allLocalStorage = JSON.parse(localStorage.getItem('simonRanking'));
  var newLocalStorage = allLocalStorage.filter(function (e) {
    return e.id !== game.id;
  });
  newLocalStorage.push(userRanking);
  localStorage.setItem('simonRanking', JSON.stringify(newLocalStorage));
};
/**
 * * Obtains the local storage data, sorts it by level and scores, and displays it
 */


var showRanking = function showRanking() {
  var ranking = document.getElementById('ranking');
  var fragment = document.createDocumentFragment();
  var rankingItems = 3;
  ranking.innerHTML = '';

  if (JSON.parse(localStorage.getItem('simonRanking')) !== null) {
    var allLocalStorage = JSON.parse(localStorage.getItem('simonRanking')).sort(function (a, b) {
      return b.level - a.level || b.score - a.score;
    });

    if (allLocalStorage.length < 3) {
      rankingItems = allLocalStorage.length;
    }

    for (var i = 0; i < rankingItems; i++) {
      var p = document.createElement('p');
      p.textContent = "\n                ".concat(i + 1, "\xBA ").concat(allLocalStorage[i].username, " - Level ").concat(allLocalStorage[i].level, "\n            ");
      fragment.appendChild(p);
    }

    var div = document.createElement('div');
    div.setAttribute('class', 'info__button-container');
    var button = document.createElement('button');
    button.textContent = 'See More';
    button.setAttribute('id', 'ranking-details');
    button.setAttribute('class', 'info__button');
    button.setAttribute('onclick', 'showModal()');
    div.appendChild(button);
    fragment.appendChild(div);
    ranking.appendChild(fragment);
  }
};
/**
 * * Shows the modal and creates the content
 */


var showModal = function showModal() {
  var allLocalStorage = JSON.parse(localStorage.getItem('simonRanking')).sort(function (a, b) {
    return b.level - a.level || b.score - a.score;
  });
  var modal = document.getElementById('modal');
  var modalRanking = document.getElementById('modal-ranking');
  var fragment = document.createDocumentFragment();
  var rankingItems = 50;
  modal.classList.add('modal--show');
  modalRanking.innerHTML = '';
  var gridColumnsNames = ['Pos', 'Name', 'Lvl', 'Score', 'Date'];
  gridColumnsNames.forEach(function (e) {
    var p = document.createElement('p');
    p.textContent = e;
    p.setAttribute('class', 'modal__title');
    fragment.appendChild(p);
  });

  if (allLocalStorage.length < 50) {
    rankingItems = allLocalStorage.length;
  }

  for (var i = 0; i < rankingItems; i++) {
    var col1 = document.createElement('p');
    var col2 = document.createElement('p');
    var col3 = document.createElement('p');
    var col4 = document.createElement('p');
    var col5 = document.createElement('p');
    col1.textContent = "".concat(i + 1, "\xBA");
    col2.textContent = allLocalStorage[i].username;
    col3.textContent = allLocalStorage[i].level;
    col4.textContent = allLocalStorage[i].score;
    col5.textContent = allLocalStorage[i].date;
    fragment.appendChild(col1);
    fragment.appendChild(col2);
    fragment.appendChild(col3);
    fragment.appendChild(col4);
    fragment.appendChild(col5);
  }

  modalRanking.appendChild(fragment);
};
/**
 * * displays a message when the user starts a new round or loses the game
 * @param {string} text that will be displayed 
 */


var showMessage = function showMessage(text) {
  var message = document.getElementById('message');
  var messageType = "";
  message.textContent = text;
  text === "Next Round!!" ? messageType = "message--round" : messageType = "message--end";
  message.classList.add(messageType);
  setTimeout(function () {
    message.classList.remove(messageType);
  }, 1000);
};