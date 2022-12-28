import { Router } from "@vaadin/router"
import { state } from "../../state";

export class CodigoPage extends HTMLElement{
  render(){
    const currentState = state.getState()

    this.innerHTML = `
    <header-el></header-el>
    <div class="codigo__container-label">
            <label for="" class="codigo__label">Compartí el código</label>
            <label for="" class="codigo__label-roomId">${currentState.info.roomId}</label>
            <label for="" class="codigo__label">con tu contrincante</label>
    </div>
    <div class="codigo__container-options">
        <ppt-el class="codigo__option" checked=true variant="Tijera"></ppt-el>
        <ppt-el class="codigo__option" checked=true variant="Papel"></ppt-el>
        <ppt-el class="codigo__option" checked=true variant="Piedra"></ppt-el>
    </div>
    `;
  }
  connectedCallback(){
    const style = document.createElement("style")
        style.innerText = `
            .codigo__container{
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
        this.classList.add("codigo__container")
        this.appendChild(style)
    this.render()
            
    setTimeout(() => {Router.go("/start")}, 2500);
  }
  }

customElements.define("codigo-page",CodigoPage)