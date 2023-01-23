// "module": "NodeNext" resuelve esto de que no reconozca express
// FALTA AGREGAR TS A DEPENDENCIES. ESTA DANDO GUERRA CON EL COMANDO NODEMON NO SE QUE ONDA
import express, { response } from "express";
import { rtdb, fs, db} from "./db"
import { push, ref, set, onValue, update, get, remove } from "firebase/database"
import * as nanoid from "nanoid"
import { doc, getDoc, setDoc } from "firebase/firestore";
import cors from "cors"
import { state } from "../client/state";

// usar yarn add cors@2.8.5

const port = process.env.PORT || 3000;
const app  = express()

const gameInfo = fs.collection("gameInfo")
const roomsCollection = fs.collection("rooms")

app.use(express.json());
app.use(cors())
app.use(express.static("dist"))

app.listen(port, () => {
    console.log(`Example app listening ${location.host}`);
})
app.get("/env", (req, res) => {
    res.json({
        enviroment: process.env.NODE_ENV
    })
})

app.post("/initServer", (req, res) => {
    const gameInfoRef = doc(db, "gameInfo", "0")
    setDoc(gameInfoRef,{
        mapa: [
            { nombre: "Piedra", gana: "Tijera" },
            { nombre: "Papel" , gana: "Piedra" },
            { nombre: "Tijera", gana: "Papel"  }
        ],
        outcomes: ["Ganaste", "Empate", "Perdiste"]
    })
    .then(() => {
        res.status(201).json({ "message": "server iniciado!" })
    })
})

app.post("/rooms", (req, res) => {
    const {shortRoomIdAux} = req.body
    const {nombre}         = req.body
    
    if (shortRoomIdAux == ""){
        const roomShortId = 1000 + Math.floor(Math.random() * 999)
        const newDbDocRef = doc(db, "rooms", roomShortId.toString())
        const rtdbRef     = ref( rtdb, "/rooms/" + nanoid.nanoid())
        
        set( rtdbRef, {
            // jugada: [] ,
            owner: nombre,
            ready: {ownerReady: false, guestReady: false},
            history: { owner: 0 , guest: 0},
            currentGame: {guestPlay: "", ownerPlay: ""}
        })
        .then( () => {
            const roomLongId = rtdbRef.key;
            
            setDoc(newDbDocRef, {
                rtdbRoomId: roomLongId,
                owner: nombre
            })
            .then(()=>{
                res.json({
                    rtdbRoomId: rtdbRef.key,
                    roomId: roomShortId.toString()
                })
            })
        })
    }
})

//                                                              FORK DE LO ANTERIOR
app.get("/rooms/:roomId", (req, res) => {
    const {roomId} = req.params;

    roomsCollection.doc(roomId).get().then( snap => {
        const data = snap.data()
        
        if(data == null){
            res.json(null)
        }else{
            res.json({data})
        }
    })
})

app.post("/rooms/:roomId", (req, res) => {
    const {from}   = req.body;
    const {jugada} = req.body;
    const {roomId} = req.params;
    const rtdbRef  = ref( rtdb, "rooms/" + roomId + "/jugada" )

    push( rtdbRef, { from, jugada })
})

app.post("/existentRoom/:roomId", (req, res) => {
    const {nombre} = req.body;
    const {roomId} = req.params;
    const rtdbRef  = ref( rtdb, "rooms/" + roomId )
    
    update( rtdbRef, { guest: nombre})
})

app.post("/usersReady/:roomId", (req, res) => {
    const {whoIsReady} = req.body;
    const {boolean}    = req.body;
    const {roomId}     = req.params;
    const rtdbRef      = ref( rtdb, "rooms/" + roomId + "/ready")
    
    function updateBoolean( boolean ){
        if(whoIsReady == "owner"){
            return update( rtdbRef, { ownerReady: boolean })
        }else{
            return update( rtdbRef, { guestReady: boolean })
        }
    }
    
    updateBoolean( boolean )
    .then( () => { res.status(201).json({ "message": "statusReady actualizado" }) })
})

app.post("/setGame/:rtdbRoomId", async(req, res) => {
    const {play}             = req.body;
    const {from}             = req.body
    const {rtdbRoomId}       = req.params;
    const rtdbCurrentGameRef = ref( rtdb, "/rooms/" + rtdbRoomId + "/currentGame")
    
    // CHEQUEAR QUE LOS REFS SEAN IGUALES!!! POR ALGUNA RAZON EL CURRENT GAME SE ACTIVA DOS VECES

    function aux(){
        if(from == "owner"){
            return update( rtdbCurrentGameRef, {ownerPlay : play})
        }else if (from == "guest"){
            return update( rtdbCurrentGameRef, {guestPlay : play})
        }
    }
    await aux().then(()=>{
        res.status(201).json({"message": "todo ok"})
    })
})

app.post("/cleanHistory/:rtdbRoomId", async (req, res)=>{
    const {rtdbRoomId}   = req.params
    const boolean        = req.body
    const rtdbHistoryRef = ref( rtdb, "/rooms/" + rtdbRoomId + "/history")
    const auxiliarRef    = ref( rtdb, "/rooms/" + rtdbRoomId + "/currentGame")
    
    await update(rtdbHistoryRef, { owner: 0 , guest: 0})
    // await update(auxiliarRef, boolean? { guestPlay: "" } : { ownerPlay: "" } )
    await update(auxiliarRef, { guestPlay: "" ,ownerPlay: "" } )
    res.status(201).json({"message": "borrado compadri"})
})

app.get("*", (req, res) => {
    res.sendFile(__dirname, "../../dist/index.html");
  });


const http   = require('http');
const ws     = require('ws');
const wsPort = 8080

const server = http.createServer(app).listen(wsPort)
const wss    = new ws.Server({server});

app.post("/api/rps/:rtdbRoomId", (req, res) => {
    const {rtdbRoomId}  = req.params;
    handleRPS(wss, rtdbRoomId);
});

function handleRPS(wss, rtdbRoomId) {
    // Send message over web socket connection
    console.log("activo handleRPS");
    wss.on("connection", (ws) => {
        // Handle web socket connection
        console.log("WS connected");
        ws.on('message',function (message){
        });

        const readyRef           = ref( rtdb, "/rooms/" + rtdbRoomId + "/ready")
        const rtdbCurrentGameRef = ref( rtdb, "/rooms/" + rtdbRoomId + "/currentGame")
        const rtdbHistoryRef     = ref( rtdb, "/rooms/" + rtdbRoomId + "/history")

        onValue(readyRef, snapshot => {
            console.log("ready: ", snapshot.val());

            wss.clients.forEach(function each(client) {
                // console.log("client.readyState", client.readyState);
                client.send( JSON.stringify({ ready: snapshot }));
            });
        })
        onValue(rtdbCurrentGameRef, snapshot => {
            const currentGame  = snapshot.val()
            const currentState = state.getState()
            // console.log("currentgame rtdb from: ", currentState.info.imGuest? "guest": "owner", currentGame);
            
            if(currentGame.guestPlay !== "" && currentGame.ownerPlay !== ""){
                currentGameResponse(currentGame, rtdbHistoryRef)
                .then( res => {
                        wss.clients.forEach(function each(client) {
                            update(rtdbHistoryRef, res.history)
                            client.send(JSON.stringify(res))
                            // console.log("res", res);
                        });
                })
                }
        })
        onValue(rtdbHistoryRef, snapshot => {
            const history = snapshot.val();
            if (history.owner == 0 && history.guest == 0){
                wss.clients.forEach(function each(client) {
                    client.send(JSON.stringify({ status: "restart", history }))
                });
            }
        })
    
    });
}


async function currentGameResponse(currentGame, rtdbHistoryRef) {
    console.log("function currentGameResponse");
    
    // DETERMINA QUIEN GANA Y ACTUALIZA EL CONTADOR
    const gameInfoRef = doc(db, "gameInfo", "0")
    const reglas      = (await getDoc(gameInfoRef)).data()
    const ownerPlay   = reglas.mapa.find( e => {
        return e.nombre == currentGame.ownerPlay
    })
    const rtdbHistoryObject = (await get(rtdbHistoryRef)).val() 
    const responseObj       = { currentGame, ownerOutcome: {} , history : rtdbHistoryObject}

    if(currentGame.guestPlay == ownerPlay?.nombre){
        // Empate
        responseObj.ownerOutcome = reglas.outcomes[1]

        return responseObj
    }else if(currentGame.guestPlay == ownerPlay?.gana){
        // Gana
        responseObj.ownerOutcome = reglas.outcomes[0]
        responseObj.history.owner++
        
        return responseObj
    }else{
        responseObj.ownerOutcome = reglas.outcomes[2]
        responseObj.history.guest++

        return responseObj
    }
}
