// import { initTimer } from "./timer";

export function initCircle(){
    class Circle extends HTMLElement{
        shadow: ShadowRoot
        constructor(){
            super()
            this.shadow = this.attachShadow({mode: "open"})
        }
        connectedCallback(){
            this.render()
        }
        render(){
            const div = document.createElement("div")
            const style = document.createElement("style")
            const COLOR_CODES = { info: { color: "green" } };
            
            let remainingPathColor = COLOR_CODES.info.color;
            
            div.innerHTML= `
            <div class="base-timer">
                <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <g class="base-timer__circle">
                        <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45" />
                        <path
                        id="base-timer-path-remaining"
                        stroke-dasharray="283"
                        class="base-timer__path-remaining ${remainingPathColor}"
                        d="
                            M 50, 50
                            m -45, 0
                            a 45,45 0 1,0 90,0
                            a 45,45 0 1,0 -90,0
                        "
                        ></path>
                    </g>
                </svg>
                <span class="base-timer__label">
                    <timer-el></timer-el>
                </span>
            </div>
            `
            style.innerHTML = `
            .base-timer {
                position: relative;
                height: 300px;
                width: 300px;
            }
            .base-timer__circle {
                fill: none;
                stroke: none;
            }
            .base-timer__path-elapsed {
                stroke-width: 7px;
                stroke: grey;
            }
            .base-timer__label {
                position: absolute;
                
                /* Size should match the parent container */
                width: 300px;
                height: 300px;
                
                /* Keep the label aligned to the top */
                top: 0;
                
                /* Create a flexible box that centers content vertically and horizontally */
                display: flex;
                align-items: center;
                justify-content: center;
            
                /* Sort of an arbitrary number; adjust to your liking */
                font-size: 48px;
            }
            .base-timer__path-remaining {
                /* Just as thick as the original ring */
                stroke-width: 7px;
            
                /* Rounds the line endings to create a seamless circle */
                stroke-linecap: round;
            
                /* Makes sure the animation starts at the top of the circle */
                transform: rotate(90deg);
                transform-origin: center;
            
                /* One second aligns with the speed of the countdown timer */
                transition: 1s linear all;
            
                /* Allows the ring to change color when the color value updates */
                stroke: currentColor;
            }
            
            .base-timer__svg {
                /* Flips the svg and makes the animation to move left-to-right */
                transform: scaleX(-1);
            }
            `
            this.startTimer()
            div.appendChild(style)
            this.shadow.appendChild(div)
        }
        startTimer(){
            const timeLimit = 3
            var timePassed = 0 ;
            const timerInterval = setInterval(()=>{
                timePassed++
                const timeLeft = timeLimit - timePassed;
                const fraction = timeLeft / timeLimit;
                const k2 = (1/timeLimit)*(1-fraction)
                const rawTimeFraction = fraction - k2
                const circleDashArray = `${(rawTimeFraction * 283).toFixed(0)} 283`;
                const k1 = this.shadow.getElementById("base-timer-path-remaining") as any
                k1.setAttribute("stroke-dasharray", circleDashArray)
                
                if ( timePassed >= 3){
                    clearInterval(timerInterval)
                }
            },1000)
            
        }
    }
    customElements.define("circle-el",Circle)
}