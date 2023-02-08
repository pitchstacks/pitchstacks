import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const dataBase = admin.firestore();


// func to initialize firebase backend functions databse
export const createUserDocs = functions.auth
    .user()
    .onCreate(async (user) => {
        
        // func for new user being uploaded
        const nUser = {
            uid: user.uid,
            email: user.email,
            username: user.displayName,
            providerData: user.providerData,
        };
        
        dataBase.collection("users").doc(user.uid).set(nUser);
    });