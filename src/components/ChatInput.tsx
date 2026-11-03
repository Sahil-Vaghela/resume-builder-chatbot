import { useState, useRef, useEffect, KeyboardEvent, ChangeEvent } from 'react';
import { Send, Square, Paperclip } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  isLoading: boolean;
  onStopGeneration?: () => void;
  disabled?: boolean;
}

export function ChatInput({
  onSendMessage,
  isLoading,
  onStopGeneration,
  disabled,
}: ChatInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-resize textarea to fit content smoothly up to 130px
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 130)}px`;
  }, [input]);

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading || disabled) return;
    onSendMessage(trimmed);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          setInput((prev) => (prev ? `${prev}\n\n[Attached: ${file.name}]\n${content}` : `[Attached: ${file.name}]\n${content}`));
        }
      };
      reader.readAsText(file);
    } else {
      setInput((prev) => (prev ? `${prev}\n\n[Attached document: ${file.name}]` : `[Attached document: ${file.name}]`));
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    textareaRef.current?.focus();
  };

  const isSendActive = input.trim().length > 0 && !disabled;

  return (
    <div className="w-full px-2.5 sm:px-4 md:px-8 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 select-none">
      <div className="w-full max-w-4xl mx-auto">
        
        {/* Large Rounded Neumorphic Capsule Input Bar */}
        <div
          className="relative flex items-center bg-[#FFFFFF] dark:bg-[#1E1E1E] border border-[#E5E5E5] dark:border-[#2E2E2E] rounded-full p-1.5 sm:p-2 pl-3.5 sm:pl-6 transition-all focus-within:border-[#047857]/50 dark:focus-within:border-[#10B981]/50 focus-within:ring-2 focus-within:ring-[#047857]/5 neu-inset"
        >
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.pdf,.doc,.docx"
            onChange={handleFileChange}
            className="hidden"
            aria-label="Upload document"
          />

          {/* Auto-growing Textarea Input */}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tell me more or provide additional details..."
            rows={1}
            disabled={disabled}
            className="flex-1 resize-none bg-transparent py-1.5 sm:py-2 text-xs sm:text-sm md:text-[15px] text-[#171717] dark:text-[#EDEDED] placeholder:text-[#737373] dark:placeholder:text-[#6B7280] focus:outline-hidden leading-relaxed max-h-[130px] font-normal min-w-0"
          />

          {/* Right Action Icons: Attachment + Emerald Send Button */}
          <div className="flex items-center gap-1 sm:gap-2 pr-0.5 sm:pr-1.5 shrink-0 ml-1.5 sm:ml-2">
            
            {/* Attachment icon */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 sm:p-2 text-[#171717] dark:text-[#A3A3A3] hover:text-[#047857] dark:hover:text-[#10B981] transition-colors rounded-full cursor-pointer touch-manipulation"
              title="Attach document or notes"
              aria-label="Attach file"
            >
              <Paperclip className="w-4 h-4 sm:w-5 sm:h-5 -rotate-45 stroke-[2]" />
            </button>

            {/* Emerald Green Send Button */}
            {isLoading ? (
              <button
                type="button"
                onClick={onStopGeneration}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#171717] dark:bg-[#262626] hover:bg-[#262626] dark:hover:bg-[#333333] text-[#FFFFFF] flex items-center justify-center transition-all cursor-pointer shadow-sm touch-manipulation shrink-0"
                title="Stop generation"
                aria-label="Stop generation"
              >
                <Square className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!isSendActive}
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all cursor-pointer shrink-0 touch-manipulation ${
                  isSendActive
                    ? 'bg-[#047857] hover:bg-[#065F46] dark:bg-[#059669] dark:hover:bg-[#10B981] text-[#FFFFFF] shadow-sm hover:scale-105 active:scale-95 neu-button-emerald'
                    : 'bg-[#047857]/40 dark:bg-[#059669]/40 text-[#FFFFFF]/80 cursor-not-allowed'
                }`}
                title="Send message"
                aria-label="Send message"
              >
                <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-0.5 stroke-[2.2]" />
              </button>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
