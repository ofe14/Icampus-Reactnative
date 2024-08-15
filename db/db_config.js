import { initializeApp ,getApps  } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth , getReactNativePersistence} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCrd_xMAuswXYm9X1Gz17P1NW4McfHlGGY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}
const db = getFirestore(app);
const auth = getAuth(app);

export { db,auth};