const boardColors = Array.from(document.querySelectorAll('.game__square')).slice(0,4)
const game = { //!Revisar como usar el tema de la difficultad
    difficulty:{
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
    
    boardColors.forEach((e) => {  
        
        if(e.getAttribute('data-value') == number){ //!Aqui es el problema, hay que pasarle de uno en uno lo que tiene que iluminar, seguramente hacerlo en el startgame
            
            e.classList.add('active')            
        }
        setTimeout(()=>{
            e.classList.remove('active')            
        }, 500) //TODO dependerá de la dificultad
           
    }); 
}

const checkSequence = (simonSequence, userSequence) =>{
    const long = game.user.sequence.length -1
    const simon = simonSequence[long]
    const user = userSequence[long]

    return simon === user
}

/**
 * * Fill de array of game.sequence, 1 number per level. 1 level = [n], 2 level = [n,n] ... 
 */
const startRound = () =>{
    const time = 1000; //Todo irá la dificultad seleccionada
    let count = 0;
    game.sequence = sequence(game.sequence);
    
    const sequenceLength = game.sequence.length;

    (function loop(sequenceLength) { 

        setTimeout(()=> {   
            activeColor(game.sequence[count]);
            count++

            if(--sequenceLength) //When rounds is != 0 the condition is true 
                loop(sequenceLength);
            
        }, time)
       
    })(sequenceLength);    

}

//TODO  deshabilitar este boton cuando el juego está en proceso
const startGame = document.getElementById('start-game')
startGame.addEventListener('click', ()=>{
    startRound()
})
//TODO hacer que el juego pase de rondas
//TODO hacer juego terminado
//TODO nombre de usuario
//TODO multiplicador para el score
//TODO ranking
//TODO el nivel de dificultad
//TODO los sonidos

const reset = () =>{
    game.user.sequence = []
}

const board = document.getElementById('game-board')

board.addEventListener('click', (e)=>{    

    if(game.compareSequence){
       
        if(e.target.getAttribute('data-value')){
            game.user.sequence.push(Number(e.target.getAttribute('data-value')))           
            game.compareSequence = checkSequence(game.sequence, game.user.sequence)
            
            //console.log(e.target.getAttribute('data-value')) 

            if(game.compareSequence && game.sequence.length === game.user.sequence.length){
                console.log("siguiente ronda")

                reset()
                game.level++
                startRound()
                
            }

            if(!game.compareSequence){
                console.log('Erroorrrrr')
                
                game.sequence = []
                game.user.sequence = []
                game.compareSequence = true
                game.level = 1
            }
        }
    }
})

