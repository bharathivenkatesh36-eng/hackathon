import React, { useState } from 'react';
import {
  CheckSquare,
  Square,
  Plus,
  Calendar,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';
import { ActionPlanTask, Notice } from '../../types/notice';
import { NoticeService } from '../../services/noticeService';

interface ActionPlansPageProps {
  tasks: ActionPlanTask[];
  notices: Notice[];
  onToggleTask: (task: ActionPlanTask) => void;
  onSelectNotice: (noticeId: string) => void;
  onAddTask: (task: ActionPlanTask) => void;
  onShowToast: (message: string, type: 'success' | 'info' | 'error') => void;
}

export const ActionPlansPage: React.FC<ActionPlansPageProps> = ({
  tasks,
  notices,
  onToggleTask,
  onSelectNotice,
  onAddTask,
  onShowToast
}) => {
  const [selectedNoticeId, setSelectedNoticeId] = useState<string>('all');
  const [filterType, setFilterType] = useState<'all' | 'mandatory' | 'suggested'>('all');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskNoticeId, setNewTaskNoticeId] = useState<string>(notices[0]?.id || '');
  const [newTaskType, setNewTaskType] = useState<'mandatory' | 'suggested'>('mandatory');

  const filteredTasks = tasks.filter((t) => {
    const matchNotice = selectedNoticeId === 'all' || t.noticeId === selectedNoticeId;
    const matchType = filterType === 'all' || t.type === filterType;
    return matchNotice && matchType;
  });

  const mandatoryTasks = filteredTasks.filter((t) => t.type === 'mandatory');
  const suggestedTasks = filteredTasks.filter((t) => t.type === 'suggested');

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const targetNotice = notices.find((n) => n.id === newTaskNoticeId);

    const task: ActionPlanTask = {
      id: `task-custom-${Date.now()}`,
      noticeId: newTaskNoticeId,
      noticeTitle: targetNotice ? targetNotice.title : 'General Compliance',
      title: newTaskTitle.trim(),
      description: newTaskDesc.trim() || 'Custom defense action step',
      dueDate: newTaskDueDate || null,
      completed: false,
      type: newTaskType,
      category: targetNotice ? targetNotice.category : 'Regulatory & Labor'
    };

    onAddTask(task);
    onShowToast('Action item added to plan', 'success');
    setShowAddModal(false);
    setNewTaskTitle('');
    setNewTaskDesc('');
    setNewTaskDueDate('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#183B70] tracking-tight">
            Compliance Action Plans
          </h1>
          <p className="mt-0.5 text-xs text-slate-500">
            Organized checklists separating mandatory statutory duties from strategic defense preparations.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-linear-to-r from-[#126A78] to-[#183B70] hover:from-[#0e525d] hover:to-[#122e58] shadow-xs hover:shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 text-[#B6E6D9]" />
          <span>Add Custom Task</span>
        </button>
      </div>

      {/* Progress & Overview Card */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="w-14 h-14 rounded-2xl bg-[#EEF8F6] border border-[#B6E6D9] flex items-center justify-center text-[#126A78] shrink-0 font-bold text-lg tabular-nums">
            {progressPercent}%
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#183B70]">Overall Defense Execution</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {completedCount} of {tasks.length} tasks completed across active notices
            </p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
          {/* Notice Filter Dropdown */}
          <select
            value={selectedNoticeId}
            onChange={(e) => setSelectedNoticeId(e.target.value)}
            className="text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#329F9C]/30 max-w-xs truncate"
          >
            <option value="all">All Associated Notices ({notices.length})</option>
            {notices.map((n) => (
              <option key={n.id} value={n.id}>
                {n.title.length > 40 ? `${n.title.slice(0, 40)}...` : n.title}
              </option>
            ))}
          </select>

          {/* Type Filter Tabs */}
          <div className="p-1 rounded-lg bg-slate-100 border border-slate-200 flex items-center text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                filterType === 'all' ? 'bg-white text-[#183B70] shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('mandatory')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                filterType === 'mandatory' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mandatory
            </button>
            <button
              onClick={() => setFilterType('suggested')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                filterType === 'suggested' ? 'bg-white text-[#126A78] shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Suggested
            </button>
          </div>
        </div>
      </div>

      {/* Mandatory Statutory Actions Section */}
      {(filterType === 'all' || filterType === 'mandatory') && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded border border-rose-200">
              Mandatory Statutory Duties
            </span>
            <span className="text-xs text-slate-500">
              ({mandatoryTasks.filter((t) => !t.completed).length} pending deadlines)
            </span>
          </div>

          <div className="space-y-2.5">
            {mandatoryTasks.length > 0 ? (
              mandatoryTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => onToggleTask(task)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 bg-white ${
                    task.completed
                      ? 'border-slate-200 bg-slate-50/70 text-slate-400'
                      : 'border-slate-200 hover:border-[#329F9C] shadow-2xs'
                  }`}
                >
                  <button
                    className="mt-0.5"
                    aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400" />
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h4
                        className={`text-xs font-bold ${
                          task.completed ? 'line-through text-slate-400' : 'text-[#183B70]'
                        }`}
                      >
                        {task.title}
                      </h4>
                      {task.dueDate && (
                        <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded shrink-0 tabular-nums self-start sm:self-auto">
                          Due: {task.dueDate}
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                      {task.description}
                    </p>

                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectNotice(task.noticeId);
                        }}
                        className="text-[#126A78] hover:underline font-medium flex items-center gap-1"
                      >
                        <span>Notice: {task.noticeTitle}</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                      <span className="text-slate-400">{task.category}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center bg-white/60 rounded-xl border border-slate-200 text-xs text-slate-500">
                No mandatory tasks match the active filters.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Suggested Preparations Section */}
      {(filterType === 'all' || filterType === 'suggested') && (
        <div className="space-y-3 pt-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#126A78] bg-[#EEF8F6] px-2.5 py-0.5 rounded border border-[#B6E6D9]/50">
              Suggested Defense Preparations
            </span>
            <span className="text-xs text-slate-500">
              ({suggestedTasks.filter((t) => !t.completed).length} recommended steps)
            </span>
          </div>

          <div className="space-y-2.5">
            {suggestedTasks.length > 0 ? (
              suggestedTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => onToggleTask(task)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 bg-white ${
                    task.completed
                      ? 'border-slate-200 bg-slate-50/70 text-slate-400'
                      : 'border-slate-200 hover:border-[#329F9C] shadow-2xs'
                  }`}
                >
                  <button
                    className="mt-0.5"
                    aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400" />
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h4
                        className={`text-xs font-bold ${
                          task.completed ? 'line-through text-slate-400' : 'text-[#183B70]'
                        }`}
                      >
                        {task.title}
                      </h4>
                      <span className="text-[11px] font-medium text-slate-500 shrink-0">
                        Strategic Prep
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                      {task.description}
                    </p>

                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectNotice(task.noticeId);
                        }}
                        className="text-[#126A78] hover:underline font-medium flex items-center gap-1"
                      >
                        <span>Notice: {task.noticeTitle}</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                      <span className="text-slate-400">{task.category}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center bg-white/60 rounded-xl border border-slate-200 text-xs text-slate-500">
                No suggested preparation tasks match the active filters.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Custom Task Modal */}
      {showAddModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
        >
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-[#183B70]">Add Custom Action Task</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Associate with Notice:
                </label>
                <select
                  value={newTaskNoticeId}
                  onChange={(e) => setNewTaskNoticeId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#329F9C]/30 text-slate-700"
                >
                  {notices.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Task Title:
                </label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g., Deliver signed CPA affirmation letter to district office"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#329F9C]/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Task Details & Location Notes:
                </label>
                <textarea
                  rows={3}
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  placeholder="Include phone numbers, contact names, or specific exhibit references..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#329F9C]/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Due Date (Optional):
                  </label>
                  <input
                    type="date"
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#329F9C]/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Obligation Classification:
                  </label>
                  <select
                    value={newTaskType}
                    onChange={(e) => setNewTaskType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#329F9C]/30 text-slate-700"
                  >
                    <option value="mandatory">Mandatory Statutory Duty</option>
                    <option value="suggested">Suggested Preparation</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-linear-to-r from-[#126A78] to-[#183B70] hover:from-[#0e525d] hover:to-[#122e58] rounded-lg shadow-xs"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
