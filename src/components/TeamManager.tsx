import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Trash2, Plus, Edit2, ArrowUp, ArrowDown, X } from 'lucide-react';
import { TeamMember } from '../types';
import { ImageUploader } from './ImageUploader';

export const TeamManager: React.FC = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [memberForm, setMemberForm] = useState<Partial<TeamMember>>({
    name: '', designation: '', nameHi: '', designationHi: '', phone: '', email: '', employeeId: '',
    address: '', aadhaar: '', imageUrl: '', signatureUrl: ''
  });

  const fetchTeam = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'team'));
      const teamData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TeamMember));
      // Sort by order field (default to 999 if not set)
      teamData.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
      setTeam(teamData);
    } catch (e) {
      console.error("Error fetching team:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberForm.name || !memberForm.designation) return;
    
    try {
      if (editingId) {
        await updateDoc(doc(db, 'team', editingId), { ...memberForm });
      } else {
        const newOrder = team.length > 0 ? Math.max(...team.map(m => m.order ?? 0)) + 1 : 1;
        await addDoc(collection(db, 'team'), { ...memberForm, order: newOrder });
      }
      resetForm();
      fetchTeam();
    } catch (e) {
      console.error("Error saving member:", e);
    }
  };

  const handleEdit = (member: TeamMember) => {
    setEditingId(member.id);
    setMemberForm({ ...member });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this team member?')) {
      try {
        await deleteDoc(doc(db, 'team', id));
        fetchTeam();
      } catch (e) {
        console.error("Error deleting member:", e);
      }
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setMemberForm({
      name: '', designation: '', nameHi: '', designationHi: '', phone: '', email: '', employeeId: '',
      address: '', aadhaar: '', imageUrl: '', signatureUrl: ''
    });
  };

  const moveMember = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === team.length - 1) return;

    const newTeam = [...team];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap
    const temp = newTeam[index];
    newTeam[index] = newTeam[targetIndex];
    newTeam[targetIndex] = temp;

    // Update order locally
    newTeam.forEach((member, i) => {
      member.order = i + 1;
    });
    setTeam(newTeam);

    // Save orders to db
    try {
      for (const member of newTeam) {
        await updateDoc(doc(db, 'team', member.id), { order: member.order });
      }
    } catch (e) {
      console.error("Error updating order:", e);
    }
  };

  return (
    <div>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {editingId ? 'Edit Team Member / Employee' : 'Add New Team Member / Employee'}
            </h3>
            {editingId && (
              <button onClick={resetForm} className="text-sm text-gray-500 hover:text-gray-900 flex items-center">
                <X size={16} className="mr-1" /> Cancel Edit
              </button>
            )}
          </div>
          
          <form onSubmit={handleSave} className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">Name (English)</label>
              <input type="text" required value={memberForm.name} onChange={e => setMemberForm({...memberForm, name: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-red-500 focus:border-red-500 sm:text-sm" />
            </div>
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">Name (Hindi)</label>
              <input type="text" value={memberForm.nameHi || ''} onChange={e => setMemberForm({...memberForm, nameHi: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-red-500 focus:border-red-500 sm:text-sm" />
            </div>
            
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">Designation (English)</label>
              <input type="text" required value={memberForm.designation} onChange={e => setMemberForm({...memberForm, designation: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-red-500 focus:border-red-500 sm:text-sm" />
            </div>
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">Designation (Hindi)</label>
              <input type="text" value={memberForm.designationHi || ''} onChange={e => setMemberForm({...memberForm, designationHi: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-red-500 focus:border-red-500 sm:text-sm" />
            </div>
            
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">Employee ID</label>
              <input type="text" value={memberForm.employeeId || ''} onChange={e => setMemberForm({...memberForm, employeeId: e.target.value})} placeholder="e.g. INT001" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-red-500 focus:border-red-500 sm:text-sm" />
            </div>
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input type="text" value={memberForm.phone || ''} onChange={e => setMemberForm({...memberForm, phone: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-red-500 focus:border-red-500 sm:text-sm" />
            </div>
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">Email ID</label>
              <input type="email" value={memberForm.email || ''} onChange={e => setMemberForm({...memberForm, email: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-red-500 focus:border-red-500 sm:text-sm" />
            </div>
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">Aadhaar Number</label>
              <input type="text" value={memberForm.aadhaar || ''} onChange={e => setMemberForm({...memberForm, aadhaar: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-red-500 focus:border-red-500 sm:text-sm" />
            </div>
            <div className="sm:col-span-6">
              <label className="block text-sm font-medium text-gray-700">Permanent Address</label>
              <input type="text" value={memberForm.address || ''} onChange={e => setMemberForm({...memberForm, address: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-red-500 focus:border-red-500 sm:text-sm" />
            </div>
            
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">Photo</label>
              <ImageUploader onUploadSuccess={(url) => setMemberForm({...memberForm, imageUrl: url})} />
              {memberForm.imageUrl && <img src={memberForm.imageUrl} alt="preview" className="mt-2 h-20 rounded" />}
            </div>
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">Signature Photo</label>
              <ImageUploader onUploadSuccess={(url) => setMemberForm({...memberForm, signatureUrl: url})} />
              {memberForm.signatureUrl && <img src={memberForm.signatureUrl} alt="preview" className="mt-2 h-10 rounded" />}
            </div>
            
            <div className="sm:col-span-6 flex justify-end">
              <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                {editingId ? (
                  <><Edit2 size={16} className="mr-2" /> Update Member</>
                ) : (
                  <><Plus size={16} className="mr-2" /> Add Member</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading team...</div>
        ) : team.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No team members found in database.</div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {team.map((member, index) => (
              <li key={member.id}>
                <div className="px-4 py-4 flex items-center sm:px-6">
                  <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                    <div className="flex items-center">
                      <div className="flex flex-col items-center mr-4">
                        <button 
                          onClick={() => moveMember(index, 'up')} 
                          disabled={index === 0}
                          className="p-1 text-gray-400 hover:text-gray-900 disabled:opacity-30 transition-colors"
                        >
                          <ArrowUp size={16} />
                        </button>
                        <button 
                          onClick={() => moveMember(index, 'down')}
                          disabled={index === team.length - 1}
                          className="p-1 text-gray-400 hover:text-gray-900 disabled:opacity-30 transition-colors"
                        >
                          <ArrowDown size={16} />
                        </button>
                      </div>
                      
                      {member.imageUrl ? (
                        <img className="h-12 w-12 rounded-full object-cover mr-4" src={member.imageUrl} alt="" />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-gray-200 mr-4"></div>
                      )}
                      <div className="truncate">
                        <p className="font-medium text-red-700 truncate">{member.name} {member.employeeId && <span className="text-gray-400 text-xs font-normal ml-2">({member.employeeId})</span>}</p>
                        <p className="font-normal text-gray-500 text-sm">{member.designation}</p>
                        <a href={`/id/${member.id}`} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline mt-1 block">View ID Card</a>
                      </div>
                    </div>
                  </div>
                  <div className="ml-5 flex-shrink-0 flex space-x-2">
                    <button onClick={() => handleEdit(member)} className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-full transition-colors" title="Edit Member">
                      <Edit2 size={20} />
                    </button>
                    <button onClick={() => handleDelete(member.id)} className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-full transition-colors" title="Delete Member">
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
  );
};
