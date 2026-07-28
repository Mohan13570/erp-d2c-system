import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Shield, 
  MapPin, 
  Calendar,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function MyProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/employees/${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        } else {
          // Fallback mock using session user
          setProfile({
            firstName: user.firstName,
            lastName: user.lastName,
            officialEmail: user.email,
            employeeCode: 'EMP-00123',
            designation: 'Operations Specialist',
            department: 'Logistics Operations',
            joinedDate: '2025-01-15'
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-12">
        <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-6">
        <div className="w-24 h-24 bg-teal-500/10 text-teal-600 rounded-full flex items-center justify-center text-3xl font-black uppercase">
          {profile?.firstName?.[0]}{profile?.lastName?.[0]}
        </div>
        <div className="text-center md:text-left flex-1 space-y-1">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            {profile?.firstName} {profile?.lastName}
          </h1>
          <p className="text-teal-600 font-bold text-sm uppercase tracking-wider">{profile?.designation}</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs text-slate-400 font-semibold mt-2">
            <span className="flex items-center gap-1"><Briefcase size={14} /> {profile?.department}</span>
            <span className="flex items-center gap-1"><MapPin size={14} /> Mumbai, India</span>
          </div>
        </div>
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Employee ID</p>
          <p className="text-lg font-mono font-black text-slate-800 mt-1">{profile?.employeeCode}</p>
        </div>
      </div>

      {/* Information Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Personal Details */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-4">
            <User className="text-teal-600" size={20} /> Personal Information
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">First Name</p>
              <p className="text-sm font-semibold text-slate-850 mt-1">{profile?.firstName}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Last Name</p>
              <p className="text-sm font-semibold text-slate-850 mt-1">{profile?.lastName}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gender</p>
              <p className="text-sm font-semibold text-slate-850 mt-1">Male</p>
            </div>
          </div>
        </div>

        {/* Work / Employment Details */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-4">
            <Shield className="text-teal-600" size={20} /> Employment Details
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Official Email</p>
              <p className="text-sm font-semibold text-slate-850 mt-1 flex items-center gap-1.5">
                <Mail size={14} className="text-slate-400" /> {profile?.officialEmail}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Primary Designation</p>
              <p className="text-sm font-semibold text-slate-855 mt-1">{profile?.designation}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Date of Joining</p>
              <p className="text-sm font-semibold text-slate-850 mt-1 flex items-center gap-1.5">
                <Calendar size={14} className="text-slate-400" /> {profile?.joinedDate}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
