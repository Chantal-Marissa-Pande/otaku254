import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDGoLVS13VFeg84BT1hOd6Hu8ceSGaVD8Y",
  authDomain: "otaku254.firebaseapp.com",
  projectId: "otaku254",
  storageBucket: "otaku254.appspot.com",
  messagingSenderId: "645205221614",
  appId: "1:645205221614:web:b296bf8503ba5ce38ed3ff",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);