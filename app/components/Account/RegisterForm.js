import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Input, Icon, Button } from "react-native-elements"
import Loading from "../Loading" //importamos el componente que hicimos de loading
import { validateEmail } from "../../utils/validations"
import { size, isEmpty } from "lodash"; //libreria para hacer validaciones
import * as firebase from "firebase" //importacion para guardar los registros en firebase
import { useNavigation } from "@react-navigation/native"; //importacion para usar la navegacion y asi mover la vista al momento de registrase

export default function RegisterForm( props ){

    //en props vienen las propiedades del toast que pasamos en el componenete anterior
    //console.log(props);
    
    const { toastRef } = props;
    console.log(toastRef)
    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setshowRepeatPassword] = useState(false);
    const [formData, setFormData] = useState(defaultFormValue());
    const [loading, setLoading] = useState(false);

    const navigation = useNavigation();

    //funcion submit al momento de clickear el boton
    const onSubmit = () => {

        if(isEmpty(formData.email.trim()) || isEmpty(formData.password.trim()) || isEmpty(formData.repeatPassword.trim())){
            //console.log("Todos los campos son boligatorios");
            toastRef.current.show("Todos los campos son boligatorios");
        } else if (!validateEmail(formData.email)){
            console.log("El Email no es valido")
            toastRef.current.show("El Email no es valido");
        } else if (formData.password.trim() !== formData.repeatPassword.trim()){
            console.log("Las contraseñas deben ser iguales")
            toastRef.current.show("Las contraseñas deben ser iguales");
        } else if (size(formData.password) < 6) {
            console.log("La contraseña debe tener al menos 6 caracteres")
            toastRef.current.show("La contraseña debe tener al menos 6 caracteres");
        } else {
            setLoading(true); //cambias el estado del loading para que aparezca antes de conectarse afirebase
            firebase
                .auth()
                .createUserWithEmailAndPassword(formData.email, formData.password)
                .then( response =>{
                    //console.log(response);
                    setLoading(false);  //cambiasmo el estado a false para que se deje de mostrar ANTES del navigate porque si va despues tira error
                                        //porque el componente ya estaria desmontado en ese momento
                    navigation.navigate("account"); //lo dirigimos a la apgina de usuario logeado con el name account
                }) //devuelve una promesa que tenemos que resolver
                .catch((err) => {
                    console.log(err)
                    setLoading(false);
                    toastRef.current.show("El email ya esta en uso, intente con otro.")
                })
        }

        console.log(validateEmail(formData.email))
    }

    //funcion que cambiar el cambio de algun valor del formualrio
    //e = el evento
    //type = el tipo de campo que se esta modificando, email, password o repeat password
    const onChange = (e, type) => {
        //console.log(type)
        //para asignar el valor a un tipo dinamico se pone entre [] sino pisa el objeto y crea uno nuevo
        //setFormData({[type]: e.nativeEvent.text})  esto no funciona porque va creando un objeto nuevo cada vez que actualizo un valor y se pierden los otros

        //nos traemos formData pero le agrgamos ... para traer solo los valor y despues le indicamos que valor vamos a cambiar y por cual valor
        setFormData({...formData, [type]: e.nativeEvent.text})
    }

    return(
        <View style = {styles.formContainer}>
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
                password= {true}
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
            <Input 
                placeholder = "Repita su contraseña"
                containerStyle = {styles.inputForm}
                password= {true}
                secureTextEntry = {showRepeatPassword ? false : true}
                onChange = {e => onChange(e, "repeatPassword")}
                rightIcon = {
                    <Icon 
                        type = "material-community"
                        name = {showRepeatPassword ? "eye-off-outline" : "eye-outline" } 
                        iconStyle = {styles.iconRight}
                        onPress = {() => {setshowRepeatPassword(!showRepeatPassword)}}
                    />
                }
            />
            <Button 
                title = "Unirse"
                buttonStyle = { styles.btnStyle}
                containerStyle = {styles.bntContainerStyle}
                onPress = {onSubmit}
            />
            <Loading isVisible = { loading } text = "Creando cuenta"/>
        </View>
    )
}

function defaultFormValue(){
    return {
        email: "",
        password: "",
        repeatPassword: "",
    }
}

const styles = StyleSheet.create({
    formContainer:{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 30,
    },
    inputForm:{
        width: "100%",
        marginTop: 20,
    },
    bntContainerStyle: {
        marginTop: 20,
        width: "95%",        
    },
    btnStyle: {
        backgroundColor: "#00a680",
    },
    iconRight: {
        color: "#c1c1c1"
    }
})