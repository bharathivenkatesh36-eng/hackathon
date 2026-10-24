import React, { useState } from 'react';
import {
  Building2,
  Bell,
  Shield,
  Trash2,
  RefreshCw,
  Save,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Clock
} from 'lucide-react';
import { AppSettings } from '../../types/notice';
import { NoticeService } from '../../services/noticeService';
import { ConfirmDialog } from '../common/ConfirmDialog';

interface SettingsPageProps {
  settings: AppSettings;
  onSettingsSaved: (newSettings: AppSettings) => void;
  onResetVault: () => void;
  onShowToast: (message: string, type: 'success' | 'info' | 'error') => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  settings,
  onSettingsSaved,
  onResetVault,
  onShowToast
}) => {
  const [formData, setFormData] = useState<AppSettings>(settings);
  const [showPurgeDialog, setShowPurgeDialog] = useState<boolean>(false);
  const [showResetDialog, setShowResetDialog] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    NoticeService.saveSettings(formData);
    onSettingsSaved(formData);
    onShowToast('Settings and entity details updated successfully', 'success');
  };

  const handlePurgeConfirm = () => {
    NoticeService.resetAllData();
    onResetVault();
    setShowPurgeDialog(false);
    onShowToast('All client-stored document data has been permanently purged', 'info');
  };

  const handleResetConfirm = () => {
    NoticeService.resetAllData();
    onResetVault();
    setShowResetDialog(false);
    onShowToast('Vault reset to default demonstration notices', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#183B70] tracking-tight">
          System Settings & Entity Configuration
        </h1>
        <p className="mt-0.5 text-xs text-slate-500">
          Manage your business identity profile, response draft variables, deadline alerts, and data retention rules.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Business Entity Profile */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Building2 className="w-4 h-4 text-[#126A78]" />
            <h2 className="text-sm font-bold text-[#183B70]">
              Business Entity & Statutory Profile
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            These values automatically populate response templates, transmittal headers, and formal extension requests.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Legal Entity Name
              </label>
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#329F9C]/30"
                placeholder="e.g. Apex Precision Technologies LLC"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Employer Identification Number (EIN)
              </label>
              <input
                type="text"
                value={formData.ein}
                onChange={(e) => setFormData({ ...formData, ein: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#329F9C]/30 font-mono"
                placeholder="XX-XXXXXXX"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                State of Organization / Incorporation
              </label>
              <input
                type="text"
                value={formData.stateOfIncorporation}
                onChange={(e) => setFormData({ ...formData, stateOfIncorporation: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#329F9C]/30"
                placeholder="e.g. California"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Registered Agent of Record
              </label>
              <input
                type="text"
                value={formData.registeredAgent}
                onChange={(e) => setFormData({ ...formData, registeredAgent: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#329F9C]/30"
                placeholder="e.g. National Registered Agents, Inc."
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Primary Compliance Contact Email
              </label>
              <input
                type="email"
                value={formData.primaryEmail}
                onChange={(e) => setFormData({ ...formData, primaryEmail: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#329F9C]/30"
                placeholder="compliance@company.com"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Notification & Deadline Alerts */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Bell className="w-4 h-4 text-[#126A78]" />
            <h2 className="text-sm font-bold text-[#183B70]">
              Deadline Notification Preferences
            </h2>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/70">
              <div>
                <h4 className="text-xs font-bold text-[#183B70]">Advance Deadline Warning</h4>
                <p className="text-[11px] text-slate-500">
                  Notify primary contact before statutory or cure response dates.
                </p>
              </div>
              <select
                value={formData.notificationAdvanceDays}
                onChange={(e) =>
                  setFormData({ ...formData, notificationAdvanceDays: Number(e.target.value) })
                }
                className="text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg px-2.5 py-1"
              >
                <option value={3}>3 Days in advance</option>
                <option value={7}>7 Days in advance</option>
                <option value={14}>14 Days in advance</option>
                <option value={30}>30 Days in advance</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/70">
              <div>
                <h4 className="text-xs font-bold text-[#183B70]">Email Alerts for Critical Notices</h4>
                <p className="text-[11px] text-slate-500">
                  Deliver verified analysis summaries directly to compliance email.
                </p>
              </div>
              <input
                type="checkbox"
                checked={formData.emailAlertsEnabled}
                onChange={(e) =>
                  setFormData({ ...formData, emailAlertsEnabled: e.target.checked })
                }
                className="w-4 h-4 text-[#126A78] rounded border-slate-300 focus:ring-[#329F9C]"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/70">
              <div>
                <h4 className="text-xs font-bold text-[#183B70]">Urgent SMS Emergency Flags</h4>
                <p className="text-[11px] text-slate-500">
                  Trigger high-priority text alerts for 10-day cure notices and stop-work citations.
                </p>
              </div>
              <input
                type="checkbox"
                checked={formData.smsUrgentAlertsEnabled}
                onChange={(e) =>
                  setFormData({ ...formData, smsUrgentAlertsEnabled: e.target.checked })
                }
                className="w-4 h-4 text-[#126A78] rounded border-slate-300 focus:ring-[#329F9C]"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Privacy & Data Retention */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Shield className="w-4 h-4 text-[#126A78]" />
            <h2 className="text-sm font-bold text-[#183B70]">
              Privacy, Security & Document Retention
            </h2>
          </div>

          <div className="p-3.5 rounded-xl bg-[#EEF8F6] border border-[#B6E6D9]/60 text-xs text-[#126A78] space-y-1">
            <p className="font-semibold flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              Client Vault Safeguards
            </p>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Uploaded notice metadata and extracted draft replies are stored in your isolated client-side browser cache and local storage. No document text is utilized to train public foundation models.
            </p>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/70">
            <div>
              <h4 className="text-xs font-bold text-[#183B70]">Document Retention Policy</h4>
              <p className="text-[11px] text-slate-500">
                Automatically purge notice records after resolution or stated period.
              </p>
            </div>
            <select
              value={formData.retentionDays}
              onChange={(e) =>
                setFormData({ ...formData, retentionDays: Number(e.target.value) })
              }
              className="text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg px-2.5 py-1"
            >
              <option value={30}>30 Days</option>
              <option value={90}>90 Days (Recommended)</option>
              <option value={365}>1 Year</option>
              <option value={0}>Retain Indefinitely</option>
            </select>
          </div>
        </div>

        {/* Save Changes Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-linear-to-r from-[#126A78] to-[#183B70] hover:from-[#0e525d] hover:to-[#122e58] shadow-xs hover:shadow-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4 text-[#B6E6D9]" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>

      {/* Danger Zone */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-rose-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-rose-700">
          <AlertTriangle className="w-4 h-4" />
          <h3 className="text-sm font-bold">Data Management & Reset Controls</h3>
        </div>
        <p className="text-xs text-slate-600">
          Reset demonstration notices or permanently wipe all cached documents and custom action plans.
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setShowResetDialog(true)}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Demo Notices</span>
          </button>

          <button
            type="button"
            onClick={() => setShowPurgeDialog(true)}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
            <span>Purge All Vault Data</span>
          </button>
        </div>
      </div>

      {/* Confirm Reset Dialog */}
      <ConfirmDialog
        isOpen={showResetDialog}
        title="Reset Demo Notices?"
        message="This will restore the original 6 realistic demonstration notices (IRS Letter 5071C, OSHA Citation, CDTFA Audit, Lease Notice, etc.) and clear any custom uploads."
        confirmLabel="Reset Demo Data"
        cancelLabel="Cancel"
        variant="warning"
        onConfirm={handleResetConfirm}
        onCancel={() => setShowResetDialog(false)}
      />

      {/* Confirm Purge Dialog */}
      <ConfirmDialog
        isOpen={showPurgeDialog}
        title="Permanently Purge All Data?"
        message="This action is irreversible. All saved notices, extracted checklists, custom action plans, and response drafts will be completely removed from your browser storage."
        confirmLabel="Purge Everything"
        cancelLabel="Keep Data"
        variant="danger"
        onConfirm={handlePurgeConfirm}
        onCancel={() => setShowPurgeDialog(false)}
      />
    </div>
  );
};
