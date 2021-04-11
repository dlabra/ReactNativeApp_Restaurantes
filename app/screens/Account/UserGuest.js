import React from "react";
import { StyleSheet, View, ScrollView, Text, Image }  from "react-native"
import { Button } from "react-native-elements"
import { useNavigation } from "@react-navigation/native"

export default function UserGuest(){

    const navigation = useNavigation();
    //console.log(navigation)

    return (
        <ScrollView centerContent = {true} style = {style.viewBody}>
            <Image
                source={require("../../../assets/img/user-guest.jpg")}
                resizeMode = "contain"  
                style = {style.image}              
            />
            <Text style = {style.title}>Consulta tu perfil de la App</Text>
            <Text style = {style.description}>
                ¿Como describirias tu mejor restaurante? Busca y visualiza los mejores restaurantes 
                de una forma sencilla, vota cual te ha gustado mas y comenta  como ha sido tu experiencia.
            </Text>
            <View style = {style.viewBtn}>
                <Button
                    title = "Ver tu perfil!"
                    buttonStyle = { style.btnStyle}
                    containerStyle = { style.btnContainer }
                    onPress = {() => navigation.navigate("login")}
                />
            </View>
        </ScrollView>
    )
}

const style = StyleSheet.create({
    viewBody: {
        marginLeft: 30,
        marginRight: 30,        
    },
    image:{
        height: 300,
        width: "100%",
        marginBottom: 40,
    },
    title:{
        fontWeight: "bold",
        fontSize: 19,
        marginBottom: 10,
        textAlign: "center"
    },
    description:{
        textAlign: "center",
        marginBottom: 20,
    },
    viewBtn: {
        flex: 1,
        alignItems: "center"
    },
    btnStyle: {
        backgroundColor: "#00a680",
    },
    btnContainer:{
        width: "80%",
    }

})