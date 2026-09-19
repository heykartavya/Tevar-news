import { collection, getDocs, getDoc, addDoc, updateDoc, deleteDoc, doc, query, orderBy, setDoc, where, limit } from 'firebase/firestore';
import { db } from './firebase';
import { Article } from '../types';

export const getArticles = async (): Promise<Article[]> => {
  const querySnapshot = await getDocs(collection(db, 'articles'));
  const articles = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Article[];

  // Robust client-side sort: newest first
  // 1. By createdAt timestamp if available
  // 2. Fallback to parsing date string (e.g. "Sep 19, 2026", "Aug 25, 2026")
  return articles.sort((a, b) => {
    const timeA = typeof a.createdAt === 'number' 
      ? a.createdAt 
      : (a.createdAt ? new Date(a.createdAt).getTime() : 0);
    const timeB = typeof b.createdAt === 'number' 
      ? b.createdAt 
      : (b.createdAt ? new Date(b.createdAt).getTime() : 0);

    if (timeA && timeB) {
      return timeB - timeA;
    }
    if (timeA && !timeB) return -1;
    if (!timeA && timeB) return 1;

    // Fallback: parse date string
    const dateA = a.date ? new Date(a.date).getTime() : 0;
    const dateB = b.date ? new Date(b.date).getTime() : 0;
    if (!isNaN(dateA) && !isNaN(dateB) && dateA !== dateB) {
      return dateB - dateA;
    }

    return (b.id || '').localeCompare(a.id || '');
  });
};

export const getArticleById = async (id: string): Promise<Article | null> => {
  const docRef = doc(db, 'articles', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Article;
  }
  return null;
};

export const getRelatedArticles = async (category: string, excludeId: string, limitCount: number = 3): Promise<Article[]> => {
  const q = query(
    collection(db, 'articles'),
    where('category', '==', category),
    limit(limitCount + 1)
  );
  const querySnapshot = await getDocs(q);
  const articles = querySnapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() } as Article))
    .filter(a => a.id !== excludeId)
    .slice(0, limitCount);
  return articles;
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
