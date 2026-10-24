import React, { useState, useEffect } from 'react';
import {
  AppSidebar,
  NavTab
} from './components/layout/AppSidebar';
import { AppHeader } from './components/layout/AppHeader';
import { OverviewPage } from './components/pages/OverviewPage';
import { UploadPage } from './components/pages/UploadPage';
import { AnalysisResultPage } from './components/pages/AnalysisResultPage';
import { MyNoticesPage } from './components/pages/MyNoticesPage';
import { ActionPlansPage } from './components/pages/ActionPlansPage';
import { ResponseAssistantPage } from './components/pages/ResponseAssistantPage';
import { SettingsPage } from './components/pages/SettingsPage';
import { ToastContainer, ToastMessage } from './components/common/Toast';
import { Notice, ActionPlanTask, AppSettings, NoticeStatus } from './types/notice';
import { NoticeService } from './services/noticeService';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [selectedNoticeId, setSelectedNoticeId] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  const [notices, setNotices] = useState<Notice[]>([]);
  const [tasks, setTasks] = useState<ActionPlanTask[]>([]);
  const [settings, setSettings] = useState<AppSettings>(NoticeService.getSettings());
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [globalSearch, setGlobalSearch] = useState<string>('');
  const [categoryFilterNav, setCategoryFilterNav] = useState<string>('all');

  // Load initial data
  const refreshData = () => {
    const loadedNotices = NoticeService.getNotices();
    const loadedTasks = NoticeService.getAllActionPlanTasks();
    const loadedSettings = NoticeService.getSettings();
    setNotices(loadedNotices);
    setTasks(loadedTasks);
    setSettings(loadedSettings);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Navigation handlers
  const handleSelectNotice = (noticeId: string) => {
    setSelectedNoticeId(noticeId);
    setActiveTab('notices');
  };

  const handleNavigateUpload = () => {
    setSelectedNoticeId(null);
    setActiveTab('analyze');
  };

  const handleNavigateNotices = (category?: string) => {
    setSelectedNoticeId(null);
    if (category) {
      setCategoryFilterNav(category);
    } else {
      setCategoryFilterNav('all');
    }
    setActiveTab('notices');
  };

  const handleNavigateActions = () => {
    setSelectedNoticeId(null);
    setActiveTab('actions');
  };

  const handleNavigateResponseAssistant = (noticeId?: string) => {
    if (noticeId) {
      setSelectedNoticeId(noticeId);
    }
    setActiveTab('responses');
  };

  // Callback when a notice is updated
  const handleNoticeUpdated = (updatedNotice: Notice) => {
    const updatedList = notices.map((n) => (n.id === updatedNotice.id ? updatedNotice : n));
    setNotices(updatedList);
    setTasks(NoticeService.getAllActionPlanTasks());
  };

  // Callback when a notice is deleted
  const handleNoticeDeleted = (deletedId: string) => {
    setNotices((prev) => prev.filter((n) => n.id !== deletedId));
    if (selectedNoticeId === deletedId) {
      setSelectedNoticeId(null);
    }
    setTasks(NoticeService.getAllActionPlanTasks());
  };

  // Toggle action plan task
  const handleToggleTask = (task: ActionPlanTask) => {
    NoticeService.toggleActionPlanTask(task);
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, completed: !t.completed } : t))
    );
    // Sync notice state
    setNotices(NoticeService.getNotices());
    showToast(
      task.completed ? 'Task marked incomplete' : 'Task completed successfully',
      'success'
    );
  };

  // Add custom action plan task
  const handleAddCustomTask = (task: ActionPlanTask) => {
    NoticeService.addCustomTask(task);
    setTasks(NoticeService.getAllActionPlanTasks());
  };

  // Active counts for badges
  const needsAttentionCount = notices.filter((n) => n.status === 'needs_attention').length;
  const pendingActionsCount = tasks.filter((t) => !t.completed).length;

  // Selected notice object if viewing analysis
  const currentSelectedNotice = selectedNoticeId
    ? notices.find((n) => n.id === selectedNoticeId)
    : null;

  // Build breadcrumbs dynamically
  const breadcrumbs: { label: string; onClick?: () => void }[] = [
    {
      label: 'Notice on the Desk',
      onClick: () => {
        setSelectedNoticeId(null);
        setActiveTab('overview');
      }
    }
  ];

  if (activeTab === 'overview') {
    breadcrumbs.push({ label: 'Overview Dashboard' });
  } else if (activeTab === 'analyze') {
    breadcrumbs.push({ label: 'Analyze Notice' });
  } else if (activeTab === 'notices') {
    breadcrumbs.push({
      label: 'My Notices',
      onClick: currentSelectedNotice
        ? () => setSelectedNoticeId(null)
        : undefined
    });
    if (currentSelectedNotice) {
      breadcrumbs.push({ label: currentSelectedNotice.title });
    }
  } else if (activeTab === 'actions') {
    breadcrumbs.push({ label: 'Action Plans' });
  } else if (activeTab === 'responses') {
    breadcrumbs.push({ label: 'Response Assistant' });
    if (currentSelectedNotice) {
      breadcrumbs.push({ label: currentSelectedNotice.title });
    }
  } else if (activeTab === 'settings') {
    breadcrumbs.push({ label: 'Settings' });
  }

  return (
    <div className="relative min-h-screen flex flex-col md:flex-row bg-[#F7F9FC] text-[#183B70] font-sans antialiased overflow-x-hidden selection:bg-[#B6E6D9] selection:text-[#126A78]">
      {/* Premium Prism Ambient Atmospheric Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Soft geometric prism image layer */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.14] mix-blend-multiply"
          style={{ backgroundImage: `url('/assets/aistudio/image_e7e8be5e.png')` }}
        />

        {/* Ambient atmospheric lighting gradients */}
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-[#DDF3D2]/35 rounded-full blur-[120px]" />
        <div className="absolute top-1/4 right-0 w-[550px] h-[550px] bg-[#B6E6D9]/30 rounded-full blur-[130px]" />
        <div className="absolute bottom-0 left-1/3 w-[650px] h-[650px] bg-[#C8B0F0]/20 rounded-full blur-[140px]" />
      </div>

      {/* Sidebar Navigation */}
      <AppSidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'notices' && tab !== 'responses') {
            setSelectedNoticeId(null);
          }
        }}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        needsAttentionCount={needsAttentionCount}
        pendingActionsCount={pendingActionsCount}
        businessName={settings.businessName}
      />

      {/* Main Workspace Area */}
      <div className="relative z-10 flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Header */}
        <AppHeader
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onNavigateUpload={handleNavigateUpload}
          onSelectNotice={handleSelectNotice}
          notices={notices}
          breadcrumbs={breadcrumbs}
          searchQuery={globalSearch}
          onSearchChange={setGlobalSearch}
          businessName={settings.businessName}
        />

        {/* Page Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <OverviewPage
              notices={notices}
              onSelectNotice={handleSelectNotice}
              onNavigateUpload={handleNavigateUpload}
              onNavigateNotices={handleNavigateNotices}
              onNavigateActions={handleNavigateActions}
            />
          )}

          {/* Tab 2: Analyze Notice */}
          {activeTab === 'analyze' && (
            <UploadPage
              onAnalysisComplete={(noticeId) => {
                refreshData();
                setSelectedNoticeId(noticeId);
                setActiveTab('notices');
                showToast('Notice analysis verified and loaded', 'success');
              }}
              onSelectNotice={handleSelectNotice}
            />
          )}

          {/* Tab 3: My Notices or Individual Analysis Result */}
          {activeTab === 'notices' && (
            <>
              {currentSelectedNotice ? (
                <AnalysisResultPage
                  notice={currentSelectedNotice}
                  onBack={() => setSelectedNoticeId(null)}
                  onNavigateResponseAssistant={handleNavigateResponseAssistant}
                  onNavigateActionPlans={handleNavigateActions}
                  onNoticeUpdated={handleNoticeUpdated}
                  onShowToast={showToast}
                />
              ) : (
                <MyNoticesPage
                  notices={notices}
                  onSelectNotice={handleSelectNotice}
                  onNavigateUpload={handleNavigateUpload}
                  onNavigateResponseAssistant={handleNavigateResponseAssistant}
                  onNoticeDeleted={handleNoticeDeleted}
                  onNoticeStatusChanged={(id, status) => {
                    NoticeService.updateNoticeStatus(id, status);
                    refreshData();
                  }}
                  onShowToast={showToast}
                  initialCategoryFilter={categoryFilterNav}
                />
              )}
            </>
          )}

          {/* Tab 4: Action Plans */}
          {activeTab === 'actions' && (
            <ActionPlansPage
              tasks={tasks}
              notices={notices}
              onToggleTask={handleToggleTask}
              onSelectNotice={handleSelectNotice}
              onAddTask={handleAddCustomTask}
              onShowToast={showToast}
            />
          )}

          {/* Tab 5: Response Assistant */}
          {activeTab === 'responses' && (
            <ResponseAssistantPage
              notices={notices}
              preselectedNoticeId={selectedNoticeId}
              settings={settings}
              onNoticeUpdated={handleNoticeUpdated}
              onShowToast={showToast}
            />
          )}

          {/* Tab 6: Settings */}
          {activeTab === 'settings' && (
            <SettingsPage
              settings={settings}
              onSettingsSaved={(newSettings) => {
                setSettings(newSettings);
              }}
              onResetVault={() => {
                refreshData();
                setSelectedNoticeId(null);
                setActiveTab('overview');
              }}
              onShowToast={showToast}
            />
          )}
        </main>
      </div>

      {/* Floating Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}
