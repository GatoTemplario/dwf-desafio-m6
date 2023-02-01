import {Router} from "@vaadin/router"

const router = new Router(document.querySelector(".root"))

router.setRoutes([
    {path: '/'             , component: 'welcome-page'},
    {path: '/new-room'            , component: 'newroom-page'},
    {path: '/existent-room'       , component: 'existentroom-page'},
    {path: '/existent-room-error' , component: 'existentroom-error-page'},
    {path: '/codigo'              , component: 'codigo-page'},
    {path: '/start'               , component: 'start-page'},
    {path: "/gameroom"            , component: "gameroom-page"},
    {path: "/result"              , component: "result-page"},
])

// SI FUNCIONA, HABRA QUE AGREGAR LUEGO PARA PREGUNTAR CUANDO ESTE DEPLOYADO ("HEROKUAPP.DESAFIO-MOD-8/")
if(location.pathname == "/"){
    Router.go("/")
}

export { router }