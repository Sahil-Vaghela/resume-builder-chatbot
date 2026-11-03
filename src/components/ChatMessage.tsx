import { useState, useMemo } from 'react';
import {
  Copy,
  Check,
  RotateCcw,
  FileText,
  User,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';
import { marked } from 'marked';
import { Message } from '../types/chat';

interface ChatMessageProps {
  message: Message;
  isLastAssistant: boolean;
  onRegenerate?: () => void;
  onAddToResume?: (content: string) => void;
}

export function ChatMessage({
  message,
  isLastAssistant,
  onRegenerate,
  onAddToResume,
}: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<'liked' | 'disliked' | null>(null);
  const isUser = message.role === 'user';

  // Format timestamp (e.g., "11:42 AM")
  const formattedTime = useMemo(() => {
    return new Date(message.timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  }, [message.timestamp]);

  // Convert markdown to clean HTML for assistant responses
  const htmlContent = useMemo(() => {
    if (isUser) return '';
    try {
      return marked.parse(message.content, { async: false, breaks: true }) as string;
    } catch {
      return message.content;
    }
  }, [message.content, isUser]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy message:', err);
    }
  };

  const handleLike = () => {
    setFeedback((prev) => (prev === 'liked' ? null : 'liked'));
  };

  const handleDislike = () => {
    setFeedback((prev) => (prev === 'disliked' ? null : 'disliked'));
  };

  const hasResumeContent = useMemo(() => {
    if (isUser) return false;
    return (
      message.content.includes('###') ||
      message.content.includes('Professional Summary') ||
      message.content.includes('Experience') ||
      message.content.includes('Skills') ||
      message.content.includes('Projects') ||
      message.content.includes('Education')
    );
  }, [message.content, isUser]);

  if (isUser) {
    return (
      <div className="w-full flex justify-end py-1.5 sm:py-2 px-1 sm:px-3">
        <div className="flex flex-col items-end max-w-[92%] sm:max-w-[85%] md:max-w-2xl">
          <div className="flex items-start gap-2 sm:gap-2.5">
            {/* User message bubble */}
            <div
              className="px-3.5 py-2.5 sm:px-5 sm:py-3.5 rounded-2xl rounded-tr-xs bg-[#047857]/8 dark:bg-[#059669]/20 text-[#171717] dark:text-[#EDEDED] border border-[#047857]/15 dark:border-[#10B981]/30 text-sm sm:text-[15px] leading-relaxed break-words [overflow-wrap:anywhere]"
              style={{
                boxShadow: '3px 3px 10px rgba(0,0,0,0.03), -3px -3px 10px rgba(255,255,255,0.9)',
              }}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>

            {/* Small user profile icon */}
            <div
              className="w-6 h-6 sm:w-7 sm:h-7 rounded-xl bg-[#FFFFFF] dark:bg-[#1E1E1E] border border-[#047857]/20 dark:border-[#10B981]/30 flex items-center justify-center text-[#047857] dark:text-[#10B981] shrink-0 mt-0.5 select-none"
              style={{
                boxShadow: '2px 2px 6px rgba(0,0,0,0.03), -2px -2px 6px rgba(255,255,255,0.95)',
              }}
            >
              <User className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </div>
          </div>

          {/* Timestamps underneath */}
          <span className="text-[10px] sm:text-[11px] text-[#737373] dark:text-[#9CA3AF] mt-1 sm:mt-1.5 pr-8 sm:pr-9 font-normal select-none">
            {formattedTime}
          </span>
        </div>
      </div>
    );
  }

  // AI Message
  return (
    <div className="w-full flex justify-start py-2 sm:py-3 px-1 sm:px-3">
      <div className="flex items-start gap-2 sm:gap-3 w-full max-w-full sm:max-w-2xl md:max-w-3xl">
        
        {/* ResumeAI Document Logo beside AI message */}
        <div
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#FFFFFF] dark:bg-[#1E1E1E] border border-[#E5E5E5] dark:border-[#2E2E2E] flex items-center justify-center text-[#047857] dark:text-[#10B981] shrink-0 mt-1 select-none neu-raised-sm"
        >
          <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
        </div>

        {/* Message Content Container */}
        <div className="flex flex-col items-start min-w-0 flex-1 overflow-hidden">
          
          {/* Neumorphic Raised Surface */}
          <div
            className="w-full bg-[#FFFFFF] dark:bg-[#1E1E1E] border border-[#E5E5E5] dark:border-[#2E2E2E] rounded-2xl sm:rounded-3xl rounded-tl-xs p-3.5 sm:p-5 md:p-6 text-sm sm:text-[15px] text-[#171717] dark:text-[#EDEDED] leading-relaxed relative overflow-hidden neu-raised"
          >
            <div
              className="prose-chat break-words [overflow-wrap:anywhere]"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />

            {/* Live typing pulse cursor when streaming */}
            {message.isStreaming && (
              <span className="inline-block w-2 h-4 ml-1 bg-[#047857] dark:bg-[#10B981] animate-pulse align-middle" />
            )}

            {/* Error display if applicable */}
            {message.error && (
              <div
                className="mt-3 text-xs text-[#DC2626] bg-[#F7F7F4] dark:bg-[#262626] border border-[#DC2626]/20 rounded-xl p-2.5 sm:p-3 flex items-center justify-between gap-2 neu-inset-sm"
              >
                <span className="break-words">{message.error}</span>
                {onRegenerate && (
                  <button
                    onClick={onRegenerate}
                    className="text-xs font-semibold text-[#DC2626] underline hover:text-[#991B1B] cursor-pointer shrink-0"
                  >
                    Retry
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Timestamp and Action Row below AI response */}
          <div className="flex flex-wrap items-center justify-between w-full mt-2 sm:mt-2.5 px-0.5 sm:px-1 gap-1.5 sm:gap-2">
            
            {/* Action buttons: Copy, Regenerate, Like, Dislike */}
            {!message.isStreaming && (
              <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 select-none">
                
                {/* Copy button */}
                <button
                  onClick={handleCopy}
                  className={`min-h-[30px] px-2 sm:px-2.5 py-1 rounded-xl text-xs font-medium border flex items-center gap-1 sm:gap-1.5 transition-all cursor-pointer neu-raised-sm ${
                    copied
                      ? 'bg-[#047857]/10 dark:bg-[#10B981]/15 text-[#047857] dark:text-[#10B981] border-[#047857]/30 dark:border-[#10B981]/40'
                      : 'bg-[#FFFFFF] dark:bg-[#1E1E1E] text-[#737373] dark:text-[#A3A3A3] hover:text-[#171717] dark:hover:text-[#FFFFFF] border-[#E5E5E5] dark:border-[#2E2E2E]'
                  }`}
                  title="Copy message to clipboard"
                  aria-label="Copy message"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#047857] dark:text-[#10B981]" />
                      <span className="text-[#047857] dark:text-[#10B981] font-medium text-[11px] sm:text-xs">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span className="text-[11px] sm:text-xs">Copy</span>
                    </>
                  )}
                </button>

                {/* Regenerate button */}
                {onRegenerate && (
                  <button
                    onClick={onRegenerate}
                    className="min-h-[30px] px-2 sm:px-2.5 py-1 rounded-xl text-xs font-medium bg-[#FFFFFF] dark:bg-[#1E1E1E] text-[#737373] dark:text-[#A3A3A3] hover:text-[#171717] dark:hover:text-[#FFFFFF] border border-[#E5E5E5] dark:border-[#2E2E2E] flex items-center gap-1 sm:gap-1.5 transition-all cursor-pointer neu-raised-sm"
                    title="Regenerate alternative AI response"
                    aria-label="Regenerate response"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="hidden xs:inline text-[11px] sm:text-xs">Regenerate</span>
                  </button>
                )}

                {/* Like button */}
                <button
                  onClick={handleLike}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl border flex items-center justify-center transition-all cursor-pointer neu-raised-sm ${
                    feedback === 'liked'
                      ? 'bg-[#047857]/10 dark:bg-[#10B981]/15 text-[#047857] dark:text-[#10B981] border-[#047857]/30 dark:border-[#10B981]/40'
                      : 'bg-[#FFFFFF] dark:bg-[#1E1E1E] text-[#737373] dark:text-[#A3A3A3] hover:text-[#047857] dark:hover:text-[#10B981] border-[#E5E5E5] dark:border-[#2E2E2E]'
                  }`}
                  title="Good response"
                  aria-label="Like response"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                </button>

                {/* Dislike button */}
                <button
                  onClick={handleDislike}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl border flex items-center justify-center transition-all cursor-pointer neu-raised-sm ${
                    feedback === 'disliked'
                      ? 'bg-[#171717]/10 dark:bg-white/10 text-[#171717] dark:text-[#FFFFFF] border-[#171717]/30 dark:border-white/20'
                      : 'bg-[#FFFFFF] dark:bg-[#1E1E1E] text-[#737373] dark:text-[#A3A3A3] hover:text-[#171717] dark:hover:text-[#FFFFFF] border-[#E5E5E5] dark:border-[#2E2E2E]'
                  }`}
                  title="Needs improvement"
                  aria-label="Dislike response"
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                </button>

                {/* Add to Live Resume draft trigger if resume content detected */}
                {hasResumeContent && onAddToResume && (
                  <button
                    onClick={() => onAddToResume(message.content)}
                    className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-[#047857] dark:text-[#10B981] bg-[#FFFFFF] dark:bg-[#1E1E1E] hover:bg-[#047857]/8 dark:hover:bg-[#10B981]/10 rounded-xl border border-[#047857]/30 dark:border-[#10B981]/30 transition-all cursor-pointer ml-1 neu-raised-sm"
                    title="Send drafted resume section to live resume preview"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#047857] dark:text-[#10B981]" />
                    <span>Send to Resume</span>
                  </button>
                )}

              </div>
            )}

            {/* AI Timestamp */}
            <span className="text-[10px] sm:text-[11px] text-[#737373] dark:text-[#9CA3AF] font-normal ml-auto select-none">
              {formattedTime}
            </span>

          </div>

        </div>

      </div>
    </div>
  );
}
