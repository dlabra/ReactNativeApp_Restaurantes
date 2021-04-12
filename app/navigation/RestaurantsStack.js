import React from "react";
import { createStackNavigator } from "@react-navigation/stack"
import Restaurants from "../screens/Restaurants/Restaurants";
import AddRestaurant from '../screens/Restaurants/AddRestaurant';
import Restaurant from '../screens/Restaurants/Restaurant';
import AddReviewRestaurant from '../screens/Restaurants/AddReviewRestaurant';

const Stack = createStackNavigator();

export default function RestaurantsStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name = "restaurants"
                component = { Restaurants }
                options = {{title: "Restaurantes"}} //Titulo en la parte superior de la pagina
            />
            <Stack.Screen 
                name = "add-restaurant"
                component = { AddRestaurant }
                options = {{title: "Añadir nuevo restaurante"}} //Titulo en la parte superior de la pagina
            />
            <Stack.Screen 
                name = "restaurant"
                component = { Restaurant }
                //options = {{title: "Informacion restaurante"}} //No tiene titulo porque sera dinamico segun la info del restaurante
            />
            <Stack.Screen 
                name = "add-review-restaurant"
                component = { AddReviewRestaurant }
                options = {{ title: "Nuevo comentario"}}
            />
        </Stack.Navigator>
    );
}