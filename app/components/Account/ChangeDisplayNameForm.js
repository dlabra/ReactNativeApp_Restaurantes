import React, { useState } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { Input, Button } from 'react-native-elements'
import * as firebase from "firebase"

export default function ChangeDisplayNameForm(props){
    const {displayName, setShowModal, toastRef, setReloadUserInfo} = props;
    const [newDisplayName, setNewDisplayName] = useState(null);
    const [error, setError] = useState(null) //en caso de error

    const [isLoading, setIsLoading] = useState(false)

    const onSubmit = () => {
        console.log(newDisplayName);
        setError(null);

        if(!newDisplayName){
            setError("El nombre no puede estar vacio");
        } else if (newDisplayName === displayName ){
            setError("El nombre no puede ser igual al actual");
        }else {
            console.log("ok")
            setIsLoading(true);
            const update = {
                displayName: newDisplayName
            }
            firebase.auth().currentUser.updateProfile(update)
            .then(() => {
                console.log("actualizado")

                //loading en boton bien bonito
                setIsLoading(false);
                setReloadUserInfo(true);
                //cerramos el modal
                setShowModal(false)
            })
            .catch(() => {
                setError("Error al actualizar el nombre")
                setIsLoading(false);
            })
        }
    }

    return(
        <View style = {styles.view}>
            <Input
                placeholder = "Ingrese su nombre completo"
                containerStyle = { styles.input}
                rightIcon= {{
                    type: "material-community",
                    name: "account-circle-outline",
                    color: "#c2c2c2"
                }}
                defaultValue = { displayName || ""} //si el nombre viene null pone vacio "" 
                onChange = {(e) => setNewDisplayName(e.nativeEvent.text)} // con esto le pasamos a setNewdisplayname el texto que esta en el input
                errorMessage =  {error} //los input traen por defecto esta propiedad para mostrar mensajes de error
            />
            <Button 
                onPress = { onSubmit }
                title = "Cambiar nombre"
                containerStyle = { styles.btnContainer}
                buttonStyle = { styles.btn }
                loading = {isLoading}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    view: {
        alignItems: "center",
        paddingTop: 10,
        paddingBottom: 10
    },
    input: {
        marginBottom: 10
    },
    btnContainer: {
        marginTop: 20,
        width: "95%"
    },
    btn: {
        backgroundColor: "#00a680"
    }
});