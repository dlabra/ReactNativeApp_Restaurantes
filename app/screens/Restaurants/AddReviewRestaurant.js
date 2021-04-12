import React, {useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native';
import { AirbnbRating, Button, Input } from "react-native-elements";


export default function AddReviewRestaurant(props) {

    const { navigation, route }= props;
    const { idRestaurant} = route.params;
    const [rating, setRating] = useState(null);
    const [title, setTitle] = useState("");
    const [review, setReview] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const addReview = () => {
        console.log(rating);
        console.log(title);
        console.log(review);
    }
    
    return (
        <View styles = {styles.viewBody }>
            <View styles = {styles.viewRating }>
                <AirbnbRating
                    count = { 5 }
                    reviews = {["Pésimo", "Deficiente", "Normal", "Muy bueno", "Excelente"]}
                    defaultRating = { 0 }
                    size = { 35 }
                    onFinishRating = {(value) => { setRating(value) }}
                />
            </View>
            <View style = {styles.formReview}>
                <Input 
                    placeholder = "Titulo"
                    containerStyle = {styles.input}
                    onChange = {(e) => setTitle(e.nativeEvent.text)}
                />
                <Input 
                    placeholder = "Comentario..."
                    multiline = { true }
                    inputContainerStyle = {styles.textArea}
                    containerStyle = { styles.input}
                    onChange = {(e) => setReview(e.nativeEvent.text)}
                />
                <Button 
                    title = "Enviar comentario"
                    containerStyle = { styles.btnContainer }
                    buttonStyle= { styles.btn }
                    onPress = { addReview }
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1
    },
    viewRating: {
        height: 110,
        backgroundColor: "#f2f2f2"
    },
    formReview: {
        marginTop: 30,
        marginLeft: 10,
        marginRight: 10,
        height: "82%"
    },
    input: {
        marginBottom: 10,        
    },
    textArea: {
        height: 150,
        width: "100%",
        padding: 0,
        margin: 0
    },
    btnContainer: {
        flex: 1,
        justifyContent: "flex-end",
        marginTop: 20,
        marginBottom: 10,
        width: "95%"
    },
    btn: {
        backgroundColor: "#00a680"
    }
})
