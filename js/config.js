import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import * as firestore from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import * as firebaseAuth from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

// web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDm0iMWU8h1F8hreKnolOxYPXSL25LIdI4",
    authDomain: "combinatorics-a9de3.firebaseapp.com",
    projectId: "combinatorics-a9de3",
    storageBucket: "combinatorics-a9de3.appspot.com",
    messagingSenderId: "277305582557",
    appId: "1:277305582557:web:7bc10748f573a1b0a00c34"
};

const app = initializeApp(firebaseConfig);
const auth = firebaseAuth.getAuth();
const db = firestore.getFirestore(app);

export {app, db, auth}