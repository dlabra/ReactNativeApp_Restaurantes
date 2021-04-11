import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Input, Button, Icon } from "react-native-elements"
import { size, isEmpty } from "lodash"; //libreria para hacer validaciones
import { validateEmail } from "../../utils/validations";
import Loading from "../Loading"
import * as firebase from "firebase"
import { useNavigation } from "@react-navigation/native"; //importacion para usar la navegacion y asi mover la vista al momento de registrase

export default function LoginForm(props){

    const { toastRef } = props;
    const navigation = useNavigation();
    const [formData, setFormData] = useState(defaultFormValue());
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setshowRepeatPassword] = useState(false);

    const onSubmit = () => {
        console.log("Submit del formulario")
        console.log(formData)

        if( isEmpty(formData.email.trim()) || isEmpty(formData.password.trim())){
            toastRef.current.show("Todos los campos son obligatorios")
        }else if (!validateEmail(formData.email)){
            toastRef.current.show("El email no es valido")
        }else{
            setLoading(true)
            firebase.auth()
                .signInWithEmailAndPassword(formData.email, formData.password)
                .then(response => {
                    setLoading(false);
                    navigation.navigate("account"); 
                    //console.log(response)
                })
                .catch(err => {
                    setLoading(false);
                    toastRef.current.show("El usuario ingresado no es valido. Intenta de nuevo")
                    console.log(err);
                })
        }
    }

    const onChange = (e, type) => {
        //console.log("capturando texto");
        //console.log(type);
        //console.log(type);
        
        setFormData({...formData, [type]: e.nativeEvent.text});

        //console.log(formData)

    }

    return (
        <View style = {styles.formCantainer}>
            <Input 
                placeholder = "Correo electronico"
                containerStyle = {styles.inputForm}
                onChange = {e => onChange(e, "email")}
                rightIcon = {
                    <Icon 
                        type = "material-community"
                        name = "at"    
                        iconStyle = {styles.iconRight}
                    />
                }
            />
            <Input 
                placeholder = "Contraseña"
                containerStyle = {styles.inputForm}
                password = {true}
                secureTextEntry = {showPassword ? false : true}
                onChange = {e => onChange(e, "password")}
                rightIcon = {
                    <Icon 
                        type = "material-community"
                        name = {showPassword ? "eye-off-outline" : "eye-outline" } 
                        iconStyle = {styles.iconRight}
                        onPress = {() => {setShowPassword(!showPassword)}}
                    />
                }
            />
            <Button 
                title = "Iniciar sesion"
                containerStyle = {styles.btnContainerLogin}
                buttonStyle = {styles.btnLogin}
                onPress = {onSubmit}
            />
            <Loading isVisible = { loading } text = "Iniciando sesion"/>
        </View>
    )
}
function defaultFormValue(){
    return ({
        email: "",
        password: "",
    })
}

const styles = StyleSheet.create({
    formCantainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 30,
    },
    inputForm: {
        width: "100%",
        marginTop: 20,
    },
    btnContainerLogin: {
        marginTop: 20,
        width: "95%",        
    },
    btnLogin: {
        backgroundColor: "#00a680",
    },
    iconRight: {
        color: "#c1c1c1"
    }
})