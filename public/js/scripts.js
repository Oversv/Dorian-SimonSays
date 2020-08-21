"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var boardColors = Array.from(document.querySelectorAll('.game__square')).slice(0, 4);
var game = {
  //!Revisar como usar el tema de la difficultad
  difficulty: {
    normal: {
      time: 1000,
      multiplier: 1
    },
    hard: {
      time: 800,
      multiplier: 1.2
    },
    epic: {
      time: 600,
      multiplier: 1.4
    }
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
  boardColors.forEach(function (e) {
    if (e.getAttribute('data-value') == number) {
      //!Aqui es el problema, hay que pasarle de uno en uno lo que tiene que iluminar, seguramente hacerlo en el startgame
      e.classList.add('active');
    }

    setTimeout(function () {
      e.classList.remove('active');
    }, 500); //TODO dependerá de la dificultad
  });
};

var checkSequence = function checkSequence(simonSequence, userSequence) {
  var _long = game.user.sequence.length - 1;

  var simon = simonSequence[_long];
  var user = userSequence[_long];
  return simon === user;
};
/**
 * * Fill de array of game.sequence, 1 number per level. 1 level = [n], 2 level = [n,n] ... 
 */


var startRound = function startRound() {
  var time = 1000; //Todo irá la dificultad seleccionada

  var count = 0;
  game.sequence = sequence(game.sequence);
  var sequenceLength = game.sequence.length;

  (function loop(sequenceLength) {
    setTimeout(function () {
      activeColor(game.sequence[count]);
      count++;
      if (--sequenceLength) //When rounds is != 0 the condition is true 
        loop(sequenceLength);
    }, time);
  })(sequenceLength);
}; //TODO  deshabilitar este boton cuando el juego está en proceso


var startGame = document.getElementById('start-game');
startGame.addEventListener('click', function () {
  startRound();
}); //TODO hacer que el juego pase de rondas
//TODO hacer juego terminado
//TODO nombre de usuario
//TODO multiplicador para el score
//TODO ranking
//TODO el nivel de dificultad
//TODO los sonidos

var reset = function reset() {
  game.user.sequence = [];
};

var board = document.getElementById('game-board');
board.addEventListener('click', function (e) {
  if (game.compareSequence) {
    if (e.target.getAttribute('data-value')) {
      game.user.sequence.push(Number(e.target.getAttribute('data-value')));
      game.compareSequence = checkSequence(game.sequence, game.user.sequence); //console.log(e.target.getAttribute('data-value')) 

      if (game.compareSequence && game.sequence.length === game.user.sequence.length) {
        console.log("siguiente ronda");
        reset();
        game.level++;
        startRound();
      }

      if (!game.compareSequence) {
        console.log('Erroorrrrr');
        game.sequence = [];
        game.user.sequence = [];
        game.compareSequence = true;
        game.level = 1;
      }
    }
  }
});