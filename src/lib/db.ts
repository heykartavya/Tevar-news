import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { Article } from '../types';

export const getArticles = async (): Promise<Article[]> => {
  const q = query(collection(db, 'articles'), orderBy('date', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Article[];
};

export const addArticle = async (article: Omit<Article, 'id'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'articles'), article);
  return docRef.id;
};

export const updateArticle = async (id: string, article: Partial<Article>): Promise<void> => {
  const docRef = doc(db, 'articles', id);
  await updateDoc(docRef, article);
};

export const deleteArticle = async (id: string): Promise<void> => {
  const docRef = doc(db, 'articles', id);
  await deleteDoc(docRef);
};

// Admin utility to seed DB if empty
export const seedDatabase = async (mockArticles: Article[]) => {
  for (const article of mockArticles) {
    const { id, ...data } = article;
    await addDoc(collection(db, 'articles'), data);
  }
};
