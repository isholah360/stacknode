import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyANw5Qpz9vz43BsfTEQonR5snz7adHXeY4",
  authDomain: "keventers-53ebe.firebaseapp.com",
  projectId: "keventers-53ebe",
  storageBucket: "keventers-53ebe.appspot.com",
  messagingSenderId: "265621760374",
  appId: "1:265621760374:web:e970c118b3285217b07257",
  measurementId: "G-47YF4MVXE2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const fireDB = getFirestore(app);
const auth = getAuth(app);

export { fireDB, storage, auth };
