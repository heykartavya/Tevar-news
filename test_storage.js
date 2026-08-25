import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import fs from 'fs';

const firebaseConfig = {
  apiKey: "AIzaSyBheQS3a1f3PKoVSEH2TqO40Jzv1n_P_hI",
  authDomain: "gen-lang-client-0445592793.firebaseapp.com",
  projectId: "gen-lang-client-0445592793",
  storageBucket: "gen-lang-client-0445592793.firebasestorage.app",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const storageRef = ref(storage, 'test_image.txt');

async function test() {
  try {
    await uploadString(storageRef, 'test upload data');
    const url = await getDownloadURL(storageRef);
    console.log("Success:", url);
  } catch (e) {
    console.error("Error:", e);
  }
}
test();
