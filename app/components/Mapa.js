import React from 'react'
import MapView from "react-native-maps";
import openMap from "react-native-open-maps";

export default function Mapa(props) {

    const { location, name, height } = props;3

    const openAppMap = () => {
        openMap({
            latitude: location.latitude,
            longitude: location.longitude.longitude,
            zoom: 19,
            query: name
        })
    }
    return (
        <MapView
            style = {{height: height, width: "100%"}}
            initialRegion = { location }
            onPress = { openAppMap }
            scrollEnabled = { false }
        >
            <MapView.Marker 
                coordinate = {{
                    latitude: location.latitude,
                    longitude: location.longitude
                }}
            />
        </MapView>
    )
}
