import { useState, useMemo, useEffect } from 'react';
import {
  Home,
  MessageSquare,
  Layers,
  Settings,
  Plus,
  Trash2,
  ChevronDown,
  FileText,
  X,
  LogOut,
  User,
  ArrowRight,
  Sun,
  Moon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Conversation } from '../types/chat';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

interface SidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  onDeleteConversation: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
  onOpenResumePreview: () => void;
  onGoHome?: () => void;
  isHomeActive?: boolean;
}

export function Sidebar({
  conversations,
  activeId,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
  isOpen,
  onClose,
  onOpenSettings,
  onOpenResumePreview,
  onGoHome,
  isHomeActive = true,
}: SidebarProps) {
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { currentUser, userProfile, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const displayName = userProfile?.fullName || currentUser?.displayName || 'Nishu';
  const displayEmail = userProfile?.email || currentUser?.email || 'nishu@example.com';
  const avatarLetter = (displayName || 'N').charAt(0).toUpperCase();

  // Prevent background scrolling on mobile when drawer is open
  useEffect(() => {
    if (isOpen && typeof window !== 'undefined' && window.innerWidth < 1024) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Pressing Escape closes the sidebar / drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Auto-close on mobile when selecting a navigation item
  const handleNavClick = (action?: () => void) => {
    if (action) action();
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      onClose();
    }
  };

  // Recent conversations sorted by latest update
  const recentConversations = useMemo(() => {
    return [...conversations]
      .sort((a, b) => (b.updatedAt || b.createdAt) - (a.updatedAt || a.createdAt))
      .slice(0, 8);
  }, [conversations]);

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (deleteConfirmId === id) {
      onDeleteConversation(id);
      setDeleteConfirmId(null);
    } else {
      setDeleteConfirmId(id);
      setTimeout(() => {
        setDeleteConfirmId((current) => (current === id ? null : current));
      }, 3500);
    }
  };

  const handleLogout = async () => {
    try {
      setIsProfileMenuOpen(false);
      await logout();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <>
      {/* Mobile & Tablet Drawer Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-[#171717]/35 dark:bg-black/65 backdrop-blur-xs lg:hidden transition-opacity duration-300 animate-in fade-in"
          aria-hidden="true"
        />
      )}

      {/* Floating Neumorphic Sidebar Panel (Slide-out drawer on mobile/tablet, Collapsible in-place on desktop) */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 h-[calc(100vh-1.25rem)] md:h-[calc(100vh-2rem)] lg:h-[calc(100vh-2.5rem)] bg-[#F7F7F4] dark:bg-[#1E1E1E] border border-[#E5E5E5]/90 dark:border-[#2E2E2E] rounded-3xl neu-raised flex flex-col justify-between transition-all duration-300 ease-in-out shrink-0 select-none overflow-hidden ${
          isOpen
            ? 'w-72 max-w-[85vw] sm:w-80 md:w-64 lg:w-64 xl:w-72 my-2.5 ml-2.5 md:my-4 md:ml-4 lg:my-5 lg:ml-5 translate-x-0 opacity-100 pointer-events-auto'
            : '-translate-x-[calc(100%+2rem)] lg:translate-x-0 lg:w-0 lg:my-5 lg:ml-0 lg:p-0 lg:border-0 lg:opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto px-3.5 py-4 md:px-3 md:py-4.5 lg:px-4 lg:py-5 scrollbar-none">
          
          {/* 1. ResumeAI logo, name & Close Button */}
          <div className="flex items-center justify-between mb-4 md:mb-5 px-1">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-[#047857] dark:bg-[#059669] flex items-center justify-center shadow-xs text-white shrink-0">
                <FileText className="w-4 h-4 stroke-[2.2]" />
              </div>
              <span className="font-bold text-[#171717] dark:text-[#FFFFFF] text-base tracking-tight truncate">
                ResumeAI
              </span>
            </div>

            {/* Clearly Visible Close (X) Button (works across desktop, tablet, and mobile) */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-[#737373] dark:text-[#A3A3A3] hover:text-[#171717] dark:hover:text-[#FFFFFF] hover:bg-[#FFFFFF] dark:hover:bg-[#262626] transition-colors cursor-pointer shrink-0"
              title="Close sidebar"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 2. New Chat button in Emerald Green */}
          <button
            type="button"
            onClick={() => handleNavClick(onNewChat)}
            className="w-full py-2.5 px-3 md:px-4 mb-3.5 md:mb-4 rounded-2xl bg-[#047857] hover:bg-[#065F46] dark:bg-[#059669] dark:hover:bg-[#10B981] text-[#FFFFFF] text-sm font-semibold flex items-center justify-center gap-2 neu-button-emerald transition-all cursor-pointer group shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="truncate">New Chat</span>
          </button>

          {/* 3. Home, 4. Chats, 5. Templates, 6. Settings */}
          <nav className="space-y-1 mb-3.5 md:mb-4">
            {/* Home */}
            <button
              type="button"
              onClick={() => handleNavClick(onGoHome || onNewChat)}
              className={`w-full flex items-center gap-3 px-3 py-2 md:px-3.5 md:py-2.5 rounded-2xl text-sm font-medium transition-all cursor-pointer ${
                isHomeActive
                  ? 'bg-[#047857]/10 dark:bg-[#10B981]/15 text-[#171717] dark:text-[#FFFFFF] font-semibold neu-raised-sm'
                  : 'text-[#737373] dark:text-[#A3A3A3] hover:text-[#171717] dark:hover:text-[#FFFFFF] hover:bg-[#FFFFFF]/60 dark:hover:bg-[#262626]/60'
              }`}
            >
              <Home className={`w-4 h-4 shrink-0 ${isHomeActive ? 'text-[#047857] dark:text-[#10B981]' : 'text-[#737373] dark:text-[#A3A3A3]'}`} />
              <span className="truncate">Home</span>
            </button>

            {/* Chats */}
            <button
              type="button"
              onClick={() => {
                handleNavClick(() => {
                  if (conversations.length > 0) {
                    onSelectConversation(conversations[0].id);
                  }
                });
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 md:px-3.5 md:py-2.5 rounded-2xl text-sm font-medium transition-all cursor-pointer ${
                !isHomeActive
                  ? 'bg-[#047857]/10 dark:bg-[#10B981]/15 text-[#171717] dark:text-[#FFFFFF] font-semibold neu-raised-sm'
                  : 'text-[#737373] dark:text-[#A3A3A3] hover:text-[#171717] dark:hover:text-[#FFFFFF] hover:bg-[#FFFFFF]/60 dark:hover:bg-[#262626]/60'
              }`}
            >
              <MessageSquare className={`w-4 h-4 shrink-0 ${!isHomeActive ? 'text-[#047857] dark:text-[#10B981]' : 'text-[#737373] dark:text-[#A3A3A3]'}`} />
              <span className="truncate">Chats</span>
            </button>

            {/* Templates */}
            <button
              type="button"
              onClick={() => handleNavClick(onOpenResumePreview)}
              className="w-full flex items-center gap-3 px-3 py-2 md:px-3.5 md:py-2.5 rounded-2xl text-sm font-medium text-[#737373] dark:text-[#A3A3A3] hover:text-[#171717] dark:hover:text-[#FFFFFF] hover:bg-[#FFFFFF]/60 dark:hover:bg-[#262626]/60 transition-all cursor-pointer"
            >
              <Layers className="w-4 h-4 shrink-0 text-[#737373] dark:text-[#A3A3A3]" />
              <span className="truncate">Templates</span>
            </button>

            {/* Settings */}
            <button
              type="button"
              onClick={() => handleNavClick(onOpenSettings)}
              className="w-full flex items-center gap-3 px-3 py-2 md:px-3.5 md:py-2.5 rounded-2xl text-sm font-medium text-[#737373] dark:text-[#A3A3A3] hover:text-[#171717] dark:hover:text-[#FFFFFF] hover:bg-[#FFFFFF]/60 dark:hover:bg-[#262626]/60 transition-all cursor-pointer"
            >
              <Settings className="w-4 h-4 shrink-0 text-[#737373] dark:text-[#A3A3A3]" />
              <span className="truncate">Settings</span>
            </button>
          </nav>

          {/* 7. Recent Chats List */}
          <div className="pt-2 border-t border-[#E5E5E5]/70 dark:border-[#2E2E2E] flex flex-col flex-1 min-h-0">
            <span className="text-[11px] font-semibold text-[#737373] dark:text-[#A3A3A3] uppercase tracking-wider px-2 mb-2">
              Recent Chats
            </span>

            <div className="space-y-0.5 overflow-y-auto flex-1 scrollbar-none pr-0.5">
              {!currentUser ? (
                <div className="px-2.5 py-3 rounded-2xl bg-[#FFFFFF]/60 dark:bg-[#262626]/60 border border-[#E5E5E5]/60 dark:border-[#333333] text-center my-1 neu-inset-sm">
                  <p className="text-[11px] text-[#737373] dark:text-[#A3A3A3] mb-2 leading-relaxed">
                    Sign in to save and sync your resume chats
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      navigate('/login');
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#047857] dark:text-[#10B981] hover:underline cursor-pointer"
                  >
                    <span>Sign in to save</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ) : recentConversations.length === 0 ? (
                <div className="px-2 py-3 text-xs text-[#737373] dark:text-[#A3A3A3] italic">
                  No previous conversations
                </div>
              ) : (
                recentConversations.map((conv) => {
                  const isActive = conv.id === activeId && !isHomeActive;
                  const isDeleting = deleteConfirmId === conv.id;

                  return (
                    <div
                      key={conv.id}
                      onClick={() => handleNavClick(() => onSelectConversation(conv.id))}
                      className={`group relative flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#FFFFFF] dark:bg-[#262626] text-[#047857] dark:text-[#10B981] font-semibold neu-raised-sm'
                          : 'text-[#171717] dark:text-[#EDEDED] hover:bg-[#FFFFFF]/70 dark:hover:bg-[#262626]/70 hover:text-[#047857] dark:hover:text-[#10B981]'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1 mr-1">
                        <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#047857] dark:text-[#10B981]' : 'text-[#737373] dark:text-[#A3A3A3]'}`} />
                        <span className="truncate">{conv.title || 'Resume Chat'}</span>
                      </div>

                      {/* Delete button */}
                      <button
                        type="button"
                        onClick={(e) => handleDeleteClick(e, conv.id)}
                        className={`p-1 rounded-lg transition-opacity shrink-0 ${
                          isDeleting
                            ? 'opacity-100 bg-[#DC2626] text-white'
                            : 'opacity-0 group-hover:opacity-100 text-[#737373] dark:text-[#A3A3A3] hover:text-[#DC2626] hover:bg-[#DC2626]/10'
                        }`}
                        title={isDeleting ? 'Click again to confirm deletion' : 'Delete conversation'}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>

        {/* 8. User Profile & Quick Theme Toggle Section at Bottom */}
        <div className="p-3 border-t border-[#E5E5E5]/70 dark:border-[#2E2E2E] relative bg-[#F7F7F4] dark:bg-[#1E1E1E]">
          {!currentUser ? (
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate('/login');
                }}
                className="w-full flex items-center justify-between p-2 rounded-2xl bg-[#FFFFFF] dark:bg-[#262626] border border-[#E5E5E5] dark:border-[#333333] neu-raised-sm hover:border-[#047857]/40 dark:hover:border-[#10B981]/40 transition-all cursor-pointer group text-left"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-[#E5E5E5] dark:bg-[#333333] text-[#737373] dark:text-[#A3A3A3] flex items-center justify-center shrink-0 group-hover:text-[#047857] dark:group-hover:text-[#10B981] transition-colors">
                    <User className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-semibold text-[#171717] dark:text-[#EDEDED] group-hover:text-[#047857] dark:group-hover:text-[#10B981] transition-colors truncate">
                      Sign In / Sign Up
                    </span>
                    <span className="text-[10px] text-[#737373] dark:text-[#A3A3A3] truncate">Save & sync resumes</span>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#737373] dark:text-[#A3A3A3] group-hover:text-[#047857] dark:group-hover:text-[#10B981] group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>

              {/* Theme toggle bar for visitors */}
              <div className="flex items-center justify-between px-2 py-1 text-xs text-[#737373] dark:text-[#A3A3A3]">
                <span className="text-[11px]">Theme</span>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="p-1.5 rounded-xl bg-[#FFFFFF] dark:bg-[#262626] border border-[#E5E5E5] dark:border-[#333333] text-[#171717] dark:text-[#EDEDED] hover:text-[#047857] dark:hover:text-[#10B981] cursor-pointer transition-colors flex items-center gap-1.5 text-[11px] font-medium"
                  title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                      <span>Light</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-3.5 h-3.5 text-[#737373]" />
                      <span>Dark</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <>
              {isProfileMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsProfileMenuOpen(false)}
                  />
                  <div className="absolute bottom-full left-3 right-3 mb-2 bg-[#FFFFFF] dark:bg-[#262626] border border-[#E5E5E5] dark:border-[#333333] rounded-2xl p-1.5 neu-raised z-50">
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onOpenSettings();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#171717] dark:text-[#EDEDED] hover:bg-[#F7F7F4] dark:hover:bg-[#1E1E1E] rounded-xl transition-colors cursor-pointer"
                    >
                      <Settings className="w-3.5 h-3.5 text-[#737373] dark:text-[#A3A3A3]" />
                      <span>Settings</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        toggleTheme();
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#171717] dark:text-[#EDEDED] hover:bg-[#F7F7F4] dark:hover:bg-[#1E1E1E] rounded-xl transition-colors cursor-pointer"
                    >
                      {theme === 'dark' ? (
                        <>
                          <Sun className="w-3.5 h-3.5 text-amber-400" />
                          <span>Switch to Light Mode</span>
                        </>
                      ) : (
                        <>
                          <Moon className="w-3.5 h-3.5 text-[#737373]" />
                          <span>Switch to Dark Mode</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#DC2626] hover:bg-[#DC2626]/8 rounded-xl transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5 text-[#DC2626]" />
                      <span>Sign out</span>
                    </button>
                  </div>
                </>
              )}

              <div
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center justify-between p-1.5 md:p-2 rounded-2xl hover:bg-[#FFFFFF]/60 dark:hover:bg-[#262626]/60 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-[#047857] dark:bg-[#059669] text-white font-semibold text-xs flex items-center justify-center shadow-xs shrink-0">
                    {avatarLetter}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-semibold text-[#171717] dark:text-[#EDEDED] truncate">{displayName}</span>
                    <span className="text-[10px] text-[#737373] dark:text-[#A3A3A3] truncate">{displayEmail}</span>
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#737373] dark:text-[#A3A3A3] group-hover:text-[#171717] dark:group-hover:text-[#FFFFFF] shrink-0" />
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  );
}
