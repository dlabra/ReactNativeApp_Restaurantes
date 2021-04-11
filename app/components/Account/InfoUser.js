import React from 'react'
import { StyleSheet, View, Text } from 'react-native';
import { Avatar } from 'react-native-elements'
import * as firebase from "firebase";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
//import AvatarDefault from "../../../assets/img/avatar-default.jpg";

export default function InfoUser (props) {
    const {userInfo: {uid, photoURL, displayName, email}, 
            toastRef,
            setLoading,
            setLoadingText
    } = props; // utilizamos {} para obtener user info por destructuring desde los props
    //const {photoURL} = userInfo
    //console.log(userInfo)
    console.log(photoURL)
    console.log(displayName)
    console.log(email)

    //Metodo para obtener una imagen de la galeria
    const changeAvartar = async () => {

        //Pedimos permisos para acceder a la galeria
        const resultPermission = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
        const resultPermissionCamera = resultPermission.permissions.mediaLibrary.status;
        console.log(resultPermissionCamera);

        //checkiamos si dio permisos
        if(resultPermissionCamera === "denied"){
            toastRef.current.show("Es necesario aceptar los permisos de la galeria.");
        }else{
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4, 3]
            });

            console.log(result)

            if(result.cancelled){
                toastRef.current.show("Cancelaste la subido del avatar");
            }else{
                //como retornamos una promesa desde el metodo, agregamos then y la funciona tipo flecha
                uplodaImage(result.uri).then(() => {
                    updateImageUrl();
                }).catch(() => {
                    toastRef.current.show("Error al actualizar el avatar");
                });
            }
        }
    }

    const uplodaImage = async (uri) => {

                
        setLoadingText("Actualizando Avatar");
        setLoading(true);

        //Obtenemos la info de la imagen para luego subir a firebase
        const responde = await fetch(uri)
        const blob = await responde.blob(); //buscar que es blob

        //ahora hacemos una referencia antes de subir
        const ref = firebase.storage().ref().child(`Avatar/${uid}`);

        //retornamos una promesa 
        return ref.put(blob);

    }

    const updateImageUrl = () => {

        firebase
            .storage()
            .ref(`Avatar/${uid}`) //aca especificamos a que ubicacion queremos ir
            .getDownloadURL() //nos da la url de la imagen
            .then(async (response) => {  //nos devuelve una promesa, le ponemos async porque osino explota xd
                //console.log(response);// retorna la url de la imagen
                const update = {
                    photoURL: response
                };

                //actualizamos la url del avatar del usuario logeado
                await firebase.auth().currentUser.updateProfile(update);
                console.log("imagen actualizada")
                setLoading(false);
            })
            .catch(() => {
                toastRef.current.show("Error al actualizar el avatar");
            });
    }

    return(
        <View style = { styles.vierUserInfo}>
            <Avatar 
                rounded
                size = "large"
                showEditButton
                onEditPress = { changeAvartar }
                containerStyle = {styles.userInfoAvatar}
                source = {photoURL ? { uri: photoURL }: require("../../../assets/img/avatar-default.jpg")}
                
            /> 
            <View>
                <Text style = {styles.displayName}>
                    {displayName ? displayName : "Anónimo"}
                </Text>
                <Text>
                    {email ? email : "Social Login"}
                </Text>
            </View>   
        </View>
    )
}

const styles = StyleSheet.create({
    vierUserInfo:{
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        backgroundColor: "#f2f2f2",
        paddingTop: 30,
        paddingBottom: 30
    },
    userInfoAvatar:{
        marginRight: 20
    },
    displayName: {
        fontWeight: "bold",
        paddingBottom: 5
    }

});