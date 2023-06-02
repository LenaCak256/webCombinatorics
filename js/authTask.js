import * as firestore from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import * as firebaseAuth from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import {auth, db} from "./config.js"
import {deleteAll} from "./objectManaging.js";
import {loadTask} from "./taskLoading.js";

const provider = new firebaseAuth.GoogleAuthProvider();

const loginButton = document.getElementById("login");
const logoutButton = document.getElementById("logout");
const userTag = document.getElementById("userName");
const userLabel = document.getElementById("user");

const setupUI = (user) => {
    if (user) {
        firestore.getDoc(firestore.doc(firestore.collection(db, 'users'), user.uid)).then((doc) => {
            userTag.textContent = doc.data().name;
        })
        // toggle user UI elements
        loginButton.style.display = "none";
        logoutButton.style.display = "inline";
        userLabel.style.display = "inline";
    } else {
        loginButton.style.display = "inline";
        logoutButton.style.display = "none";
        userLabel.style.display = "none";
    }
};

window.onload = function () {
    // listen for auth status changes
    auth.onAuthStateChanged( user => {
        if (user) {
            //get and display data
            setupUI(user);
        } else {
            deleteAll();
            setupUI();
        }
    })
}

// login
loginButton.addEventListener('click', (e) => {
    firebaseAuth.signInWithPopup(auth, provider)
        .then(async (result) => {
            const user = result.user;

            const users = firestore.collection(db, 'users');
            const q = firestore.query(users, firestore.where("__name__", "==", user.uid));
            const querySnapshot = await firestore.getDocs(q);

            //if user is new, he's added to database to collection 'users'
            if (querySnapshot.empty) {
                user.providerData.forEach((profile) => {
                    firestore.setDoc(firestore.doc(firestore.collection(db, 'users'), user.uid), {
                        name: profile.displayName,
                        skills: []
                    });
                });
            }

            loadTask();
        })
});

