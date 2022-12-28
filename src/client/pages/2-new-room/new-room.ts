import { Router } from "@vaadin/router"
import { state } from "../../state";

export class NewRoomPage extends HTMLElement{
    render(){
        this.innerHTML = `
        <title-el class=""></title-el>

        <div class="new-Room__container-button">
          <form action="" class="new-Room__form">
            <div class="new-Room__campo nombre">
                <label for="" class="new-Room__label">Tu nombre</label>
                <input type="text" name="nombre" class="new-Room__input" placeholder="ingresa tu nombre aqui">
            </div>
            <button-el class="new-Room__button">Comenzar</button-el>
          </form>
        </div>
        <div class="new-Room__container-options">
            <ppt-el class="new-Room__option" checked=true variant="Tijera"></ppt-el>
            <ppt-el class="new-Room__option" checked=true variant="Papel"></ppt-el>
            <ppt-el class="new-Room__option" checked=true variant="Piedra"></ppt-el>
        </div>
        `;
    }
    connectedCallback(){
      this.classList.add("new-Room__container")
      this.render()

      const form = this.querySelector(".new-Room__form") as HTMLFormElement
      const button = this.querySelector(".new-Room__button")

      button.addEventListener("click", (e)=>{
        e.preventDefault()
        form.dispatchEvent(new Event ("submit"))
      })
      form.addEventListener("submit", e => {
        e.preventDefault()
        const target = e.target as any;
        const currentState = state.getState()

        currentState.info.owner = target["nombre"].value
        state.setState(currentState)
        state.getNewRoom()
        state.suscribe( () => {Router.go("/codigo") })
      });
    }
}

customElements.define("newroom-page",NewRoomPage)

