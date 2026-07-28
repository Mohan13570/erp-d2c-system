import React, { useState, useEffect } from 'react';
import { useEmployeeAuth } from '../context/EmployeeAuthContext';
import { employeePortalService } from '../services/employeeApi';
import { User, Phone, Mail, Shield, Key, Save, CheckCircle2, AlertCircle, Building2, Briefcase, ChevronRight } from 'lucide-react';

export default function EmployeeProfile() {
  const { user } = useEmployeeAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Profile Form state
  const [personalEmail, setPersonalEmail] = useState('');
  const [primaryMobile, setPrimaryMobile] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [bio, setBio] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');

  // Password Change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passSaving, setPassSaving] = useState(false);
  const [passSuccess, setPassSuccess] = useState<string | null>(null);
  const [passError, setPassError] = useState<string | null>(null);

  // Read-only profile state from HR
  const [hrProfile, setHrProfile] = useState<any>(null);

  useEffect(() => {
    employeePortalService.getProfile()
      .then(res => {
        if (res.data.success) {
          const data = res.data.data;
          setHrProfile(data);
          setPersonalEmail(data.personalEmail || '');
          setPrimaryMobile(data.primaryMobile || '');
          setEmergencyContact(data.emergencyContact || '');
          setEmergencyPhone(data.emergencyPhone || '');
          setBio(data.bio || '');
          setProfilePhoto(data.profilePhoto || '');
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(null);
    setError(null);

    try {
      await employeePortalService.updateProfile({
        personalEmail,
        primaryMobile,
        emergencyContact,
        emergencyPhone,
        bio,
        profilePhoto
      });
      setSuccess('Profile updated successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassSaving(true);
    setPassSuccess(null);
    setPassError(null);

    try {
      await employeePortalService.changePassword(currentPassword, newPassword);
      setPassSuccess('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      setPassError(err.message || 'Failed to change password');
    } finally {
      setPassSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto animate-pulse">
        <div className="h-8 w-48 bg-slate-200 rounded-lg" />
        <div className="h-40 bg-white rounded-2xl border border-slate-200" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Breadcrumbs & Header */}
      <div>
        <nav className="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-1">
          <span>Home</span>
          <ChevronRight size={12} />
          <span>Employee Portal</span>
          <ChevronRight size={12} />
          <span className="text-blue-600 font-bold">My Profile</span>
        </nav>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Employee Profile & Settings</h1>
        <p className="text-sm text-slate-500 font-normal mt-0.5">
          Manage your personal contact details, emergency contacts, and security credentials.
        </p>
      </div>

      {/* Profile Header Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold uppercase overflow-hidden shrink-0 shadow-md">
          {profilePhoto ? (
            <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            `${user?.firstName?.[0]}${user?.lastName?.[0]}`
          )}
        </div>

        <div className="flex-1 text-center md:text-left space-y-1">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <h2 className="text-xl font-bold text-slate-900">
              {user?.firstName} {user?.lastName}
            </h2>
            <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {user?.role}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">{user?.email}</p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-600 pt-1 font-medium">
            <span className="flex items-center gap-1.5"><Briefcase size={14} className="text-blue-600" /> {hrProfile?.employmentInfo?.designation?.name || 'Logistics Specialist'}</span>
            <span className="flex items-center gap-1.5"><Building2 size={14} className="text-indigo-600" /> Operations Department</span>
            <span className="flex items-center gap-1.5"><Shield size={14} className="text-purple-600" /> Code: {user?.employeeCode}</span>
          </div>
        </div>
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Editable Contact Form (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <User size={18} className="text-blue-600" /> Personal & Emergency Contact Details
            </h2>
            <span className="text-xs text-slate-400 font-semibold">Self-Service</span>
          </div>

          {success && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 size={15} /> {success}
            </div>
          )}
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle size={15} /> {error}
            </div>
          )}

          <form onSubmit={handleProfileSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Personal Email</label>
                <input
                  type="email"
                  value={personalEmail}
                  onChange={e => setPersonalEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500 font-medium"
                  placeholder="personal@email.com"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Mobile Number</label>
                <input
                  type="text"
                  value={primaryMobile}
                  onChange={e => setPrimaryMobile(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500 font-medium"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Emergency Contact Name</label>
                <input
                  type="text"
                  value={emergencyContact}
                  onChange={e => setEmergencyContact(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500 font-medium"
                  placeholder="Relative / Spouse Name"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Emergency Phone</label>
                <input
                  type="text"
                  value={emergencyPhone}
                  onChange={e => setEmergencyPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500 font-medium"
                  placeholder="+91 98765 00000"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Profile Photo URL</label>
              <input
                type="text"
                value={profilePhoto}
                onChange={e => setProfilePhoto(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500 font-medium"
                placeholder="https://image-url.com/avatar.jpg"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Bio / Profile Notes</label>
              <textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                rows={3}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500 font-medium"
                placeholder="Short background summary..."
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all"
            >
              <Save size={15} /> {saving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>

        {/* Right Column: Change Password & Read-Only Record */}
        <div className="space-y-6">
          
          {/* Change Password Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
              <Key size={18} className="text-indigo-600" /> Security & Password
            </h2>

            {passSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 size={15} /> {passSuccess}
              </div>
            )}
            {passError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle size={15} /> {passError}
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500 font-medium"
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500 font-medium"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={passSaving}
                className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-md shadow-indigo-600/20"
              >
                {passSaving ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>

          {/* Read-Only HR Master Data */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-3">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-100">
              Read-Only HR System Record
            </h2>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Employee Code</span>
                <span className="text-slate-900 font-mono font-bold">{user?.employeeCode}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Official Email</span>
                <span className="text-slate-900 font-bold">{user?.email}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Status</span>
                <span className="text-emerald-600 font-bold">Active</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500 font-medium">Joining Date</span>
                <span className="text-slate-900 font-bold">2026-01-15</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
