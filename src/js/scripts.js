const boardColors = Array.from(document.querySelectorAll('.game__square')).slice(0,4)
const btnStartGame = document.getElementById('start-game')
const gameDifficulty = document.getElementById('game-difficulty')
const formName = document.getElementById('form-name')
const infoScore = document.getElementById('info-score')
const game = { 
    difficulty:{        
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
}
/**
 * * Generate a random number between 0 and 3 inclusive, this represents the colors of simon
 * @param {array} arr receive the array of game.sequence 
 */
const sequence = (arr) =>{

    const newArr = [...arr]
    const rdn = Math.floor(Math.random() * 4);
    
    newArr.push(rdn)
    return newArr
}
/**

 */
const activeColor = (number) =>{
    const time = game.difficulty.time / 2  

    boardColors.forEach((e) => {  
        
        if(e.getAttribute('data-value') == number){ 
            e.classList.add('active')            
        }
        setTimeout(()=>{
            e.classList.remove('active')            
        }, time) 
           
    }); 
}

const checkSequence = (simonSequence, userSequence) =>{
    const long = game.user.sequence.length -1
    const simon = simonSequence[long]
    const user = userSequence[long]

    return simon === user
}

/**
 * * Fill de array of game.sequence, with 1 number per level. Level 1 = [n], Level 2 = [n,n] ... 
 */
const startRound = () =>{
    const infoLevel = document.getElementById('info-level')    
    const time = game.difficulty.time;  
    let sequenceLength
    let count = 0;

    game.sequence = sequence(game.sequence);    
    sequenceLength = game.sequence.length;
    infoLevel.textContent = `Level ${game.level}`;

    (function loop(sequenceLength) { 

        setTimeout(()=> {   
            activeColor(game.sequence[count]);
            count++

            if(--sequenceLength) //When rounds is != 0 the condition is true 
                loop(sequenceLength);
            
        }, time)
       
    })(sequenceLength);    

}
const selectDifficulty = () =>{
    const selectDifficulty = document.getElementById('game-difficulty').value
    let result

    switch (selectDifficulty) {

        case 'hard':
            game.difficulty = {
                time: 700,
                multiplier: 1.3
            }

            result = game.difficulty
            break;

        case 'epic':
            game.difficulty = {
                time: 500,
                multiplier: 1.5
            }

            result = game.difficulty
            break;

        default:
            game.difficulty = {
                time: 1000,
                multiplier: 1
            }

            result = game.difficulty
          break;
    }    
    return result
}


const reset = () =>{
    game.user.sequence = []   
}
const endGame = () =>{
    game.sequence = []
    game.user.sequence = []
    game.user.score = 0
    game.compareSequence = true
    game.level = 1
    game.playing = false    
    btnStartGame.removeAttribute('disabled')
    btnStartGame.classList.remove('game__button--disabled')
    gameDifficulty.removeAttribute('disabled')    
}
const updateScore = () =>{   

    game.user.score += game.scoreBase * game.difficulty.multiplier
    infoScore.textContent = game.user.score.toString().padStart(6, '0')
}

btnStartGame.addEventListener('click', ()=>{
    const error = document.getElementById('error')
    infoScore.textContent = game.user.score.toString().padStart(6, '0')

    if(formName.value.length === 0){
        error.classList.remove('error--hide')
        formName.focus()
    }else{
        error.classList.add('error--hide')
        if(!game.playing){
            
            startRound()
            game.playing = true
            btnStartGame.setAttribute('disabled', '')
            btnStartGame.classList.add('game__button--disabled')
            gameDifficulty.setAttribute('disabled', '')
        }
    }
})

//TODO ranking
//TODO los sonidos

const board = document.getElementById('game-board')
board.addEventListener('click', (e)=>{    

    if(game.compareSequence){
       
        if(e.target.getAttribute('data-value')){
            const colorPressed = Number(e.target.getAttribute('data-value'))

            game.user.sequence.push(colorPressed)           
            game.compareSequence = checkSequence(game.sequence, game.user.sequence)
            activeColor(colorPressed)

            if(game.compareSequence){
                updateScore()
            }

            if(game.compareSequence && game.sequence.length === game.user.sequence.length){
                console.log("Next Round")

                reset()
                game.level++
                //Delay between rounds
                setTimeout(startRound, 1000)
            }

            if(!game.compareSequence){
                console.log('Erroorrrrr')                
                endGame()
            }
        }
    }
})


formName.addEventListener('change', ()=>{

    const infoUsername = document.getElementById('info-username')

    game.user.username = formName.value
    infoUsername.textContent = game.user.username
})


gameDifficulty.addEventListener('change', ()=>{    
    
    if(!game.playing){        
        selectDifficulty()      
    }   
})
