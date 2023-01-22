import { initWs } from "../server/ws"

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:"
const PORT = 3000

export type Jugada = "Piedra" | "Papel" | "Tijera" | ""
export type Game = { oponent: Jugada, user: Jugada }

const state = {
    data : {
        info:{
            owner: "user1",
            guest: "tu oponente",
            readyToPlay: false,
            imGuest: false,
            roomId: "0000",
            rtdbRoomId: ""},
        game:{
            currentGame: {
                guestPlay: <Jugada>"Papel",
                ownerPlay: <Jugada>"",
            },
            resultado: "",
            history: {
                owner: 0,
                guest: 0,
            },
            mapa: [
                { nombre: "Piedra", gana: "Tijera" },
                { nombre: "Papel" , gana: "Piedra" },
                { nombre: "Tijera", gana: "Papel"  }
            ],
            outcomes: ["Ganaste", "Empate", "Perdiste"],}
    },
    listeners: [],
    initState(){
        console.log("initstate");
    },
    getState(){
        return this.data
    },
    setState(newState){
        this.data = newState;
        for (const cb of this.listeners) {
            cb(newState)
        }
        console.log("state cambio!", this.data);
    },
    suscribe( callback: (any)=> any){
        this.listeners.push(callback)
    },
    pushJugada( jugada: Jugada ){
        const currentState = this.getState()
        const nombreDelUser = currentState.info.user
        fetch( API_BASE_URL + PORT + "/rooms/" + currentState.info.rtdbRoomId,{
            method: "POST",
            headers: { "content-type": "application/json"},
            body: JSON.stringify({
                from: nombreDelUser,
                jugada
            })
        })
    },
    getNewRoom(){
        const currentState = state.getState()

        fetch( API_BASE_URL + PORT + '/rooms',{
            method: "POST",
            headers: {"content-type": 'application/json'},
            body: JSON.stringify({shortRoomIdAux: "", nombre: currentState.info.owner})
        })
        .then( res => { return res.json() })
        .then( responseData => {
            currentState.info.roomId = responseData.roomId
            currentState.info.rtdbRoomId = responseData.rtdbRoomId
            this.setState(currentState)
            initWs(API_BASE_URL, PORT)
        })
    },
    async auth(nombre, shortRoomId){
        const primerFetch = await fetch( API_BASE_URL + PORT + '/rooms/' + shortRoomId, {
            method: "GET",
            headers: { "content-type": 'application/json' },
        })
        const response = await primerFetch.json()
        
            if (response !== null && response.data.owner == nombre){
                const currentState = state.getState()
                
                currentState.info.owner      = nombre
                currentState.info.imGuest    = false
                currentState.info.roomId     = shortRoomId
                currentState.info.rtdbRoomId = response.data.rtdbRoomId
                state.setState(currentState)

            }else if(response !== null && response.data.owner !== nombre){
                const currentState = state.getState()
                
                currentState.info.owner      = response.data.owner
                currentState.info.guest      = nombre
                currentState.info.imGuest    = true
                currentState.info.roomId     = shortRoomId
                currentState.info.rtdbRoomId = response.data.rtdbRoomId
                state.setState(currentState)

                fetch( API_BASE_URL + PORT + '/existentRoom/' + currentState.info.rtdbRoomId,{
                    method: "POST",
                    headers: {"content-type": 'application/json'},
                    body: JSON.stringify({nombre})
                })

            }
        // if owner== true => initws!!!!!
        initWs(API_BASE_URL, PORT)
        // console.log("response", response);
        
        return response
    },
    async isReady(whoIsReady: "owner" | "guest", boolean){
        const currentState = state.getState()
        
        fetch( API_BASE_URL + PORT + '/usersReady/' + currentState.info.rtdbRoomId, {
            method: "POST",
            headers: { "content-type": 'application/json' },
            body: JSON.stringify({whoIsReady, boolean})
        })
    },
    async setGame(move: Jugada) {
        const currentState = this.getState();
        const boolean = currentState.info.imGuest
        console.log("uso setGame");
        
        
        boolean? currentState.game.currentGame.guestPlay = move : currentState.game.currentGame.ownerPlay = move

        fetch( API_BASE_URL + PORT + '/setGame/' + currentState.info.rtdbRoomId,{
            method: "POST",
            headers: {"content-type": 'application/json'},
            body: JSON.stringify({
                play: move,
                from: boolean? "guest" : "owner"
            })
        })
    },
    async restartHistory(){
        const currentState = this.getState();
        const boolean = currentState.info.imGuest

        currentState.game.resultado = "";
        state.setState(currentState)

        fetch( API_BASE_URL + PORT + '/cleanHistory/' + currentState.info.rtdbRoomId,{
            method: "POST",
            headers: {"content-type": 'application/json'},
            body: JSON.stringify({
                from: boolean? "guest" : "owner"
            })
        })
    }
}

export {state}