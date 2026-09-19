import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { TeamMember } from '../types';
import { getArticles, addArticle, updateArticle, deleteArticle, seedDatabase } from '../lib/db';
import { Article } from '../types';
import { CATEGORIES, MOCK_ARTICLES, TEAM_MEMBERS } from '../data';
import { Trash2, Edit, Plus, LogOut, Database, MoveUp, MoveDown, Users, FileText, BellRing, Send } from 'lucide-react';
import { TeamManager } from '../components/TeamManager';
import { BlockEditor } from '../components/BlockEditor';
import { AdminListSkeleton } from '../components/ArticleSkeleton';
import { getISTDateTime, getYouTubeId } from '../lib/utils';

const getInitialArticleState = (): Partial<Article> => ({
  title: '',
  excerpt: '',
  content: '',
  blocks: [],
  category: 'World',
  author: '',
  date: new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', month: 'short', day: 'numeric', year: 'numeric' }),
  readTime: '5 min read',
  isTrending: false
});

export const Admin: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [activeTab, setActiveTab] = useState<'articles' | 'team'>('articles');
  
  const [articles, setArticles] = useState<Article[]>([]);
  const [dbTeam, setDbTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscribersCount, setSubscribersCount] = useState<number>(0);
  
  const [editArticleId, setEditArticleId] = useState<string | null>(null);
  const [newArticle, setNewArticle] = useState<Partial<Article>>(getInitialArticleState());
  const [translating, setTranslating] = useState(false);
  const [sendPushAlert, setSendPushAlert] = useState(false);
  const [sendingAlertId, setSendingAlertId] = useState<string | null>(null);

  const allTeam = [...TEAM_MEMBERS];
  dbTeam.forEach(member => {
    if (!allTeam.some(m => m.name === member.name)) {
      allTeam.push(member);
    }
  });

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/notifications/stats');
      const data = await res.json();
      if (typeof data.subscribersCount === 'number') {
        setSubscribersCount(data.subscribersCount);
      }
    } catch (e) {}
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchArticles();
        fetchTeam();
        fetchStats();
      }
    });
    return () => unsubscribe();
  }, []);


  
  const fetchTeam = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'team'));
      const teamData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TeamMember));
      setDbTeam(teamData);
    } catch (e) {
      console.error("Error fetching team:", e);
    }
  };

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
      await signInWithEmailAndPassword(auth, email, password);
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
      const trimmedTitle = (newArticle.title || '').trim();
      const trimmedExcerpt = (newArticle.excerpt || '').trim();

      const blocks = (newArticle.blocks || []).map((block) => {
        const blockContent = block.content || '';
        return {
          ...block,
          content: blockContent,
          contentEn: blockContent,
          contentHi: blockContent
        };
      });

      const firstImageBlock = blocks.find(b => b.type === 'image' && b.content);
      const firstYtBlock = blocks.find(b => b.type === 'youtube' && b.content);
      const ytId = firstYtBlock?.content ? getYouTubeId(firstYtBlock.content) : null;
      const ytThumbnail = ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : null;
      const imageUrl = firstImageBlock ? firstImageBlock.content : (ytThumbnail || newArticle.imageUrl || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&q=80&w=1000');
      
      const istTime = getISTDateTime();
      
      const textBlocksContent = blocks
        .filter(b => b.type === 'text' && b.content)
        .map(b => b.content)
        .join('\n');
      const resolvedContent = textBlocksContent || newArticle.content || '';

      const rawArticle: Record<string, any> = {
        ...newArticle,
        title: trimmedTitle,
        titleHi: trimmedTitle,
        titleEn: trimmedTitle,
        excerpt: trimmedExcerpt,
        excerptHi: trimmedExcerpt,
        excerptEn: trimmedExcerpt,
        content: resolvedContent,
        contentHi: resolvedContent,
        contentEn: resolvedContent,
        blocks: blocks,
        imageUrl,
        originalLanguage: newArticle.originalLanguage || 'hi'
      };
      
      if (editArticleId) {
        rawArticle.updatedAt = istTime;
      } else {
        if (!rawArticle.date) {
          rawArticle.date = new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', month: 'short', day: 'numeric', year: 'numeric' });
        }
      }

      const articleToSave = Object.fromEntries(
        Object.entries(rawArticle).filter(([_, v]) => v !== undefined)
      );

      let savedId = editArticleId;
      if (editArticleId) {
        await updateArticle(editArticleId, articleToSave);
        setEditArticleId(null);
      } else {
        savedId = await addArticle(articleToSave as Omit<Article, 'id'>);
      }


      // If Push Alert was checked, dispatch breaking news push notification
      if (sendPushAlert) {
        try {
          const alertPayload = {
            title: `🚨 ${articleToSave.title}`,
            body: articleToSave.excerpt || 'ताज़ा ब्रेकिंग खबर पढ़ें',
            imageUrl: articleToSave.imageUrl || '',
            articleId: savedId || '',
            url: savedId ? `/article/${savedId}` : '/',
            createdAt: new Date().toISOString()
          };

          // 1. Save directly to Firestore breaking_alerts so active readers receive it instantly
          try {
            await addDoc(collection(db, 'breaking_alerts'), alertPayload);
          } catch (fsErr) {
            console.warn('Firestore direct alert note:', fsErr);
          }

          // 2. Dispatch via backend push API (handles FCM & Web Push subscriptions)
          try {
            const res = await fetch('/api/notifications/send-breaking-news', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(alertPayload)
            });
            const ct = res.headers.get('content-type') || '';
            if (res.ok && ct.includes('application/json')) {
              await res.json();
            }
          } catch (apiErr) {
            console.warn('Backend push API notice:', apiErr);
          }

          fetchStats();
        } catch (pushErr) {
          console.warn('Push alert dispatch error:', pushErr);
        }
      }
      
      setSendPushAlert(false);
      setNewArticle(getInitialArticleState());
      await fetchArticles();

    } catch (err) {
      console.error(err);
      alert(`Error saving article: ${err instanceof Error ? err.message : JSON.stringify(err)}`);
    } finally {
      setTranslating(false);
    }
  };

  const handleSendPushAlert = async (article: Article) => {
    if (!window.confirm(`क्या आप "${article.title}" के लिए सभी सब्सक्राइबर्स को ब्रेकिंग न्यूज़ पुश नोटिफिकेशन भेजना चाहते हैं?\n(Send breaking news push alert to all subscribers?)`)) {
      return;
    }

    setSendingAlertId(article.id);
    try {
      const alertPayload = {
        title: `🚨 ${article.title}`,
        body: article.excerpt || 'ताज़ा ब्रेकिंग खबर पढ़ें',
        imageUrl: article.imageUrl || '',
        articleId: article.id,
        url: `/article/${article.id}`,
        createdAt: new Date().toISOString()
      };

      // 1. Save directly to Firestore breaking_alerts so all active readers receive it in real-time
      let directSaved = false;
      try {
        await addDoc(collection(db, 'breaking_alerts'), alertPayload);
        directSaved = true;
      } catch (fsErr) {
        console.warn('Direct Firestore save note:', fsErr);
      }

      // 2. Dispatch via backend push API for device push notifications (FCM)
      let backendSuccess = false;
      let totalSubscribers = subscribersCount;
      let serverError = '';

      try {
        const res = await fetch('/api/notifications/send-breaking-news', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(alertPayload)
        });

        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const data = await res.json();
          if (data.success) {
            backendSuccess = true;
            if (typeof data.totalSubscribers === 'number') {
              totalSubscribers = data.totalSubscribers;
            }
          } else {
            serverError = data.error || 'Server error';
          }
        } else {
          // If server returned HTML (e.g. static hosting proxy, 502, or offline)
          const text = await res.text();
          console.warn('Backend API returned non-JSON:', res.status, text.slice(0, 100));
        }
      } catch (apiErr: any) {
        console.warn('API call notice:', apiErr.message);
      }

      if (directSaved || backendSuccess) {
        alert(`सफलतापूर्वक भेजा गया! ब्रेकिंग अलर्ट लाइव जारी कर दिया गया है।${totalSubscribers > 0 ? ` (कुल सब्सक्राइबर्स: ${totalSubscribers})` : ''}`);
        fetchStats();
      } else {
        alert(`अलर्ट भेजने में समस्या: ${serverError || 'कृपया कनेक्शन जांचें'}`);
      }
    } catch (err: any) {
      alert(`अलर्ट भेजने में त्रुटि: ${err.message}`);
    } finally {
      setSendingAlertId(null);
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
                  'Sign in'
                </button>
              </div>
            </form>
            
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
          
          <div className="flex justify-center space-x-4 mb-8 border-b border-gray-200 pb-4">
            <button 
              onClick={() => setActiveTab('articles')} 
              className={`flex items-center px-4 py-2 font-medium text-sm rounded-md transition-colors ${activeTab === 'articles' ? 'bg-red-700 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <FileText size={18} className="mr-2" /> Manage Articles
            </button>
            <button 
              onClick={() => setActiveTab('team')} 
              className={`flex items-center px-4 py-2 font-medium text-sm rounded-md transition-colors ${activeTab === 'team' ? 'bg-red-700 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <Users size={18} className="mr-2" /> Manage Team
            </button>
          </div>

          {activeTab === 'team' ? (
            <TeamManager />
          ) : (
            <>
              <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                <div className="flex items-center space-x-3">
                  <h2 className="text-xl font-semibold text-gray-900">Manage Articles</h2>
                  <div className="flex items-center space-x-1.5 bg-red-50 text-red-800 px-3 py-1 rounded-full border border-red-200 text-xs font-semibold">
                    <BellRing size={13} className="text-red-600" />
                    <span>Push Subscribers: <strong>{subscribersCount}</strong></span>
                  </div>
                </div>
                <button onClick={handleSeed} className="flex items-center text-sm px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                  <Database size={16} className="mr-2" /> Seed Database
                </button>
              </div>


              <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">{editArticleId ? "Edit Article" : "Publish New Article"}</h3>
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
                      <select required value={newArticle.author} onChange={e => setNewArticle({...newArticle, author: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm">
                        <option value="" disabled>Select Author</option>
                        {allTeam.map(member => (
                          <option key={member.id} value={member.name}>
                            {member.name} - {member.designation}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <div className="flex items-center h-full pt-6">
                        <input id="trending" type="checkbox" checked={newArticle.isTrending} onChange={e => setNewArticle({...newArticle, isTrending: e.target.checked})} className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded" />
                        <label htmlFor="trending" className="ml-2 block text-sm text-gray-900">
                          Trending Article
                        </label>
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <div className="flex items-center h-full pt-6">
                        <input 
                          id="pushAlert" 
                          type="checkbox" 
                          checked={sendPushAlert} 
                          onChange={e => setSendPushAlert(e.target.checked)} 
                          className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded" 
                        />
                        <label htmlFor="pushAlert" className="ml-2 block text-sm font-semibold text-red-700 flex items-center gap-1">
                          <BellRing size={15} />
                          <span>Push Breaking Alert</span>
                        </label>
                      </div>
                    </div>

                    <div className="sm:col-span-6 flex justify-end">

                      {editArticleId && (
                        <button type="button" onClick={() => { setEditArticleId(null); setNewArticle(getInitialArticleState()); }} className="mr-4 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                          Cancel
                        </button>
                      )}
                      <button type="submit" disabled={translating} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50">
                        <Plus size={16} className="mr-2" /> {translating ? (editArticleId ? "Updating..." : "Translating & Publishing...") : (editArticleId ? "Update Article" : "Publish Article")}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                {loading ? (
                  <AdminListSkeleton />
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
                                <div className="flex items-center text-sm text-gray-500 gap-2">
                                  <span>{article.date} • By {article.author}</span>
                                  {article.updatedAt && (
                                    <span className="text-xs bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200 font-medium">
                                      Updated: {article.updatedAt}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="ml-5 flex-shrink-0 flex items-center space-x-2">
                            <button 
                              onClick={() => handleSendPushAlert(article)}
                              disabled={sendingAlertId === article.id}
                              title="Send Breaking News Push Notification"
                              className="p-2 text-amber-600 hover:text-amber-900 hover:bg-amber-50 rounded-full transition-colors disabled:opacity-50 cursor-pointer"
                            >
                              <BellRing size={20} className={sendingAlertId === article.id ? 'animate-bounce text-red-600' : ''} />
                            </button>
                            <button onClick={() => {
                              setEditArticleId(article.id);
                              setNewArticle(article);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }} className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-full transition-colors">
                              <Edit size={20} />
                            </button>
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
            </>
          )}
        </div>
      </main>
    </div>
  );
};
