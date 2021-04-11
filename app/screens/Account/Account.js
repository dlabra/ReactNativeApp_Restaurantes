import React, { useState, useEffect } from "react"
import * as firebase from "firebase"

//importamos las otras 2 vistas
import UserGuest from "./UserGuest"
import UserLogged from "./UserLogged"

//importamos el loading
import Loading from "../../components/Loading"

export default function Account(){

    const [login, setLogin] = useState(null); //lo inicializamos como null porque no sabemos si el user esta logeado o no, login = valor del estado setLogin = funcion encargada de cambiar el estado

    //ejecutamos un useEffect
    //es una funcion que contiene una funcion simple tipo flecha
    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {  //esta funcion retorna null sino esta logeado y un objeto con la info cuando si lo esta
            !user ? setLogin(false) : setLogin(true)   //verificamos si user es false (no esta logeado) o si es true (si esta logeado)
        })
    }, []) //lo que esta entre [] es la variable que si se modifica se vuelve a ejecutar el useEffect, si no ponemos nada se ejecuta cuando el componente se monte y ahi termina su funcion

    if(login === null) return <Loading isVisible = {true} text = "Cargando"/> //<Text>Cargando....</Text>  //Si login es null, osea en la primera renderizacion mostrara cargando

    return login ? <UserLogged /> : <UserGuest />; //si login es true, muestra la ventana del usuario logeado si no la de usuario invitado
}