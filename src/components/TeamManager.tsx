import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { Trash2, Plus } from 'lucide-react';
import { TeamMember } from '../types';
import { ImageUploader } from './ImageUploader';

export const TeamManager: React.FC = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMember, setNewMember] = useState<Partial<TeamMember>>({
    name: '', designation: '', nameHi: '', designationHi: '', phone: '', email: '', employeeId: '',
    address: '', aadhaar: '', imageUrl: '', signatureUrl: ''
  });

  const fetchTeam = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'team'));
      const teamData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TeamMember));
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

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name || !newMember.designation) return;
    
    try {
      await addDoc(collection(db, 'team'), { ...newMember });
      setNewMember({
        name: '', designation: '', nameHi: '', designationHi: '', phone: '', email: '', employeeId: '',
        address: '', aadhaar: '', imageUrl: '', signatureUrl: ''
      });
      fetchTeam();
    } catch (e) {
      console.error("Error adding member:", e);
    }
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

  return (
    <div>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Add New Team Member / Employee</h3>
          <form onSubmit={handleAdd} className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">Name (English)</label>
              <input type="text" required value={newMember.name} onChange={e => setNewMember({...newMember, name: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-red-500 focus:border-red-500 sm:text-sm" />
            </div>
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">Name (Hindi)</label>
              <input type="text" value={newMember.nameHi} onChange={e => setNewMember({...newMember, nameHi: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-red-500 focus:border-red-500 sm:text-sm" />
            </div>
            
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">Designation (English)</label>
              <input type="text" required value={newMember.designation} onChange={e => setNewMember({...newMember, designation: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-red-500 focus:border-red-500 sm:text-sm" />
            </div>
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">Designation (Hindi)</label>
              <input type="text" value={newMember.designationHi} onChange={e => setNewMember({...newMember, designationHi: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-red-500 focus:border-red-500 sm:text-sm" />
            </div>

            
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">Employee ID</label>
              <input type="text" value={newMember.employeeId} onChange={e => setNewMember({...newMember, employeeId: e.target.value})} placeholder="e.g. INT001" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-red-500 focus:border-red-500 sm:text-sm" />
            </div>
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input type="text" value={newMember.phone} onChange={e => setNewMember({...newMember, phone: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-red-500 focus:border-red-500 sm:text-sm" />
            </div>
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">Email ID</label>
              <input type="email" value={newMember.email} onChange={e => setNewMember({...newMember, email: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-red-500 focus:border-red-500 sm:text-sm" />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">Aadhaar Number</label>
              <input type="text" value={newMember.aadhaar} onChange={e => setNewMember({...newMember, aadhaar: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-red-500 focus:border-red-500 sm:text-sm" />
            </div>
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">Permanent Address</label>
              <input type="text" value={newMember.address} onChange={e => setNewMember({...newMember, address: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-red-500 focus:border-red-500 sm:text-sm" />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">Photo</label>
              <ImageUploader onUploadSuccess={(url) => setNewMember({...newMember, imageUrl: url})} />
              {newMember.imageUrl && <img src={newMember.imageUrl} alt="preview" className="mt-2 h-20 rounded" />}
            </div>
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">Signature Photo</label>
              <ImageUploader onUploadSuccess={(url) => setNewMember({...newMember, signatureUrl: url})} />
              {newMember.signatureUrl && <img src={newMember.signatureUrl} alt="preview" className="mt-2 h-10 rounded" />}
            </div>

            <div className="sm:col-span-6 flex justify-end">
              <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                <Plus size={16} className="mr-2" /> Add Member
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
            {team.map((member) => (
              <li key={member.id}>
                <div className="px-4 py-4 flex items-center sm:px-6">
                  <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                    <div className="flex items-center">
                      {member.imageUrl ? (
                        <img className="h-12 w-12 rounded-full object-cover mr-4" src={member.imageUrl} alt="" />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-gray-200 mr-4"></div>
                      )}
                      <div className="truncate">
                        <p className="font-medium text-red-700 truncate">{member.name} {member.employeeId && <span className="text-gray-400 text-xs font-normal ml-2">({member.employeeId})</span>}</p>
                        <p className="font-normal text-gray-500 text-sm">{member.designation}</p>
                        <a href={`/id/${member.id}`} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline">View ID Card</a>
                      </div>
                    </div>
                  </div>
                  <div className="ml-5 flex-shrink-0">
                    <button onClick={() => handleDelete(member.id)} className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-full transition-colors">
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
