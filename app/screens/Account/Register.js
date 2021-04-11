import React, { useRef } from "react";
import { StyleSheet, View, Text, Image } from "react-native"
import Toast from "react-native-easy-toast"; //importacion para usar el mensaje toast
import FormRegistro from "../../components/Account/RegisterForm"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function Register(){

    const toastRef = useRef(); //inicializamos la ref del toast con el hook useRef

    return (
        <KeyboardAwareScrollView>
            <Image 
                source = {require("../../../assets/img/5-tenedores-letras-icono-logo.png")}
                resizeMode = "contain"                
                style = { styles.logo }
            />

            <View style = {styles.viewForm}>
                {/* Le pasamos la referencia de toastRef al componente FormRegistro, para que se monte y tenga valor */}
                <FormRegistro toastRef = { toastRef }/>
            </View>
            {/* Mensaje toast, le damos una referencia para utilizarlo desde cualquiera lado de la vista llamando por la ref */}
            <Toast ref = { toastRef } position = "center" opacity = {0.9} />  
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    logo : {
        width: "100%",
        height: 150,
        marginTop: 20,
    },
    viewForm:{
        marginRight: 40,
        marginLeft: 40,
    }
});