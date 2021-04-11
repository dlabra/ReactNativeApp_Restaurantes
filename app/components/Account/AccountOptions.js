import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { ListItem } from 'react-native-elements'
import { map } from "lodash"
import Modal from "../Modal";
import ChangeDisplayNameForm from "../Account/ChangeDisplayNameForm"
import ChangeEmailForm from "../Account/ChangeEmailForm"
import ChangePasswordForm from "../Account/ChangePasswordForm"

export default function AccountOptions (props) {

    const { userInfo, toastRef, setReloadUserInfo } = props;
    const [showModal, setShowModal] = useState(false)
    const [renderComponent, setRenderComponent] = useState(null)
    // console.log(userInfo)
    // console.log(toastRef)
    
    const selectComponent = (key) => {
        console.log(key)
        switch(key){
            case "displayName":
                setRenderComponent(
                    <ChangeDisplayNameForm 
                        displayName = {userInfo.displayName} //displayname es el nombre completo que viene desde userInfo
                        setShowModal = { setShowModal }
                        toastRef = { toastRef }
                        setReloadUserInfo = { setReloadUserInfo }
                    />
                )
                setShowModal(true);
                break;
            case "email":
                setRenderComponent(
                    <ChangeEmailForm 
                        email = {userInfo.email} //displayname es el nombre completo que viene desde userInfo
                        setShowModal = { setShowModal }
                        toastRef = { toastRef }
                        setReloadUserInfo = { setReloadUserInfo }
                    />
                )
                setShowModal(true);
                break;
            case "password":
                setRenderComponent(
                    <ChangePasswordForm 
                        email = {userInfo.email} //displayname es el nombre completo que viene desde userInfo
                        password = { userInfo.password }
                        setShowModal = { setShowModal }
                        toastRef = { toastRef }
                    />
                )
                setShowModal(true);
                break;
            default:
                setRenderComponent(null);
                setShowModal(false);
                break;            
        }
    }
    
    const menuOptions = generateOptions(selectComponent);
    return (
        <View>
            {map(menuOptions, (menu, index) => (
                <ListItem 
                    key = { index }
                    title = { menu.title }  
                    onPress = {menu.onPress}                  
                    leftIcon = {{
                        type: menu.iconType,
                        name: menu.iconNameLeft,
                        color: menu.iconColorLeft
                    }}
                    rightIcon = {{
                        type: menu.iconType,
                        name: menu.iconNameRight,
                        color: menu.iconColorRight
                    }}
                    containerStyle = { styles.menuItems }
                />
            ))}
            {renderComponent && (
                <Modal isVisible = { showModal} setIsVisible = {setShowModal}>
                    {renderComponent}
                </Modal>
            )}
            
        </View>
    )
}

function generateOptions(selectComponent) {
    return[
        {
            title: "Cambiar Nombre y Apellidos",
            iconType: "material-community",
            iconNameLeft: "account-circle",
            iconColorLeft: "#ccc",
            iconNameRight: "chevron-right",
            iconColorRight: "#ccc",
            onPress: () => selectComponent("displayName")
        },
        {
            title: "Cambiar Email",
            iconType: "material-community",
            iconNameLeft: "at",
            iconColorLeft: "#ccc",
            iconNameRight: "chevron-right",
            iconColorRight: "#ccc",
            onPress: () => selectComponent("email")
        },
        {
            title: "Cambiar contraseña",
            iconType: "material-community",
            iconNameLeft: "lock-reset",
            iconColorLeft: "#ccc",
            iconNameRight: "chevron-right",
            iconColorRight: "#ccc",
            onPress: () => selectComponent("password")
        }
    ]
}


const styles = StyleSheet.create({
    menuItems: {
        borderBottomWidth: 1,
        borderBottomColor: "#e3e3e3"
    }
});