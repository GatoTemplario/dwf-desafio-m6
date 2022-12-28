import { Router } from "@vaadin/router";
import { state } from "../../state";

export class StartPage extends HTMLElement {
  render(){
    const currenstate1 = state.getState()

    this.innerHTML = `
      <header-el class="start__header"></header-el>
      <div class="start__main-text">
        <p class="start__text">Presioná jugar y elegí: piedra, papel o tijera antes de que pasen los 3 segundos.</p>
        <div class="start__container-button">
          <button-el class="start__button">¡Jugar!</button-el>
        </div>
      </div>
      <div class="start__container-waiting">
        <p class="start__text-waiting">Esperando a que ${currenstate1.info.imGuest? currenstate1.info.owner : currenstate1.info.guest} presione ¡Jugar!</p>
      </div>
      <div class="start__container-options">
        <ppt-el class="start__option" checked=true variant="Tijera"></ppt-el>
        <ppt-el class="start__option" checked=true variant="Papel"></ppt-el>
        <ppt-el class="start__option" checked=true variant="Piedra"></ppt-el>
      </div>
      `;
    }
    connectedCallback(){
      const style = document.createElement("style")
      
      this.render()
      style.innerText = `
          .start__container{
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
      this.classList.add("start__container")

      const currenstate = state.getState()
      const button = this.querySelector(".start__button");
      
      state.isReady( currenstate.info.imGuest? "guest" : "owner", false)
      
      .then(()=>{
        button?.addEventListener("click", event => {
          const mainTextContainer = document.querySelector(".start__main-text") as HTMLElement
          const waitingContainer  = document.querySelector(".start__container-waiting") as HTMLElement
          
          mainTextContainer.style.display = "none"
          waitingContainer.style.display = "flex"
          
          function auxFunction(){
            return currenstate.info.imGuest == true ? state.isReady("guest", true) : state.isReady("owner", true)
            // return state.setGame("")
          }
          // function auxFunction(){
          //   state.setGame("")
          //   return currenstate.info.imGuest == true ? state.isReady("guest", true) : state.isReady("owner", true)
          // }
          
          auxFunction()
          .then( () => {
            state.suscribe( () => {
              const newCurrentState = state.getState()

              newCurrentState.info.readyToPlay ? Router.go("/gameroom") : null
            })
          })
          
        });
      })
  }
}

customElements.define("start-page",StartPage)