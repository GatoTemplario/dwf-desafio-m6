import { Router } from "@vaadin/router"
import { state } from "../../state"

export class WelcommePage extends HTMLElement{
    render(){
        this.innerHTML = `
        <title-el class=""></title-el>
        <div class="welcome__auxiliar-container">
        <div class="welcome__container-button">
            <button-el class="welcome__button newRoom">Nuevo Juego</button-el>
            <button-el class="welcome__button existentRoom">Ingresar a una sala</button-el>
        </div>
        </div>
        <div class="welcome__container-options">
            <ppt-el class="welcome__option" checked=true variant="Tijera"></ppt-el>
            <ppt-el class="welcome__option" checked=true variant="Papel"></ppt-el>
            <ppt-el class="welcome__option" checked=true variant="Piedra"></ppt-el>
        </div>
        `
    }
    connectedCallback(){
        const style = document.createElement("style")
        style.innerText = `
            .welcome__container{
                display: flex;
                flex-direction: column;
                text-align: center;
                align-items: center;
                justify-content: center;
                height: 100vh;
                width: 100%;
                font-family: 'Odibee Sans', cursive;
            }
        `
        this.classList.add("welcome__container")
        this.appendChild(style)
        this.render()

        const newButton = this.querySelector(".newRoom")
        newButton?.addEventListener("click",()=>{ Router.go("/new-room") })
        const existentButton = this.querySelector(".existentRoom")
        existentButton?.addEventListener("click",()=>{ Router.go("/existent-room") })
        
        state.initState()
    }
}

customElements.define("welcome-page",WelcommePage)