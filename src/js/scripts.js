/******************** 
  *** Listeners *** 
 *******************/
btnStartGame.addEventListener('click', ()=>{

    const error = document.getElementById('error')
    infoScore.textContent = game.user.score.toString().padStart(6, '0')    

    if(formName.value.trim().length === 0 || formName.value.trim().length > 10){
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
board.addEventListener('click', (e)=>{    
    
    //Only when it is the user's turn
    if(game.user.userTurn){
       
        if(e.target.getAttribute('data-value')){
            const colorPressed = Number(e.target.getAttribute('data-value'))

            game.user.sequence.push(colorPressed)           
            game.compareSequence = checkSequence(game.sequence, game.user.sequence)
            activeColor(colorPressed)
            playAudio(colorPressed)

            if(game.compareSequence){
                updateScore()              
            }

            //Next Round
            if(game.compareSequence && game.sequence.length === game.user.sequence.length){
               
                saveRanking(game)
                showRanking()
                reset()
                showMessage('Next Round!!')
                game.level++               
                //Delay between rounds
                setTimeout(startRound, 1000)
            }

            //Error and game over :(
            if(!game.compareSequence){                              
                endGame()
                showMessage('Game Over')
            }
        }
    }
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

modalClose.addEventListener('click', () => modal.classList.remove('modal--show'))

showRanking()