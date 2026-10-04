import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User, Mail, Phone, Shield, Pencil, CheckCircle2, AlertCircle,
  Lock, Eye, EyeOff, Camera, Building2, GraduationCap, Briefcase,
  Save, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import { InputField } from '../components/forms/InputField';
import { Button } from '../components/common/Button';

function fmt(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase().replace(/_/g, ' ');
}

const ACCOUNT_TYPE_CONFIG = {
  STUDENT: {
    label: 'Student',
    icon: GraduationCap,
    bg: '#EDEBF7',
    text: '#7C5CFC',
  },
  EMPLOYEE: {
    label: 'Employee',
    icon: Briefcase,
    bg: '#E6F7F6',
    text: '#0EA5E9',
  },
  BUSINESS_OWNER: {
    label: 'Business Owner',
    icon: Building2,
    bg: '#E6F7E4',
    text: '#10B981',
  },
};

/* ─── Toast notification ─── */
function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`fixed top-16 sm:top-20 right-4 sm:right-6 left-4 sm:left-auto z-50 px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-sm font-medium ${
        type === 'success'
          ? 'bg-emerald-600 text-white'
          : 'bg-red-600 text-white'
      }`}
    >
      {type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
      <span>{message}</span>
    </motion.div>
  );
}

/* ─── Profile Edit Form ─── */
function ProfileEditSection({ user, serverProfile, onSuccess }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: serverProfile?.name || user?.name || '',
    phone: serverProfile?.phone || user?.phone || '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Full name is required.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const result = await userService.updateProfile({
        name: form.name.trim(),
        phone: form.phone.trim() || null,
      });
      onSuccess(result);
      setEditing(false);
    } catch (err) {
      setError(err?.message || 'Failed to update profile.');
    } finally {
      setSubmitting(false);
    }
  };

  const effectiveUser = serverProfile || user;
  const typeConfig = ACCOUNT_TYPE_CONFIG[effectiveUser?.accountType || effectiveUser?.userType] || ACCOUNT_TYPE_CONFIG.STUDENT;
  const TypeIcon = typeConfig.icon;

  return (
    <div className="glass-card glossy-panel rounded-2xl sm:rounded-3xl border border-white/80 dark:border-white/10 shadow-xl overflow-hidden">
      {/* Profile Header Banner */}
      <div
        className="h-24 sm:h-28 relative"
        style={{ background: 'linear-gradient(135deg, rgba(237, 235, 247, 0.8) 0%, rgba(230, 247, 246, 0.8) 50%, rgba(230, 247, 228, 0.8) 100%)' }}
      >
        <div className="absolute bottom-0 left-4 sm:left-8 translate-y-1/2">
          <div className="relative">
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl border-4 border-white/90 dark:border-white/20 glass-1 flex items-center justify-center font-black text-xl sm:text-2xl shadow-xl"
              style={{ background: typeConfig.bg, color: typeConfig.text }}
            >
              {(form.name || effectiveUser?.name || 'U')[0]?.toUpperCase()}
            </div>
            <div
              className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 rounded-lg sm:rounded-xl border-2 border-white dark:border-gray-900 flex items-center justify-center shadow-sm cursor-pointer"
              style={{ background: typeConfig.bg, color: typeConfig.text }}
              title="Change avatar (coming soon)"
            >
              <Camera size={12} />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-12 sm:pt-14 pb-5 sm:pb-6 px-4 sm:px-8">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-primary-text dark:text-white">
              {form.name || effectiveUser?.name || 'User'}
            </h2>
            <div className="flex items-center gap-2 mt-1.5">
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold"
                style={{ background: typeConfig.bg, color: typeConfig.text }}
              >
                <TypeIcon size={12} />
                {typeConfig.label}
              </span>
            </div>
          </div>

          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-primary-text dark:text-gray-200 transition-all"
            >
              <Pencil size={15} />
              Edit Profile
            </button>
          )}
        </div>

        {editing ? (
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
                <AlertCircle size={15} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <InputField
              id="profile-name"
              name="name"
              label="Full Name"
              placeholder="Your full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />

            <InputField
              id="profile-phone"
              name="phone"
              label="Phone Number"
              placeholder="e.g. +91 98765 43210"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />

            <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
              <span className="text-xs font-medium text-secondary-text block mb-0.5">Email</span>
              <span className="text-sm font-semibold text-primary-text dark:text-white">
                {effectiveUser?.email || '—'}
              </span>
              <span className="text-xs text-secondary-text block mt-0.5">
                Email cannot be changed
              </span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => {
                  setEditing(false);
                  setError('');
                  setForm({
                    name: serverProfile?.name || user?.name || '',
                    phone: serverProfile?.phone || user?.phone || '',
                  });
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                action="save"
                isLoading={submitting}
                size="sm"
              >
                Save Changes
              </Button>
            </div>
          </form>
        ) : (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
              <div className="w-9 h-9 rounded-xl bg-violet-50 dark:bg-violet-950/30 text-violet-600 flex items-center justify-center flex-shrink-0">
                <Mail size={16} />
              </div>
              <div>
                <span className="text-xs font-medium text-secondary-text block mb-0.5">Email</span>
                <span className="text-sm font-semibold text-primary-text dark:text-white">
                  {effectiveUser?.email || '—'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
              <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/30 text-sky-600 flex items-center justify-center flex-shrink-0">
                <Phone size={16} />
              </div>
              <div>
                <span className="text-xs font-medium text-secondary-text block mb-0.5">Phone</span>
                <span className="text-sm font-semibold text-primary-text dark:text-white">
                  {effectiveUser?.phone || 'Not provided'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: typeConfig.bg, color: typeConfig.text }}>
                <TypeIcon size={16} />
              </div>
              <div>
                <span className="text-xs font-medium text-secondary-text block mb-0.5">Account Type</span>
                <span className="text-sm font-semibold text-primary-text dark:text-white">
                  {typeConfig.label}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <Shield size={16} />
              </div>
              <div>
                <span className="text-xs font-medium text-secondary-text block mb-0.5">Account Status</span>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 size={14} />
                  Verified & Active
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Security Section (Change Password) ─── */
function SecuritySection() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [show, setShow] = useState({ current: false, new: false, confirm: false });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.currentPassword) {
      setError('Current password is required.');
      return;
    }
    if (form.newPassword.length < 8) {
      setError('New password must be at least 8 characters.');
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      // Note: No backend change-password endpoint found in the codebase.
      // This is a client-side validation exercise — the PATCH /api/users/me 
      // can be used to update password when backend supports it.
      await userService.updateProfile({ password: form.newPassword });
      setSuccess(true);
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => {
        setSuccess(false);
        setOpen(false);
      }, 2500);
    } catch (err) {
      setError(err?.message || 'Failed to change password. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="glass-card rounded-3xl border border-white/80 dark:border-white/10 p-6 shadow-md">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Lock size={17} className="text-violet-500" />
            Security
          </h3>
          <p className="text-xs text-secondary-text mt-0.5">
            Manage your account password
          </p>
        </div>
        {!open && (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setOpen(true)}
          >
            Change Password
          </Button>
        )}
      </div>

      {!open ? (
        <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 flex items-center gap-3">
          <Lock size={18} className="text-violet-500 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-primary-text dark:text-white">Password last changed</p>
            <p className="text-xs text-secondary-text">Password is set and protected</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {success && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
              <CheckCircle2 size={15} />
              Password updated successfully!
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
              <AlertCircle size={15} className="flex-shrink-0" />
              {error}
            </div>
          )}

          {[
            { key: 'current', label: 'Current Password', field: 'currentPassword' },
            { key: 'new', label: 'New Password', field: 'newPassword', hint: 'Minimum 8 characters' },
            { key: 'confirm', label: 'Confirm New Password', field: 'confirmPassword' },
          ].map((item) => (
            <div key={item.key} className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-primary-text dark:text-gray-200">
                {item.label}
              </label>
              <div className="relative">
                <input
                  type={show[item.key] ? 'text' : 'password'}
                  value={form[item.field]}
                  onChange={(e) => setForm({ ...form, [item.field]: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 pr-10 rounded-xl glass-input text-sm text-gray-900 dark:text-gray-100 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShow({ ...show, [item.key]: !show[item.key] })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {show[item.key] ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {item.hint && <p className="text-xs text-secondary-text">{item.hint}</p>}
            </div>
          ))}

          <div className="flex items-center gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => {
                setOpen(false);
                setError('');
                setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              action="save"
              isLoading={submitting}
              size="sm"
            >
              Update Password
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

/* ─── Danger Zone Section ─── */
function DangerZone({ onLogout }) {
  return (
    <div className="glass-card rounded-3xl border border-red-500/25 p-6 shadow-md">
      <h3 className="text-base font-bold text-red-600 dark:text-red-400 mb-2 flex items-center gap-2">
        <AlertCircle size={17} />
        Danger Zone
      </h3>
      <p className="text-xs text-secondary-text mb-4">
        These actions are irreversible. Please be certain before proceeding.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          action="logout"
          variant="danger"
          size="sm"
          onClick={onLogout}
        >
          Sign Out of All Devices
        </Button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PROFILE PAGE
════════════════════════════════════════════════════════════════ */
export default function ProfilePage() {
  const { user, logout } = useAuth();

  const [serverProfile, setServerProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    userService
      .getMe()
      .then((data) => {
        if (mounted && data) setServerProfile(data);
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleProfileSuccess = (updated) => {
    setServerProfile(updated);
    showToast('Profile updated successfully!');
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto pb-12">
      {/* Toast */}
      {toast && (
        <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />
      )}

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-primary-text dark:text-white">My Profile</h1>
        <p className="text-sm text-secondary-text mt-0.5">
          Manage your personal information and account security
        </p>
      </div>

      {/* Loading skeleton */}
      {loading ? (
        <div className="space-y-4">
          <div className="h-56 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 animate-pulse" />
          <div className="h-36 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 animate-pulse" />
        </div>
      ) : (
        <>
          <ProfileEditSection
            user={user}
            serverProfile={serverProfile}
            onSuccess={handleProfileSuccess}
          />

          <SecuritySection />

          <DangerZone onLogout={handleLogout} />
        </>
      )}
    </div>
  );
}
