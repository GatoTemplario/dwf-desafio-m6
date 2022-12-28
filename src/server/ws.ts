import { state } from "../client/state";


function initWs(){
    const currentState = state.getState()
    // console.log("currentstate1", currentState.rtdbRoomId);
    // console.log("init ws");
    
    // Create WebSocket connection.
    const socket = new WebSocket('ws://localhost:8080');

    // Connection opened
    socket.addEventListener('open', (event) => {
        console.log("socket open");
        
        socket.send(currentState.info.rtdbRoomId);
    });

    // Listen for messages
    socket.addEventListener('message', (event) => {
        // console.log("current state", currentState);
        
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
            const history = usefulJson.history

            if (ownerOutcome == currentState.game.outcomes[0] && imGuest){
                currentState.game.resultado = currentState.game.outcomes[2]
            }else if(ownerOutcome == currentState.game.outcomes[1] && imGuest){
                currentState.game.resultado = currentState.game.outcomes[1]
            }else{
                currentState.game.resultado = currentState.game.outcomes[0]
            }
            currentState.game.history = history
            state.setState(currentState)
        }
        function updateHistory(){
            const history = usefulJson.history
            
            currentState.game.history = history
            state.setState(currentState)
        }
            
        if(usefulJson.ready){
            readyToPlay()
        }
        // else if( usefulJson.status ){
        //     updateHistory()
        // }
        else{
            updateCurrentGame()
            updateOutcome()
        }
    });

    socket.onclose = function(event) {
        console.log('Chau amigo! ', event.reason);
    }
}

export { initWs }