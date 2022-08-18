//Hola! mi nombre es Gastón Sosa. Este es el código de mi juego 'Duque' - que está un poquito inspirado en Magic The Gathering.
//La estructura del código se puede resumir en 1- declaración de clases / 2- declaración de variables y constantes (NO HTML)
//3- declaración de constantes HTML (básicamente las voy a estar ingresando y sacando del DOM constantemente)
//4- Construcción de Funciones (que serían 2 categorías: Principales y complementarias.) Dentro de las funciones principales
//van a estar una función Main, que luego llamaré en la ejecución, y varias funciones asincrónicas dentro, las cuales se van a 
//estar chequeando cada 3.5seg (excepto la última) y que van a estar atadas a unas variables booleanas. Luego están las funciones 
//complementarias, las cuáles vendrían a ser funciones comunes, que hacen ciertas cosas las cuales estan explicadas en sus respectivos
//comments. 5- Acá comienza la parte de eventos - Estos eventos los hice dentro de funciones, porque al no tener un HTML fijo, el DOM 
//va a estar cambiando CONSTANTEMENTE, así que a medida que algunos elementos entran al DOM llamo a estas funciones que cargan los eventos
//para dar funcionalidad, principalmente a botones. 6- Ejecución, que es donde llamo a la funcion main()
//La estructura de ejecución sería así: Main()>funciones de etapas 1 a 5 > eventos. O sea, los eventos se cargan a las funciones de etapa,
//a su vez, las funciones de etapa se cargan al main, y estan siendo monitoreadas asincrónicamente. 
//Puede ser que sea un poco desordenado...Pero es la mejor manera que se me ocurrió para organizar el código. 
//También está la falta de estilo con CSS, pero es que tengo trabajo y un niño de 5 años, así que mi tiempo es limitado, perdón!
//Espero se entienda!


/* ************************************************************************************************************************** */
/* ********************************************* DECLARACION CLASES ********************************************************* */
/* ************************************************************************************************************************** */

//Creo una clase para crear cartas, y les doy el método Atacar
class Carta {
    constructor (id, nombre, hp, ataque, rango='basicas',color='lightgrey') {
        this.id=id
        this.nombre=nombre
        this.hp=hp
        this.ataque=ataque
        this.rango=rango
        this.color=color
    }
    atacar (objetivo){
        objetivo.hp-=this.ataque
    }
}

/* ************************************************************************************************************************** */
/* ***********************************DECLARACION DE VARIABLES Y CONSTANTES************************************************** */
/* ************************************************************************************************************************** */
//Este objeto es un dict que me permite hacer el login.
let usuariosRegistrados = {'jorge':'1234'}
let usuarioActual=""

//Esta variable se usa para el login, me permite saber si alguien se logueó correctamente,
//Por default está como false, y será true cuando un usuario registrado se loguee.
let esUsuarioCorrecto=false

//Esta variable es exactamente como la anterior, pero la voy a usar para chequear que
//las dos manos (jugador y rival) esten listas.
let esJuegoListo=false

//Siguiendo la misma lógica, la siguiente variable nos sirve para comenzar la batalla
let comienzaBatalla=false

//Esta variable determinará si comienza el jugador o el rival
let comienzaJugador=true

//Esta variable determina si puede comenzar la batalla.
let battleReady=false

//Acá consulto el DOM por los divs que serán la plantilla donde activamente
//llenare y vaciare de código HTML, para usar sólo una página. 
//No se si es una buena práctica, pero me pareció divertido hacerlo así.
const divLogin = document.getElementById('divLogin')
const divRegistro = document.getElementById('divRegistro')
const divSeleccionDeCartas = document.getElementById('divSeleccionDeCartas')
const divConfirmacionMano = document.getElementById('divConfirmacionMano')
const divBatalla = document.getElementById('divBatalla')

//Consulto el Local Storage, para ver si tiene ya algún usuario creado, si es así, lo ingreso en el objeto usuariosRegistrados.
if(localStorage.getItem('storageUsuarios')) {
    usuariosRegistrados = JSON.parse(localStorage.getItem('storageUsuarios'))
} else {
    localStorage.setItem('storageUsuarios', JSON.stringify(usuariosRegistrados))
}


// Creo 10 cartas distintas 2 por cada rango de rareza - esto va a hacer que luego se repartan equitativamente
const carta1= new Carta (1,"Granjero agresivo",3,1)
const carta2= new Carta (2,"Carnicero psicópata",2,2)
const carta3= new Carta (3,"Milicia sucia",4,2,"normales",'#2ecc71')
const carta4= new Carta (4,"Mercenario",3,3,"normales",'#2ecc71')
const carta5= new Carta (5,"Caballero Pesado",7,3,"raras",'#2e86c1')
const carta6= new Carta (6,"Asesino",4,6,"raras",'#2e86c1')
const carta7= new Carta (7,"Lancero",8,4,"epicas",'#7d3c98')
const carta8= new Carta (8,"Maestro de la espada",6,6,"epicas",'#7d3c98')
const carta9= new Carta (9,"Hechicero",8,8,"legendarias",'#e67e22')
const carta10= new Carta (10,"Caballero Real",14,6,"legendarias",'#e67e22')

//Creo un array Mazo con todas las cartas
const MAZO = [carta1,carta2,carta3,carta4,carta5,carta6,carta7,carta8,carta9,carta10]

//Creo unos arrays, separando las cartas por rango
const basicas = MAZO.filter(carta => carta.rango=="basicas")
const normales = MAZO.filter(carta => carta.rango=="normales")
const raras = MAZO.filter(carta => carta.rango=="raras")
const epicas = MAZO.filter(carta => carta.rango=="epicas")
const legendarias = MAZO.filter(carta => carta.rango=="legendarias")
const ordenadas = [basicas,normales,raras,epicas,legendarias]

//Creo 2 arrays para las manos
const manoJugador=[]
const manoRival=[]



/* ************************************************************************************************************************** */
/* ***********************************DECLARACION DE VARIABLES Y CONSTANTES************************************************** */
/* *******************************************QUE SON ELEMENTOS HTML********************************************************* */
/* ************************************************************************************************************************** */

const loginHTML = ` <h1>DUQUE</h1>
                    <h6>Por Gastón Sosa</h6>
                    <form id="loginForm">
                        <h2>Si ya tienes usuario, por favor logueate: </h2>
                        <div class="mb-3">
                            <label for="usuario" class="form-label">Usuario</label>
                            <input type="text" class="form-control" id="usuario" name="usuario">
                            <div id="usuarioHelp" class="form-text">Este es el nombre de tu jugador!</div>
                        </div>
                        <div class="mb-3">
                            <label for="password" class="form-label">Password</label>
                            <input type="password" class="form-control" id="password" name="password">
                        </div>
                        <button type="submit" class="btn btn-primary">Login</button>
                    </form>
                    <br><hr><br>
                    <div id="noExisteUsuario">
                    </div>
                    <div>
                        <h2>Si no tienes usuario, puedes registrarte aquí!</h2>
                        <button id="botonRegistro" class="btn btn-primary btn-lg">REGISTRATE</button>
                    </div>`

const registroHTML=`<form id="formRegistro">
                    <h2 class="h1">Por favor, ingrese sus datos para registrarse</h2>
                    <div class="mb-3">
                        <label for="nuevoUsuario" class="form-label">Nuevo Username: </label>
                        <input type="text" class="form-control" id="idNuevoUsuario" name="nuevoUsuario">
                        <div id="usuarioHelp" class="form-text">Este será su nombre de usuario.</div>
                    </div>
                    <div class="mb-3">
                        <label for="nuevaPassword" class="form-label">Nueva Password: </label>
                        <input type="password" class="form-control" id="idNuevaPassword" name="nuevaPassword">
                    </div>
                        <button type="submit" class="btn btn-primary">Registrame!</button>
                    </form>`

const headerHTML = `
    <header class="row">
        <h1 class="text-center">Javascript Proyecto Final: Juego "DUQUE" - Alumno Gastón Sosa </h1>
        <hr>
        <br>
    
        <!-- Boton modal -->
        <button type="button" class="btn btn-primary btn-lg" data-bs-toggle="modal" data-bs-target="#explicacionModal">
            Explicación
        </button>
        <br><br>
        <hr>
        <br>
        
        <!-- Modal -->
        <div class="modal fade" id="explicacionModal" tabindex="-1" aria-labelledby="explicacionModalLabel" aria-hidden="true">
            <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                <h5 class="modal-title" id="explicacionModalLabel">Qué es Duque?</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                Duque es un juego TCG - Un juego de cartas al estilo Magic The Gathering.
                <br><br>
                ¿Y de qué se trata? <br>
                Hay una tierra enorme, pero hay 2 herederos que se la disputarán. El tema es que sólo hay un puñado 
                de personajes en la tierra, entonces el ejército se dividirá entre los 2 posibles Duques.
                <br><br>
                ¿Y cómo se juega? <br>
                Hay 5 clasificaciones de personajes: Básicos, Normales, Raros, Épicos y Legendarios. <br>
                Por cada clasificación hay 2 opciones, pero sólo podrás elegir una, la otra irá para tu rival, así que elige con cuidado. <br>
                Una vez que hayas armado tu ejército (que consistira en un personaje por clase), comenzará la batalla. <br>
                Se tirará un dado, y quien saque el número más alto atacará primero! <br>
                El primero que se quede sin personajes, será el perdedor. <br>
                Sin embargo, puedes elegir el orden en qué combatirán tus personajes, será el orden en que vayas eligiendo las cartas!<br>
                Pero recuerda que el rival siempre jugará del rango más bajo al rango más alto, ten esto en cuenta para planear tu estrategia!

                </div>
                <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Entendido!</button>
                </div>
            </div>
            </div>
        </div>
    </header>
`

const seleccionDeCartasHTML=`
        <div class="container text-left" id="divCartas">

            <br>
            <h2 class="text-left" id="presentacionJugador">Por favor, elija una carta de cada rango!</h2>
            <br>
            <hr>
        
            <h3 class="h2">Cartas básicas: </h3>
            <div id="divBasicas" class="container row align-self-center">
            </div>
            <hr>
        
            <h3 class="h2">Cartas Normales: </h3>
            <div id="divNormales" class="container row align-self-center">
            </div>
            <hr>
        
            <h3 class="h2">Cartas Raras: </h3>
            <div id="divRaras" class="container row align-self-center">
            </div>
            <hr>
        
            <h3 class="h2">Cartas Épicas: </h3>
            <div id="divEpicas" class="container row align-self-center">
            </div>
            <hr>
        
            <h3 class="h2">Cartas Legendarias: </h3>
            <div id="divLegendarias" class="container row align-self-center">
            </div>

            <br><hr><br>
            
            <button class="btn btn-primary btn-lg" id="botonConfirmarMano"> Ya elegí mis cartas!</button>
            <br>
          </div>

`
const confirmacionManosHTML=`
                            <div id="manos" class="container">
                                <div class="container">
                                    <div class="col">
                                        <br>
                                        <h5 id="labelCartasJugador">Cartas del Jugador: </h5>
                                        <div class="card-group" id="divCartasJugador">

                                        </div>
                                    </div>
                                </div>
                                <hr>
                                <div id="divBatallarCancelar" class="container">
                                    <div class="row">
                                        <div class="col">
                                            <button class="btn btn-primary" id="botonBatallar">Todo OK, listo para la batalla!</button>
                                        </div>
                                        <div class="col">
                                            <button class="btn btn-dark" id="botonCancelarBatalla">Cancelar y volver atrás!</button>
                                        </div>
                                    </div>
                                </div>

                                <div class="container">
                                    <div class="col-12">
                                        <hr><br>
                                        <h5>Cartas del Rival: </h5>
                                        <div class="card-group" id="divCartasRival">

                                        </div>
                                    </div>

                                </div>
                            </div>`

const campoDeBatallaHTML= `
            <div id="batallar" class="container text-center">
                <div class="row justify-content-center">
                    <div class="col-12">
                    <h1 class="display-1">DUQUE</h1>
                    </div>
                </div>

                <div class="row justify-content-center">
                    <div class="col-3" id="divCartasJugador"></div>
                    <div class="col-6 overflow-auto text-warning" id="divTextoBatalla" style="color:black;"></div>
                    <div class="col-3" id="divCartasRival"></div>
                </div>

                <div class="row justify-content-center">
                    <div class="col-3" id="divConteoJugador"></div>
                    <div class="col-6" id="divBotonTurno">
                        <button class="btn btn-primary" type="button" id="botonTurno">SIGUIENTE TURNO</button> 
                    </div>
                    <div class="col-3" id="divConteoRival"></div>
                </div>                


            </div>

`
const divTirarDados = `
    <div class="container">
        <div class="row">
            <div class="col-12 d-grid gap-2" id="tirarDados">
                <br>
                <button class="btn btn-primary" type="button" id="botonDado">Tirar los dados!</button>
                <button class="btn btn-primary" type="button" id="botonComenzar" disabled>A la batalla!</button>
                <br>
            </div>
        </div>
        <div class="row" id="resultadoDados">
            <div class="col-3" id="resultadoDadoJugador"></div>
            <div class="d-grid gap-2 col-6 mx-auto text-center" id="resultado">
            </div>
            <div class="col-3" id="resultadoDadoRival"></div>
        </div>
    </div>



`



/* ************************************************************************************************************************** */
/* ******************************************CONSTRUCCION DE FUNCIONES******************************************************* */
/* ************************************************************************************************************************** */


/* ******************************************  FUNCIONES PRINCIPALES ******************************************************** */
//Funcion principal, la idea que se me ocurrió es usar las funciones Async para chequear ciertas condiciones, que nos harán avanzar
// a través del proyecto. No sé si es lo ideal, pero me pareció una buena manera.
function main () {

    //Al ejecutar main, primero cargo el HTML principal... luego viene todo el resto.
    divLogin.innerHTML=loginHTML

    //Como siempre va a empezar main, esta carga de eventos es la única que no es asincrónica.
    cargarEventosPrimeraEtapa()

    setInterval(() => {
        if (esUsuarioCorrecto) {
            segundaEtapa()
        }
    }, 3500)

    setInterval(() => {
        if (esJuegoListo) {
            terceraEtapa()
        }
    }, 3500)

    setInterval(() => {
        if (comienzaBatalla) {
            cuartaEtapa()
        }
    }, 3500)

    setInterval(() => {
        if (battleReady) {
            etapaFinal()
        }
    }, 500)



}

//Funcion de la segunda etapa. Se activan una vez que se logueo correctamente.
function segundaEtapa (){
    esUsuarioCorrecto=false
    divLogin.innerHTML = ''
    divLogin.innerHTML += headerHTML
    divSeleccionDeCartas.innerHTML = seleccionDeCartasHTML
    cargarSeleccionDeCartas()
    cargarEventosSegundaEtapa()
}

//Funcion de la tercera etapa. Se activa una vez que las 2 manos estan cargadas, y el jugador le da al boton de confirmar Cartas.
function terceraEtapa() {
    esJuegoListo=false
    divLogin.innerHTML=''
    divSeleccionDeCartas.innerHTML=''
    divConfirmacionMano.innerHTML=confirmacionManosHTML
    cargarEventosTerceraEtapa()
}

//Funcion de la cuarta etapa, lo mismo de antes...
function cuartaEtapa(){
    comienzaBatalla=false
    divConfirmacionMano.innerHTML=''
    divBatalla.innerHTML =divTirarDados
    cargarEventosCuartaEtapa()
}

//Funcion para la batalla.
function etapaFinal () {
    cargarEventosEtapaFinal()


}



/* ******************************************  FUNCIONES COMPLEMENTARIAS ******************************************************** */


//creo una funcion dado, para ver quién ataca primero
const dado = () => {return Math.round(Math.random()*6)}

//Funcion para validar el usuario
function registrarUsuario (nuevoUsuario,nuevaPass){
    usuariosRegistrados[String(nuevoUsuario).toLowerCase()]=String(nuevaPass).toLowerCase()
}

//en esta parte chequeamos el user con la funcion y luego le damos el elemento del DOM
function loginCheck(user,pass){
    if (usuariosRegistrados[String(user).toLocaleLowerCase()]===String(pass).toLowerCase()){
        document.getElementById('noExisteUsuario').innerHTML=''
        esUsuarioCorrecto=true
        divLogin.innerHTML=`
        <div class="container text-center">
            <h1 style="color:green;">USUARIO CORRECTO!</h1>
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
        `

    }
    else {
        document.getElementById('noExisteUsuario').innerHTML='<h3 style="color: red;">Usuario no existente. Por favor, regístrese.</h3>'
    }
}

function cargarSeleccionDeCartas(){
    //Consulto el DOM para obtener los divs donde voy a ofrecer las cartas
    //Estas constantes las creo dentro de esta función por un tema de scope.
    const divBasicas=document.getElementById('divBasicas')
    const divNormales=document.getElementById('divNormales')
    const divRaras=document.getElementById('divRaras')
    const divEpicas=document.getElementById('divEpicas')
    const divLegendarias=document.getElementById('divLegendarias')

    //Creo un array con los componentes de las cartas en el DOM
    const divsCartas=[divBasicas,divNormales,divRaras,divEpicas,divLegendarias]

    //itero por los rangos de cartas, y luego lleno el html con eso.
    ordenadas.forEach((rangos,index) =>{
        rangos.forEach(carta => { //
            divsCartas[index].innerHTML += //
                (`
                <div class="col md-3">
                    <div class="card" style="width: 15rem; margin:4px; background-color:${carta.color}" id="carta${carta.id}">
                        <img src="images/cards/${carta.id}.png" style="padding:4px;" class="card-img-top" alt="${carta.nombre}-image">
                        <div class="card-body">
                            <h5 class="card-title h4 text-center"><b>${carta.nombre}</b></h5>
                        </div>
                        <ul class="list-group list-group-flush text-center">
                            <li class="list-group-item">🩸​ HP: ${carta.hp}</li>
                            <li class="list-group-item">⚔️​ ATAQUE: ${carta.ataque}</li>
                        </ul>
                        <div class="card-footer text-center">
                            <button class="btn btn-primary" id="botonCarta${carta.id}">Elegir!</button>
                            <button class="btn btn-secondary" id="botonCancelar${carta.id}" disabled>Remover!</button>
                        </div>
                    </div>
                </div>
                `)
            })
        })
}

function armarMazoRival() {
    MAZO.forEach(carta => { 
        if (manoJugador.includes(carta)){                               //Chequeo por cada carta, si es que existe en la mano del jugador
            console.log(`la carta ${carta.nombre} ya esta en la mano del jugador`)
        }
        else {
            manoRival.push(carta)                                       //Si la carta no esta en la mano, puedo agregarla a la mano del rival.
        }
        console.log(manoRival)                                          //Confirmo las cartas del rival en la consola.
    })  
}


//Creo una funcion para armar los divs con las cartas seleccionadas por el jugador y subsecuentemente las cartas del rival, los argumentos son 
// las manos (array con las 5 cartas ya dentro) y el div donde va a ser armado el group card 
// Esto arma los group cards para confirmar antes de comenzar la batalla,
function armarDivManos (mano,div){
    mano.forEach(carta => {
        div.innerHTML +=`
                        <div class="card" id="jugadorCarta${carta.id}" style="background-color: ${carta.color}">
                            <img src="images/cards/${carta.id}.png" class="card-img-top" alt="imagen carta${carta.id}">
                            <div class="card-body">
                                <h5 class="card-title">${carta.nombre}</h5>
                            </div>
                            <ul class="list-group list-group-flush text-center">
                                <li class="list-group-item">🩸​ HP: ${carta.hp}</li>
                                <li class="list-group-item">⚔️​ ATAQUE: ${carta.ataque}</li>
                            </ul>
                            <div class="card-footer text-center">
                                <p>Rango: ${carta.rango}</p>
                            </div>
                        </div>
                        `
    })
}


//Esta función arma el html y luego se usa para actualizar las cartas mientras están batallando.
//Es muy parecida a la anterior, sólo que se hace de a 1 carta a la vez.
function armarCartaEnBatalla(html,mano){
    html.innerHTML=""
    html.innerHTML +=`
                            <div class="card" style="width: 15rem; margin:4px; background-color:${mano.color}" id="cartaBatalla${mano.id}">
                                <img src="images/cards/${mano.id}.png" style="padding:4px;" class="card-img-top" alt="${mano.nombre}-image">
                                <div class="card-body">
                                    <h5 class="card-title h4 text-center"><b>${mano.nombre}</b></h5>
                                </div>
                                <ul class="list-group list-group-flush text-center">
                                    <li class="list-group-item">🩸​ HP: ${mano.hp}</li>
                                    <li class="list-group-item">⚔️​ ATAQUE: ${mano.ataque}</li>
                                </ul>
                                <div class="card-footer text-center">
                                    <p>Rango: ${mano.rango}</p>
                                </div>
                            </div>
                        `
                    }


//Nueva versión de la batalla, acá sólamente creo una funcion para que una carta ataque a otra,
//la idea ahora es darle mayor control, además de la posibilidad de agregarle una linda animación
//los parametros son mano que ataca, mano que recibe, html de la mano que recibe, y el log de batalla
function atacaAlguien (mano1, mano2, html2, log) {

    mano1[0].atacar(mano2[0])
    log.innerHTML+= `<p class="p"> ${mano1[0].nombre} ha atacado a ${mano2[0].nombre} y le ha causado ${mano1[0].ataque} puntos de daño! </p>`
    armarCartaEnBatalla(html2,mano2[0])
    log.scrollTop=log.scrollHeight
    if (mano2[0].hp<1){
        log.innerHTML+=`<p class="p"> ${mano2[0].nombre} ha caído en batalla!</p>`
        log.scrollTop=log.scrollHeight
        animarMuerte(mano2[0])
        mano2.splice(0,1)
        //*** agregar un toast o notificacion para poner 'Aceptar' ***
        if (mano2.length>0) {
            setTimeout(() => {
                log.innerHTML+= `<p class="p">${mano2[0].nombre} ha ingresado al campo de batalla!</p>`
                armarCartaEnBatalla(html2,mano2[0])   
                log.scrollTop=log.scrollHeight
            }, 1000)
             
        } 
    }
}

//Con esta función más simple, lo que hago es condicionar si ataca el jugador o el rival.
//Si la variable comienzaJugador es true, entonces en el siguiente turno atacará el jugador, y esa variable será falsa
//si la variable, en cambio, es false, entonces en el siguiente turno atacará el rival, y luego la variable pasara a ser true
function batallaNuevaVersion (jugador,rival,htmlJugador,htmlRival,log) {

    if (comienzaJugador) {
        atacaAlguien(jugador, rival, htmlRival, log)
        animarAtaqueJugador(jugador[0])
        if(rival[0]!=null){
            animarRecibirAtaqueRival(rival[0])
        } 
        comienzaJugador=false
    }
    else {
        atacaAlguien(rival,jugador,htmlJugador,log)
        animarAtaqueRival(rival[0])
        if (jugador[0]!=null){
            animarRecibirAtaqueJugador(jugador[0])
        }
        comienzaJugador=true
    }
}

//Creo una funcion para la animación de la victoria.
function victoria () {
    //Primero vacío la página, y luego creo los elementos en el DOM
    divBatalla.innerHTML=""
    const resultadoJuego = document.getElementById('resultadoJuego')
    resultadoJuego.innerHTML+= `<h1 id="textoVictoria" class="display-1">HAS TRIUNFADO!</h1>`
    resultadoJuego.innerHTML +=`<button class="btn btn-lg" id="reiniciar">Volver a Empezar.</button>`
    document.getElementById('reiniciar').addEventListener('click',()=>{location.reload()})
    //Luego le doy animación.
    animarVictoria()


}

//Lo mismo,pero para la derrota
function derrota () {
    //Igual que en victoria.
    divBatalla.innerHTML=""
    const resultadoJuego = document.getElementById('resultadoJuego')
    resultadoJuego.innerHTML="<p class='h1'>HAS PERDIDO!</p>"
    resultadoJuego.innerHTML +=`<button class="btn btn-lg" id="reiniciar">Volver a Empezar.</button>`
    document.getElementById('reiniciar').addEventListener('click',()=>{location.reload()})

    animarDerrota()
}

/* ******************************************  FUNCIONES DE LIBRERIAS ******************************************************** */

//Uso la librería Anime.js para darle animación a los ataques. Para esto creo una función, en la cuál me permite darle un 'target' - que es
//el ID de la carta en batalla. 
//una para el rival y otra para el jugador.
function animarAtaqueJugador (target) {
    let animacionAtaque = anime ({
        targets: [`#cartaBatalla${target.id}`],
        translateX: [
            {value: 660, duration: 500},
            {value: 0, duration: 500}
        ],
        //rotate: 180,
        //borderRadius: '8px',
        //duration: 2000,
        loop: false,
        autoplay: false
    });

    animacionAtaque.play()
}

function animarAtaqueRival (target) {
    let animacionAtaque = anime ({
        targets: [`#cartaBatalla${target.id}`],
        translateX: [
            {value: -660, duration: 500},
            {value: 0, duration: 500}
        ],
        //rotate: 180,
        //borderRadius: '8px',
        //duration: 2000,
        loop: false,
        autoplay: false
    });

    animacionAtaque.play()
}

//Esta funcion genera la vibración de cuando se recibe el ataque
//tiene un timeOut para hacer match con la otra carta cuando 
//hacen colision... aunque no hay colisión, sólo esta simulado.
function animarRecibirAtaqueRival (target) {
    let animacionAtacado = anime ({
        targets: [`#cartaBatalla${target.id}`],
        translateX: [
            {value: 16},
            {value: -16},
            {value: 8},
            {value: -8},
            {value: 0}
        ],
        duration: 500,
        easing: 'easeInOutSine',
        loop: false,
        autoplay: false

    })
    setTimeout(()=>{
        animacionAtacado.play()
    },125)
    
}

function animarRecibirAtaqueJugador (target) {
    let animacionAtacado = anime ({
        targets: [`#cartaBatalla${target.id}`],
        translateX: [
            {value: -16},
            {value: 16},
            {value: -8},
            {value: 8},
            {value: 0}
        ],
        duration: 500,
        easing: 'easeInOutSine',
        loop: false,
        autoplay: false

    })
    setTimeout(()=>{
        animacionAtacado.play()
    },100)
    
}

//Esta funcion cambia el bgc de la carta cuando 'muere'
function animarMuerte (target){
    let animacionMuerte = anime ({
        targets: [`#cartaBatalla${target.id}`],
        backgroundColor: '#f20505',
        easing: 'easeInOutQuad',
        //duration: 300,
        loop: false,
        autoplay:false
    })
    animacionMuerte.play()
}

//Esta función le da una animación al texto de victoria
//no le doy argumentos, porque el id esta hardcodeado
function animarVictoria () {
    let animacionVictoria = anime({
        targets: ['#resultadoJuego'],
        opacity: [0,1],
        translateX: [100,0],
        easing: "easeInOutSine",
        duration:800,
        autoplay:true,
        loop:false
    })

    animacionVictoria.play()
}

//Lo mismo, pero para la derrota
function animarDerrota () {
    let animacionDerrota = anime ({
        targets: ['#resultadoJuego'],
        opacity: [0,1],
        scale: [5,1],
        easing: "easeOutCirc",
        duration:1200,
        autoplay:true,
        loop:false

    })
    animacionDerrota.play()
}

/* ************************************************************************************************************************** */
/* ************************************************** EVENTOS *************************************************************** */
/* ************************************************************************************************************************** */
//Acá voy cargando los eventos, ya que como no estan en el DOM, lo tengo que hacer manualmente.

//Eventos que se cargaran con la función de la segunda etapa, una vez que los agregué al DOM, les puedo dar funcionalidad con esta función.
function cargarEventosPrimeraEtapa(){
    
    const loginForm = document.getElementById('loginForm')
    loginForm.addEventListener('submit', (e)=>{
        e.preventDefault()
        let datForm = new FormData(e.target)
        usuarioActual = datForm.get('usuario')
        loginCheck(datForm.get('usuario'),datForm.get('password'))
        loginForm.reset()
    })

    //Este boton te lleva a la pantalla para registrar.
    const botonRegistro = document.getElementById('botonRegistro')
    botonRegistro.addEventListener('click',()=>{
        divLogin.innerHTML=''
        divRegistro.innerHTML=registroHTML
        
        const formRegistro = document.getElementById('formRegistro')
        formRegistro.addEventListener('submit',(e)=>{
            e.preventDefault()
            let datForm = new FormData(e.target)
            registrarUsuario(datForm.get('nuevoUsuario'),datForm.get('nuevaPassword'))
            console.log(usuariosRegistrados)
            localStorage.setItem('storageUsuarios', JSON.stringify(usuariosRegistrados))
            console.log(localStorage)

            location.reload()
        })  

    })
}


//Eventos que se cargaran con la función de la segunda etapa, una vez que los agregué al DOM, les puedo dar funcionalidad con esta función.
function cargarEventosSegundaEtapa(){

    MAZO.forEach(carta=>{

        //Agrego funcionalidad al boton de elegir carta.
        const botonCarta=document.getElementById(`botonCarta${carta.id}`)
        botonCarta.addEventListener('click',()=>{
            if (!manoJugador.some(cartaJugador=>cartaJugador.rango===carta.rango)){ //Si no hay una carta del mismo rango, la agrego a la mano, y luego la modifico un poquito.
                manoJugador.push(carta)
                document.getElementById(`carta${carta.id}`).classList.add('border','border-5','border-danger')
                console.log(`agregada carta ${carta.nombre} a la mano del jugador`) //Cambiar esto por un toastify
                document.getElementById(`botonCarta${carta.id}`).disabled=true
                document.getElementById(`botonCancelar${carta.id}`).disabled=false
            }
            else{
                Toastify({
                    text: "Usted ya tiene un elemento de ese rango!",
                    className: "info",
                    style: {
                      background: "linear-gradient(to right, #FFA69E, #861657)",
                      
                    }
                  }).showToast();
            }
        })

        //Agrego un evento al boton Cancelar de cada carta
        document.getElementById(`botonCancelar${carta.id}`).addEventListener('click',()=>{

            document.getElementById(`botonCancelar${carta.id}`).disabled=true
            if (manoJugador.find(cartaJugador => cartaJugador.id===carta.id)){
                document.getElementById(`carta${carta.id}`).classList.remove('border','border-5','border-danger')
                document.getElementById(`botonCarta${carta.id}`).disabled=false
                manoJugador.splice(manoJugador.indexOf(carta),1)
                console.log(`Removida carta ${carta.nombre} de la mano del jugador`) //Cambiar esto por un toastify
            }
        })

    })

    //Este evento se explica solo jaj
    const botonConfirmarMano = document.getElementById('botonConfirmarMano')
    botonConfirmarMano.addEventListener('click',()=>{
        if (manoJugador.length===5){
            armarMazoRival()
            esJuegoListo=true
            divSeleccionDeCartas.innerHTML =`
            <div class="text-center">
            <h1 style="color:green;">Confirma tus cartas!</h1>
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
            `
        }
        else {
            Toastify({
                text: "El juego aún no está listo! Elija 5 cartas!",
                className: "info",
                style: {
                  background: "linear-gradient(to right, #FFA69E, #861657)",
                }
              }).showToast();
        }

    })
}

//Eventos que se cargaran con la función de la segunda etapa, una vez que los agregué al DOM, les puedo dar funcionalidad con esta función.
function cargarEventosTerceraEtapa() {

    //Consulto los nuevos elementos del DOM
    const divCartasJugador=document.getElementById('divCartasJugador')
    const divCartasRival=document.getElementById('divCartasRival')
    const botonBatallar=document.getElementById('botonBatallar')
    const botonCancelarBatalla = document.getElementById('botonCancelarBatalla')

    //corro la funcion para armar la presentación de las 2 manos
    armarDivManos(manoJugador,divCartasJugador)
    armarDivManos(manoRival,divCartasRival)

    //Le doy funcionalidad al boton cancelar, vuelve todo para la 2da etapa.
    botonCancelarBatalla.addEventListener('click',()=>{
        manoJugador.splice(0,5)
        manoRival.splice(0,5)
        divConfirmacionMano.innerHTML=''
        segundaEtapa()
    })

    //Le doy funcionalidad al boton para jugar.
    botonBatallar.addEventListener('click',()=>{

        //Le doy una pantalla de carga, mientras confirma el booleano.
        divConfirmacionMano.innerHTML =`
        <div class="text-center">
            <h1 style="color:green;">Preparate para la batalla!</h1>
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
        `
        comienzaBatalla=true
        esJuegoListo=false


    })
}

//Esto, deja todo listo para que comience la batalla. Básicamente prepara el DOM para poder usar la funcion de batalla.
//Primero le damos funcionalidad al boton que ejecuta la función del dado. Esto nos permite coordinar los turnos.
//Además cargo todo el HTML al DOM, así en la fase final puedo consultarlo.
function cargarEventosCuartaEtapa(){
    
    const botonDado = document.getElementById('botonDado')
    const botonComenzar = document.getElementById('botonComenzar')
    
    botonDado.addEventListener('click',()=>{
        botonDado.disabled=true
        let dadoJugador=dado()
        let dadoRival = dado()
        document.getElementById('resultadoDadoJugador').innerHTML=`<h3>El Jugador ha sacado un </h3><br><h3 class="h2 text-center">${dadoJugador}</h3>`
        document.getElementById('resultadoDadoRival').innerHTML=`<h3>El Rival ha sacado un </h3><br><h3 class="h2 text-center">${dadoRival}</h3>`
        
        if(dadoJugador>dadoRival){
            document.getElementById('resultado').innerHTML='<h2>HA GANADO EL JUGADOR!</h2>'
            botonComenzar.disabled=false
        }
        else {
            document.getElementById('resultado').innerHTML='<h2>HA GANADO EL RIVAL!</h2>'
            comienzaJugador=false
            botonComenzar.disabled=false
        }
    })

    //Este boton es el que finaliza todos los preparativos. Le damos al div campo de batalla el código HTML, que luego será consultado para poder batallar.
    botonComenzar.addEventListener('click',()=>{
        //Primero le doy la plantilla HTML
        divBatalla.innerHTML=campoDeBatallaHTML
        //Luego consulto el DOM para poder ir modificándolos.
        const divCartasJugador = document.getElementById('divCartasJugador')
        const divCartasRival = document.getElementById('divCartasRival')
        const divTextoBatalla = document.getElementById('divTextoBatalla')
        
        //Luego ejecuto la funcion para poder darles contenido.
        armarCartaEnBatalla(divCartasJugador,manoJugador[0])
        armarCartaEnBatalla(divCartasRival,manoRival[0])
        divTextoBatalla.style="height:450px; background-color:#000;"
        battleReady=true
        comienzaBatalla=false
    })
}

//Esta función carga los últimos eventos. Primero consultamos el dom, y luego le doy funcionalidad al único boton, de los turnos. 
//Con esto estan dadas las condiciones para la batalla. Mientras las 2 manos posean cartas, se dara la batalla. 
//Luego, si alguna de las 2 llega a 0, entonces perderá.
//Acá pense en ponerle asincronía para cuando alguna de las 2 manos llegase a 0, que la pantalla de victoría o derrota
//se activara automaticamente... Pero preferí dejarlo así.
function cargarEventosEtapaFinal () {
    battleReady=false
    const botonTurno = document.getElementById('botonTurno')
    const divCartasJugador = document.getElementById('divCartasJugador')
    const divCartasRival = document.getElementById('divCartasRival')
    const divTextoBatalla = document.getElementById('divTextoBatalla')
    botonTurno.addEventListener('click',()=>{

        if (manoJugador.length>0 && manoRival.length>0) {
            batallaNuevaVersion(manoJugador,manoRival,divCartasJugador,divCartasRival,divTextoBatalla)
        }
        else if (manoJugador.length>0){
            victoria()
        }
        else {
            derrota()
        }
    })
}


/* ************************************************************************************************************************** */
/* ************************************************EJECUCIÓN***************************************************************** */
/* ************************************************************************************************************************** */
main()
