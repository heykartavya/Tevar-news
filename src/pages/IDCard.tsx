import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ShieldCheck, Mail, Phone, MapPin, User, FileDigit, BadgeCheck, Check } from 'lucide-react';
import QRCode from 'react-qr-code';
import { TeamMember } from '../types';

export const IDCard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [member, setMember] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMember = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'team', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setMember({ id: docSnap.id, ...docSnap.data() } as TeamMember);
        }
      } catch (error) {
        console.error("Error fetching team member:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMember();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-100 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 border-4 border-red-700 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-zinc-500 font-sans">Verifying Identity...</p>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen bg-zinc-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck size={40} className="text-red-600" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-zinc-900 mb-2">Invalid ID</h1>
          <p className="text-zinc-500 mb-8 font-sans">We could not verify this digital ID card in the Tevar News database. It may be invalid or has been revoked.</p>
          <Link to="/" className="inline-block bg-zinc-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-zinc-800 transition-colors">
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-100 flex items-center justify-center p-2 sm:p-6 py-4 font-sans">
      <div className="max-w-md w-full relative">
        {/* Background Decorative Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-700/10 to-red-900/10 blur-3xl -z-10 rounded-full"></div>
        
        {/* Card Container */}
        <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden relative border border-zinc-200">
          
          {/* Header */}
          <div className="bg-zinc-950 pt-6 pb-14 px-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <ShieldCheck size={120} />
            </div>
            
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-serif font-black text-white tracking-tight">TEVAR<span className="text-red-600">.</span></h1>
                <p className="text-zinc-400 text-xs tracking-widest uppercase mt-1">Digital Identity</p>
              </div>
              {member.employeeId ? (
                <div className="bg-zinc-800 text-zinc-200 px-3 py-1 rounded-md text-xs font-bold flex items-center border border-zinc-700 tracking-wider">
                  {member.employeeId}
                </div>
              ) : (
                <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold flex items-center border border-green-500/30">
                  <ShieldCheck size={14} className="mr-1" /> Verified
                </div>
              )}
            </div>
          </div>

          {/* Profile Content (overlapping header) */}
          <div className="px-6 pb-6 relative -mt-14">
            
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="w-28 h-28 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-zinc-100">
                  {member.imageUrl ? (
                    <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-400">
                      <User size={48} />
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-white rounded-full border-2 border-white shadow-sm flex items-center justify-center" title="Verified Member">
                  <BadgeCheck size={28} className="fill-blue-500 text-white" />
                </div>
              </div>
            </div>

            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-zinc-900 leading-tight">{member.nameHi || member.name}</h2>
              <p className="text-red-700 font-semibold mt-1 uppercase tracking-wide text-sm">{member.designationHi || member.designation}</p>
              
              {/* DigiLocker style stamp */}
              <div className="mt-3 flex flex-col items-center justify-center w-full">
                 <div className="flex items-start gap-3 border-[1.5px] border-green-600/80 bg-white/50 px-3 py-2 rounded-sm max-w-[240px]">
                    <div className="mt-0.5">
                       <Check size={32} className="text-green-600 stroke-[3]" />
                    </div>
                    <div className="text-left font-sans">
                       <p className="text-xs text-green-700 font-bold tracking-wide uppercase border-b border-green-600/20 pb-0.5 mb-1">Signature Valid</p>
                       <p className="text-[8px] text-zinc-600 leading-tight">Digitally signed by TEVAR NEWS</p>
                       <p className="text-[8px] text-zinc-600 leading-tight">Date: {new Date().toLocaleDateString('en-IN')} {new Date().toLocaleTimeString('en-IN', {hour: '2-digit', minute:'2-digit'})} IST</p>
                       <p className="text-[8px] text-zinc-600 leading-tight">Reason: Verified Identity</p>
                    </div>
                 </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="space-y-2">
              {member.phone && (
                <div className="flex items-center p-2 bg-zinc-50 rounded-xl border border-zinc-100">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-zinc-500 shadow-sm mr-3">
                    <Phone size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider mb-0.5">Phone</p>
                    <p className="text-sm text-zinc-900 font-medium">{member.phone}</p>
                  </div>
                </div>
              )}

              {member.email && (
                <div className="flex items-center p-2 bg-zinc-50 rounded-xl border border-zinc-100">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-zinc-500 shadow-sm mr-3">
                    <Mail size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider mb-0.5">Email</p>
                    <p className="text-sm text-zinc-900 font-medium break-all">{member.email}</p>
                  </div>
                </div>
              )}

              {member.aadhaar && (
                <div className="flex items-center p-2 bg-zinc-50 rounded-xl border border-zinc-100">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-zinc-500 shadow-sm mr-3">
                    <FileDigit size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider mb-0.5">Govt ID</p>
                    <p className="text-sm text-zinc-900 font-medium">XXXX-XXXX-{member.aadhaar.slice(-4)}</p>
                  </div>
                </div>
              )}

              {member.address && (
                <div className="flex items-center p-2 bg-zinc-50 rounded-xl border border-zinc-100">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-zinc-500 shadow-sm mr-3">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider mb-0.5">Location</p>
                    <p className="text-xs text-zinc-900 font-medium leading-snug">{member.address}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Signature & QR Area */}
            <div className="mt-5 pt-4 border-t border-zinc-200 flex justify-between items-end">
              <div className="flex-1">
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2 font-medium">Authorized Signatory</p>
                {member.signatureUrl ? (
                  <img src={member.signatureUrl} alt="Signature" className="h-8 mix-blend-multiply opacity-80" />
                ) : (
                  <div className="h-8 border-b border-zinc-300 w-24 border-dashed"></div>
                )}
              </div>
              
              <div className="w-16 h-16 bg-white p-1 rounded-xl shadow-sm border border-zinc-200 flex items-center justify-center">
                 {/* Pseudo QR code for aesthetics */}
                 <QRCode value={window.location.href} size={54} style={{ height: "auto", maxWidth: "100%", width: "100%" }} />
              </div>
            </div>

          </div>
          
          <div className="bg-red-700 h-2 w-full"></div>
        </div>

        {/* Action buttons outside card */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-xs text-zinc-500">Scan QR code or share URL to verify identity.</p>
          <div className="flex justify-center gap-4">
             <Link to="/" className="text-sm font-medium text-zinc-600 hover:text-red-700 transition-colors">
               Return Home
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
