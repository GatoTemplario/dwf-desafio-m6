import { Jugada, state } from "../../state";
import { Router } from "@vaadin/router";

export class GameRoomPage extends HTMLElement{
    render(){
        this.innerHTML = `
        <circle-el class="game__circle"></circle-el>
        <div class="game__container-options">
            <ppt-el class="game__option" variant="Tijera"></ppt-el>
            <ppt-el class="game__option" variant="Papel"></ppt-el>
            <ppt-el class="game__option" variant="Piedra"></ppt-el>
        </div>
    `;
    }
    connectedCallback(){
        this.render()
        this.classList.add("game__container");

        const htmlElements = this.getElementsByTagName("ppt-el")
        const setDeOptions = Array.from(htmlElements)
        var choosenID = 3
        
        for (let i = 0; i < setDeOptions.length; i++) {
            const element = setDeOptions[i];
            
            element.setAttribute("id",i.toString())
            element.addEventListener("click", () => {
                const optionsRestantes = setDeOptions.filter( el => {
                    return el != element
                })
                optionsRestantes.map( el => {
                    const options = el.shadowRoot?.querySelector(".imagen") as any
                    if (options.className != "imagen image-grey"){
                        options.className  = "imagen image-grey"
                    }
                })
                choosenID = i
            })
        }
        async function setGame(){
            const optionChoosen = document.getElementById(choosenID.toString())
            const myPlay = optionChoosen?.getAttribute("variant") as Jugada
            
            await state.setGame(myPlay)
        }
        setTimeout( () => {
            const currenstate = state.getState()

            currenstate.info.readyToPlay = false
            state.setState(currenstate)

            if (choosenID !== 3){
                setGame()
                .then( () => {
                    state.suscribe( () => {
                        const newCurrentState = state.getState();

                        newCurrentState.game.resultado !== ""? Router.go("/result") : null
                    })
                })
            }
            else{
                Router.go("/start")
            }
        }, 3500)
    }
}

customElements.define("gameroom-page", GameRoomPage)