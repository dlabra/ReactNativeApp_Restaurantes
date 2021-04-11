import React from "react";
import { NavigationContainer } from "@react-navigation/native";

//empieza en minuscula, no es un componente, es una funcion
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

//libreria para importar los iconos
import { Icon } from "react-native-elements"

import RestaurantsStack from "../navigation/RestaurantsStack"
import FavotiresStack from "../navigation/FavotiresStack"
import TopRestorantsStack from "../navigation/TopRestorantsStack"
import SearchStack from "../navigation/SearchStack"
import AccountStack from "../navigation/AccountStack"

//import Restaurants from "../screens/Restaurants"
// import Favorites from "../screens/Favorites"
// import TopRestaurants from "../screens/TopRestaurants"
// import Search from "../screens/Search"
// import Account from "../screens/Account"

const Tab = createBottomTabNavigator();

export default function Navigation() {
    
    return (
        <NavigationContainer>

                     
            <Tab.Navigator 
                initialRouteName="restaurants" // Le indico en que pestaña quiero que se inicia la app
                tabBarOptions = {{
                    inactiveTintColor: "#646464", //color de los tab inactivos
                    activeTintColor: "#00a680", //color del tab activo 
                }}
                
                //para obtener route se utiliza destructirng ({ asdasd }) => ({})
                screenOptions = {({ route }) => ({
                    tabBarIcon: ({ color }) => screenOptions(route, color),  //por destructinr obtenenemos el color y con la funciona screenOptions obtenels el icono para cada elemento
                })}
            >
                 {/* Pestañas que se muestran en la parte de abajo de la app */}
                <Tab.Screen
                    name = "restaurants"
                    component = {RestaurantsStack}
                    options = {{ title: "Restaurantes"}} //Titulo en la parte inferior, en los botones de abajo
                />
                <Tab.Screen
                    name = "favorites"
                    component = {FavotiresStack}
                    options = {{ title: "Favoritos"}}
                />
                <Tab.Screen
                    name = "top-restaurants"
                    component = {TopRestorantsStack}
                    options = {{ title: "Top 5"}}
                />
                <Tab.Screen
                    name = "search"
                    component = {SearchStack}
                    options = {{ title: "Buscar!"}}
                />
                <Tab.Screen
                    name = "account"
                    component = {AccountStack}
                    options = {{ title: "Cuenta"}}
                />

                
            </Tab.Navigator>
        </NavigationContainer>
    )
}

function screenOptions(route, color){
    let iconName;

    //route.name esta el nombre de la ruta que le estamos pasando
    switch (route.name) {
        case "restaurants": 
            iconName = "compass-outline"           
            break;    
        case "favorites": 
            iconName = "heart-outline"           
            break;
        case "top-restaurants": 
            iconName = "star-outline"           
            break;
        case "search": 
            iconName = "magnify"           
            break;
        case "account": 
            iconName = "account-outline"           
            break;
        default:
            break;
    }

    //el tipo lo obtenemos de aca https://reactnativeelements.com/docs/icon puedes ser cualquiera, es el diseño del icono
    return (
        <Icon type="material-community" name={iconName} size = {22} color = {color} />
    )
}