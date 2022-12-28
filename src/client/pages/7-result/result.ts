import { Router } from "@vaadin/router";
import { state } from "../../state";
const imgWinningStar = require("url:../../images/winning-star.png");
const imgLosingStar  = require("url:../../images/losing-star.png");

export class ResultPage extends HTMLElement{
    
    render(){
        const currentState = state.getState()
        const boolean = currentState.info.imGuest
        
        function renderStar(){
            if(currentState.game.resultado == currentState.game.outcomes[0]){
                return imgWinningStar
            }else if(currentState.game.resultado == currentState.game.outcomes[2]){
                return imgLosingStar
            }else{
                return ""
            }
        }
        function renderPPT(side: "upside" | "downside"){
            const boolean = currentState.info.imGuest
            if( side == "upside"){
                return boolean? currentState.game.currentGame.guestPlay : currentState.game.currentGame.ownerPlay
            }else{
                return boolean? currentState.game.currentGame.ownerPlay : currentState.game.currentGame.guestPlay
            }
        }
        function renderScore (side: "upper" | "low"){
            const nombreGuest = currentState.info.guest
            const nombreOwner = currentState.info.owner
            const scoreOwner  = currentState.game.history.owner
            const scoreGuest  = currentState.game.history.guest
            if( side == "upper"){
                return boolean ? "Vos: " + scoreGuest :  "Vos: " + scoreOwner
            }else{
                return boolean ? nombreOwner + ": " + scoreOwner : nombreGuest +  ": " + scoreGuest
            }
        }
        this.innerHTML = ` 
        <div class="result__options-container">
            <ppt-el class="ppt result__option--inverted" id="1" checked=true variant="${renderPPT("downside")}"></ppt-el>
            <ppt-el class="ppt result__option--normal" id="2" checked=true variant="${renderPPT("upside")}"></ppt-el>
        </div>

        <div class="result__score-container">
            <div class="result__score-title-container">
                <img src="${renderStar()}" alt="" class="result__score-star">
                <h1 class="result__score-title">${currentState.game.resultado}</h1>
            </div>
            <div class="result__score-text-container">
                <h2 class="result__score-subtitle">Score</h2>
                <h3 class="result__text">${renderScore("upper")}</h3>
                <h3 class="result__text">${renderScore("low")}</h3>
            </div>
            <button-el class="result__button--jugar">Volver a jugar</button-el>
            <button-el class="result__button--reiniciar">Reiniciar score</button-el>
        </div>
    `
    }
    connectedCallback(){
        const currentState = state.getState()

        this.render()

        const buttonAgain = this.querySelector(".result__button--jugar");
        const buttonRestart = this.querySelector(".result__button--reiniciar");
        
        buttonAgain?.addEventListener("click", () => {
            currentState.game.resultado = "";
            // state.setState(currentState)
            
            function auxFunction(){
                if(currentState.info.imGuest == true){
                    state.setGame("")
                    return state.isReady("guest", false)
                }else{
                    state.setGame("")
                    return state.isReady("owner", false)
                }
            }
            auxFunction().then( () => { Router.go("/start")}) 
        })

        buttonRestart?.addEventListener("click", () => {
            state.restartHistory()
                .then(()=>{
                Router.go("/start")
            })
        })
        
        setTimeout( () => {
            const optionsContainer = this.querySelector(".result__options-container") as HTMLElement
            const scoreContainer   = this.querySelector(".result__score-container") as HTMLElement
            
            if(currentState.game.resultado == currentState.game.outcomes[0]){
                scoreContainer.style.backgroundColor = "rgba(0, 255, 0, 0.4)"
            }else if (currentState.game.resultado == currentState.game.outcomes[2]){
                scoreContainer.style.backgroundColor = "rgba(255, 0, 0, 0.4)"
            }
            optionsContainer.style.display = "none"
            scoreContainer.style.display = "flex"
        },2000)
    }
}

customElements.define("result-page",ResultPage)