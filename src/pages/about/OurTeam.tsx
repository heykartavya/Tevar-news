import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../lib/LanguageContext';
import { TEAM_MEMBERS } from '../../data';
import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { TeamMember } from '../../types';

export const OurTeam: React.FC = () => {
  const { t } = useLanguage();
  const [dbTeam, setDbTeam] = useState<TeamMember[]>([]);
  
  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'team'));
        const teamData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TeamMember));
        // Sort by order field
        teamData.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
        setDbTeam(teamData);
      } catch (e) {
        console.error("Error fetching team:", e);
      }
    };
    fetchTeam();
  }, []);

  const allTeam = [...dbTeam];
  const hardcodedTeam = TEAM_MEMBERS.filter(m => m.name !== 'Desk');
  
  hardcodedTeam.forEach(member => {
    if (!allTeam.some(m => m.name === member.name)) {
      allTeam.push(member);
    }
  });

  return (
    <div className="max-w-3xl">
      <h2 className="text-4xl font-serif font-black text-gray-900 mb-6">{t('about.ourTeam')}</h2>
      
      <div className="prose prose-lg prose-red max-w-none text-gray-800">
        <p className="mb-8">
          {t('language') === 'hi' || t('language') === 'hinglish' 
            ? 'टेवर न्यूज़ में, हमारा मानना है कि हमारी पत्रकारिता उतनी ही अच्छी है जितने इसके पीछे के लोग हैं। हमारी टीम से मिलें:'
            : 'At Tevar News, we believe our journalism is only as good as the people behind it. Meet our team:'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 not-prose">
          {allTeam.map((member) => (
            <Link to={`/id/${member.id}`} key={member.id} className="bg-white border border-gray-100 shadow-sm rounded-lg overflow-hidden flex flex-col hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 block group">
              {member.imageUrl && (
                <div className="w-full bg-gray-50 flex justify-center items-center border-b border-gray-100">
                  <img 
                    src={member.imageUrl} 
                    alt={member.name} 
                    className="w-full h-auto max-h-[400px] object-contain object-top"
                  />
                </div>
              )}
              <div className="p-5 flex-1 flex flex-col">
                <h4 className="text-xl font-bold font-serif text-gray-900 mb-1">{member.nameHi || member.name}</h4>
                <p className="text-red-700 font-sans font-bold text-sm tracking-wider uppercase mb-4">{member.designationHi || member.designation}</p>
                <div className="font-sans text-sm text-gray-600 space-y-2 mt-auto">
                  {member.phone && (
                    <p className="flex items-center">
                      <span className="font-semibold mr-2 w-12 text-gray-900">Phone:</span> 
                      <span className="hover:text-red-700 transition-colors">{member.phone}</span>
                    </p>
                  )}
                  {member.email && (
                    <p className="flex items-center">
                      <span className="font-semibold mr-2 w-12 text-gray-900">Email:</span> 
                      <span className="hover:text-red-700 transition-colors break-all">{member.email}</span>
                    </p>
                  )}
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm text-red-700 font-medium group-hover:text-red-800">
                  <span>View Digital ID</span>
                  <span className="transform transition-transform group-hover:translate-x-1">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
