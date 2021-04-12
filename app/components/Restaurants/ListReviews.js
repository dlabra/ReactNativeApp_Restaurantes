import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Button, Avatar, Rating } from "react-native-elements";
import {firebaseApp } from "../../utils/firebase"
import firebase from "firebase/app"

const db = firebase.firestore(firebaseApp);

export default function ListReviews(props) {

    const { navigation, idRestaurant, setRating } = props;

    const [userLogeged, setUserLogeged] = useState(false);

    //Verificamos si el usuario esta logeado
    firebase.auth().onAuthStateChanged((user) => {
        user ? setUserLogeged(true) : setUserLogeged(false)
    });

    return (
        <View>
            {userLogeged ? (
                <Button 
                    title = "Escribe una reseña"
                    buttonStyle = {styles.btnAddReview}
                    titleStyle = { styles.btnTitleAddReview}
                    icon = {{
                        type: "material-community",
                        name: "square-edit-outline",
                        color: "#00a680"
                    }}
                    onPress = {() => navigation.navigate("add-review-restaurant", {
                        idRestaurant: idRestaurant,
                    })}
                />
            ) : (
                <View>
                    <Text
                        style = {{textAlign: "center", color: "#00a680", padding: 20 }}
                        onPress = {() => navigation.navigate("account", {screen: "login"})}
                    >
                        Para escribir una reseña debes estar logeado {" "}
                        <Text style = {{ fontWeight: "bold" }}>
                            pulsa AQUI para iniciar sesión
                        </Text>
                    </Text>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    btnAddReview: {
        backgroundColor: "transparent"
    },
    btnTitleAddReview: {
        color: "#00a680"
    }
})
