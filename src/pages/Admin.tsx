import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { getArticles, addArticle, deleteArticle, seedDatabase } from '../lib/db';
import { Article } from '../types';
import { CATEGORIES, MOCK_ARTICLES } from '../data';
import { Trash2, Plus, LogOut, Database, MoveUp, MoveDown } from 'lucide-react';
import { BlockEditor } from '../components/BlockEditor';

export const Admin: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [newArticle, setNewArticle] = useState<Partial<Article>>({
    title: '', excerpt: '', content: '', blocks: [], category: 'World', author: '', date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), readTime: '5 min read', isTrending: false
  });
  const [translating, setTranslating] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchArticles();
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const data = await getArticles();
      setArticles(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate');
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleAddArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    setTranslating(true);
    try {
      // Publisher types in Hindi, bypass translation
      const blocks = (newArticle.blocks || []).map((block) => {
        return {
          ...block,
          contentEn: block.content,
          contentHi: block.content
        };
      });

      const firstImageBlock = blocks.find(b => b.type === 'image' && b.content);
      const imageUrl = firstImageBlock ? firstImageBlock.content : 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&q=80&w=1000'; // Default news fallback image

      const rawArticle = {
        ...newArticle,
        blocks: blocks,
        imageUrl,
        titleEn: newArticle.title,
        titleHi: newArticle.title,
        excerptEn: newArticle.excerpt,
        excerptHi: newArticle.excerpt,
        contentEn: newArticle.content || '',
        contentHi: newArticle.content || '',
        originalLanguage: 'hi'
      };
      
      // Strip undefined values to prevent Firestore errors
      const articleToSave = Object.fromEntries(
        Object.entries(rawArticle).filter(([_, v]) => v !== undefined)
      );

      await addArticle(articleToSave as Omit<Article, 'id'>);
      setNewArticle({
        title: '', excerpt: '', content: '', blocks: [], category: 'World', author: '', date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), readTime: '5 min read', isTrending: false
      });
      fetchArticles();
    } catch (err) {
      console.error(err);
      alert(`Error adding article: ${err instanceof Error ? err.message : JSON.stringify(err)}`);
    } finally {
      setTranslating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await deleteArticle(id);
        fetchArticles();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSeed = async () => {
    if (window.confirm('This will add the mock articles to the database. Continue?')) {
      try {
        await seedDatabase(MOCK_ARTICLES);
        fetchArticles();
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-serif font-black text-gray-900">
            TEVAR<span className="text-red-700">.</span> Admin
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isLogin ? 'Sign in to your account' : 'Create a new admin account'}
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleAuth}>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email address</label>
                <div className="mt-1">
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <div className="mt-1">
                  <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm" />
                </div>
              </div>

              {error && <div className="text-red-600 text-sm">{error}</div>}

              <div>
                <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                  {isLogin ? 'Sign in' : 'Sign up'}
                </button>
              </div>
            </form>
            <div className="mt-6 text-center">
              <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-red-600 hover:text-red-500">
                {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-serif font-black text-gray-900">
            TEVAR<span className="text-red-700">.</span> Admin
          </h1>
          <button onClick={handleLogout} className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900">
            <LogOut size={16} className="mr-2" /> Logout
          </button>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Manage Articles</h2>
            <button onClick={handleSeed} className="flex items-center text-sm px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
              <Database size={16} className="mr-2" /> Seed Database
            </button>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Publish New Article</h3>
              <form onSubmit={handleAddArticle} className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input type="text" required value={newArticle.title} onChange={e => setNewArticle({...newArticle, title: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm" />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select required value={newArticle.category} onChange={e => setNewArticle({...newArticle, category: e.target.value})} className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm">
                    {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="sm:col-span-6">
                  <label className="block text-sm font-medium text-gray-700">Excerpt</label>
                  <textarea required rows={3} value={newArticle.excerpt} onChange={e => setNewArticle({...newArticle, excerpt: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm" />
                </div>
                
                <div className="sm:col-span-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content Blocks</label>
                  <BlockEditor blocks={newArticle.blocks || []} onChange={(blocks) => setNewArticle({...newArticle, blocks})} />
                </div>
                
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Author</label>
                  <input type="text" required value={newArticle.author} onChange={e => setNewArticle({...newArticle, author: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm" />
                </div>

                <div className="sm:col-span-2">
                  <div className="flex items-center h-full pt-6">
                    <input id="trending" type="checkbox" checked={newArticle.isTrending} onChange={e => setNewArticle({...newArticle, isTrending: e.target.checked})} className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded" />
                    <label htmlFor="trending" className="ml-2 block text-sm text-gray-900">
                      Trending Article
                    </label>
                  </div>
                </div>

                <div className="sm:col-span-6 flex justify-end">
                  <button type="submit" disabled={translating} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50">
                    <Plus size={16} className="mr-2" /> {translating ? 'Translating & Publishing...' : 'Publish Article'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading articles...</div>
            ) : articles.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No articles found in database.</div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {articles.map((article) => (
                  <li key={article.id}>
                    <div className="px-4 py-4 flex items-center sm:px-6">
                      <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                        <div className="truncate">
                          <div className="flex text-sm">
                            <p className="font-medium text-red-700 truncate">{article.title}</p>
                            <p className="ml-1 flex-shrink-0 font-normal text-gray-500">
                              in {article.category}
                            </p>
                          </div>
                          <div className="mt-2 flex">
                            <div className="flex items-center text-sm text-gray-500">
                              <span className="truncate">{article.date} • By {article.author}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="ml-5 flex-shrink-0">
                        <button onClick={() => handleDelete(article.id)} className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-full transition-colors">
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};
