'use client';

import { useState, useTransition, useRef, useEffect } from 'react';
import {
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Bot, User, Loader, MessageCircle } from 'lucide-react';
import { getSupportResponse } from '@/actions/get-support-response';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { cn } from '@/lib/utils';

type Message = {
  role: 'user' | 'bot';
  content: string;
};

interface ChatbotProps {
  isEmbedded?: boolean;
}

function ChatContent() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isPending, startTransition] = useTransition();
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isPending]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');

        startTransition(async () => {
        const result = await getSupportResponse(input);
        if (result.error) {
            const errorMessage: Message = { role: 'bot', content: result.error };
            setMessages((prev) => [...prev, errorMessage]);
        } else if (result.data) {
            const botMessage: Message = { role: 'bot', content: result.data };
            setMessages((prev) => [...prev, botMessage]);
        }
        });
    };

    return (
        <>
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-6">
                <div className="space-y-4">
                {messages.length === 0 && (
                    <div className="text-center text-muted-foreground p-8">
                        <p>Welcome to Assetra Support!</p>
                        <p>Ask me anything about the application.</p>
                    </div>
                )}
                {messages.map((message, index) => (
                    <div
                    key={index}
                    className={`flex items-start gap-3 ${
                        message.role === 'user' ? 'justify-end' : ''
                    }`}
                    >
                    {message.role === 'bot' && (
                        <Avatar className="h-8 w-8">
                        <AvatarFallback><Bot size={20} /></AvatarFallback>
                        </Avatar>
                    )}
                    <div
                        className={`rounded-lg p-3 max-w-[80%] ${
                        message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                    >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                    {message.role === 'user' && (
                        <Avatar className="h-8 w-8">
                        <AvatarFallback><User size={20} /></AvatarFallback>
                        </Avatar>
                    )}
                    </div>
                ))}
                {isPending && (
                    <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                            <AvatarFallback><Bot size={20} /></AvatarFallback>
                        </Avatar>
                        <div className="rounded-lg p-3 bg-muted flex items-center space-x-2">
                            <Loader className="h-4 w-4 animate-spin" />
                            <span className="text-sm text-muted-foreground">Thinking...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
                </div>
            </CardContent>
            <CardFooter className="border-t p-4">
                <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
                <Input
                    id="message"
                    placeholder="Type your message..."
                    className="flex-1"
                    autoComplete="off"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isPending}
                />
                <Button type="submit" size="icon" disabled={isPending || !input.trim()}>
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Send</span>
                </Button>
                </form>
            </CardFooter>
        </>
    );
}


export function Chatbot({ isEmbedded = false }: ChatbotProps) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return null;
    }
    
    if (isEmbedded) {
        return <ChatContent />;
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button className="fixed bottom-8 right-8 rounded-full h-16 w-16 shadow-lg">
                    <MessageCircle className="h-8 w-8" />
                </Button>
            </PopoverTrigger>
            <PopoverContent 
                sideOffset={16} 
                className={cn(
                    "w-[440px] h-[600px] p-0 flex flex-col",
                )}
            >
                <div className="p-4 border-b">
                    <h3 className="font-medium flex items-center gap-2"><Bot /> AI Support Assistant</h3>
                </div>
                <ChatContent />
            </PopoverContent>
      </Popover>
    );
}
