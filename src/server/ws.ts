// import process from "process";
import { state } from "../client/state";



function initWs(API_BASE_URL){
    console.log("api base: ", API_BASE_URL);
    const nodeEnv = process.env.NODE_ENV.trim()
    console.log("env: ", nodeEnv);
    
    const currentState = state.getState()
    // console.log("currentstate1", currentState.rtdbRoomId);
    console.log("init ws");
    
    // Create WebSocket connection.
    const protocol = window.location.protocol.includes('https') ? 'wss' : 'ws'
    // SI ESTO NO FUNCIONA, PROBAR CON ${protocol}://${location.host}:${8080}
    function locationHost(nodeEnv){
        if(nodeEnv == "production"){
            console.log("boolean true");
            
            return location.hostname + ":8080"  
        }else{
            console.log("boolean false");
            
            return location.host
        }
        
    }
    const socket = new WebSocket(`${protocol}://${locationHost(nodeEnv)}`)
    console.log("socket: ", socket);
    
    fetch( API_BASE_URL + '/api/rps/' + currentState.info.rtdbRoomId,{
        method: "POST",
        headers: {"content-type": 'application/json'},
    })

    // Connection opened
    socket.addEventListener('open', (event) => {
        console.log("socket open");
        
        socket.send(currentState.info.rtdbRoomId);
    });

    // Listen for messages
    socket.addEventListener('message', (event) => {
        const usefulJson = JSON.parse(event.data)
        console.log("usefulJson",usefulJson);
        function readyToPlay(){
            if(usefulJson.ready.guestReady == true && usefulJson.ready.ownerReady == true){
                currentState.info.readyToPlay = true
                state.setState(currentState)
            }
        }
        function updateCurrentGame(){
            const guestPlay    = usefulJson.currentGame.guestPlay
            const ownerPlay    = usefulJson.currentGame.ownerPlay
            
            currentState.game.currentGame.guestPlay = guestPlay
            currentState.game.currentGame.ownerPlay = ownerPlay
            state.setState(currentState)
        }
        function updateOutcome(){
            const ownerOutcome = usefulJson.ownerOutcome
            const imGuest      = currentState.info.imGuest
            const history      = usefulJson.history

            const gana   = currentState.game.outcomes[0]
            const empata = currentState.game.outcomes[1]
            const pierde = currentState.game.outcomes[2]

            if (ownerOutcome == gana){
                imGuest? currentState.game.resultado = pierde : currentState.game.resultado = gana
            }else if(ownerOutcome == pierde){
                imGuest? currentState.game.resultado = gana   : currentState.game.resultado = pierde
            }else{
                currentState.game.resultado = empata
            }
            currentState.game.history = history
            state.setState(currentState)
        }
        function updateHistory(){
            // const history = usefulJson.history
            
            currentState.game.history = usefulJson.history
            state.setState(currentState)
        }
            
        if(usefulJson.ready){
            readyToPlay()
        }
        else if( usefulJson.status ){
            updateHistory()
        }
        else{
            updateCurrentGame()
            updateOutcome()
        }
    });

    socket.onclose = function(event) {
        console.log('event :', event);
        console.log('Chau amigo! :', event.reason);
    }
    socket.onerror = function (error){
        console.log(error);
        
    }
}

export { initWs }