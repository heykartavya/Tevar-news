import { Article } from './types';

export const CATEGORIES = ['All', 'World', 'Politics', 'Business', 'Technology', 'Culture', 'Science'];

export const MOCK_ARTICLES: Article[] = [
  {
    id: '1',
    title: 'Global Markets Rally as Tech Sector Shows Unexpected Resilience',
    excerpt: 'Despite early quarter concerns, major tech conglomerates report record-breaking earnings, driving global market indices to new heights.',
    category: 'Business',
    author: 'Sarah Jenkins',
    date: 'Oct 24, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=1000',
    readTime: '5 min read',
    isTrending: true
  },
  {
    id: '2',
    title: 'The Future of Urban Architecture: Vertical Forests',
    excerpt: 'Cities around the world are adopting a new standard in sustainable living, integrating massive vertical forests into metropolitan skylines.',
    category: 'Science',
    author: 'David Chen',
    date: 'Oct 23, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1000',
    readTime: '8 min read',
    isTrending: true
  },
  {
    id: '3',
    title: 'Diplomatic Breakthrough Reached in Geneva Accords',
    excerpt: 'After weeks of tense negotiations, participating nations have finally signed the comprehensive trade and security agreement.',
    category: 'World',
    author: 'Elena Rostova',
    date: 'Oct 24, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1529107336415-4dc8c99a8b66?auto=format&fit=crop&q=80&w=1000',
    readTime: '6 min read'
  },
  {
    id: '4',
    title: 'Quantum Computing Milestones Reached Ahead of Schedule',
    excerpt: 'Researchers announce stable qubits functioning at room temperature, a breakthrough that could accelerate quantum adoption by a decade.',
    category: 'Technology',
    author: 'Dr. Alan Turing',
    date: 'Oct 22, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=1000',
    readTime: '4 min read',
    isTrending: true
  },
  {
    id: '5',
    title: 'Modern Art Auction Sets New Records in London',
    excerpt: 'A previously undiscovered collection from the late 20th century fetched unprecedented sums at Sotheby\'s yesterday evening.',
    category: 'Culture',
    author: 'Isabella Vance',
    date: 'Oct 21, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?auto=format&fit=crop&q=80&w=1000',
    readTime: '3 min read'
  },
  {
    id: '6',
    title: 'New Policy Shifts Aim to Revitalize Local Manufacturing',
    excerpt: 'The latest legislative package introduces significant incentives for domestic producers, aiming to reshape supply chain dependencies.',
    category: 'Politics',
    author: 'Marcus Wright',
    date: 'Oct 24, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1507208773393-40d9fc670acf?auto=format&fit=crop&q=80&w=1000',
    readTime: '7 min read',
    isTrending: true
  },
  {
    id: '7',
    title: 'Electric Vehicle Adoption Reaches Tipping Point in Europe',
    excerpt: 'Sales data confirms that EVs now outpace traditional combustion engines across five major European economies.',
    category: 'Business',
    author: 'Thomas GÃ¶tze',
    date: 'Oct 20, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=1000',
    readTime: '5 min read'
  }
];
