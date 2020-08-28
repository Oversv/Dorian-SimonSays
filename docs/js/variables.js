"use strict";

var boardColors = Array.from(document.querySelectorAll('.game__square')).slice(0, 4);
var btnStartGame = document.getElementById('start-game');
var gameDifficulty = document.getElementById('game-difficulty');
var formName = document.getElementById('form-name');
var infoScore = document.getElementById('info-score');
var board = document.getElementById('game-board');
var modalClose = document.getElementById('modal-close');
var game = {
  id: '',
  difficulty: {
    time: 1000,
    multiplier: 1
  },
  sequence: [],
  audio: ['green.wav', 'yellow.wav', 'blue.wav', 'red.wav'],
  playing: false,
  compareSequence: true,
  user: {
    username: '',
    userTurn: false,
    sequence: [],
    score: 0
  },
  level: 1,
  scoreBase: 10,
  ranking: []
};