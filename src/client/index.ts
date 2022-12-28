import { router } from "./router"
// import pages
import "./pages/1-welcome/welcome"
import "./pages/2-new-room/new-room"
import "./pages/3-existent-room/existent-room"
import "./pages/3.1-existent-room-error/existent-room-error"
import "./pages/4-codigo/codigo"
import "./pages/5-start/start"
import "./pages/6-game/game"
import "./pages/7-result/result"

// import component
import { initComponents } from "./components/components-importer"

(()=>{
    router
    initComponents()

    const fondo = require("url:./images/fondo.png")
    // const div   = document.querySelector(".root") as HTMLElement
    const body  = document.querySelector("body") as HTMLElement
    const auxDivEl = document.createElement("div")


    auxDivEl.classList.add("imagen-fondo__container")
    auxDivEl.innerHTML= `<img class="imagen-fondo__image" src="${fondo}" alt="">`
    body.appendChild(auxDivEl)
})()