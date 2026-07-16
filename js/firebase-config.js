import { initializeApp } from
    "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";

import { getAuth } from
    "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

import { getFirestore } from
    "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC7vmMNsPGaQeGYmRBr_qge_Ic6KY-7upU",
  authDomain: "skala-2c933.firebaseapp.com",
  projectId: "skala-2c933",
  storageBucket: "skala-2c933.firebasestorage.app",
  messagingSenderId: "687450536645",
  appId: "1:687450536645:web:b45493118637d964e38eac"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };