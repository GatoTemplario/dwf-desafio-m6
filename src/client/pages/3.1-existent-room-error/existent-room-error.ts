import { Router } from "@vaadin/router"

export class ExistentRoomPage extends HTMLElement{
  render(){
    this.innerHTML = `
    <title-el class=""></title-el>
    <div class="existent-Room__container-button">
          <form action="" class="existent-Room__form">
            <div class="existent-Room__campo nombre">
                <label for="" class="existent-Room__label">Ups, esta sala está completa y tu nombre no coincide con nadie en la sala.</label>
            </div>
            <button-el class="existent-Room__button volver">Volver</button-el>
            <button-el class="existent-Room__button inicio">Ir al inicio</button-el>
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

        const newButton = this.querySelector(".inicio")
        newButton?.addEventListener("click",()=>{ Router.go("/welcome") })
        const existentButton = this.querySelector(".volver")
        existentButton?.addEventListener("click",()=>{ Router.go("/existent-room") })


    // ACA VA LOGICA DE MIERDA PARA VER SI TA BIEN O NO!

    
    // button?.addEventListener("click", () => {Router.go("/codigo")});
  }
  }

customElements.define("existentroom-error-page",ExistentRoomPage)