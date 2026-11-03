import { useState } from 'react';
import {
  ArrowLeft,
  Pencil,
  Check,
  X,
  MoreVertical,
  FileText,
  RotateCcw,
  Download,
  Trash2,
  Menu,
  Moon,
  Sun,
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface ChatHeaderProps {
  title: string;
  onUpdateTitle: (newTitle: string) => void;
  onGoBack: () => void;
  onNewChat: () => void;
  onOpenResumePreview: () => void;
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
  onClearConversation?: () => void;
  onExportConversation?: () => void;
}

export function ChatHeader({
  title,
  onUpdateTitle,
  onGoBack,
  onNewChat,
  onOpenResumePreview,
  onToggleSidebar,
  isSidebarOpen = true,
  onClearConversation,
  onExportConversation,
}: ChatHeaderProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(title);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleTitleSubmit = () => {
    const trimmed = titleInput.trim();
    if (trimmed && trimmed !== title) {
      onUpdateTitle(trimmed);
    } else {
      setTitleInput(title);
    }
    setIsEditingTitle(false);
  };

  const handleTitleCancel = () => {
    setTitleInput(title);
    setIsEditingTitle(false);
  };

  return (
    <header className="h-14 md:h-15 border-b border-[#E5E5E5] dark:border-[#2E2E2E] bg-[#F7F7F4]/95 dark:bg-[#121212]/95 backdrop-blur-md px-3 sm:px-4 md:px-6 flex items-center justify-between gap-2 sm:gap-3 sticky top-0 z-30 select-none transition-colors duration-200">
      
      {/* Left: Sidebar Reopen / Toggle + Back Navigation + Title + Rename */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 overflow-hidden min-w-0 flex-1 mr-2">
        
        {/* Sidebar Re-open / Menu toggle button (Always visible on mobile/tablet, and visible on desktop when sidebar is collapsed) */}
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className={`w-8 h-8 rounded-xl bg-[#FFFFFF] dark:bg-[#1E1E1E] border border-[#E5E5E5] dark:border-[#2E2E2E] flex items-center justify-center text-[#737373] dark:text-[#A3A3A3] hover:text-[#171717] dark:hover:text-[#FFFFFF] transition-all cursor-pointer shrink-0 neu-raised-sm ${
              isSidebarOpen ? 'lg:hidden' : 'flex'
            }`}
            title={isSidebarOpen ? 'Close navigation' : 'Open navigation'}
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}

        {/* Back navigation button */}
        <button
          onClick={onGoBack}
          className="w-8 h-8 rounded-xl bg-[#FFFFFF] dark:bg-[#1E1E1E] border border-[#E5E5E5] dark:border-[#2E2E2E] flex items-center justify-center text-[#737373] dark:text-[#A3A3A3] hover:text-[#171717] dark:hover:text-[#FFFFFF] transition-all cursor-pointer shrink-0 neu-raised-sm"
          title="Back to Home"
          aria-label="Back to Home"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2]" />
        </button>

        {/* Conversation Title & Inline Editor */}
        {isEditingTitle ? (
          <div className="flex items-center gap-1 min-w-0 flex-1 max-w-[200px] xs:max-w-[260px] sm:max-w-xs">
            <input
              type="text"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleTitleSubmit();
                if (e.key === 'Escape') handleTitleCancel();
              }}
              autoFocus
              className="w-full text-xs sm:text-sm font-semibold text-[#171717] dark:text-[#EDEDED] bg-[#FFFFFF] dark:bg-[#1E1E1E] border border-[#E5E5E5] dark:border-[#2E2E2E] rounded-xl px-2 py-1 focus:outline-hidden focus:border-[#047857]/60 dark:focus:border-[#10B981]/60 neu-inset-sm"
            />
            <button
              onClick={handleTitleSubmit}
              className="p-1 text-[#047857] dark:text-[#10B981] hover:text-[#065F46] cursor-pointer shrink-0"
              title="Save title"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={handleTitleCancel}
              className="p-1 text-[#737373] dark:text-[#A3A3A3] hover:text-[#171717] dark:hover:text-[#FFFFFF] cursor-pointer shrink-0"
              title="Cancel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 min-w-0 group">
            <h1 className="text-xs sm:text-sm md:text-base font-semibold text-[#171717] dark:text-[#EDEDED] tracking-tight truncate max-w-[120px] xs:max-w-[160px] sm:max-w-[240px] md:max-w-sm lg:max-w-md">
              {title || 'Software Developer Resume'}
            </h1>
            <button
              onClick={() => {
                setTitleInput(title || 'Software Developer Resume');
                setIsEditingTitle(true);
              }}
              className="p-1 text-[#737373] dark:text-[#A3A3A3] hover:text-[#047857] dark:hover:text-[#10B981] transition-colors rounded-lg cursor-pointer shrink-0"
              title="Rename conversation"
              aria-label="Rename conversation"
            >
              <Pencil className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[1.8]" />
            </button>
          </div>
        )}
      </div>

      {/* Right Controls: Theme Toggle + More Options */}
      <div className="flex items-center gap-2 shrink-0">
        
        {/* Instant Theme Switcher Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          className="w-8 h-8 rounded-xl bg-[#FFFFFF] dark:bg-[#1E1E1E] border border-[#E5E5E5] dark:border-[#2E2E2E] flex items-center justify-center text-[#737373] dark:text-[#A3A3A3] hover:text-[#171717] dark:hover:text-[#FFFFFF] transition-all cursor-pointer neu-raised-sm"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          aria-label="Toggle dark/light theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400 stroke-[2.2]" />
          ) : (
            <Moon className="w-4 h-4 stroke-[2]" />
          )}
        </button>

        {/* Three-dot menu for additional conversation actions */}
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-8 h-8 rounded-xl bg-[#FFFFFF] dark:bg-[#1E1E1E] border border-[#E5E5E5] dark:border-[#2E2E2E] flex items-center justify-center text-[#737373] dark:text-[#A3A3A3] hover:text-[#171717] dark:hover:text-[#FFFFFF] transition-all cursor-pointer neu-raised-sm"
            title="Conversation options"
            aria-label="Conversation options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {/* Dropdown Menu */}
          {isMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsMenuOpen(false)}
              />
              <div
                className="absolute right-0 mt-2 w-52 max-w-[90vw] bg-[#FFFFFF] dark:bg-[#1E1E1E] border border-[#E5E5E5] dark:border-[#2E2E2E] rounded-2xl py-1.5 z-50 overflow-hidden neu-raised"
              >
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenResumePreview();
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-[#171717] dark:text-[#EDEDED] hover:bg-[#F7F7F4] dark:hover:bg-[#262626] hover:text-[#047857] dark:hover:text-[#10B981] transition-colors cursor-pointer text-left"
                >
                  <FileText className="w-4 h-4 text-[#047857] dark:text-[#10B981] shrink-0" />
                  <span className="truncate">Resume Document Preview</span>
                </button>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onNewChat();
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-[#171717] dark:text-[#EDEDED] hover:bg-[#F7F7F4] dark:hover:bg-[#262626] transition-colors cursor-pointer text-left"
                >
                  <RotateCcw className="w-4 h-4 text-[#737373] dark:text-[#A3A3A3] shrink-0" />
                  <span className="truncate">Start Fresh Chat</span>
                </button>

                {onExportConversation && (
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onExportConversation();
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-[#171717] dark:text-[#EDEDED] hover:bg-[#F7F7F4] dark:hover:bg-[#262626] transition-colors cursor-pointer text-left"
                  >
                    <Download className="w-4 h-4 text-[#737373] dark:text-[#A3A3A3] shrink-0" />
                    <span className="truncate">Export Chat History</span>
                  </button>
                )}

                {onClearConversation && (
                  <div className="border-t border-[#E5E5E5] dark:border-[#2E2E2E] my-1 pt-1">
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        onClearConversation();
                      }}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-[#DC2626] hover:bg-[#DC2626]/8 rounded-none transition-colors cursor-pointer text-left"
                    >
                      <Trash2 className="w-4 h-4 text-[#DC2626] shrink-0" />
                      <span className="truncate">Clear Messages</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

    </header>
  );
}
