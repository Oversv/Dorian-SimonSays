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

var reset = function reset() {
  game.user.sequence = [];
};

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

var updateScore = function updateScore() {
  game.user.score += game.scoreBase * game.difficulty.multiplier;
  infoScore.textContent = game.user.score.toString().padStart(6, '0');
};

btnStartGame.addEventListener('click', function () {
  var error = document.getElementById('error');
  infoScore.textContent = game.user.score.toString().padStart(6, '0');

  if (formName.value.length === 0) {
    error.classList.remove('error--hide');
    formName.focus();
  } else {
    error.classList.add('error--hide');

    if (!game.playing) {
      startRound();
      game.playing = true;
      btnStartGame.setAttribute('disabled', '');
      btnStartGame.classList.add('game__button--disabled');
      gameDifficulty.setAttribute('disabled', '');
    }
  }
}); //TODO ranking
//TODO los sonidos

var board = document.getElementById('game-board');
board.addEventListener('click', function (e) {
  if (game.compareSequence) {
    if (e.target.getAttribute('data-value')) {
      var colorPressed = Number(e.target.getAttribute('data-value'));
      game.user.sequence.push(colorPressed);
      game.compareSequence = checkSequence(game.sequence, game.user.sequence);
      activeColor(colorPressed);

      if (game.compareSequence) {
        updateScore();
      }

      if (game.compareSequence && game.sequence.length === game.user.sequence.length) {
        console.log("Next Round");
        reset();
        game.level++; //Delay between rounds

        setTimeout(startRound, 1000);
      }

      if (!game.compareSequence) {
        console.log('Erroorrrrr');
        endGame();
      }
    }
  }
});
formName.addEventListener('change', function () {
  var infoUsername = document.getElementById('info-username');
  game.user.username = formName.value;
  infoUsername.textContent = game.user.username;
});
gameDifficulty.addEventListener('change', function () {
  if (!game.playing) {
    selectDifficulty();
  }
});