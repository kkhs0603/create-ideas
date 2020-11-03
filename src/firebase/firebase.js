import * as firebase from "../../node_modules/firebase/app";
import "@firebase/firestore";
import "../../node_modules/firebase/auth";
import "../../node_modules/firebase/database";
import "firebase/storage";

const config = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databeseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSEGING_SENDER_ID,
};
if (!firebase.apps.length) {
  firebase.initializeApp(config);
}
//firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);

export const storage = firebase.storage();
export default firebase;
