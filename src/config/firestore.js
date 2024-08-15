
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCYWOOLjZh3Qjubmh6ICA083j6E_PcXBSc",
  authDomain: "icampus-project-cf315.firebaseapp.com",
  projectId: "icampus-project-cf315",
  storageBucket: "icampus-project-cf315.appspot.com",
  messagingSenderId: "567596067043",
  appId: "1:567596067043:web:86d3db9e8d51abe5293dd6",
  measurementId: "G-W6V99JS2RE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);