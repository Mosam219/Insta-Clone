
  import firebase from "firebase";
  const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDAjraH57KGRTySuox090tShLUfV2V-NJ0",
    authDomain: "instagram-clone-83628.firebaseapp.com",
    projectId: "instagram-clone-83628",
    storageBucket: "instagram-clone-83628.appspot.com",
    messagingSenderId: "575106389733",
    appId: "1:575106389733:web:5cd4ebee3a62f38a32260c",
    measurementId: "G-SRRDJ4V9HV"
  });
  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();

  export { db, auth, storage };
//   export default db;