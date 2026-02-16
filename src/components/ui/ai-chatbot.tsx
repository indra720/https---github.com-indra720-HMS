import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, X, MessageCircle, Zap, Brain, Search, MapPin, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface AiChatbotProps {
  className?: string;
}

export function AiChatbot({ className }: AiChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hi! I\'m your AI travel assistant. I can help you find the perfect hotels, restaurants, and experiences. What are you looking for today?',
      timestamp: new Date(),
      suggestions: ['Find luxury hotels', 'Romantic restaurants', 'Family activities', 'Best deals']
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const aiResponses = {
    luxury: {
      content: 'I\'ve found some amazing luxury options for you! Here are my top recommendations with 5-star ratings and premium amenities.',
      suggestions: ['Show prices', 'Check availability', 'Compare amenities', 'View locations']
    },
    romantic: {
      content: 'Perfect for a romantic evening! I\'ve selected intimate restaurants with great ambiance, wine selections, and cozy settings.',
      suggestions: ['Book a table', 'View menus', 'Check reviews', 'Get directions']
    },
    family: {
      content: 'Great choice for family fun! These places offer kid-friendly menus, activities, and spacious accommodations.',
      suggestions: ['Family packages', 'Kids activities', 'Group booking', 'Special offers']
    },
    deals: {
      content: 'I found some incredible deals with up to 40% off! These offers won\'t last long, so I recommend booking soon.',
      suggestions: ['Book now', 'Compare savings', 'Set price alerts', 'View terms']
    },
    search: {
      content: 'I can help you search through our entire database of 800+ hotels and 1,500+ restaurants. What specific features are you looking for?',
      suggestions: ['By location', 'By price range', 'By cuisine type', 'By rating']
    },
    location: {
      content: 'Location is key! I can show you places near landmarks, beaches, city centers, or quiet neighborhoods. Where would you prefer to stay?',
      suggestions: ['Downtown', 'Beachfront', 'Historic quarter', 'Business district']
    }
  };

  const getAiResponse = (userMessage: string): Message => {
    const lowerMessage = userMessage.toLowerCase();
    
    let responseKey: keyof typeof aiResponses = 'search';
    
    if (lowerMessage.includes('luxury') || lowerMessage.includes('5 star') || lowerMessage.includes('premium')) {
      responseKey = 'luxury';
    } else if (lowerMessage.includes('romantic') || lowerMessage.includes('anniversary') || lowerMessage.includes('date')) {
      responseKey = 'romantic';
    } else if (lowerMessage.includes('family') || lowerMessage.includes('kids') || lowerMessage.includes('children')) {
      responseKey = 'family';
    } else if (lowerMessage.includes('deal') || lowerMessage.includes('cheap') || lowerMessage.includes('discount') || lowerMessage.includes('offer')) {
      responseKey = 'deals';
    } else if (lowerMessage.includes('location') || lowerMessage.includes('where') || lowerMessage.includes('area')) {
      responseKey = 'location';
    }
    
    const response = aiResponses[responseKey];
    
    return {
      id: Date.now().toString(),
      type: 'bot',
      content: response.content,
      timestamp: new Date(),
      suggestions: response.suggestions
    };
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = getAiResponse(input);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: suggestion,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse = getAiResponse(suggestion);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={cn("fixed bottom-6 right-6 z-50", className)}>
      {/* Chat Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-16 h-16 rounded-full shadow-2xl transition-all duration-300 hover:scale-110",
          "bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90",
          "border-2 border-primary-foreground/20",
          isOpen && "scale-95"
        )}
        size="icon"
      >
        {isOpen ? (
          <X className="h-6 w-6 text-primary-foreground" />
        ) : (
          <div className="relative">
            <MessageCircle className="h-6 w-6 text-primary-foreground" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse" />
          </div>
        )}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="absolute bottom-20 right-0 w-96 h-[500px] shadow-2xl border-2 border-primary/20 overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-accent text-primary-foreground p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                <Brain className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">AI Travel Assistant</h3>
                <p className="text-xs opacity-90 flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  Powered by Advanced AI
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <CardContent className="p-0 h-[340px] overflow-y-auto bg-gradient-to-b from-background to-muted/20">
            <div className="p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={cn(
                  "flex gap-3 animate-fade-in",
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                )}>
                  {message.type === 'bot' && (
                    <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                  
                  <div className={cn(
                    "max-w-[70%] p-3 rounded-2xl",
                    message.type === 'user' 
                      ? 'bg-primary text-primary-foreground ml-auto' 
                      : 'bg-card border shadow-sm'
                  )}>
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    
                    {message.suggestions && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {message.suggestions.map((suggestion, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            {suggestion}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {message.type === 'user' && (
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-3 animate-fade-in">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div className="bg-card border p-3 rounded-2xl">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>

          {/* Input */}
          <div className="p-4 border-t bg-background">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about travel..."
                className="flex-1 rounded-full border-2 focus:border-primary"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="rounded-full w-10 h-10 p-0"
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}