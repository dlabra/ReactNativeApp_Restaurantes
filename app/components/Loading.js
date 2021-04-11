import React from "react";
import {StyleSheet, View, Text, ActivityIndicator } from "react-native"
import { Overlay } from "react-native-elements"; //esto es un modal

//funcion loading que recibe unos props
export default function Loading(props){
 
    //los props que recibe son
    //isVisible = se muesra o no el loading
    // text = texto que mostrara el loading
    const { isVisible, text} = props;

    return(
        <Overlay 
            isVisible = {isVisible}
            windowBackgroundColor = "rgba(0, 0, 0, 0.5)"
            overlayBackgroundColor = "transparent"
            overlayStyle =  {style.overlay}
        >
            <View style={style.view}>
                <ActivityIndicator size = "large" color = "#00a680" />
                {/* Aca validamos si text viene con algo, si viene se muestra si no, nada jaja */}
                {text && <Text style = {style.text}>{text}</Text>}  
            </View>
        </Overlay>
    )
}


//tenemos que darle estilo al loading asi que creamos un stylesheet
const style = StyleSheet.create({
    overlay:{
        height: 100,
        width: 200,
        backgroundColor: "#fff",
        borderColor: "#00a680",
        borderWidth: 2,
        borderRadius: 10,
    },
    view:{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        color: "#00a680",
        textTransform : "uppercase",
        marginTop: 10,
    }
    
});