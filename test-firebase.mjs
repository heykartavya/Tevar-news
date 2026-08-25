import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBheQS3a1f3PKoVSEH2TqO40Jzv1n_P_hI",
  projectId: "gen-lang-client-0445592793",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "ai-studio-tevarnews-8a28c4b5-2980-4382-84ec-61e7f72ad2dd");

async function run() {
  try {
    const docRef = doc(db, 'articles', '1');
    const docSnap = await getDoc(docRef);
    console.log("Exists:", docSnap.exists());
    if (docSnap.exists()) {
       console.log(docSnap.data());
    }
  } catch (e) {
    console.error(e);
  }
  process.exit(0);
}
run();
