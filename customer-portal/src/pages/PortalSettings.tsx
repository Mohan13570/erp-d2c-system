import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User, Shield, Lock, Bell, Camera, Trash2, CheckCircle2,
  AlertTriangle, Mail, Phone, Package, LogOut, Key, ArrowRight,
  ShieldCheck, Loader2, Sparkles, X, RefreshCw
} from 'lucide-react';

import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import PortalNavbar from '../components/PortalNavbar';

const API_BASE = '/api/customer-portal';

export default function PortalSettings() {
  const { user, updateUser, logout } = useCustomerAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const customerId = user?.customerId || 'cust_901';

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [savingNotifications, setSavingNotifications] = useState(false);
  const [requestingEmailChange, setRequestingEmailChange] = useState(false);
  const [deactivatingAccount, setDeactivatingAccount] = useState(false);

  // Active Tab: 'profile' | 'security' | 'notifications' | 'account'
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'account'>('profile');

  // Customer State
  const [customerData, setCustomerData] = useState<any>({
    displayName: user?.displayName || 'Acme Corporation Admin',
    email: user?.email || 'admin@acme.com',
    phone: user?.phone || '+1 (555) 234-5678',
    profilePhoto: user?.profilePhoto || null,
    pendingEmail: null,
    notifications: {
      emailShipmentUpdates: true,
      emailBillingAlerts: true,
      emailClaimsReturns: false,
      smsShipmentUpdates: true,
      smsBillingAlerts: false,
      smsClaimsReturns: true,
    },
    twoFactorEnabled: false,
    accountStatus: 'ACTIVE'
  });

  // Profile Form State
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [phone, setPhone] = useState(user?.phone || '');

  // Email Change Form State
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailCurrentPassword, setEmailCurrentPassword] = useState('');
  const [newTargetEmail, setNewTargetEmail] = useState('');
  const [emailChangeNotice, setEmailChangeNotice] = useState<any>(null);

  // Password Change Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Notification Preferences State
  const [notifications, setNotifications] = useState({
    emailShipmentUpdates: true,
    emailBillingAlerts: true,
    emailClaimsReturns: false,
    smsShipmentUpdates: true,
    smsBillingAlerts: false,
    smsClaimsReturns: true,
  });

  // Account Deactivation Modal State
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [deactivatePassword, setDeactivatePassword] = useState('');
  const [deactivateReason, setDeactivateReason] = useState('');

  // Feedback Banners
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showMessage = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 5000);
  };

  // Fetch Settings on Mount
  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/settings?customerId=${customerId}`, {
        headers: { 'x-customer-id': customerId }
      });
      const json = await res.json();
      if (json.success) {
        setCustomerData(json.data);
        setDisplayName(json.data.displayName || '');
        setPhone(json.data.phone || '');
        if (json.data.notifications) setNotifications(json.data.notifications);
        updateUser({
          displayName: json.data.displayName,
          email: json.data.email,
          phone: json.data.phone,
          profilePhoto: json.data.profilePhoto
        });
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [customerId]);

  // Handler: Save Profile Details
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await fetch(`${API_BASE}/settings/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-customer-id': customerId
        },
        body: JSON.stringify({ displayName, phone, customerId })
      });
      const json = await res.json();
      if (json.success) {
        setCustomerData(json.data);
        updateUser({ displayName: json.data.displayName, phone: json.data.phone });
        showMessage('success', 'Profile information updated successfully.');
      } else {
        showMessage('error', json.error || 'Failed to update profile.');
      }
    } catch (err: any) {
      showMessage('error', err.message || 'Error saving profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  // Handler: Profile Photo Upload / Preview
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showMessage('error', 'Image size must be under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Photo = reader.result as string;
      try {
        const res = await fetch(`${API_BASE}/settings/photo`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-customer-id': customerId
          },
          body: JSON.stringify({ photoUrl: base64Photo, customerId })
        });
        const json = await res.json();
        if (json.success) {
          setCustomerData(json.data);
          updateUser({ profilePhoto: json.data.profilePhoto });
          showMessage('success', 'Profile photo updated successfully.');
        } else {
          showMessage('error', json.error || 'Failed to upload photo.');
        }
      } catch (err: any) {
        showMessage('error', 'Error uploading profile photo.');
      }
    };
    reader.readAsDataURL(file);
  };

  // Handler: Remove Photo
  const handleRemovePhoto = async () => {
    try {
      const res = await fetch(`${API_BASE}/settings/photo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-customer-id': customerId
        },
        body: JSON.stringify({ action: 'remove', customerId })
      });
      const json = await res.json();
      if (json.success) {
        setCustomerData(json.data);
        updateUser({ profilePhoto: null });
        showMessage('success', 'Profile photo removed.');
      }
    } catch (err) {
      showMessage('error', 'Error removing photo.');
    }
  };

  // Handler: Email Change Request
  const handleEmailChangeRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setRequestingEmailChange(true);
    try {
      const res = await fetch(`${API_BASE}/settings/request-email-change`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-customer-id': customerId
        },
        body: JSON.stringify({
          currentPassword: emailCurrentPassword,
          newEmail: newTargetEmail,
          customerId
        })
      });
      const json = await res.json();
      if (json.success) {
        setEmailChangeNotice(json.data);
        setShowEmailModal(false);
        setEmailCurrentPassword('');
        setNewTargetEmail('');
        fetchSettings();
        showMessage('success', json.message);
      } else {
        showMessage('error', json.error || 'Email change request failed.');
      }
    } catch (err: any) {
      showMessage('error', err.message || 'Error requesting email change.');
    } finally {
      setRequestingEmailChange(false);
    }
  };

  // Handler: Test Email Verification
  const handleVerifyEmail = async (token: string) => {
    try {
      const res = await fetch(`${API_BASE}/settings/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-customer-id': customerId
        },
        body: JSON.stringify({ token, customerId })
      });
      const json = await res.json();
      if (json.success) {
        setCustomerData(json.data);
        updateUser({ email: json.data.email });
        setEmailChangeNotice(null);
        showMessage('success', json.message);
      } else {
        showMessage('error', json.error || 'Email verification failed.');
      }
    } catch (err) {
      showMessage('error', 'Error verifying email.');
    }
  };

  // Handler: Password Change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      showMessage('error', 'New password and confirmation do not match.');
      return;
    }
    if (newPassword.length < 8) {
      showMessage('error', 'Password must be at least 8 characters long.');
      return;
    }

    setSavingPassword(true);
    try {
      const res = await fetch(`${API_BASE}/settings/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-customer-id': 'cust_901'
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
          customerId: 'cust_901'
        })
      });
      const json = await res.json();
      if (json.success) {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        showMessage('success', json.message);
      } else {
        showMessage('error', json.error || 'Failed to update password.');
      }
    } catch (err: any) {
      showMessage('error', err.message || 'Error changing password.');
    } finally {
      setSavingPassword(false);
    }
  };

  // Handler: Save Notification Preferences
  const handleSaveNotifications = async () => {
    setSavingNotifications(true);
    try {
      const res = await fetch(`${API_BASE}/settings/notifications`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-customer-id': 'cust_901'
        },
        body: JSON.stringify({ notifications, customerId: 'cust_901' })
      });
      const json = await res.json();
      if (json.success) {
        setCustomerData(json.data);
        showMessage('success', 'Notification preferences saved.');
      } else {
        showMessage('error', json.error || 'Failed to save notifications.');
      }
    } catch (err: any) {
      showMessage('error', err.message || 'Error saving notifications.');
    } finally {
      setSavingNotifications(false);
    }
  };

  // Handler: Account Deactivation Request
  const handleDeactivateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setDeactivatingAccount(true);
    try {
      const res = await fetch(`${API_BASE}/settings/deactivate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-customer-id': 'cust_901'
        },
        body: JSON.stringify({
          currentPassword: deactivatePassword,
          reason: deactivateReason,
          customerId: 'cust_901'
        })
      });
      const json = await res.json();
      if (json.success) {
        setShowDeactivateModal(false);
        setDeactivatePassword('');
        setDeactivateReason('');
        showMessage('success', json.message);
        setTimeout(() => navigate('/portal/login'), 3000);
      } else {
        showMessage('error', json.error || 'Deactivation request failed.');
      }
    } catch (err: any) {
      showMessage('error', err.message || 'Error submitting deactivation.');
    } finally {
      setDeactivatingAccount(false);
    }
  };

  const handleLogout = () => {
    navigate('/portal/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      
      {/* ── Top Header Navigation ─────────────────────────────────────────── */}
      <PortalNavbar />

      {/* ── Main Container ────────────────────────────────────────────────── */}
      <main className="container mx-auto px-4 py-8 max-w-5xl space-y-6">
        
        {/* Page Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Account Settings</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage your personal profile, security credentials, notification channels, and account status.
          </p>
        </div>

        {/* Global Feedback Alert Banner */}
        {feedback && (
          <div className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between border shadow-sm animate-in fade-in ${
            feedback.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800' :
            'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'
          }`}>
            <div className="flex items-center gap-2">
              {feedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
              <span>{feedback.message}</span>
            </div>
            <button onClick={() => setFeedback(null)} className="opacity-70 hover:opacity-100"><X size={14} /></button>
          </div>
        )}

        {/* Pending Email Change Notice Banner */}
        {customerData.pendingEmail && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 dark:bg-amber-950/40 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold">
                <Mail size={16} className="text-amber-600" />
                <span>Verification Pending for New Email: <span className="underline">{customerData.pendingEmail}</span></span>
              </div>
              {emailChangeNotice?.verificationToken && (
                <button
                  onClick={() => handleVerifyEmail(emailChangeNotice.verificationToken)}
                  className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition-colors flex items-center gap-1"
                >
                  <CheckCircle2 size={13} /> Test Verify Now
                </button>
              )}
            </div>
            <p className="text-[11px] opacity-90">
              A verification link was sent to your new email. Your login email address will remain <span className="font-semibold">{customerData.email}</span> until verified.
            </p>
          </div>
        )}

        {/* ── Section Navigation Tabs (Unified Single Page Layout) ──────────── */}
        <div className="bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'profile'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <User size={15} />
            <span>Profile &amp; Identity</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'security'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Shield size={15} />
            <span>Security &amp; Password</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'notifications'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Bell size={15} />
            <span>Notification Channels</span>
          </button>

          <button
            onClick={() => setActiveTab('account')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'account'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30'
            }`}
          >
            <AlertTriangle size={15} />
            <span>Account Management</span>
          </button>
        </div>

        {/* ── TAB 1: PROFILE & IDENTITY ────────────────────────────────────── */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            
            {/* Profile Photo Card */}
            <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Camera size={18} className="text-blue-600" /> Profile Picture
                </CardTitle>
                <CardDescription>Upload a photo or avatar image to personalize your customer profile.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center text-3xl font-extrabold overflow-hidden border-2 border-slate-300 dark:border-slate-700 shadow-md">
                    {customerData.profilePhoto ? (
                      <img src={customerData.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span>{customerData.displayName?.[0] || 'C'}</span>
                    )}
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all"
                  >
                    <Camera size={14} />
                  </button>
                </div>

                <div className="space-y-2 text-center sm:text-left">
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <Button onClick={() => fileInputRef.current?.click()} variant="outline" size="sm">
                      Upload New Photo
                    </Button>

                    {customerData.profilePhoto && (
                      <Button onClick={handleRemovePhoto} variant="ghost" size="sm" className="text-rose-600 hover:text-rose-700 hover:bg-rose-50">
                        <Trash2 size={14} className="mr-1" /> Remove
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Supports PNG, JPG, or GIF up to 5MB. Photo is saved securely for your customer account.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Editable Profile Fields */}
            <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <User size={18} className="text-blue-600" /> Editable Profile Details
                </CardTitle>
                <CardDescription>Update your display name and contact phone number.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Display Name / Username</Label>
                      <Input
                        id="displayName"
                        value={displayName}
                        onChange={e => setDisplayName(e.target.value)}
                        placeholder="e.g. Acme Corporation Admin"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="e.g. +1 (555) 234-5678"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button type="submit" disabled={savingProfile} className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
                      {savingProfile ? <Loader2 size={14} className="mr-1 animate-spin" /> : null}
                      Save Profile Changes
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Email Address Section with Verification Flow */}
            <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Mail size={18} className="text-blue-600" /> Email Address &amp; Verification Flow
                </CardTitle>
                <CardDescription>Your registered login email address. Changing email requires current password authentication and email link verification.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Current Account Email</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">{customerData.email}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300">
                        VERIFIED
                      </span>
                    </div>
                  </div>

                  <Button onClick={() => setShowEmailModal(true)} variant="outline" size="sm" className="font-bold">
                    <Mail size={14} className="mr-1.5 text-blue-600" /> Change Email...
                  </Button>
                </div>
              </CardContent>
            </Card>

          </div>
        )}

        {/* ── TAB 2: SECURITY & PASSWORD ───────────────────────────────────── */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            
            {/* Change Password Form */}
            <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Lock size={18} className="text-blue-600" /> Change Account Password
                </CardTitle>
                <CardDescription>Update your password. Your current password will be verified server-side before changes take effect.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={currentPassword}
                      onChange={e => setCurrentPassword(e.target.value)}
                      placeholder="Enter your current password"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="Minimum 8 characters"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      required
                    />
                  </div>

                  <div className="pt-2">
                    <Button type="submit" disabled={savingPassword} className="bg-blue-600 hover:bg-blue-700 text-white font-bold w-full sm:w-auto">
                      {savingPassword ? <Loader2 size={14} className="mr-1 animate-spin" /> : null}
                      Update Password
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Two-Factor Authentication (2FA) Placeholder */}
            <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <ShieldCheck size={18} className="text-blue-600" /> Two-Factor Authentication (2FA)
                  </CardTitle>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-300">
                    Coming Soon
                  </span>
                </div>
                <CardDescription>Add an extra layer of protection to your customer account using authenticator apps or SMS OTP.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 opacity-60 pointer-events-none">
                  <div className="space-y-1">
                    <span className="font-bold text-sm block text-slate-900 dark:text-white">Authenticator App (TOTP)</span>
                    <span className="text-xs text-slate-500">Secure log in with Google Authenticator or Authy.</span>
                  </div>

                  <div className="w-11 h-6 bg-slate-300 dark:bg-slate-700 rounded-full relative p-0.5">
                    <div className="w-5 h-5 bg-white rounded-full shadow-md" />
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        )}

        {/* ── TAB 3: NOTIFICATION PREFERENCES ─────────────────────────────── */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            
            <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Bell size={18} className="text-blue-600" /> Notification Channels &amp; Preferences
                </CardTitle>
                <CardDescription>Choose how you want to receive operational alerts, invoices, and shipment tracking milestones.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Email Notifications Group */}
                <div className="space-y-3">
                  <span className="text-xs font-extrabold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                    <Mail size={14} /> Email Alerts
                  </span>

                  <div className="space-y-2">
                    <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 cursor-pointer">
                      <div>
                        <span className="text-sm font-bold block text-slate-900 dark:text-white">Shipment Status Updates</span>
                        <span className="text-xs text-slate-500">Receive email alerts for tracking milestones, in-transit delays, and delivery confirmations.</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.emailShipmentUpdates}
                        onChange={e => setNotifications({ ...notifications, emailShipmentUpdates: e.target.checked })}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 cursor-pointer">
                      <div>
                        <span className="text-sm font-bold block text-slate-900 dark:text-white">Billing &amp; Invoice Alerts</span>
                        <span className="text-xs text-slate-500">Receive email notifications for newly generated freight invoices and credit limit statements.</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.emailBillingAlerts}
                        onChange={e => setNotifications({ ...notifications, emailBillingAlerts: e.target.checked })}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 cursor-pointer">
                      <div>
                        <span className="text-sm font-bold block text-slate-900 dark:text-white">Claim &amp; Return Status Updates</span>
                        <span className="text-xs text-slate-500">Receive updates when cargo damage claims or reverse logistics returns are processed.</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.emailClaimsReturns}
                        onChange={e => setNotifications({ ...notifications, emailClaimsReturns: e.target.checked })}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                      />
                    </label>
                  </div>
                </div>

                {/* SMS Notifications Group */}
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-extrabold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                    <Phone size={14} /> SMS Mobile Alerts
                  </span>

                  <div className="space-y-2">
                    <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 cursor-pointer">
                      <div>
                        <span className="text-sm font-bold block text-slate-900 dark:text-white">SMS Shipment Milestones</span>
                        <span className="text-xs text-slate-500">Instant SMS dispatch notifications to {customerData.phone}.</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.smsShipmentUpdates}
                        onChange={e => setNotifications({ ...notifications, smsShipmentUpdates: e.target.checked })}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 cursor-pointer">
                      <div>
                        <span className="text-sm font-bold block text-slate-900 dark:text-white">SMS Billing Alerts</span>
                        <span className="text-xs text-slate-500">SMS reminders for upcoming payment due dates.</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.smsBillingAlerts}
                        onChange={e => setNotifications({ ...notifications, smsBillingAlerts: e.target.checked })}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 cursor-pointer">
                      <div>
                        <span className="text-sm font-bold block text-slate-900 dark:text-white">SMS Claim Status Updates</span>
                        <span className="text-xs text-slate-500">SMS updates when insurance claims or payouts are approved.</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.smsClaimsReturns}
                        onChange={e => setNotifications({ ...notifications, smsClaimsReturns: e.target.checked })}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                      />
                    </label>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button onClick={handleSaveNotifications} disabled={savingNotifications} className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
                    {savingNotifications ? <Loader2 size={14} className="mr-1 animate-spin" /> : null}
                    Save Notification Preferences
                  </Button>
                </div>

              </CardContent>
            </Card>

          </div>
        )}

        {/* ── TAB 4: ACCOUNT MANAGEMENT & DEACTIVATION ────────────────────── */}
        {activeTab === 'account' && (
          <div className="space-y-6">
            
            <Card className="border-rose-200 dark:border-rose-900 shadow-sm bg-rose-50/20 dark:bg-rose-950/10">
              <CardHeader>
                <CardTitle className="text-base font-bold text-rose-700 dark:text-rose-400 flex items-center gap-2">
                  <AlertTriangle size={18} /> Danger Zone: Deactivate Account
                </CardTitle>
                <CardDescription>
                  Request deactivation of your customer account. Your account access will be disabled and sent for administrative review.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-800/60 text-xs space-y-2">
                  <span className="font-bold text-slate-900 dark:text-white block">What happens when you deactivate your account?</span>
                  <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
                    <li>Your customer portal login credentials will be disabled immediately.</li>
                    <li>Active shipments, billing invoices, and historical records are preserved for audit &amp; regulatory compliance.</li>
                    <li>Your request is logged for review by the system operations admin.</li>
                  </ul>
                </div>

                <div className="pt-2">
                  <Button
                    onClick={() => setShowDeactivateModal(true)}
                    variant="destructive"
                    className="bg-rose-600 hover:bg-rose-700 text-white font-bold"
                  >
                    <AlertTriangle size={15} className="mr-1.5" /> Deactivate Account...
                  </Button>
                </div>
              </CardContent>
            </Card>

          </div>
        )}

      </main>

      {/* ── Change Email Modal ─────────────────────────────────────────────── */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Mail size={18} className="text-blue-600" /> Change Email Address
              </h3>
              <button onClick={() => setShowEmailModal(false)} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
            </div>

            <form onSubmit={handleEmailChangeRequest} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="emailCurrentPassword">Current Password</Label>
                <Input
                  id="emailCurrentPassword"
                  type="password"
                  value={emailCurrentPassword}
                  onChange={e => setEmailCurrentPassword(e.target.value)}
                  placeholder="Enter current password for verification"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newTargetEmail">New Email Address</Label>
                <Input
                  id="newTargetEmail"
                  type="email"
                  value={newTargetEmail}
                  onChange={e => setNewTargetEmail(e.target.value)}
                  placeholder="newemail@company.com"
                  required
                />
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                A verification link will be sent to the new email address. Your current email will remain active until verified.
              </p>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" onClick={() => setShowEmailModal(false)} variant="outline" size="sm">
                  Cancel
                </Button>
                <Button type="submit" disabled={requestingEmailChange} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
                  {requestingEmailChange ? <Loader2 size={14} className="mr-1 animate-spin" /> : null}
                  Send Verification Link
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Account Deactivation Confirmation Modal ──────────────────────── */}
      {showDeactivateModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-rose-600 flex items-center gap-2">
                <AlertTriangle size={18} /> Confirm Account Deactivation
              </h3>
              <button onClick={() => setShowDeactivateModal(false)} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
            </div>

            <form onSubmit={handleDeactivateAccount} className="space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Are you sure you want to deactivate your account? This action will disable portal login. Enter your current password to confirm.
              </p>

              <div className="space-y-2">
                <Label htmlFor="deactivatePassword">Current Password</Label>
                <Input
                  id="deactivatePassword"
                  type="password"
                  value={deactivatePassword}
                  onChange={e => setDeactivatePassword(e.target.value)}
                  placeholder="Enter current password"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deactivateReason">Reason for Deactivation (Optional)</Label>
                <Input
                  id="deactivateReason"
                  value={deactivateReason}
                  onChange={e => setDeactivateReason(e.target.value)}
                  placeholder="e.g. Switching companies, no longer needed..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" onClick={() => setShowDeactivateModal(false)} variant="outline" size="sm">
                  Cancel
                </Button>
                <Button type="submit" disabled={deactivatingAccount} variant="destructive" size="sm" className="font-bold">
                  {deactivatingAccount ? <Loader2 size={14} className="mr-1 animate-spin" /> : null}
                  Confirm &amp; Submit Request
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
