import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBheQS3a1f3PKoVSEH2TqO40Jzv1n_P_hI",
  projectId: "gen-lang-client-0445592793",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "ai-studio-tevarnews-8a28c4b5-2980-4382-84ec-61e7f72ad2dd");

async function run() {
  try {
    const coll = collection(db, 'articles');
    const snap = await getDocs(coll);
    console.log("Size:", snap.size);
    if (snap.size > 0) {
      console.log(snap.docs[0].id, snap.docs[0].data());
    }
  } catch (e) {
    console.error(e);
  }
  process.exit(0);
}
run();
