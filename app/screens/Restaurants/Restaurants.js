import React, { useState, useEffect, useCallback } from "react"
import {StyleSheet, View, Text} from "react-native"
import {Icon} from 'react-native-elements'
import { useFocusEffect } from '@react-navigation/native'
import { firebaseApp } from "../../utils/firebase"
// import * as firebase from "firebase"
import firebase from "firebase/app";
import "firebase/firestore"
import ListRestaurants from "../../components/Restaurants/ListRestaurants"

const db = firebase.firestore(firebaseApp);

export default function Restaurants(props){

    //Por destructuring sacamos la navegacion
    const { navigation } = props
    //guardamos el estado del user para ver si esta logeado o no
    const [user, setUser] = useState(null);
    const [restaurants, setRestaurants] = useState([]);
    const [totalRestaurants, setTotalRestaurants] = useState(0);
    const [startRestaurants, setStartRestaurants] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const limitRestaurant = 10;

    //console.log(totalRestaurants)
    useEffect(() => {
        firebase.auth().onAuthStateChanged((userInfo) => {
            //console.log(userInfo);
            setUser(userInfo);
        })
    }, []);

    //con esto haremos que cada vez que el usuario pincha en restaurantes se vuelvan a listar
    useFocusEffect(
        useCallback(() => {
            db.collection("restaurants").get().then((snap) => {
                setTotalRestaurants(snap.size);
            });
    
            //obtenemos la info de todos los restaurantes
            const resultRestaurants = [];
            db.collection("restaurants")
            .orderBy("createAt", "desc")
            .limit(limitRestaurant)
            .get()
            .then((response) => {
                //.docs es para sacar todos los documentos
                setStartRestaurants(response.docs[response.docs.length - 1]);
    
                response.forEach((doc) => {
                    // console.log(doc.data())
                    const restaurant = doc.data();
                    restaurant.id = doc.id;
                    //console.log(restaurant)
                    resultRestaurants.push(restaurant);
                });
    
                setRestaurants(resultRestaurants);
            })
        }, [])
    );

    //Para obtener los restaurantes desde firebase
    // useEffect(() => {
       

    // }, [])

    //nos traemos los siguientes registros mientras vamos scroleando hacia abajo
    const handleLoadMore = () =>{
        const resultRestaurants = [];
        restaurants.length < totalRestaurants &&  setIsLoading(true);

        db.collection("restaurants")
        .orderBy("createAt", "desc")
        .startAfter(startRestaurants.data().createAt)
        .limit(limitRestaurant)
        .get()
        .then(response => {
            //significa que aun quedan restaurantes por mostrar
            if(response.docs.length > 0){
                setStartRestaurants(response.docs[response.docs.length - 1]);
            }else{
                setIsLoading(false);
            }

            //por cada iteracion nos devuelve el documentos osea un restaurant
            response.forEach((doc) => {
                const restaurant = doc.data();

                restaurant.id = doc.id;
                resultRestaurants.push( restaurant );
            });

            //si hacemos esto y le pasamos resultaRestaurants vamos a perdir los antiguos
            //setRestaurants(resultRestaurants)

            setRestaurants([...restaurants, ...resultRestaurants]);

        })
    }

    return (
        <View style = { styles.viewBody }>
            <ListRestaurants 
                restaurants = { restaurants }
                handleLoadMore = { handleLoadMore }
                isLoading = { isLoading }
            />

            {/* validamos si user tiene data, si tiene renderizamos el icon, sino a tomar por culo el icon */}
            { user &&(
                <Icon 
                    reverse
                    type = "material-community"
                    name = "plus"
                    color = "#00a680"
                    containerStyle = {styles.btnContainer}
                    onPress = {() => navigation.navigate("add-restaurant")}
                />
            )}
            
        </View>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        backgroundColor: "#fff"
    },
    btnContainer  : {
        position: "absolute",
        bottom: 10,
        right: 10,
        //para agregar sombrita al boton
        shadowColor: "black",
        shadowOffset: { width: 2, height: 2},
        shadowOpacity: 0.5
    }
})