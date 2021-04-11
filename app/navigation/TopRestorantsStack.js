import React from "react";
import { createStackNavigator } from "@react-navigation/stack"
import TopRestaurants from "../screens/TopRestaurants";

const Stack = createStackNavigator();

export default function TopRestorantsStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name = "toprestorants"
                component = { TopRestaurants }
                options = {{title: "Mejores 5 restorantes"}} //Titulo en la parte superior de la pagina
            />
        </Stack.Navigator>
    );
}