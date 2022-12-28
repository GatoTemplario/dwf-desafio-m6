export type Opciones = "Piedra" | "Papel" | "Tijera"
// me dio guerra el require, instale @types/node y dejo de hinchar las 00. Veremos que sucede
const imgPiedra = require("url:../../images/piedra.png");
const imgPapel  = require("url:../../images/papel.png");
const imgTijera = require("url:../../images/tijera.png");

export function initPPT(){
    class PiedraPapelTijera extends HTMLElement{
        shadow: ShadowRoot;
        constructor(){
            super()
            this.shadow = this.attachShadow({mode:"open"})
        }
        connectedCallback(){
            this.render()

            const style = document.createElement("style")
            style.innerHTML = `
                .imagen{
                    height: 100%;
                    width: 100%;
                }
                .image-coloured{
                    filter: grayscale(0%);
                }
                .image-grey{
                    filter: grayscale(100%);
                }
                .container{
                    width: 100%;
                }
            `
            this.shadow.appendChild(style)

            const imagen = this.shadow.querySelector(".image-grey")
            
            imagen?.addEventListener("click", ()=>{
                if (imagen.className = "imagen image-grey"){
                    imagen.className = "imagen image-coloured"
                }else{
                    imagen.className = "imagen image-grey"
                }
            });
        }

        render(){
            const div = document.createElement("div")
            const img = document.createElement("img") as any
            let isChecked = this.getAttribute("checked") || false
            
            div.classList.add("container")

            if(isChecked){
                img.className = "imagen image-coloured"
            }else{
                img.className = "imagen image-grey"
            }

            let opcion = "Piedra" as Opciones
            let variant : Opciones = this.getAttribute("variant") as Opciones || opcion 
            
            if(variant == "Piedra"){
                img.src= imgPiedra
            }else if (variant == "Papel"){
                img.src = imgPapel
            }else{
                img.src = imgTijera
            };

            div.appendChild(img);
            this.shadow.appendChild(div);
        }
    }
    customElements.define("ppt-el",PiedraPapelTijera)
}