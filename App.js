// import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';

// import { StyleSheet, Text, View } from 'react-native';
import Navigation from "./app/navigation/Navigation"
import { decode, encode } from 'base-64';

//importacion de firebase para laBD
import { firebaseApp } from "./app/utils/firebase";

if(!global.btoa) global.btoa = encode;
if(!global.atob) global.atob = decode;

export default function App() {

  return (
    <Navigation/>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
