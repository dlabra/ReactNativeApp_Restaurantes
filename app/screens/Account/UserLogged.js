import React, {useRef, useState, useEffect } from "react"; //useEffect lo importamos para obtener los datos del usuario
import { View, Text, StyleSheet} from "react-native";
import { Button, colors } from "react-native-elements";
import Toast from "react-native-easy-toast";
import * as firebase from "firebase"; //importamos firebase para utilizar la funciona de cerrar sesion
import Loadin from "../../components/Loading";
import Loading from "../../components/Loading";
import InfoUser from "../../components/Account/InfoUser";
import AccountOptions from "../../components/Account/AccountOptions";

export default function UserLogged() {

    const [userInfo, setUserInfo] = useState(null)
    const [loading, setLoading] = useState(false)
    const [loadingText, setLoadingText] = useState("")
    const toastRef = useRef();

    //creamos este estado para actulizar la info en pantalla del usuario cuando actualizamos el nombre
    const [reloadUserInfo, setReloadUserInfo] = useState(false)

    //vamos a crear una funcioon anonima asyncrona autoejecutable
    useEffect(() => {
        //para que sea autoejecutable
        (async () => {
            const user = await firebase.auth().currentUser; //currentUser me retorna de firebase el usuario logeado
            setUserInfo(user);
        })()
        setReloadUserInfo(false);
    }, [reloadUserInfo])

    return(
        <View style = {styles.viewUserInfo}>
            {userInfo && <InfoUser 
                            userInfo = {userInfo} 
                            toastRef = {toastRef}
                            setLoading = {setLoading}
                            setLoadingText = { setLoadingText }
                            />}
            
            <AccountOptions userInfo = { userInfo} toastRef = {toastRef} setReloadUserInfo = {setReloadUserInfo} />

            <Button 
                title = "Cerrar sesión" 
                buttonStyle = {styles.btnCloseSession}
                titleStyle = {styles.btnCloseSessionText}
                onPress = { () => firebase.auth().signOut()}
            />

            <Toast ref ={toastRef} position="center" opacity={0.9}/>
            <Loading text = {loadingText} isVisible={loading}/>

        </View>

    );
}

const styles = StyleSheet.create({
    viewUserInfo: {
        minHeight: "100%",
        backgroundColor: "#f2f2f2",
    },
    btnCloseSession: {
        marginTop: 30,
        borderRadius: 0,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#e3e3e3",
        borderBottomWidth: 1,
        borderBottomColor: "#e3e3e3",
        paddingTop: 10,
        paddingBottom: 10
    },
    btnCloseSessionText: {
        color: "#00a680",
    }
    
})