export function initButton(){
    class Boton extends HTMLElement{
        shadow: ShadowRoot
        constructor(){
            super()
            this.shadow = this.attachShadow({ mode: "open"})
        }
        connectedCallback(){
            this.render()
        }
        render(){
            const divEl    = document.createElement("div")
            divEl.classList.add("container")
            const style    = document.createElement("style")
            
            const textContent = this.textContent
            
            divEl.innerHTML = `
                <button class="button">${textContent}</button>
            `
            style.innerHTML= `
                .container{
                    height: 100%;
                }
                .button{
                    width: 322px;
                    height: 100%;
                    background-color: #006CFC;
                    border: solid;
                    border-color: #001997;
                    border-radius: 10px;
                    font-family: inherit;
                    font-size: inherit;
                    color: white;
                }
                @media(min-width: 769px){
                    .button{
                        width: 422px;
                    }
                }
            `

            divEl.appendChild(style)
            
            this.shadow.appendChild(divEl)
        }
    }
    customElements.define("button-el",Boton)
}