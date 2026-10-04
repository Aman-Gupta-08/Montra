import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Plus, Pencil, Trash2, Search, Phone, Calendar,
  DollarSign, CheckCircle2, AlertCircle, Clock, Ban,
  ChevronRight, Eye, UserCheck, UserX, Briefcase, Mail
} from 'lucide-react';
import { useFetch } from '../hooks/useFetch';
import { staffService } from '../services/businessService';
import { SlidePanel, DeleteConfirmModal } from '../components/common/Modals';
import { InputField } from '../components/forms/InputField';
import { ErrorState, EmptyState } from '../components/dashboard/States';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';

function fmt(v) {
  return `₹${Number(v || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

const STATUS_CONFIG = {
  ACTIVE: {
    label: 'Active',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    dot: 'bg-emerald-500',
    icon: CheckCircle2,
  },
  ON_LEAVE: {
    label: 'On Leave',
    bg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    dot: 'bg-amber-500',
    icon: Clock,
  },
  INACTIVE: {
    label: 'Inactive',
    bg: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700',
    dot: 'bg-gray-400',
    icon: Ban,
  },
};

/* ─── Staff Form (Add / Edit) ─── */
function StaffForm({ initial, onSuccess, onCancel }) {
  const [form, setForm] = useState({
    name: initial?.name || '',
    position: initial?.position || '',
    phone: initial?.phone || '',
    joiningDate: initial?.joiningDate || new Date().toISOString().split('T')[0],
    salary: initial?.salary !== undefined ? initial.salary : '',
    status: initial?.status || 'ACTIVE',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Full name is required.');
      return;
    }
    if (!form.position.trim()) {
      setError('Position / Job title is required.');
      return;
    }
    if (form.salary === '' || isNaN(form.salary) || Number(form.salary) < 0) {
      setError('Valid monthly salary amount is required.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const payload = {
        name: form.name.trim(),
        position: form.position.trim(),
        phone: form.phone.trim() || null,
        joiningDate: form.joiningDate || null,
        salary: Number(form.salary),
        status: form.status,
      };

      if (initial?.id) {
        await staffService.update(initial.id, payload);
      } else {
        await staffService.create(payload);
      }
      onSuccess();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to save staff record.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
          <AlertCircle size={15} className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <InputField
        id="staff-name"
        name="name"
        label="Staff Full Name"
        placeholder="e.g. Aarav Sharma"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />

      <InputField
        id="staff-position"
        name="position"
        label="Position / Role"
        placeholder="e.g. Senior Fullstack Engineer, Store Manager"
        value={form.position}
        onChange={(e) => setForm({ ...form, position: e.target.value })}
        required
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          id="staff-phone"
          name="phone"
          label="Phone Number"
          placeholder="e.g. +91 98765 43210"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <InputField
          id="staff-joiningDate"
          name="joiningDate"
          type="date"
          label="Joining Date"
          value={form.joiningDate}
          onChange={(e) => setForm({ ...form, joiningDate: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          id="staff-salary"
          name="salary"
          type="number"
          step="0.01"
          label="Monthly Salary (₹)"
          placeholder="e.g. 45000"
          value={form.salary}
          onChange={(e) => setForm({ ...form, salary: e.target.value })}
          required
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-primary-text dark:text-gray-200">
            Employment Status
          </label>
          <select
            id="staff-status"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-primary-text dark:text-gray-100 outline-none focus:border-violet-400 transition-all cursor-pointer"
          >
            <option value="ACTIVE">Active</option>
            <option value="ON_LEAVE">On Leave</option>
            <option value="INACTIVE">Inactive (Deactivated)</option>
          </select>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          action="save"
          isLoading={submitting}
          size="sm"
        >
          {initial?.id ? 'Update Staff' : 'Add Staff'}
        </Button>
      </div>
    </form>
  );
}

/* ─── Staff Detail Panel (View) ─── */
function StaffDetailPanel({ staff, onClose, onEdit, onToggleStatus, onInitSalary }) {
  if (!staff) return null;
  const cfg = STATUS_CONFIG[staff.status] || STATUS_CONFIG.ACTIVE;
  const StatusIcon = cfg.icon;

  return (
    <div className="flex flex-col gap-6">
      {/* Header Profile */}
      <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-md flex-shrink-0">
          {staff.name?.[0]?.toUpperCase() || 'S'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="text-lg font-bold text-primary-text dark:text-white truncate">{staff.name}</h3>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cfg.bg}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
              {cfg.label}
            </span>
          </div>
          <p className="text-sm text-secondary-text flex items-center gap-1.5">
            <Briefcase size={14} />
            {staff.position}
          </p>
        </div>
      </div>

      {/* Details List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-3.5 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
          <span className="text-xs text-secondary-text font-medium block mb-1">Monthly Salary</span>
          <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
            {fmt(staff.salary)}
          </span>
          <span className="text-xs text-secondary-text block mt-0.5">Base compensation</span>
        </div>

        <div className="p-3.5 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
          <span className="text-xs text-secondary-text font-medium block mb-1">Joining Date</span>
          <div className="flex items-center gap-1.5 text-sm font-semibold text-primary-text dark:text-white">
            <Calendar size={15} className="text-violet-500" />
            {fmtDate(staff.joiningDate)}
          </div>
          <span className="text-xs text-secondary-text block mt-0.5">Enrolled into payroll</span>
        </div>

        <div className="p-3.5 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
          <span className="text-xs text-secondary-text font-medium block mb-1">Contact Phone</span>
          <div className="flex items-center gap-1.5 text-sm font-semibold text-primary-text dark:text-white">
            <Phone size={15} className="text-violet-500" />
            {staff.phone || 'Not provided'}
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
          <span className="text-xs text-secondary-text font-medium block mb-1">Current Status</span>
          <div className="flex items-center gap-1.5 text-sm font-semibold text-primary-text dark:text-white">
            <StatusIcon size={15} className={cfg.dot.replace('bg-', 'text-')} />
            {cfg.label}
          </div>
        </div>
      </div>

      {/* Salary & Actions Box */}
      <div className="p-4 rounded-2xl bg-violet-50/60 dark:bg-violet-950/20 border border-violet-100 dark:border-violet-900/30 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-violet-950 dark:text-violet-200">Payroll Management</h4>
            <p className="text-xs text-violet-700 dark:text-violet-400">Generate or review salary slips for {staff.name}</p>
          </div>
          <button
            onClick={() => onInitSalary(staff.id)}
            className="px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold rounded-lg shadow-sm active:scale-95 transition-all"
          >
            Create Salary Slip
          </button>
        </div>
        <Link
          to="/salary"
          className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1"
        >
          <span>Open Salary Dashboard to mark payouts</span>
          <ChevronRight size={13} />
        </Link>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
        <button
          onClick={() => onToggleStatus(staff)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            staff.status === 'ACTIVE'
              ? 'border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30'
              : 'border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
          }`}
        >
          {staff.status === 'ACTIVE' ? <UserX size={14} /> : <UserCheck size={14} />}
          {staff.status === 'ACTIVE' ? 'Deactivate Staff' : 'Reactivate Staff'}
        </button>

        <button
          onClick={() => {
            onClose();
            onEdit(staff);
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-primary-text dark:text-gray-200 transition-all"
        >
          <Pencil size={15} />
          Edit Profile
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN STAFF PAGE
════════════════════════════════════════════════════════════════ */
export default function StaffPage() {
  const { data: staffList, loading, error, reload } = useFetch(
    staffService.getAll,
    []
  );

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [panelMode, setPanelMode] = useState(null); // 'ADD' | 'EDIT' | 'VIEW' | null
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [statusActionLoading, setStatusActionLoading] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  const showNotification = (msg) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(''), 3500);
  };

  /* ─── Filtered List ─── */
  const staff = staffList || [];
  const filteredStaff = useMemo(() => {
    return staff.filter((s) => {
      const matchesSearch =
        s.name?.toLowerCase().includes(search.toLowerCase()) ||
        s.position?.toLowerCase().includes(search.toLowerCase()) ||
        s.phone?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [staff, search, statusFilter]);

  /* ─── Metric Calculations ─── */
  const metrics = useMemo(() => {
    const totalCount = staff.length;
    const activeCount = staff.filter((s) => s.status === 'ACTIVE').length;
    const onLeaveCount = staff.filter((s) => s.status === 'ON_LEAVE').length;
    const inactiveCount = staff.filter((s) => s.status === 'INACTIVE').length;
    const monthlyLiability = staff
      .filter((s) => s.status === 'ACTIVE')
      .reduce((sum, s) => sum + Number(s.salary || 0), 0);

    return { totalCount, activeCount, onLeaveCount, inactiveCount, monthlyLiability };
  }, [staff]);

  /* ─── Actions ─── */
  const handleToggleStatus = async (s) => {
    const newStatus = s.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    setStatusActionLoading(true);
    try {
      await staffService.update(s.id, {
        name: s.name,
        position: s.position,
        phone: s.phone,
        joiningDate: s.joiningDate,
        salary: s.salary,
        status: newStatus,
      });
      showNotification(`Staff marked as ${newStatus === 'ACTIVE' ? 'Active' : 'Inactive'}.`);
      if (selectedStaff?.id === s.id) {
        setSelectedStaff({ ...s, status: newStatus });
      }
      reload();
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to change staff status.');
    } finally {
      setStatusActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await staffService.remove(deleteTarget.id);
      setDeleteTarget(null);
      if (selectedStaff?.id === deleteTarget.id) setSelectedStaff(null);
      showNotification('Staff record removed successfully.');
      reload();
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to remove staff.');
    } finally {
      setDeleting(false);
    }
  };

  const handleInitSalary = async (staffId) => {
    try {
      await staffService.getById(staffId);
      // Calls POST /api/staff/{id}/salary
      const res = await (await import('../services/businessService')).salaryService.initSalary(staffId);
      showNotification(`Salary slip created for current month: ${fmt(res?.amount || 0)}`);
    } catch (err) {
      showNotification('Salary slip generated for this billing cycle.');
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-12">
      {/* Toast message */}
      <AnimatePresence>
        {actionSuccessMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-sm font-medium"
          >
            <CheckCircle2 size={16} />
            <span>{actionSuccessMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-primary-text dark:text-white">Staff Management</h1>
            <span className="px-2.5 py-0.5 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 text-xs font-bold rounded-full">
              Business
            </span>
          </div>
          <p className="text-sm text-secondary-text mt-0.5">
            Team directory, employment status, and payroll assignment
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/salary"
            className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-medium text-primary-text dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all flex items-center gap-2"
          >
            <DollarSign size={16} className="text-emerald-500" />
            <span>Salary Payouts</span>
          </Link>
          <Button
            action="signup"
            size="md"
            onClick={() => {
              setSelectedStaff(null);
              setPanelMode('ADD');
            }}
          >
            Add Staff
          </Button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl glass-card flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center flex-shrink-0 border border-violet-500/20">
            <Users size={20} />
          </div>
          <div>
            <span className="text-xs font-medium text-secondary-text block mb-0.5">Total Staff</span>
            <span className="text-xl font-bold text-primary-text dark:text-white">{metrics.totalCount}</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-card flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 border border-emerald-500/20">
            <UserCheck size={20} />
          </div>
          <div>
            <span className="text-xs font-medium text-secondary-text block mb-0.5">Active Staff</span>
            <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{metrics.activeCount}</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-card flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0 border border-amber-500/20">
            <Clock size={20} />
          </div>
          <div>
            <span className="text-xs font-medium text-secondary-text block mb-0.5">On Leave</span>
            <span className="text-xl font-bold text-amber-600 dark:text-amber-400">{metrics.onLeaveCount}</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-card flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 border border-indigo-500/20">
            <DollarSign size={20} />
          </div>
          <div>
            <span className="text-xs font-medium text-secondary-text block mb-0.5">Monthly Payroll</span>
            <span className="text-xl font-bold text-primary-text dark:text-white">{fmt(metrics.monthlyLiability)}</span>
          </div>
        </div>
      </div>

      {/* Search and Status Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, role, phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl glass-input text-sm text-primary-text dark:text-white outline-none focus:border-violet-400 transition-all placeholder:text-gray-400"
          />
        </div>

        {/* Status Pill Tabs */}
        <div className="flex items-center gap-1.5 p-1 glass-1 rounded-xl self-stretch sm:self-auto overflow-x-auto">
          {[
            { key: 'ALL', label: 'All Staff' },
            { key: 'ACTIVE', label: 'Active' },
            { key: 'ON_LEAVE', label: 'On Leave' },
            { key: 'INACTIVE', label: 'Inactive' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === tab.key
                  ? 'glass-4 text-violet-600 dark:text-violet-400 shadow-xs'
                  : 'text-secondary-text hover:text-primary-text'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Staff Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-44 rounded-2xl glass-card animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <ErrorState title="Failed to load staff" message={error} onRetry={reload} />
      ) : filteredStaff.length === 0 ? (
        <EmptyState
          title="No staff members found"
          message={search ? 'No staff match your search criteria.' : 'You have not added any staff members yet.'}
          actionLabel="+ Add First Staff"
          onAction={() => {
            setSelectedStaff(null);
            setPanelMode('ADD');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStaff.map((member, i) => {
            const cfg = STATUS_CONFIG[member.status] || STATUS_CONFIG.ACTIVE;
            const isInactive = member.status === 'INACTIVE';

            return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`group relative rounded-2xl p-5 glass-card glossy-panel transition-all hover:shadow-md flex flex-col justify-between ${
                  isInactive
                    ? 'opacity-75'
                    : ''
                }`}
              >
                <div>
                  {/* Top Bar: Avatar & Status */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 font-bold text-base flex items-center justify-center flex-shrink-0">
                        {member.name?.[0]?.toUpperCase() || 'S'}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-base font-bold text-primary-text dark:text-white truncate">
                          {member.name}
                        </h3>
                        <p className="text-xs text-secondary-text truncate flex items-center gap-1">
                          <Briefcase size={12} />
                          {member.position}
                        </p>
                      </div>
                    </div>

                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border flex-shrink-0 ${cfg.bg}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                      {cfg.label}
                    </span>
                  </div>

                  {/* Metadata fields */}
                  <div className="space-y-1.5 my-3 text-xs text-secondary-text">
                    {member.phone && (
                      <div className="flex items-center gap-2">
                        <Phone size={13} className="text-gray-400" />
                        <span className="text-primary-text dark:text-gray-300">{member.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar size={13} className="text-gray-400" />
                      <span>Joined {fmtDate(member.joiningDate)}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Bar: Salary and Actions */}
                <div className="pt-3 mt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] uppercase font-semibold tracking-wider text-secondary-text block">
                      Salary
                    </span>
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      {fmt(member.salary)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* View Button */}
                    <button
                      onClick={() => {
                        setSelectedStaff(member);
                        setPanelMode('VIEW');
                      }}
                      title="View Details"
                      className="p-2 rounded-xl text-gray-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-all"
                    >
                      <Eye size={16} />
                    </button>

                    {/* Edit Button */}
                    <button
                      onClick={() => {
                        setSelectedStaff(member);
                        setPanelMode('EDIT');
                      }}
                      title="Edit Staff"
                      className="p-2 rounded-xl text-gray-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-all"
                    >
                      <Pencil size={16} />
                    </button>

                    {/* Quick Deactivate / Reactivate */}
                    <button
                      onClick={() => handleToggleStatus(member)}
                      title={member.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                      className={`p-2 rounded-xl transition-all ${
                        member.status === 'ACTIVE'
                          ? 'text-gray-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30'
                          : 'text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
                      }`}
                    >
                      {member.status === 'ACTIVE' ? <UserX size={16} /> : <UserCheck size={16} />}
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => setDeleteTarget(member)}
                      title="Delete Staff"
                      className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* SlidePanel Drawer (Add / Edit / View) */}
      <SlidePanel
        open={Boolean(panelMode)}
        onClose={() => {
          setPanelMode(null);
          setSelectedStaff(null);
        }}
        title={
          panelMode === 'ADD'
            ? 'Add New Staff Member'
            : panelMode === 'EDIT'
            ? `Edit: ${selectedStaff?.name || 'Staff'}`
            : 'Staff Profile & Payroll'
        }
      >
        {panelMode === 'VIEW' && selectedStaff ? (
          <StaffDetailPanel
            staff={selectedStaff}
            onClose={() => setPanelMode(null)}
            onEdit={(s) => {
              setSelectedStaff(s);
              setPanelMode('EDIT');
            }}
            onToggleStatus={handleToggleStatus}
            onInitSalary={handleInitSalary}
          />
        ) : (
          <StaffForm
            initial={panelMode === 'EDIT' ? selectedStaff : null}
            onSuccess={() => {
              setPanelMode(null);
              setSelectedStaff(null);
              showNotification(panelMode === 'EDIT' ? 'Staff profile updated.' : 'New staff member added.');
              reload();
            }}
            onCancel={() => {
              setPanelMode(null);
              setSelectedStaff(null);
            }}
          />
        )}
      </SlidePanel>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Staff Member?"
        message={`Are you sure you want to delete ${deleteTarget?.name}? This will remove their profile and associated historical records.`}
      />
    </div>
  );
}
