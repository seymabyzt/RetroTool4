import { initializeApp } from "@firebase/app";
import { getFirestore } from '@firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD7x_AkGgIrgLKwQuUCXkWC_3Bs2Nk95Vc",
  authDomain: "retro-tool-c1281.firebaseapp.com",
  projectId: "retro-tool-c1281",
  storageBucket: "retro-tool-c1281.appspot.com",
  messagingSenderId: "425095036620",
  appId: "1:425095036620:web:6a3b2cc172a01d3e68cc69"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };


