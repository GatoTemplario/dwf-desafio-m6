export function initTitle(){
    class Title extends HTMLElement{
        shadow : ShadowRoot
        constructor(){
            super()
            this.shadow = this.attachShadow({mode:"open"})
        }
        connectedCallback(){
            this.render()
        }
        render(){
            const style = document.createElement("style")

            this.shadow.innerHTML = `
                <div class="title-container">
                    <h1 class="title">Piedra</h1>
                    <h1 class="title">Papel
                    <span class="span">ó </span>
                    </h1>
                    <h1 class="title">Tijera</h1>
                </div>
            `
            style.innerText = `
            .container{
                display: flex;
                flex-direction: column;
                text-align: center;
                align-items: center;
                justify-content: center;
                height: 100vh;
                width: 100%;
                font-family: 'Odibee Sans', cursive;
            }
            .title-container{
                margin: 25px;
            }
            @media(min-width: 769px){
                .title-container{
                    margin: 15px;
                }
            }
            .title{
                font-size: 80px;
                font-weight: 700;
                font-size: 85px;
                color: #009048;
                width: fit-content;
                margin: 0px;
                text-align: left;
            }
            @media(min-width: 769px){
                .title{
                    font-size: 105px;
                }
            }
            .span{
                color: #91CCAF;
            }
            `
            this.shadow.appendChild(style)
        }
    }
    customElements.define("title-el",Title)
}