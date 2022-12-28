import { Router } from "@vaadin/router"
import { state } from "../../state";

export class ExistentRoomPage extends HTMLElement{
  render(){
    this.innerHTML = `
    <title-el class=""></title-el>
    <div class="existent-Room__container-button">
          <form action="" class="existent-Room__form">
            <div class="existent-Room__campo codigo">
                <label name="codigo" for="" class="existent-Room__label">Ingresa un código</label>
                <input type="text" name="codigo" class="existent-Room__input" placeholder="codigo">
            </div>
            <div class="existent-Room__campo nombre">
                <label name="nombre" for="" class="existent-Room__label">Ingresa tu nombre</label>
                <input type="text" name="nombre" class="existent-Room__input" placeholder="Tu nombre">
            </div>
            <button-el name="nombre-random" class="existent-Room__button">Ingresar a la sala</button-el>
            </form>
            </div>
            <div class="existent-Room__container-options">
              <ppt-el class="existent-Room__option" checked=true variant="Tijera"></ppt-el>
              <ppt-el class="existent-Room__option" checked=true variant="Papel"></ppt-el>
              <ppt-el class="existent-Room__option" checked=true variant="Piedra"></ppt-el>
            </div>
            `;
          }
  connectedCallback(){
    const style = document.createElement("style")

    style.innerText = `
            .existent-Room__container{
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
    this.classList.add("existent-Room__container")
    this.appendChild(style)
    this.render()

    const form = this.querySelector(".existent-Room__form") as HTMLFormElement
    const button = this.querySelector(".existent-Room__button")

    button.addEventListener("click", (e)=>{
      e.preventDefault()
      form.dispatchEvent(new Event ("submit"))
    })
    form.addEventListener("submit", e => {
      e.preventDefault()

      const target = e.target as any
      const nombreUser = target["nombre"].value
      const shortId    = target["codigo"].value

      state.auth(nombreUser, shortId)
      .then( res => {
        if(res == null){
          Router.go("/existent-room-error")
        }else{
          state.setGame("")
          .then(()=>{
            Router.go("/start")
          })
        }
      })
    })
    }
}

customElements.define("existentroom-page",ExistentRoomPage)