import { initPPT } from "./PiedraPapelTijera/ppt-el"
import { initTimer}  from "./timer-el/timer"
import { initCircle } from "./timer-el/circle"
import { initButton } from "./button-el/button-el"
import { initTitle } from "./title-el/title"
import { initHeader } from "./header/header"

export function initComponents(){
    initPPT()
    initTimer()
    initCircle()
    initButton()
    initTitle()
    initHeader()
}