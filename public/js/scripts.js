"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var boardColors = Array.from(document.querySelectorAll('.game__square')).slice(0, 4);
var btnStartGame = document.getElementById('start-game');
var gameDifficulty = document.getElementById('game-difficulty');
var formName = document.getElementById('form-name');
var infoScore = document.getElementById('info-score');
var game = {
  id: '',
  difficulty: {
    time: 1000,
    multiplier: 1
  },
  sequence: [],
  playing: false,
  compareSequence: true,
  user: {
    username: '',
    sequence: [],
    score: 0
  },
  level: 1,
  scoreBase: 10,
  ranking: []
};
/**
 * * Generate a random number between 0 and 3 inclusive, this represents the colors of simon
 * @param {array} arr receive the array of game.sequence 
 */

var sequence = function sequence(arr) {
  var newArr = _toConsumableArray(arr);

  var rdn = Math.floor(Math.random() * 4);
  newArr.push(rdn);
  return newArr;
};
/**
 * * Iluminate the button 
 * @param {number} number 
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
 * * Check the Simon sequence with the user and return true if both are equals and false if are different
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
 * * Fill de array of game.sequence, with 1 number per level. Level 1 = [n], Level 2 = [n,n] ... 
 */


var startRound = function startRound() {
  var infoLevel = document.getElementById('info-level');
  var time = game.difficulty.time;
  var sequenceLength;
  var count = 0;
  game.sequence = sequence(game.sequence);
  sequenceLength = game.sequence.length;
  infoLevel.textContent = "Level ".concat(game.level);

  (function loop(sequenceLength) {
    setTimeout(function () {
      activeColor(game.sequence[count]);
      count++;
      if (--sequenceLength) //When rounds is != 0 the condition is true 
        loop(sequenceLength);
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
 * * Reset the user sequence when finish de round
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
 * *Upadete the score when finish each round
 */


var updateScore = function updateScore() {
  game.user.score += game.scoreBase * game.difficulty.multiplier;
  infoScore.textContent = game.user.score.toString().padStart(6, '0');
};
/**
 * * Save in the local storage the ranking of the user, save(id, username, level, score and date) for each round
 * @param {object} game The object when the game save all parameters 
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
 * * Order the local storage for levels and scores, and show
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

    var button = document.createElement('button');
    button.textContent = 'See More';
    button.setAttribute('id', 'ranking-details');
    button.setAttribute('onclick', 'showModal()');
    fragment.appendChild(button);
    ranking.appendChild(fragment);
  }
};
/**
 * * Show the modal and create the content
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

  if (allLocalStorage.length < 50) {
    rankingItems = allLocalStorage.length;
  }

  for (var i = 0; i < rankingItems; i++) {
    var p = document.createElement('p');
    p.textContent = "\n            ".concat(i + 1, "\xBA ").concat(allLocalStorage[i].username, " - Level ").concat(allLocalStorage[i].level, " - Score ").concat(allLocalStorage[i].score, " - Date ").concat(allLocalStorage[i].date, " \n        ");
    fragment.appendChild(p);
  }

  modalRanking.appendChild(fragment);
};
/******************** 
  *** Listeners *** 
 *******************/


btnStartGame.addEventListener('click', function () {
  var error = document.getElementById('error');
  infoScore.textContent = game.user.score.toString().padStart(6, '0');

  if (formName.value.trim().length === 0) {
    error.classList.remove('error--hide');
    formName.focus();
  } else {
    error.classList.add('error--hide');

    if (!game.playing) {
      startRound();
      game.id = Date.now();
      game.playing = true;
      btnStartGame.setAttribute('disabled', '');
      btnStartGame.classList.add('game__button--disabled');
      gameDifficulty.setAttribute('disabled', '');
    }
  }
}); //TODO los sonidos
//TODO mirar de meter un grid en la modal y añadir la difiucultad, añadir el scroll para la modal mirar el log the piedra papel

var board = document.getElementById('game-board');
board.addEventListener('click', function (e) {
  // if(game.compareSequence){ //! Creo que no hace falta
  if (e.target.getAttribute('data-value')) {
    var colorPressed = Number(e.target.getAttribute('data-value'));
    game.user.sequence.push(colorPressed);
    game.compareSequence = checkSequence(game.sequence, game.user.sequence);
    activeColor(colorPressed);

    if (game.compareSequence) {
      updateScore();
    } //Next Round


    if (game.compareSequence && game.sequence.length === game.user.sequence.length) {
      console.log("Next Round");
      saveRanking(game);
      showRanking();
      reset();
      game.level++; //Delay between rounds

      setTimeout(startRound, 1000);
    } //Eror and game over :(


    if (!game.compareSequence) {
      console.log('Error');
      endGame();
    }
  } // }

});
formName.addEventListener('change', function () {
  var infoUsername = document.getElementById('info-username');
  game.user.username = formName.value.trim();
  infoUsername.textContent = game.user.username;
});
gameDifficulty.addEventListener('change', function () {
  if (!game.playing) {
    selectDifficulty();
  }
}); //Close Modal

var modalClose = document.getElementById('modal-close');
modalClose.addEventListener('click', function () {
  return modal.classList.remove('modal--show');
});
showRanking();