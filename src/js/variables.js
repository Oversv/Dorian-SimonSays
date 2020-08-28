const boardColors = Array.from(document.querySelectorAll('.game__square')).slice(0,4)
const btnStartGame = document.getElementById('start-game')
const gameDifficulty = document.getElementById('game-difficulty')
const formName = document.getElementById('form-name')
const infoScore = document.getElementById('info-score')
const board = document.getElementById('game-board')
const modalClose = document.getElementById('modal-close')
const game = { 
    id: '',
    difficulty:{        
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
}