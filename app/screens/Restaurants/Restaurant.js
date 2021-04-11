import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native'
import { Rating } from "react-native-elements";
import Loading from "../../components/Loading";
import Carousel from "../../components/Carousel";

import { firebaseApp } from "../../utils/firebase"
import firebase from "firebase/app";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);

//Sacamos el widht segun la pantalla del telefono
const screenwidth = Dimensions.get("window").width;

export default function Restaurant(props) {
    //console.log(props);
    const {navigation, route } = props;
    const {id, name} = route.params;
    const [restaurant, setRestaurant] = useState(null);
    const [rating, setRating] = useState(0);

    useEffect(() => {
        navigation.setOptions({ title: name });

        db.collection("restaurants")
        .doc(id)
        .get()
        .then((response) => {
            //console.log(response.data());
            const data = response.data();
            data.id = response.id;
            setRestaurant(data);
            setRating(data.rating);
        })

    }, []);

    if(!restaurant) return <Loading isVisible = { true } text = "Cargando..." />
    
    return (
        <ScrollView vertical style = {styles.viewBody}>
            <Carousel
                arrayImages = { restaurant.images }
                height = { 250 }
                width = { screenwidth }
            />
            <TitleRestaunrat
                name = { restaurant.name }
                description = {restaurant.description }
                rating = { rating }
            />
        </ScrollView>
    )
}

function TitleRestaunrat(props) {
    const {name, description, rating } = props;

    return (
        <View style = { styles.viewRestaurantTitle }>
            <View style = {{ flexDirection: "row"}}>
                <Text style = {styles.nameRestaurant}>{ name }</Text>
                <Rating
                    style = { styles.rating }
                    imageSize = { 20 }
                    readonly
                    startingValue = { parseFloat(rating) }
                />
            </View>
            <Text style = {styles.descriptionRestaurant}>{ description }</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        backgroundColor: "#fff"
    },
    viewRestaurantTitle: {
        padding: 15
    },
    nameRestaurant: {
        fontSize: 20,
        fontWeight: "bold"
    },
    descriptionRestaurant: {
        marginTop: 5,
        color: "grey"
    },
    rating: {
        position: "absolute",
        right: 0
    }

})
