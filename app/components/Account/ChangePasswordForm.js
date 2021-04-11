import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Input, Button, Icon } from 'react-native-elements'
import { size } from "lodash"
import { reauthenticate } from '../../utils/api';
import * as firebase from 'firebase';

export default function ChangePasswordForm(props) {

    const {setShowModal, toastRef} = props;

    //si queremos que cada ojito se maneje de forma independiente en cada campo hay que crear un estado para cada campo
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState(defaulValue());
    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false);

    const onChange = (e, tipo) => {
        setFormData({...formData, [tipo]: e.nativeEvent.text});
        //console.log(formData);
    }

    //Para mostrar el mensaje de error en caso de que la contraseña no es correcta hacemos el metodo async
    //para que el metodo de reauthenticate espere la respuesta
    const onSubmit =  async () => {
        //console.log(formData);
        let isSetError = true;
        let errorTemp = {}
        //limpiamos los errores antes de setear los nuevos
        setErrors({});

        if(!formData.password || !formData.newPassword || !formData.repeatNewPassword ){
            errorTemp = {
                password: !formData.password  ? "La contraseña no puede estar vacia." : "",
                newPassword: !formData.newPassword  ? "La contraseña no puede estar vacia." : "",
                repeatNewPassword: !formData.repeatNewPassword  ? "La contraseña no puede estar vacia." : ""
            }
        } else if (formData.newPassword !== formData.repeatNewPassword){
            errorTemp = {                
                newPassword: "Las contraseñas no son iguales.",
                repeatNewPassword: "Las contraseñas no son iguales."
            }
        } else if (size(formData.newPassword) < 6){
            errorTemp = {                
                newPassword: "Las contraseñas tiene que ser mayor a 5 caracteres.",
                repeatNewPassword: "Las contraseñas tiene que ser mayor a 5 caracteres.",
            }
        } else if (formData.password === formData.newPassword ) {
            errorTemp = {                
                newPassword: "La nueva contraseña no puede ser igual a la actual.",                
            }
        } else {
            setIsLoading(true);
            await reauthenticate(formData.password)
            .then( async () => {
                await firebase.auth()
                    .currentUser
                    .updatePassword(formData.newPassword)
                    .then(() => {
                        isSetError = false;
                        setIsLoading(false);
                        setShowModal(false);
                        firebase.auth().signOut();
                    })
                    .catch(() => {
                        other: "Error al actualizar la contraseña."
                    });
                    setIsLoading(false);
            })
            .catch(() => {
                errorTemp = {                
                    password: "Las contraseñas no es correcta"                    
                }
                setIsLoading(false);
            })
        }

        //Los errores solo se muestrna si isSeterror es true
        if(isSetError){
            setErrors(errorTemp);
        }
        
    }

    return (
        <View style = { styles.view }>
            <Input 
                placeholder = "Contraseña actual"
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
                onChange = {(e) => onChange(e, "password")}
                errorMessage = { errors.password }
            />

            <Input 
                placeholder = "Nueva contraseña"
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
                onChange = {(e) => onChange(e, "newPassword")}
                errorMessage = { errors.newPassword }
            />

            <Input 
                placeholder = "Repite tu nueva contraseña"
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
                onChange = {(e) => onChange(e, "repeatNewPassword")}
                errorMessage = { errors.repeatNewPassword }
            />

            <Button 
                title = "Cambiar contraseña"
                containerStyle = { styles.btnContainer}
                buttonStyle = { styles.btn }
                onPress = { onSubmit }
                loading = { isLoading }
            />
            <Text>{errors.other}</Text>
        </View>
    )
}

function defaulValue () {
    return {
        password: "",
        newPassword: "",
        repeatNewPassword: ""
    }
}


const styles = StyleSheet.create({
    view: {
        alignItems: "center",
        paddingTop: 10,
        paddingBottom: 10,
    },
    input: {
        marginBottom: 10
    },
    btnContainer: {
        marginTop: 20,
        width: "95%",
    },
    btn: {
        backgroundColor: "#00a680"
    }
})
