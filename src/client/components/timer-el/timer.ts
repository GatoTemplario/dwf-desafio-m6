import { state } from "../../state";

export function initTimer(){
    class Timer extends HTMLElement{
        shadow: ShadowRoot;
        constructor(){
            super()
            this.shadow = this.attachShadow({mode: "open"})
        }
        connectedCallback(){
            this.render()
            this.initCountdown()
        }
        render(){
            // console.log("this render");
            
            const div = document.createElement("div")
            const timer = document.createElement("p")

            div.appendChild(timer)
            this.shadow.appendChild(div)
        }
        initCountdown(){
            const timer = this.shadow.querySelector("p") as HTMLElement
            let counter = 3
            timer.innerHTML = `Tiempo: ${counter}`

            const intervalId = setInterval(()=>{
                counter = counter - 1;
                timer.innerHTML = `Tiempo: ${counter}`
                if (counter < 1){
                    // ESTAS LINEAS NO VAN AQUI
                    // const computerPlay = state.getRandomPlay()
                    // console.log(computerPlay);
                    // 
                    clearInterval(intervalId)
                }
            },1000)
        }
    }
    customElements.define("timer-el",Timer)
}