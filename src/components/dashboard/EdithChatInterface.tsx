import { useState, useRef, useEffect } from 'react';
import { Send, Square, Plus, MessageCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import { useEdithChat } from '@/hooks/useEdithChat';
import { useUserProfile } from '@/contexts/UserProfileContext';
import edithAvatar from '@/assets/edith-arm-by-side.png';

const suggestedQuestions = [
  "What are the 5 rights of medication administration?",
  "Calculate IV drip rate: 1000mL over 8 hours",
  "What's the antidote for heparin overdose?",
  "Signs of digoxin toxicity",
];

const EdithChatInterface = () => {
  const { messages, isLoading, sendMessage, stopGeneration, startNewConversation } = useEdithChat();
  const { avatarUrl, userInitials } = useUserProfile();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    sendMessage(input.trim());
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestedClick = (q: string) => {
    sendMessage(q);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 border border-border bg-background">
            <AvatarImage src={edithAvatar} className="object-contain p-0.5" />
            <AvatarFallback>E</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Nurse Edith</h1>
            <p className="text-xs text-muted-foreground">AI Medication Safety Companion</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={startNewConversation} className="gap-1.5">
          <Plus className="w-4 h-4" />
          New Chat
        </Button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto py-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <Avatar className="w-24 h-24 mb-4 opacity-80 border border-border bg-background">
              <AvatarImage src={edithAvatar} className="object-contain p-1" />
              <AvatarFallback className="text-2xl">E</AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-semibold text-foreground mb-2">Hi! I'm Nurse Edith 👋</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Your AI medication safety companion. Ask me about medications, dosing, drug interactions, and clinical guidelines.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestedClick(q)}
                  className="text-left p-3 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors text-sm text-foreground"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-primary inline mr-2" />
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={cn("flex gap-3", msg.role === 'user' ? 'justify-end' : 'justify-start')}>
              {msg.role === 'assistant' && (
                <Avatar className="w-8 h-8 flex-shrink-0 mt-1 border border-border bg-background">
                  <AvatarImage src={edithAvatar} className="object-contain p-0.5" />
                  <AvatarFallback>E</AvatarFallback>
                </Avatar>
              )}
              <div className={cn(
                "max-w-[80%] rounded-2xl px-4 py-3 text-sm",
                msg.role === 'user'
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground"
              )}>
                {msg.role === 'assistant' ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none [&>p]:mb-2 [&>ul]:mb-2 [&>ol]:mb-2">
                    <ReactMarkdown>{msg.content || '...'}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                )}
              </div>
              {msg.role === 'user' && (
                <Avatar className="w-8 h-8 flex-shrink-0 mt-1">
                  {avatarUrl ? <AvatarImage src={avatarUrl} /> : null}
                  <AvatarFallback className="text-xs">{userInitials}</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))
        )}
        {isLoading && messages[messages.length - 1]?.content === '' && (
          <div className="flex items-center gap-2 text-muted-foreground text-sm pl-11">
            <Sparkles className="w-4 h-4 animate-pulse text-primary" />
            Edith is thinking...
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-border pt-4">
        <div className="flex items-end gap-2">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Nurse Edith a question..."
            className="min-h-[44px] max-h-[120px] resize-none"
            rows={1}
          />
          {isLoading ? (
            <Button onClick={stopGeneration} variant="destructive" size="icon" className="shrink-0">
              <Square className="w-4 h-4" />
            </Button>
          ) : (
            <Button onClick={handleSend} disabled={!input.trim()} size="icon" className="shrink-0">
              <Send className="w-4 h-4" />
            </Button>
          )}
        </div>
        <p className="text-[10px] text-muted-foreground mt-2 text-center">
          Edith is an AI assistant. Always verify with official clinical references and your facility's protocols.
        </p>
      </div>
    </div>
  );
};

export default EdithChatInterface;
