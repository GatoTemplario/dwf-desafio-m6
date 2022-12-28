import {state} from "../../state"

export function initHeader(){
    class Header extends HTMLElement{
        shadow: ShadowRoot
        constructor(){
            super()
            this.shadow = this.attachShadow({mode:"open"})
        }
        connectedCallback(){
            const currentState = state.getState()
            this.render(currentState)
        }
        render(currentState){
            const style = document.createElement("style")

            
            this.shadow.innerHTML = `
            <div class="container">
                <div class="columna">
                        <p class="text user">${currentState.info.owner}: ${currentState.game.history.owner}</p>
                        <p class="text oponent">${currentState.info.guest}: ${currentState.game.history.guest}</p>
                </div>  
                <div class="columna">
                        <p class="text sala">Sala</p>
                        <p class="text roomId">${currentState.info.roomId}</p>
                </div>
            </div>
            `
            style.innerText = `
            .container{
                width: 100%;
                display: flex;
                flex-direction:row;
                justify-content: space-between
                ;
            }
            .columna{
                margin: 13px;
            }
            .text{
                margin: 0px;
                font-size: 25px;
            }
            .user{
                margin-bottom: 15px;
            }
            .sala{
                margin-bottom: 15px;
            }

            `
            this.shadow.appendChild(style)
        }
    }
    customElements.define("header-el", Header)
}