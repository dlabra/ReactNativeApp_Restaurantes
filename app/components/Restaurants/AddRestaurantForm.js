import React, { useState, useEffect } from 'react'
import { StyleSheet, ScrollView, Alert, Dimensions, View, Text } from 'react-native';
import { Icon, Avatar, Image, Input, Button } from 'react-native-elements';
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import { map, size, filter } from 'lodash'
import uuid from 'random-uuid-v4'
import Modal from '../Modal';
import * as Location from 'expo-location'
import MapView from 'react-native-maps';

import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);


const widthScreen = Dimensions.get("window").width;

export default function AddRestaurantForm(props) {

    const { navigation, setIsLoading, toastRef} = props;
    const [restaurantName, setRestaurantName] = useState("");
    const [restaurantAddress, setRestaurantAddress] = useState("");
    const [restaurantDescription, setRestaurantDescription] = useState("");
    const [imagesSelected, setImagesSelected] = useState([]);
    const [isVisibleMap, setIsVisibleMap] = useState(false);
    const [locationRestaurant, setLocationRestaurant] = useState(null);

    //Aca creamos un array donde almacenamos las urls de los ficheros subidos
    const uploadIMageStorega = async () => {
        //console.log(imagesSelected);
        const imageBlob = [];

        //creamos una promesa porque sino el codigo de ejecuta mas rapido de lo que se demora el map
        await Promise.all(
            map(imagesSelected, async (image) => {
                const response = await fetch(image);
                const blob = await response.blob();
                const ref = firebase.storage().ref("restaurants").child(uuid());
    
                await ref.put(blob).then(async (result) => {
                    //console.log("ok");
                    await firebase
                            .storage()
                            .ref(`restaurants/${result.metadata.name}`)
                            .getDownloadURL()
                            .then(photoUrl => {
                                // console.log(photoUrl);
                                imageBlob.push(photoUrl);
                            })
                })
            })
        );        

        return imageBlob;
    }

    const addRestaurant = () =>{
        // console.log("ok");
        // console.log(imagesSelected);
        // console.log(locationRestaurant);

        if(!restaurantName || !restaurantAddress || !restaurantAddress){
            toastRef.current.show("Todos los campos son obligatorios")
        }else if ( size(imagesSelected) === 0){
            toastRef.current.show("Debe seleccionar al menos una imagen")
        }else if( !locationRestaurant ) {
            toastRef.current.show("Tienes que localizar el restaurante en el mapa.")
        }else {
            setIsLoading(true);
            uploadIMageStorega().then((response) => {
                // console.log(response);
                db.collection("restaurants")
                    .add({
                        name: restaurantName,
                        address: restaurantAddress,
                        description: restaurantDescription,
                        location: locationRestaurant,
                        images: response,
                        rating: 0,
                        ratingTotal: 0,
                        quantityVoting: 0,
                        createAt: new Date(),
                        createBy: firebase.auth().currentUser.uid,
                    })
                    .then(() => {
                        setIsLoading(false);
                        navigation.navigate("restaurants");
                    })
                    .catch(() =>{
                        setIsLoading(false);
                        toastRef.current.show("Error al subir el restaurante, intentalo mas tarde")
                    })
                
            });
        }
    }

    return (
        // Cambios view por scrollview porque la vista en la pagina sera bastante grande
        <ScrollView style = { styles.scrollView }>
            <ImageRestaurant 
                imageRestaurant = { imagesSelected[0] }
            />
            <FormAdd
                setRestaurantName = { setRestaurantName }
                setRestaurantAddress = { setRestaurantAddress }
                setRestaurantDescription = { setRestaurantDescription }
                setIsVisibleMap = { setIsVisibleMap }
                locationRestaurant = { locationRestaurant }
            />
            <UploadImage 
                toastRef = { toastRef }
                imagesSelected = { imagesSelected }
                setImagesSelected = { setImagesSelected }
            />
            <Button 
                title = "Crear Restaurante"
                onPress = { addRestaurant }
                buttonStyle = { styles.addRestaurant}
            />
            <Map 
                isVisibleMap = { isVisibleMap } 
                setIsVisibleMap = { setIsVisibleMap } 
                setLocationRestaurant = { setLocationRestaurant }
                toastRef = { toastRef }
            />
        </ScrollView>
    )
}

function FormAdd(props){

    const { setRestaurantName, 
        setRestaurantAddress, 
        setRestaurantDescription, 
        setIsVisibleMap, 
        locationRestaurant } = props;

    return (
        <View style = { styles.viewForm }>
            <Input 
                placeholder = "Nombre del restaurante"
                containerStyle = { styles.input}
                onChange = {(e) => setRestaurantName(e.nativeEvent.text)}
            />
            <Input 
                placeholder = "Dirección del restaurante"
                containerStyle = { styles.input}
                onChange = {(e) => setRestaurantAddress(e.nativeEvent.text)}
                rightIcon = {{
                    type: "material-community",
                    name: "google-maps",
                    color: locationRestaurant ? "#00a680" :"#c2c2c2",
                    onPress: () => setIsVisibleMap(true)
                }}
            />
            <Input 
                placeholder = "Descripcion del restaurante"
                multiline = { true }
                inputContainerStyle = {styles.textarea}
                containerStyle = { styles.input}
                onChange = {(e) => setRestaurantDescription(e.nativeEvent.text)}
            />
        </View>
    )
}

function UploadImage(props) {

    const { toastRef, setImagesSelected, imagesSelected } = props;

    //haremos que al seleccionar el icono nos lleve a la galeria para seleccionar imagenes
    //la hacemos asincrona porque el usuario debe esperar a que selccione una imagen para continuar
    const imageSelect = async () => {
        
        //Solicimoas los permisos para acceder a la camara
        const resultPermissions = await Permissions.askAsync(
            Permissions.MEDIA_LIBRARY
        );

        if(resultPermissions === "denied") {
            toastRef.current.show("Debe aceptar los permisos para acceder a la galeria", 3000);
        }else{
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4, 3]
            });

            if(result.cancelled) {
                toastRef.current.show("No seleccionaste ningun foto :(", 3000);
            } else {
                setImagesSelected([...imagesSelected, result.uri])
            }
        }
    }

    const deleteImage = (image) => {
        console.log(image);       

        Alert.alert(
            "Eliminar imagen",
            "¿Estas seguro de eliminar imagen?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Eliminar",
                    onPress: () => {
                        setImagesSelected(
                            filter(imagesSelected, (imageUrl) => imageUrl !== image)
                        )
                    }
                }
            ],
            {cancelable: false}
        )
    }

    return(
        <View style = { styles.viewImage }>
            {size(imagesSelected) < 4 && (
                <Icon 
                    type = "material-community"
                    name = "camera"
                    color = "#7a7a7a"
                    containerStyle = {styles.containerIcon}
                    onPress = { imageSelect }
                />
            )}
            
            {map(imagesSelected, (imageRestaurant, index) =>(
                <Avatar 
                    key = {index}
                    style = { styles.miniatureStyle}
                    source = {{uri: imageRestaurant}}
                    onPress = { () => deleteImage(imageRestaurant) }
                />
            ))}
        </View>
    )
}

function ImageRestaurant(props){
    const { imageRestaurant } = props;

    return (
        <View style = { styles.viewPhoto }>
            <Image 
                source = { imageRestaurant ? { uri: imageRestaurant } : require("../../../assets/img/restaurant-default.png")}
                style = {{ width: widthScreen, height: 200}}
            />
        </View>
    )
}

function Map(props){
    const { isVisibleMap, setIsVisibleMap, setLocationRestaurant, toastRef } = props;
    const [location, setLocation] = useState(null)


    //hacemos una funciona await dentro para la ubicacion
    useEffect(() => {
        (async () => {
            const resultPermissions = await Permissions.askAsync(
                Permissions.LOCATION
            )
            //console.log(resultPermissions);

            const statusPermission = resultPermissions.permissions.location.status;

            if(statusPermission !== "granted"){
                toastRef.current.show("Debe aceptar la ubicacion para agregar un restaurante", 3000);
            }else{
                const loc = await Location.getCurrentPositionAsync({})
                console.log(loc);
                setLocation({
                    latitude: loc.coords.latitude,
                    longitude: loc.coords.longitude,
                    latitudeDelta: 0.001,
                    longitudeDelta: 0.001
                })
            }


        })()
    }, [])

    const confirmLocation = () => {
        setLocationRestaurant(location);
        toastRef.current.show("Localizacion guardada");
        setIsVisibleMap(false);
    }
    return (
        <Modal isVisible = { isVisibleMap } setIsVisible = { setIsVisibleMap }>
            <View>
                {location && (
                    <MapView
                        style = { styles.mapStyle}
                        initialRegion = { location }
                        showsUserLocation = { true }
                        onRegionChange = {(region) => setLocation(region)}
                    >
                        <MapView.Marker 
                            coordinate = {{
                                latitude: location.latitude,
                                longitude: location.longitude
                            }}
                            draggable
                        />
                    </MapView>
                )}

                <View style = {styles.viewMapBtn}>
                    <Button 
                        title = "Guardar ubicacion"
                        containerStyle = { styles.viewMapBtnContainerSave}
                        buttonStyle = { styles.viewMapBtnSave}
                        onPress = { confirmLocation }
                    />
                    <Button 
                        title = "Cancelar ubicacion" 
                        containerStyle = { styles.viewMapBtnContainerCancel}
                        buttonStyle = { styles.viewMapBtnCancel}
                        onPress = {() => setIsVisibleMap(false)}
                    />
                </View>
            </View>
        </Modal>
    )
}



const styles = StyleSheet.create({
    scrollView: {
        height: "100%"
    },
    viewForm: {
        marginLeft: 10,
        marginRight: 10,
    },
    input: {
        marginBottom: 10,
    },
    textarea: {
        height: 100,
        width: "100%",
        padding: 0,
        margin: 0
    },
    addRestaurant: {
        backgroundColor: "#00a680",
        margin: 20
    },
    viewImage: {
        flexDirection: "row",
        marginLeft: 20,
        marginRight: 20,
        marginTop: 30
    },
    containerIcon: {
        alignItems: "center",
        justifyContent : "center",
        marginRight: 10,
        height: 70,
        width: 70,
        backgroundColor: "#e3e3e3"
    },
    miniatureStyle: {
        width: 70,
        height: 70,
        marginRight: 10
    },
    viewPhoto: {
        alignItems: "center",
        height: 200,
        marginBottom: 20
    },
    mapStyle: {
        width: "100%",
        height: 550
    },
    viewMapBtn: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10
    },
    viewMapBtnContainerCancel: {
        paddingLeft: 5
    },
    viewMapBtnCancel: {
        backgroundColor: "#a60d0d"
    },
    viewMapBtnContainerSave: {
        paddingRight: 5
    },
    viewMapBtnSave: {
        backgroundColor: "#00a680"
    }
})
