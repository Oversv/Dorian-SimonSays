const boardColors = Array.from(document.querySelectorAll('.game__square')).slice(0,4)
const btnStartGame = document.getElementById('start-game')
const gameDifficulty = document.getElementById('game-difficulty')
const formName = document.getElementById('form-name')
const infoScore = document.getElementById('info-score')
const game = { 
    id: '',
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
 * * Iluminate the button 
 * @param {number} number 
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
/**
 * * Check the Simon sequence with the user and return true if both are equals and false if are different
 * @param {array} simonSequence array with Simon sequence
 * @param {array} userSequence array with user sequence
 */
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

/**
 *  *Change the difficulty of the game
 */
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

/**
 * * Reset the user sequence when finish de round
 */
const reset = () =>{
    game.user.sequence = []   
}

/**
 * * Reset all parameters of the game
 */
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

/**
 * *Upadete the score when finish each round
 */
const updateScore = () =>{
    game.user.score += game.scoreBase * game.difficulty.multiplier
    infoScore.textContent = game.user.score.toString().padStart(6, '0')
}
/**
 * * Save in the local storage the ranking of the user, save(id, username, level, score and date) for each round
 * @param {object} game The object when the game save all parameters 
 */
const saveRanking = (game) =>{ 
    const myDate = new Date()
    const day = myDate.getDate()
    const month = myDate.getMonth()+1
    const year = myDate.getFullYear()

    const userRanking = {
        id: game.id,
        username: game.user.username,
        level: game.level,
        score: game.user.score,
        date: `${day}/${month}/${year}`
    }

    if(JSON.parse(localStorage.getItem('simonRanking')) === null){
        localStorage.setItem('simonRanking', JSON.stringify([]))
    }

    const allLocalStorage = JSON.parse(localStorage.getItem('simonRanking'))
    const newLocalStorage = allLocalStorage.filter(e => e.id !== game.id)
    
    newLocalStorage.push(userRanking)
    localStorage.setItem('simonRanking', JSON.stringify(newLocalStorage))
}
/**
 * * Order the local storage for levels and scores, and show
 */
const showRanking = () =>{
    const ranking = document.getElementById('ranking')
    const fragment = document.createDocumentFragment()
    let rankingItems = 3

    ranking.innerHTML = ''

    if(JSON.parse(localStorage.getItem('simonRanking')) !== null){

        const allLocalStorage = JSON.parse(localStorage.getItem('simonRanking')).sort((a, b) => b.level - a.level || b.score - a.score);

        if(allLocalStorage.length < 3){           
            rankingItems = allLocalStorage.length
        }

        for(let i = 0; i < rankingItems; i++){
            const p = document.createElement('p')         
           
            p.textContent=`
                ${i+1}º ${allLocalStorage[i].username} - Level ${allLocalStorage[i].level}
            `
            fragment.appendChild(p)
        }

        const button = document.createElement('button')
        button.textContent = 'See More'
        button.setAttribute('id', 'ranking-details')
        button.setAttribute('onclick','showModal()')

        fragment.appendChild(button)        
        ranking.appendChild(fragment)
    }
}
/**
 * * Show the modal and create the content
 */
const showModal = () =>{    
    const allLocalStorage = JSON.parse(localStorage.getItem('simonRanking')).sort((a, b) => b.level - a.level || b.score - a.score);
    const modal = document.getElementById('modal')    
    const modalRanking = document.getElementById('modal-ranking')
    const fragment = document.createDocumentFragment()
    let rankingItems = 50
    
    modal.classList.add('modal--show')
    modalRanking.innerHTML = ''

    if(allLocalStorage.length < 50){           
        rankingItems = allLocalStorage.length
    }

    for(let i = 0; i < rankingItems; i++){
        const p = document.createElement('p')         
       
        p.textContent=`
            ${i+1}º ${allLocalStorage[i].username} - Level ${allLocalStorage[i].level} - Score ${allLocalStorage[i].score} - Date ${allLocalStorage[i].date} 
        `
        fragment.appendChild(p)
    }
    
    modalRanking.appendChild(fragment)
}

/******************** 
  *** Listeners *** 
 *******************/
btnStartGame.addEventListener('click', ()=>{

    const error = document.getElementById('error')
    infoScore.textContent = game.user.score.toString().padStart(6, '0')

    if(formName.value.trim().length === 0){
        error.classList.remove('error--hide')
        formName.focus()
    }else{
        error.classList.add('error--hide')

        if(!game.playing){            
            startRound()
            game.id = Date.now()
            game.playing = true
            btnStartGame.setAttribute('disabled', '')
            btnStartGame.classList.add('game__button--disabled')
            gameDifficulty.setAttribute('disabled', '')
        }
    }
})

//TODO los sonidos
//TODO mirar de meter un grid en la modal y añadir la difiucultad, añadir el scroll para la modal mirar el log the piedra papel

const board = document.getElementById('game-board')
board.addEventListener('click', (e)=>{    
    
   // if(game.compareSequence){ //! Creo que no hace falta
       
        if(e.target.getAttribute('data-value')){
            const colorPressed = Number(e.target.getAttribute('data-value'))

            game.user.sequence.push(colorPressed)           
            game.compareSequence = checkSequence(game.sequence, game.user.sequence)
            activeColor(colorPressed)

            if(game.compareSequence){
                updateScore()              
            }

            //Next Round
            if(game.compareSequence && game.sequence.length === game.user.sequence.length){
                console.log("Next Round")
                saveRanking(game)
                showRanking()
                reset()
                game.level++
                //Delay between rounds
                setTimeout(startRound, 1000)
            }

            //Eror and game over :(
            if(!game.compareSequence){
                console.log('Error')                
                endGame()
            }
        }
   // }
})

formName.addEventListener('change', ()=>{

    const infoUsername = document.getElementById('info-username')

    game.user.username = formName.value.trim()
    infoUsername.textContent = game.user.username
})

gameDifficulty.addEventListener('change', ()=>{   
    
    if(!game.playing){        
        selectDifficulty()      
    }   
})

//Close Modal
const modalClose = document.getElementById('modal-close')
modalClose.addEventListener('click', () => modal.classList.remove('modal--show'))

showRanking()