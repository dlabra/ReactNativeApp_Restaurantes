import * as firebase from 'firebase';

//Como vamos a cambiar el email del usuario que es un dato sensible volvemos a autenticar con el nuevo email
export function reauthenticate (password) {

    //obtenemos el usuario actual que esta conectado
    const user = firebase.auth().currentUser;

    //lalamos a la funcion para que devuelva las crendenciales del usuario
    const crendentials = firebase.auth.EmailAuthProvider.credential(
        user.email,
        password
    );
    
    //si es correcto hara un reautenticate en la cuenta si no da error
    return user.reauthenticateWithCredential(crendentials);

}