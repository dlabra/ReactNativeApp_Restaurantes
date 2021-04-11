import firebase from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyCTZHXfdqFTR0Hq3GcbeUDqJ3MORfP-cu4",
    authDomain: "tenedores-1788e.firebaseapp.com",
    projectId: "tenedores-1788e",
    storageBucket: "tenedores-1788e.appspot.com",
    messagingSenderId: "1096463828650",
    appId: "1:1096463828650:web:2b4fcdffc04c4af7edb2d3"
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);