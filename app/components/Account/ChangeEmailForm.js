import React, { useState } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { Input, Button, Icon } from 'react-native-elements'
import * as firebase from 'firebase'
import { validateEmail } from '../../utils/validations'
import  { reauthenticate } from '../../utils/api'
import { set } from 'lodash'

export default function ChangeEmailForm (props) {

    const { email, setShowModal, toastRef, setReloadUserInfo } = props;
    const [isLoading, setisLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState({}); //en caso de error

    //en este objeto guardaremos la info que ingresara el usuario
    const [formData, setFormData] = useState(defaultFormValue(email));

    //recibe el evento y el tipo que puede email o contraseña
    const onChange = (e, type)  => {
        setFormData({...formData, [type]: e.nativeEvent.text})
    }

    const onSubmit = () => {
        console.log("Form Enviado")
        console.log(formData)
        setError({});
        if(!formData.email || email === formData.email ){
            setError({
                email: "El email no ha cambiado",
            })
        }else if(!validateEmail(formData.email)){
            setError({
                email: "Email incorrecto"
            })
        }else if (!formData.password){
            setError({
                password: "La contraseña no puede estar vacia"
            })
        }else{
            setisLoading(true)
            console.log("Ok")
            reauthenticate(formData.password)
            .then(response => {
                
                //actualizamos el email del usuario con updateEmail
                firebase.auth()
                    .currentUser.updateEmail(formData.email)
                    .then(() => {
                        //si todo sale bien nos devuelve una promesa
                        //volvemos a recargafr la info del usuario con el nuevo email
                        setisLoading(false);
                        setReloadUserInfo(true);
                        toastRef.current.show("Email actualizado correctamente");
                        setShowModal(false);
                    })
                    .catch(() => {
                        setError({ email: "Error al actualizar el email,"});
                        setisLoading(false);
                    })
                console.log(response)
            })
            .catch(() => {
                setisLoading(false)
                setError({ password: "La contraseña no es correcta."})
            })

        }
    }

    return (
        <View style = {styles.view}>
            <Input 
                placeholder = "Ingrese Email"
                containerStyle = { styles.input }
                rightIcon = {{
                    type: "material-community",
                    name: "at",
                    color: "#c2c2c2"
                }}
                defaultValue = { email || ""}
                errorMessage =  {error.email}
                onChange = { (e) => onChange(e, "email") }
            />

            {/* Agregamos un input para la contraseña porque es un dato sensible, firebase nos pide la contraseña */}
            <Input 
                placeholder = "Contraseña"
                containerStyle = { styles.input }
                password = { true }
                secureTextEntry = {showPassword ? false : true}
                rightIcon = {
                    <Icon 
                        type = "material-community"
                        name = {showPassword ? "eye-off-outline" : "eye-outline" } 
                        iconStyle = {styles.iconRight}
                        onPress = {() => {setShowPassword(!showPassword)}}
                    />
                }
                onChange = { (e) => onChange(e, "password") }
                errorMessage = { error.password }
            />
            <Button 
                title = "Cambiar Email"
                containerStyle = { styles.btnContainer}
                buttonStyle = { styles.btn }
                loading = {isLoading}
                onPress = { onSubmit }
            />
        </View>
    )
}

function defaultFormValue(email){
    return {
        email: email,
        password: ""
    }
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
})