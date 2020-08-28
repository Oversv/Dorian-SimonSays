
/**
 * * Generate a random number between 0 and 3 included, this represents Simon colours
 * @param {array} arr receive the array of game.sequence 
 */
const sequence = (arr) =>{

    const newArr = [...arr]
    const rdn = Math.floor(Math.random() * 4);
    
    newArr.push(rdn)
    return newArr
}
/**
 * * Light up the button 
 * @param {number} number of the button that should be activated
 */
const activeColor = number =>{
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
 * * Play the audio
 * @param {number} audio is a number with the position of the audio in the array
 */
const playAudio = audio =>{ 
    return new Audio(`audio/${game.audio[audio]}`).play()
}

/**
 * * Check the Simon sequence with the user and return true if both are equal and false if are different
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
 * * Fill the array of game.sequence, with 1 number per level. Level 1 = [n], Level 2 = [n,n] ... 
 */
const startRound = () =>{
    const infoLevel = document.getElementById('info-level')    
    const time = game.difficulty.time;  
    let sequenceLength
    let count = 0;

    game.sequence = sequence(game.sequence);    
    sequenceLength = game.sequence.length;
    infoLevel.textContent = `Level ${game.level}`;
    game.user.userTurn = false; //Block the user turn

    (function loop(sequenceLength) { 

        setTimeout(()=> {   
            activeColor(game.sequence[count]);
            playAudio(game.sequence[count])
            count++;

            (--sequenceLength)
                ? loop(sequenceLength)
                : game.user.userTurn = true 

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
 * * Reset the user sequence when the round ends
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
 * * Update the score when each round ends
 */
const updateScore = () =>{
    game.user.score += game.scoreBase * game.difficulty.multiplier
    infoScore.textContent = game.user.score.toString().padStart(6, '0')
}
/**
 * * Save in the local storage the ranking of the user, save(id, username, level, score and date) for each round
 * @param {object} game The object where the game saves all parameters 
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
 * * Obtains the local storage data, sorts it by level and scores, and displays it
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

        const div = document.createElement('div')
        div.setAttribute('class', 'info__button-container')

        const button = document.createElement('button')
        button.textContent = 'See More'
        button.setAttribute('id', 'ranking-details')
        button.setAttribute('class', 'info__button')
        button.setAttribute('onclick','showModal()')

        div.appendChild(button)
        fragment.appendChild(div)        
        ranking.appendChild(fragment)
    }
}
/**
 * * Shows the modal and creates the content
 */
const showModal = () =>{    
    const allLocalStorage = JSON.parse(localStorage.getItem('simonRanking')).sort((a, b) => b.level - a.level || b.score - a.score);
    const modal = document.getElementById('modal')    
    const modalRanking = document.getElementById('modal-ranking')
    const fragment = document.createDocumentFragment()
    let rankingItems = 50
    
    modal.classList.add('modal--show')
    modalRanking.innerHTML = ''

    const gridColumnsNames = ['Pos', 'Name', 'Lvl', 'Score', 'Date']

    gridColumnsNames.forEach(e =>{
        const p = document.createElement('p')
        p.textContent = e 
        p.setAttribute('class', 'modal__title')
        fragment.appendChild(p) 
    })

    if(allLocalStorage.length < 50){           
        rankingItems = allLocalStorage.length
    }

    for(let i = 0; i < rankingItems; i++){

        const col1 = document.createElement('p')
        const col2 = document.createElement('p')    
        const col3 = document.createElement('p')    
        const col4 = document.createElement('p')          
        const col5 = document.createElement('p') 

        col1.textContent = `${i+1}º`
        col2.textContent = allLocalStorage[i].username
        col3.textContent = allLocalStorage[i].level
        col4.textContent = allLocalStorage[i].score
        col5.textContent = allLocalStorage[i].date

        fragment.appendChild(col1)
        fragment.appendChild(col2)
        fragment.appendChild(col3)
        fragment.appendChild(col4)
        fragment.appendChild(col5)
    }
    
    modalRanking.appendChild(fragment)
}

/**
 * * displays a message when the user starts a new round or loses the game
 * @param {string} text that will be displayed 
 */
const showMessage = text =>{
   
    const message = document.getElementById('message')    
    let messageType = ""

    message.textContent = text;   

    (text === "Next Round!!")
        ? messageType = "message--round"
        : messageType = "message--end"
    
    message.classList.add(messageType)

    setTimeout(()=>{
        message.classList.remove(messageType)
    }, 1000)
}