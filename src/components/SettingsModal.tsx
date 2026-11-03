import { useState } from 'react';
import {
  X,
  Check,
  Trash2,
  Download,
  Sliders,
  Briefcase,
  MessageSquare,
  Palette,
  Shield,
  Sun,
  Moon,
} from 'lucide-react';
import { ChatSettings, ToneType, CareerLevel } from '../types/chat';
import { useTheme } from '../contexts/ThemeContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ChatSettings;
  onSaveSettings: (settings: ChatSettings) => void;
  onClearAllData: () => void;
  onExportAllData: () => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onClearAllData,
  onExportAllData,
}: SettingsModalProps) {
  const [currentSettings, setCurrentSettings] = useState<ChatSettings>(settings);
  const [confirmClear, setConfirmClear] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'chat' | 'appearance' | 'data'>('general');
  const { theme, setTheme } = useTheme();

  if (!isOpen) return null;

  const toneOptions: { id: ToneType; title: string; desc: string }[] = [
    {
      id: 'professional',
      title: 'Professional Executive',
      desc: 'Balanced, authoritative, and metrics-focused phrasing favored by corporate recruiters.',
    },
    {
      id: 'modern',
      title: 'Modern Tech & High-Growth',
      desc: 'Action-oriented, product-minded, and engineering-centric terminology.',
    },
    {
      id: 'executive',
      title: 'Strategic Leadership',
      desc: 'P&L ownership, organizational impact, leadership, and vision.',
    },
    {
      id: 'creative',
      title: 'Creative & Narrative',
      desc: 'Story-driven and brand-focused, ideal for designers, copywriters, and marketers.',
    },
  ];

  const careerLevels: { id: CareerLevel; label: string }[] = [
    { id: 'fresher', label: 'Student / Fresher' },
    { id: 'mid', label: 'Mid-Level (2-5 yrs)' },
    { id: 'senior', label: 'Senior / Staff (5-10 yrs)' },
    { id: 'executive', label: 'Executive (Director / VP)' },
    { id: 'career-changer', label: 'Career Changer' },
  ];

  const handleSave = () => {
    onSaveSettings(currentSettings);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-[#171717]/35 dark:bg-black/65 backdrop-blur-xs select-none">
      <div className="w-full max-w-xl bg-[#FFFFFF] dark:bg-[#1E1E1E] rounded-2xl neu-raised border border-[#E5E5E5] dark:border-[#2E2E2E] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-[#E5E5E5] dark:border-[#2E2E2E] flex items-center justify-between bg-[#F7F7F4] dark:bg-[#161616]">
          <div className="flex items-center gap-2.5 font-semibold text-[#171717] dark:text-[#FFFFFF] text-sm sm:text-base">
            <Sliders className="w-4 h-4 text-[#047857] dark:text-[#10B981]" />
            <span>Settings</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#737373] dark:text-[#A3A3A3] hover:text-[#171717] dark:hover:text-[#FFFFFF] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs (Sections) */}
        <div className="flex items-center px-3 sm:px-6 pt-2 sm:pt-3 border-b border-[#E5E5E5] dark:border-[#2E2E2E] bg-[#F7F7F4] dark:bg-[#161616] gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('general')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'general'
                ? 'border-[#047857] dark:border-[#10B981] text-[#047857] dark:text-[#10B981] font-semibold'
                : 'border-transparent text-[#737373] dark:text-[#A3A3A3] hover:text-[#171717] dark:hover:text-[#FFFFFF]'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>General</span>
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'chat'
                ? 'border-[#047857] dark:border-[#10B981] text-[#047857] dark:text-[#10B981] font-semibold'
                : 'border-transparent text-[#737373] dark:text-[#A3A3A3] hover:text-[#171717] dark:hover:text-[#FFFFFF]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat Preferences</span>
          </button>
          <button
            onClick={() => setActiveTab('appearance')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'appearance'
                ? 'border-[#047857] dark:border-[#10B981] text-[#047857] dark:text-[#10B981] font-semibold'
                : 'border-transparent text-[#737373] dark:text-[#A3A3A3] hover:text-[#171717] dark:hover:text-[#FFFFFF]'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Appearance</span>
          </button>
          <button
            onClick={() => setActiveTab('data')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'data'
                ? 'border-[#047857] dark:border-[#10B981] text-[#047857] dark:text-[#10B981] font-semibold'
                : 'border-transparent text-[#737373] dark:text-[#A3A3A3] hover:text-[#171717] dark:hover:text-[#FFFFFF]'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Data & Privacy</span>
          </button>
        </div>

        {/* Content by Section */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 bg-[#FFFFFF] dark:bg-[#1E1E1E]">
          
          {/* Section 1: General */}
          {activeTab === 'general' && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-[#171717] dark:text-[#EDEDED] mb-1.5">
                  Default Target Role / Career Field
                </label>
                <input
                  type="text"
                  value={currentSettings.defaultCareerField}
                  onChange={(e) =>
                    setCurrentSettings({ ...currentSettings, defaultCareerField: e.target.value })
                  }
                  placeholder="e.g. Software Engineer, Product Manager"
                  className="w-full bg-[#FFFFFF] dark:bg-[#262626] border border-[#E5E5E5] dark:border-[#333333] neu-inset-sm rounded-xl px-3.5 py-2 text-xs text-[#171717] dark:text-[#EDEDED] placeholder-[#737373] dark:placeholder-[#6B7280] focus:outline-hidden focus:border-[#047857]/50 dark:focus:border-[#10B981]/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171717] dark:text-[#EDEDED] mb-2">
                  Target Experience Level
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {careerLevels.map((lvl) => (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setCurrentSettings({ ...currentSettings, careerLevel: lvl.id })}
                      className={`p-2.5 rounded-xl border text-xs text-left transition-all cursor-pointer ${
                        currentSettings.careerLevel === lvl.id
                          ? 'border-[#047857] dark:border-[#10B981] bg-[#047857]/5 dark:bg-[#10B981]/15 text-[#047857] dark:text-[#10B981] font-semibold neu-raised-sm'
                          : 'border-[#E5E5E5] dark:border-[#333333] bg-[#FFFFFF] dark:bg-[#262626] text-[#171717] dark:text-[#EDEDED] hover:border-[#737373]/40'
                      }`}
                    >
                      {lvl.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Section 2: Chat Preferences */}
          {activeTab === 'chat' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#171717] dark:text-[#EDEDED] mb-2">
                  AI Resume Writer Tone
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {toneOptions.map((opt) => (
                    <div
                      key={opt.id}
                      onClick={() => setCurrentSettings({ ...currentSettings, tone: opt.id })}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                        currentSettings.tone === opt.id
                          ? 'border-[#047857] dark:border-[#10B981] bg-[#047857]/5 dark:bg-[#10B981]/15 neu-raised-sm'
                          : 'border-[#E5E5E5] dark:border-[#333333] bg-[#FFFFFF] dark:bg-[#262626] hover:border-[#737373]/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <span className={`font-semibold ${currentSettings.tone === opt.id ? 'text-[#047857] dark:text-[#10B981]' : 'text-[#171717] dark:text-[#EDEDED]'}`}>
                          {opt.title}
                        </span>
                        {currentSettings.tone === opt.id && (
                          <Check className="w-4 h-4 text-[#047857] dark:text-[#10B981]" />
                        )}
                      </div>
                      <p className="text-[#737373] dark:text-[#A3A3A3] leading-relaxed">{opt.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Auto-sync resume toggle */}
              <div className="pt-2 border-t border-[#E5E5E5] dark:border-[#2E2E2E] flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-[#171717] dark:text-[#EDEDED]">Auto-Sync Resume Sections</div>
                  <div className="text-[11px] text-[#737373] dark:text-[#A3A3A3]">Update live resume draft when new sections are finalized</div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setCurrentSettings({
                      ...currentSettings,
                      autoExtractResume: !currentSettings.autoExtractResume,
                    })
                  }
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    currentSettings.autoExtractResume ? 'bg-[#047857] dark:bg-[#10B981]' : 'bg-[#E5E5E5] dark:bg-[#333333]'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-[#FFFFFF] shadow-sm transform transition-transform ${
                      currentSettings.autoExtractResume ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* Section 3: Appearance with Functional Theme Selection */}
          {activeTab === 'appearance' && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-[#171717] dark:text-[#EDEDED] mb-2.5">
                  Color Theme Mode
                </label>
                <div className="grid grid-cols-2 gap-3">
                  
                  {/* Light Mode Option */}
                  <div
                    onClick={() => setTheme('light')}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      theme === 'light'
                        ? 'border-[#047857] bg-[#047857]/5 neu-raised-sm'
                        : 'border-[#E5E5E5] dark:border-[#333333] bg-[#FFFFFF] dark:bg-[#262626] hover:border-[#737373]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Sun className={`w-4 h-4 ${theme === 'light' ? 'text-[#047857]' : 'text-[#737373]'}`} />
                        <span className={`text-xs font-semibold ${theme === 'light' ? 'text-[#047857]' : 'text-[#171717] dark:text-[#EDEDED]'}`}>
                          Light Mode
                        </span>
                      </div>
                      {theme === 'light' && <Check className="w-4 h-4 text-[#047857]" />}
                    </div>
                    <div className="flex items-center gap-1.5 pt-1">
                      <div className="w-4 h-4 rounded-full bg-[#F7F7F4] border border-[#E5E5E5]" title="Warm White" />
                      <div className="w-4 h-4 rounded-full bg-[#FFFFFF] border border-[#E5E5E5]" title="Pure White" />
                      <div className="w-4 h-4 rounded-full bg-[#171717]" title="Charcoal" />
                      <div className="w-4 h-4 rounded-full bg-[#047857]" title="Emerald Green" />
                    </div>
                  </div>

                  {/* Dark Mode Option */}
                  <div
                    onClick={() => setTheme('dark')}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      theme === 'dark'
                        ? 'border-[#10B981] bg-[#10B981]/15 neu-raised-sm'
                        : 'border-[#E5E5E5] dark:border-[#333333] bg-[#FFFFFF] dark:bg-[#262626] hover:border-[#737373]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Moon className={`w-4 h-4 ${theme === 'dark' ? 'text-[#10B981]' : 'text-[#737373]'}`} />
                        <span className={`text-xs font-semibold ${theme === 'dark' ? 'text-[#10B981]' : 'text-[#171717] dark:text-[#EDEDED]'}`}>
                          Dark Mode
                        </span>
                      </div>
                      {theme === 'dark' && <Check className="w-4 h-4 text-[#10B981]" />}
                    </div>
                    <div className="flex items-center gap-1.5 pt-1">
                      <div className="w-4 h-4 rounded-full bg-[#121212] border border-[#2E2E2E]" title="Deep Charcoal" />
                      <div className="w-4 h-4 rounded-full bg-[#1E1E1E] border border-[#2E2E2E]" title="Charcoal Card" />
                      <div className="w-4 h-4 rounded-full bg-[#EDEDED]" title="Light Text" />
                      <div className="w-4 h-4 rounded-full bg-[#10B981]" title="Emerald Green" />
                    </div>
                  </div>

                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171717] dark:text-[#EDEDED] mb-2">
                  Visual Design System
                </label>
                <div className="p-3.5 rounded-xl border border-[#047857]/30 dark:border-[#10B981]/30 bg-[#047857]/5 dark:bg-[#10B981]/10 neu-raised-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#FFFFFF] dark:bg-[#262626] border border-[#E5E5E5] dark:border-[#333333] neu-raised-sm flex items-center justify-center text-[#047857] dark:text-[#10B981]">
                      <Palette className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-[#171717] dark:text-[#EDEDED]">Neomorphism (Soft UI)</span>
                      <p className="text-[11px] text-[#737373] dark:text-[#A3A3A3]">Clean contrast, raised surfaces, and emerald accents</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-[#047857] dark:text-[#10B981] bg-[#FFFFFF] dark:bg-[#262626] px-2.5 py-1 rounded-full border border-[#047857]/20 dark:border-[#10B981]/30 neu-raised-sm">
                    Active
                  </span>
                </div>
              </div>

              <div className="p-3.5 bg-[#F7F7F4] dark:bg-[#161616] border border-[#E5E5E5] dark:border-[#2E2E2E] rounded-xl text-xs text-[#737373] dark:text-[#A3A3A3] space-y-1">
                <div className="font-medium text-[#171717] dark:text-[#EDEDED]">Design Principles:</div>
                <div>• Soft dual shadows with subtle raised & inset depth</div>
                <div>• Balanced contrast compliant with WCAG AA readability</div>
                <div>• Emerald Green action points and highlights</div>
              </div>
            </div>
          )}

          {/* Section 4: Data & Privacy */}
          {activeTab === 'data' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#171717] dark:text-[#EDEDED] mb-2">
                  Local Storage & Export
                </label>
                <p className="text-xs text-[#737373] dark:text-[#A3A3A3] mb-4">
                  All your conversation logs, drafted resume sections, and preferences are stored locally in your browser.
                </p>

                <div className="flex flex-col sm:flex-row gap-2.5">
                  <button
                    type="button"
                    onClick={onExportAllData}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-[#171717] dark:text-[#EDEDED] bg-[#FFFFFF] dark:bg-[#262626] hover:bg-[#F7F7F4] dark:hover:bg-[#333333] border border-[#E5E5E5] dark:border-[#333333] rounded-xl neu-button transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-[#737373] dark:text-[#A3A3A3]" />
                    <span>Export Conversations (.json)</span>
                  </button>

                  {confirmClear ? (
                    <button
                      type="button"
                      onClick={() => {
                        onClearAllData();
                        setConfirmClear(false);
                        onClose();
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-white bg-[#DC2626] hover:bg-rose-700 rounded-xl transition-all cursor-pointer shadow-xs"
                    >
                      <span>Confirm Clear All</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmClear(true)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-[#DC2626] bg-[#FFFFFF] dark:bg-[#262626] hover:bg-rose-50/50 dark:hover:bg-rose-950/20 border border-[#DC2626]/30 rounded-xl neu-button transition-all cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Reset History</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[#E5E5E5] dark:border-[#2E2E2E] flex justify-end gap-2.5 bg-[#F7F7F4] dark:bg-[#161616]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-[#737373] dark:text-[#A3A3A3] hover:text-[#171717] dark:hover:text-[#FFFFFF] rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 text-xs font-semibold rounded-xl neu-button-emerald transition-all cursor-pointer"
          >
            Save Preferences
          </button>
        </div>

      </div>
    </div>
  );
}
