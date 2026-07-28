import React, { useState, useEffect, useRef } from 'react';
import { useEmployeeAuth } from '../context/EmployeeAuthContext';
import { employeePortalService } from '../services/employeeApi';
import {
  User, Lock, Bell, Camera, Trash2, Mail, Phone, Key, ShieldCheck,
  Loader2, Save, X, AlertTriangle, CheckCircle2, QrCode, Copy, Check,
  Shield, Eye, EyeOff, Sparkles
} from 'lucide-react';

export default function EmployeeSettings() {
  const { user, updateUser } = useEmployeeAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Account & Profile State ───────────────────────────────────────────────
  const [firstName, setFirstName] = useState(user?.firstName || 'Admin');
  const [lastName, setLastName] = useState(user?.lastName || 'User');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [profilePhoto, setProfilePhoto] = useState<string | null>(user?.avatarUrl || null);
  const [savingAccount, setSavingAccount] = useState(false);

  // Email Change Flow State
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailCurrentPassword, setEmailCurrentPassword] = useState('');
  const [newTargetEmail, setNewTargetEmail] = useState('');
  const [emailNotice, setEmailNotice] = useState<any>(null);
  const [requestingEmailChange, setRequestingEmailChange] = useState(false);

  // Password Change & Policy Rules State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // 2FA Interactive Setup State
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [twoFactorSecret, setTwoFactorSecret] = useState('');
  const [twoFactorQrUrl, setTwoFactorQrUrl] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [verifying2FA, setVerifying2FA] = useState(false);
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [copiedCodes, setCopiedCodes] = useState(false);
  const [disable2FAConfirm, setDisable2FAConfirm] = useState(false);
  const [disable2FAPassword, setDisable2FAPassword] = useState('');

  // Notification Preferences State
  const [notifications, setNotifications] = useState({
    emailShipmentUpdates: true,
    emailBillingAlerts: true,
    emailClaimsReturns: false,
    emailSupportTickets: true,
    smsShipmentUpdates: true,
    smsBillingAlerts: false,
    smsClaimsReturns: true,
  });
  const [savingNotifications, setSavingNotifications] = useState(false);

  // Deactivation Modal State
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [deactivatePassword, setDeactivatePassword] = useState('');
  const [deactivateReason, setDeactivateReason] = useState('');
  const [deactivatingAccount, setDeactivatingAccount] = useState(false);

  // Feedback Notification Banner
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showMessage = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 5000);
  };

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || 'Admin');
      setLastName(user.lastName || 'User');
      setPhone(user.phone || '+91 98765 43210');
      setProfilePhoto(user.avatarUrl || null);
    }
  }, [user]);

  // ── Password Rules & Policy Checks ───────────────────────────────────────
  const passMinLength = newPassword.length >= 8;
  const passHasUpper = /[A-Z]/.test(newPassword);
  const passHasLower = /[a-z]/.test(newPassword);
  const passHasNumber = /[0-9]/.test(newPassword);
  const passHasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword);
  const passMatches = newPassword.length > 0 && newPassword === confirmPassword;

  const validRulesCount = [passMinLength, passHasUpper, passHasLower, passHasNumber, passHasSpecial].filter(Boolean).length;
  
  const getStrengthLabel = () => {
    if (newPassword.length === 0) return { label: 'None', color: 'bg-slate-200', text: 'text-slate-400' };
    if (validRulesCount <= 2) return { label: 'Weak', color: 'bg-rose-500', text: 'text-rose-600' };
    if (validRulesCount === 3 || validRulesCount === 4) return { label: 'Fair', color: 'bg-amber-500', text: 'text-amber-600' };
    return { label: 'Strong & Secure', color: 'bg-emerald-500', text: 'text-emerald-600' };
  };

  const strength = getStrengthLabel();

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingAccount(true);
    try {
      const res = await employeePortalService.updateAccountProfile({ firstName, lastName, phone });
      if (res.data.success) {
        updateUser({ firstName, lastName, phone });
        showMessage('success', 'Personal profile updated successfully.');
      }
    } catch (err: any) {
      showMessage('error', err.message || 'Failed to update profile.');
    } finally {
      setSavingAccount(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showMessage('error', 'Profile photo size must be under 10MB.');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const rawBase64 = event.target?.result as string;

      const uploadBase64 = async (photoStr: string) => {
        try {
          const res = await employeePortalService.updateProfilePhoto({ photoUrl: photoStr });
          if (res.data.success) {
            setProfilePhoto(photoStr);
            updateUser({ avatarUrl: photoStr });
            showMessage('success', 'Profile photo updated successfully!');
          } else {
            showMessage('error', res.data.error || 'Failed to update profile photo.');
          }
        } catch (err: any) {
          showMessage('error', err.message || 'Error uploading profile photo.');
        } finally {
          e.target.value = '';
        }
      };

      if (file.type.includes('image/') && !file.type.includes('svg')) {
        const img = new Image();
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 400;
            const MAX_HEIGHT = 400;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > MAX_WIDTH) {
                height = Math.round((height * MAX_WIDTH) / width);
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                width = Math.round((width * MAX_HEIGHT) / height);
                height = MAX_HEIGHT;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);
              const compressedBase64 = canvas.toDataURL(file.type.includes('png') ? 'image/png' : 'image/jpeg', 0.85);
              uploadBase64(compressedBase64);
              return;
            }
          } catch {
            // Fallback
          }
          uploadBase64(rawBase64);
        };
        img.onerror = () => uploadBase64(rawBase64);
        img.src = rawBase64;
      } else {
        uploadBase64(rawBase64);
      }
    };

    reader.onerror = () => {
      showMessage('error', 'Failed to read image file.');
      e.target.value = '';
    };

    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = async () => {
    try {
      const res = await employeePortalService.updateProfilePhoto({ action: 'remove' });
      if (res.data.success) {
        setProfilePhoto(null);
        updateUser({ avatarUrl: undefined });
        showMessage('success', 'Profile photo removed.');
      }
    } catch (err: any) {
      showMessage('error', 'Error removing photo.');
    }
  };

  const handleEmailChangeRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setRequestingEmailChange(true);
    try {
      const res = await employeePortalService.requestAccountEmailChange({
        currentPassword: emailCurrentPassword,
        newEmail: newTargetEmail
      });
      if (res.data.success) {
        setEmailNotice(res.data.data);
        setShowEmailModal(false);
        setEmailCurrentPassword('');
        setNewTargetEmail('');
        showMessage('success', res.data.data.message);
      }
    } catch (err: any) {
      showMessage('error', err.message || 'Email change request failed.');
    } finally {
      setRequestingEmailChange(false);
    }
  };

  const handleVerifyEmail = async (token: string) => {
    try {
      const res = await employeePortalService.verifyAccountEmail(token);
      if (res.data.success) {
        if (emailNotice?.pendingEmail) {
          updateUser({ email: emailNotice.pendingEmail });
        }
        setEmailNotice(null);
        showMessage('success', 'Email address verified and updated successfully!');
      }
    } catch (err: any) {
      showMessage('error', err.message || 'Email verification failed.');
    }
  };

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword) {
      showMessage('error', 'Current password is required.');
      return;
    }

    if (validRulesCount < 5) {
      showMessage('error', 'New password does not meet all complexity requirements.');
      return;
    }

    if (!passMatches) {
      showMessage('error', 'New passwords do not match.');
      return;
    }

    setSavingPassword(true);
    try {
      const res = await employeePortalService.changePassword(currentPassword, newPassword);
      if (res.data.success || res.status === 200) {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        showMessage('success', 'Password updated successfully!');
      } else {
        showMessage('error', res.data.error || 'Failed to update password.');
      }
    } catch (err: any) {
      showMessage('error', err.message || 'Current password validation failed.');
    } finally {
      setSavingPassword(false);
    }
  };

  // ── 2FA Handlers ─────────────────────────────────────────────────────────
  const handleStart2FASetup = async () => {
    try {
      const res = await employeePortalService.setup2FA();
      if (res.data.success) {
        setTwoFactorSecret(res.data.data.secret);
        setTwoFactorQrUrl(res.data.data.qrCodeUrl);
        setTotpCode('');
        setRecoveryCodes([]);
        setShow2FAModal(true);
      }
    } catch (err: any) {
      showMessage('error', err.message || 'Failed to start 2FA setup.');
    }
  };

  const handleVerify2FACode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (totpCode.length !== 6) {
      showMessage('error', 'Please enter a valid 6-digit verification code.');
      return;
    }

    setVerifying2FA(true);
    try {
      const res = await employeePortalService.verify2FA(totpCode, twoFactorSecret);
      if (res.data.success) {
        setTwoFactorEnabled(true);
        setRecoveryCodes(res.data.data.recoveryCodes || []);
        showMessage('success', 'Two-Factor Authentication (2FA) is now ACTIVE!');
      }
    } catch (err: any) {
      showMessage('error', err.message || 'Invalid verification code.');
    } finally {
      setVerifying2FA(false);
    }
  };

  const handleDisable2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await employeePortalService.disable2FA(disable2FAPassword);
      if (res.data.success) {
        setTwoFactorEnabled(false);
        setDisable2FAConfirm(false);
        setDisable2FAPassword('');
        showMessage('success', 'Two-Factor Authentication (2FA) has been disabled.');
      }
    } catch (err: any) {
      showMessage('error', err.message || 'Failed to disable 2FA.');
    }
  };

  const copyToClipboard = (text: string, type: 'secret' | 'codes') => {
    navigator.clipboard.writeText(text);
    if (type === 'secret') {
      setCopiedSecret(true);
      setTimeout(() => setCopiedSecret(false), 2000);
    } else {
      setCopiedCodes(true);
      setTimeout(() => setCopiedCodes(false), 2000);
    }
  };

  const handleSaveNotifications = async () => {
    setSavingNotifications(true);
    try {
      const res = await employeePortalService.updateAccountNotifications({ notifications });
      if (res.data.success) {
        showMessage('success', 'Notification channel preferences saved.');
      }
    } catch (err: any) {
      showMessage('error', err.message || 'Failed to save notification preferences.');
    } finally {
      setSavingNotifications(false);
    }
  };

  const handleDeactivateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setDeactivatingAccount(true);
    try {
      const res = await employeePortalService.requestAccountDeactivation({
        currentPassword: deactivatePassword,
        reason: deactivateReason
      });
      if (res.data.success) {
        setShowDeactivateModal(false);
        setDeactivatePassword('');
        setDeactivateReason('');
        showMessage('success', res.data.data.message);
      }
    } catch (err: any) {
      showMessage('error', err.message || 'Deactivation request failed.');
    } finally {
      setDeactivatingAccount(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* ── Feedback Banner Alert ────────────────────────────────────────── */}
      {feedback && (
        <div className={`p-4 rounded-xl flex items-center justify-between text-xs font-bold transition-all animate-in fade-in ${
          feedback.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-rose-50 border border-rose-200 text-rose-800'
        }`}>
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? <CheckCircle2 size={16} className="text-emerald-600" /> : <AlertTriangle size={16} className="text-rose-600" />}
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="opacity-70 hover:opacity-100"><X size={14} /></button>
        </div>
      )}

      {/* ── Email Verification Link Notice Banner ────────────────────────── */}
      {emailNotice && (
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold flex items-center gap-1.5"><Mail size={15} className="text-blue-600" /> Pending Email Change Verification</span>
            <button onClick={() => setEmailNotice(null)} className="text-slate-400 hover:text-slate-600"><X size={14} /></button>
          </div>
          <p className="text-slate-600">Verification link dispatched to <strong className="text-slate-900">{emailNotice.pendingEmail}</strong>.</p>
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={() => handleVerifyEmail(emailNotice.verificationToken)}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm"
            >
              <CheckCircle2 size={13} /> Confirm Verification
            </button>
            <span className="text-[11px] font-mono text-slate-500">Token: {emailNotice.verificationToken}</span>
          </div>
        </div>
      )}

      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <div>
        <nav className="flex items-center space-x-1.5 text-xs text-slate-400 font-medium mb-1">
          <span>Home</span>
          <span>&gt;</span>
          <span>Employee Portal</span>
          <span>&gt;</span>
          <span className="text-blue-600 font-semibold">User Settings</span>
        </nav>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          User Settings &amp; Profile Preferences
        </h1>
        <p className="text-xs text-slate-500 font-normal mt-0.5">
          Manage your personal profile, photo, contact details, password policy rules, 2FA, and notification channels.
        </p>
      </div>

      {/* ── Section 1: Profile & Photo ───────────────────────────────────── */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <User size={18} className="text-blue-600" /> Employee Profile &amp; Photo
            </h2>
            <p className="text-xs text-slate-500 font-medium">Update your profile avatar and contact information.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="relative group">
            <div className="w-24 h-24 rounded-2xl bg-slate-100 border-2 border-slate-200 flex items-center justify-center overflow-hidden shadow-sm">
              {profilePhoto ? (
                <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={36} className="text-slate-400" />
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              accept="image/*"
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-blue-600 text-white shadow-md hover:bg-blue-700 transition-colors"
              title="Upload New Photo"
            >
              <Camera size={14} />
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 font-bold text-xs hover:bg-blue-100 transition-colors"
              >
                Upload Photo
              </button>

              {profilePhoto && (
                <button
                  onClick={handleRemovePhoto}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-bold text-xs hover:bg-rose-100 transition-colors flex items-center gap-1"
                >
                  <Trash2 size={13} /> Remove
                </button>
              )}
            </div>
            <p className="text-[11px] text-slate-400">Supports JPG, PNG, WEBP, GIF, SVG, BMP, AVIF up to 10MB.</p>
          </div>
        </div>

        {/* Profile Edit Form */}
        <form onSubmit={handleSaveProfile} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 uppercase">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 uppercase">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 uppercase flex items-center justify-between">
                <span>Email Address</span>
                <span className="text-[10px] text-slate-400 font-normal">Read-only</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={user?.email || 'admin@aura.com'}
                  readOnly
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-600 cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowEmailModal(true)}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold text-xs whitespace-nowrap"
                >
                  Change Email
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 uppercase">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={savingAccount}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-500/20"
            >
              {savingAccount ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save Profile Details
            </button>
          </div>
        </form>
      </div>

      {/* ── Section 2: Change Password with Policy Rules & Strength Meter ─ */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Lock size={18} className="text-blue-600" /> Password Security Policy &amp; Change
            </h2>
            <p className="text-xs text-slate-500 font-medium">Server validates current password and enforces password complexity rules.</p>
          </div>
        </div>

        <form onSubmit={handleChangePasswordSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Current Password */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 uppercase">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  required
                  placeholder="Enter current password"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 pr-9 text-xs font-bold text-slate-900"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showCurrentPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 uppercase">New Password</label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                  placeholder="Create new password"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 pr-9 text-xs font-bold text-slate-900"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showNewPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 uppercase flex items-center justify-between">
                <span>Confirm New Password</span>
                {newPassword && (
                  <span className={`text-[10px] font-extrabold ${passMatches ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {passMatches ? '✓ Matches' : '✗ Mismatch'}
                  </span>
                )}
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                placeholder="Re-enter new password"
                className={`w-full bg-slate-50 border rounded-xl p-2.5 text-xs font-bold text-slate-900 ${
                  confirmPassword && !passMatches ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200'
                }`}
              />
            </div>
          </div>

          {/* Password Strength Indicator Meter */}
          {newPassword && (
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">Password Strength Rating:</span>
                <span className={`font-extrabold ${strength.text}`}>{strength.label}</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${strength.color}`}
                  style={{ width: `${(validRulesCount / 5) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Interactive Password Policy Requirements Checklist */}
          <div className="p-4 bg-slate-50/70 border border-slate-200/80 rounded-xl space-y-2 text-xs">
            <span className="font-extrabold text-slate-700 uppercase tracking-wider block text-[11px]">
              Password Security Complexity Rules:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-slate-600">
              <div className={`flex items-center gap-1.5 ${passMinLength ? 'text-emerald-600 font-bold' : ''}`}>
                {passMinLength ? <CheckCircle2 size={14} className="text-emerald-600" /> : <X size={14} className="text-slate-400" />}
                <span>At least 8 characters long</span>
              </div>
              <div className={`flex items-center gap-1.5 ${passHasUpper ? 'text-emerald-600 font-bold' : ''}`}>
                {passHasUpper ? <CheckCircle2 size={14} className="text-emerald-600" /> : <X size={14} className="text-slate-400" />}
                <span>At least 1 uppercase letter (A-Z)</span>
              </div>
              <div className={`flex items-center gap-1.5 ${passHasLower ? 'text-emerald-600 font-bold' : ''}`}>
                {passHasLower ? <CheckCircle2 size={14} className="text-emerald-600" /> : <X size={14} className="text-slate-400" />}
                <span>At least 1 lowercase letter (a-z)</span>
              </div>
              <div className={`flex items-center gap-1.5 ${passHasNumber ? 'text-emerald-600 font-bold' : ''}`}>
                {passHasNumber ? <CheckCircle2 size={14} className="text-emerald-600" /> : <X size={14} className="text-slate-400" />}
                <span>At least 1 number (0-9)</span>
              </div>
              <div className={`flex items-center gap-1.5 ${passHasSpecial ? 'text-emerald-600 font-bold' : ''}`}>
                {passHasSpecial ? <CheckCircle2 size={14} className="text-emerald-600" /> : <X size={14} className="text-slate-400" />}
                <span>At least 1 special character (!@#$)</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={savingPassword || validRulesCount < 5 || !passMatches || !currentPassword}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-500/20"
            >
              {savingPassword ? <Loader2 size={14} className="animate-spin" /> : <Key size={14} />} Validate &amp; Change Password
            </button>
          </div>
        </form>
      </div>

      {/* ── Section 3: Two-Factor Authentication (2FA) Interactive Module ─ */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck size={18} className="text-blue-600" /> Two-Factor Authentication (2FA)
            </h2>
            <p className="text-xs text-slate-500 font-medium">Protect your portal account with TOTP Google/Microsoft Authenticator codes.</p>
          </div>

          <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
            twoFactorEnabled ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'
          }`}>
            {twoFactorEnabled ? '● 2FA Active' : '○ 2FA Disabled'}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <QrCode size={20} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Authenticator App (TOTP)</h4>
              <p className="text-[11px] text-slate-500">Generate verification codes using Google Authenticator or Authy.</p>
            </div>
          </div>

          {twoFactorEnabled ? (
            <button
              onClick={() => setDisable2FAConfirm(true)}
              className="px-4 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 font-bold text-xs"
            >
              Disable 2FA
            </button>
          ) : (
            <button
              onClick={handleStart2FASetup}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center gap-1.5"
            >
              <Shield size={14} /> Enable 2FA Security
            </button>
          )}
        </div>

        {/* Display Recovery Codes Summary if 2FA Active */}
        {twoFactorEnabled && recoveryCodes.length > 0 && (
          <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-xl space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-900 flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-600" /> Backup Recovery Codes Saved</span>
              <button onClick={() => copyToClipboard(recoveryCodes.join('\n'), 'codes')} className="text-emerald-700 hover:text-emerald-900 flex items-center gap-1 font-bold">
                {copiedCodes ? <Check size={13} /> : <Copy size={13} />} {copiedCodes ? 'Copied!' : 'Copy Codes'}
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-[11px] text-emerald-800 pt-1">
              {recoveryCodes.map((code, idx) => (
                <div key={idx} className="p-1.5 bg-white border border-emerald-200 rounded text-center">{code}</div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Section 4: Notification Channels ────────────────────────────── */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Bell size={18} className="text-blue-600" /> Notification Channels &amp; Alerts
            </h2>
            <p className="text-xs text-slate-500 font-medium">Select which operational events dispatch Email or SMS alerts.</p>
          </div>

          <button
            onClick={handleSaveNotifications}
            disabled={savingNotifications}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-500/20"
          >
            {savingNotifications ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save Preferences
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email Alerts */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <span className="text-xs font-extrabold text-blue-700 uppercase flex items-center gap-1.5">
              <Mail size={14} /> Email Notifications
            </span>

            <label className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-lg cursor-pointer">
              <span className="text-xs font-semibold text-slate-800">Shipment Status &amp; Milestones</span>
              <input
                type="checkbox"
                checked={notifications.emailShipmentUpdates}
                onChange={e => setNotifications({ ...notifications, emailShipmentUpdates: e.target.checked })}
                className="rounded text-blue-600"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-lg cursor-pointer">
              <span className="text-xs font-semibold text-slate-800">Billing &amp; Invoice Alerts</span>
              <input
                type="checkbox"
                checked={notifications.emailBillingAlerts}
                onChange={e => setNotifications({ ...notifications, emailBillingAlerts: e.target.checked })}
                className="rounded text-blue-600"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-lg cursor-pointer">
              <span className="text-xs font-semibold text-slate-800">Claims &amp; Return Approvals</span>
              <input
                type="checkbox"
                checked={notifications.emailClaimsReturns}
                onChange={e => setNotifications({ ...notifications, emailClaimsReturns: e.target.checked })}
                className="rounded text-blue-600"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-lg cursor-pointer">
              <span className="text-xs font-semibold text-slate-800">Support Ticket SLA Escalations</span>
              <input
                type="checkbox"
                checked={notifications.emailSupportTickets}
                onChange={e => setNotifications({ ...notifications, emailSupportTickets: e.target.checked })}
                className="rounded text-blue-600"
              />
            </label>
          </div>

          {/* SMS Alerts */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <span className="text-xs font-extrabold text-blue-700 uppercase flex items-center gap-1.5">
              <Phone size={14} /> SMS Mobile Notifications
            </span>

            <label className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-lg cursor-pointer">
              <span className="text-xs font-semibold text-slate-800">Dispatch &amp; Delivery Milestones</span>
              <input
                type="checkbox"
                checked={notifications.smsShipmentUpdates}
                onChange={e => setNotifications({ ...notifications, smsShipmentUpdates: e.target.checked })}
                className="rounded text-blue-600"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-lg cursor-pointer">
              <span className="text-xs font-semibold text-slate-800">High Priority Billing Alerts</span>
              <input
                type="checkbox"
                checked={notifications.smsBillingAlerts}
                onChange={e => setNotifications({ ...notifications, smsBillingAlerts: e.target.checked })}
                className="rounded text-blue-600"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-lg cursor-pointer">
              <span className="text-xs font-semibold text-slate-800">Claim Payout Approvals</span>
              <input
                type="checkbox"
                checked={notifications.smsClaimsReturns}
                onChange={e => setNotifications({ ...notifications, smsClaimsReturns: e.target.checked })}
                className="rounded text-blue-600"
              />
            </label>
          </div>
        </div>
      </div>

      {/* ── Section 5: Account Deactivation Danger Zone ─────────────────── */}
      <div className="bg-rose-50/50 border border-rose-200 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-rose-900 flex items-center gap-2">
              <AlertTriangle size={18} className="text-rose-600" /> Account Deactivation Danger Zone
            </h3>
            <p className="text-xs text-rose-700 font-medium">Deactivating your employee profile disables login access while retaining operational records for compliance.</p>
          </div>

          <button
            onClick={() => setShowDeactivateModal(true)}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 whitespace-nowrap"
          >
            Deactivate Account
          </button>
        </div>
      </div>

      {/* ── MODALS ───────────────────────────────────────────────────────── */}
      
      {/* 2FA Setup Modal */}
      {show2FAModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-md space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <QrCode size={18} className="text-blue-600" /> Enable Two-Factor Authentication
              </h3>
              <button onClick={() => setShow2FAModal(false)} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
            </div>

            {recoveryCodes.length === 0 ? (
              <form onSubmit={handleVerify2FACode} className="space-y-4">
                <div className="flex flex-col items-center space-y-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="w-40 h-40 bg-white border border-slate-200 rounded-xl p-2 flex items-center justify-center shadow-sm">
                    {twoFactorQrUrl ? (
                      <img src={twoFactorQrUrl} alt="2FA QR Code" className="w-full h-full object-contain" />
                    ) : (
                      <Loader2 className="animate-spin text-blue-600" />
                    )}
                  </div>
                  <span className="text-xs text-slate-500 font-medium">Scan QR code using Google Authenticator app</span>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase flex items-center justify-between">
                    <span>Secret Key (Manual Entry)</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(twoFactorSecret, 'secret')}
                      className="text-blue-600 hover:text-blue-800 text-[10px] font-bold flex items-center gap-1"
                    >
                      {copiedSecret ? <Check size={12} /> : <Copy size={12} />} {copiedSecret ? 'Copied!' : 'Copy Key'}
                    </button>
                  </label>
                  <input
                    type="text"
                    value={twoFactorSecret}
                    readOnly
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 font-mono text-center text-xs font-bold text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Enter 6-Digit TOTP Code</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={totpCode}
                    onChange={e => setTotpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-mono text-center text-lg font-bold tracking-widest text-slate-900"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button type="button" onClick={() => setShow2FAModal(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold">Cancel</button>
                  <button type="submit" disabled={verifying2FA || totpCode.length !== 6} className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-600/20">
                    {verifying2FA ? <Loader2 size={14} className="animate-spin" /> : 'Verify & Activate 2FA'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 font-bold flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  <span>2FA Security Successfully Enabled!</span>
                </div>

                <div className="space-y-2">
                  <span className="font-bold text-slate-900 block">Save Your Recovery Backup Codes:</span>
                  <p className="text-slate-500">If you lose access to your phone, these recovery codes are required to log in.</p>
                  <div className="grid grid-cols-2 gap-2 font-mono text-[11px] text-slate-900 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    {recoveryCodes.map((code, idx) => (
                      <div key={idx} className="p-1.5 bg-white border border-slate-200 rounded text-center">{code}</div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button
                    onClick={() => copyToClipboard(recoveryCodes.join('\n'), 'codes')}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 flex items-center gap-1.5"
                  >
                    {copiedCodes ? <Check size={14} /> : <Copy size={14} />} {copiedCodes ? 'Copied!' : 'Copy Recovery Codes'}
                  </button>
                  <button onClick={() => setShow2FAModal(false)} className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold shadow-md">
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Disable 2FA Modal */}
      {disable2FAConfirm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Disable Two-Factor Authentication</h3>
              <button onClick={() => setDisable2FAConfirm(false)} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
            </div>

            <p className="text-xs text-slate-600">
              Enter your current password to confirm disabling 2FA authentication on your account.
            </p>

            <form onSubmit={handleDisable2FASubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Current Password</label>
                <input
                  type="password"
                  value={disable2FAPassword}
                  onChange={e => setDisable2FAPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setDisable2FAConfirm(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold shadow-md">
                  Disable 2FA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Change Account Email</h3>
              <button onClick={() => setShowEmailModal(false)} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
            </div>

            <form onSubmit={handleEmailChangeRequest} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">New Email Address</label>
                <input
                  type="email"
                  value={newTargetEmail}
                  onChange={e => setNewTargetEmail(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold"
                  placeholder="newemail@domain.com"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Current Password Required</label>
                <input
                  type="password"
                  value={emailCurrentPassword}
                  onChange={e => setEmailCurrentPassword(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowEmailModal(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold">Cancel</button>
                <button type="submit" disabled={requestingEmailChange} className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md">
                  {requestingEmailChange ? <Loader2 size={14} className="animate-spin" /> : 'Send Verification Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Account Deactivation Modal */}
      {showDeactivateModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-rose-200 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-rose-100">
              <h3 className="text-base font-bold text-rose-900">Deactivate Employee Account</h3>
              <button onClick={() => setShowDeactivateModal(false)} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
            </div>

            <p className="text-xs text-rose-700">
              This logs an account deactivation request for HR approval. Once approved, your login access will be suspended while operational history is retained for compliance.
            </p>

            <form onSubmit={handleDeactivateAccount} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Reason for Deactivation</label>
                <input
                  type="text"
                  value={deactivateReason}
                  onChange={e => setDeactivateReason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold"
                  placeholder="Optional reason..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Current Password Required</label>
                <input
                  type="password"
                  value={deactivatePassword}
                  onChange={e => setDeactivatePassword(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowDeactivateModal(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold">Cancel</button>
                <button type="submit" disabled={deactivatingAccount} className="px-5 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold shadow-md shadow-rose-600/20">
                  {deactivatingAccount ? <Loader2 size={14} className="animate-spin" /> : 'Confirm Deactivation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
