
import { useState } from "react";
import { MessageSquare, Send, Paperclip, Search, User, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useWebSocket } from "@/hooks/useWebSocket";
import VoiceMessageInterface from "@/components/VoiceMessageInterface";

const Messages = () => {
  const [selectedConversation, setSelectedConversation] = useState(1);
  const [newMessage, setNewMessage] = useState("");
  
  const { messages, isConnected, isTyping, sendMessage } = useWebSocket({
    doctorName: "Dr. Sarah Johnson"
  });

  const conversations = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialty: "Cardiology",
      lastMessage: "Your recent test results look good. Let's schedule a follow-up.",
      time: "2 hours ago",
      unread: 2,
      online: true
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      specialty: "Primary Care",
      lastMessage: "Please remember to take your medication as prescribed.",
      time: "1 day ago",
      unread: 0,
      online: false
    },
    {
      id: 3,
      name: "Nurse Lisa Martinez",
      specialty: "Care Coordinator",
      lastMessage: "Your appointment has been confirmed for tomorrow at 2 PM.",
      time: "2 days ago",
      unread: 1,
      online: true
    }
  ];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      sendMessage(newMessage.trim());
      setNewMessage("");
    }
  };

  const handleVoiceMessage = (transcribedMessage: string) => {
    sendMessage(transcribedMessage);
  };

  const lastDoctorMessage = messages
    .filter(msg => msg.sender === 'doctor')
    .pop()?.content;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-1">
            Secure communication with your healthcare team 
            {isConnected && <span className="text-green-600 ml-2">● Real-time connected</span>}
          </p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
          <MessageSquare className="w-4 h-4 mr-2" />
          New Message
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Conversations</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input placeholder="Search conversations..." className="pl-10" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-4 cursor-pointer hover:bg-gray-50 border-b border-gray-100 ${
                    selectedConversation === conversation.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                  }`}
                  onClick={() => setSelectedConversation(conversation.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-blue-600 text-white text-sm">
                          {conversation.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      {conversation.online && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {conversation.name}
                        </p>
                        {conversation.unread > 0 && (
                          <Badge className="bg-red-500 text-white text-xs">
                            {conversation.unread}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">{conversation.specialty}</p>
                      <p className="text-sm text-gray-600 truncate mt-1">
                        {conversation.lastMessage}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{conversation.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Message Thread */}
        <Card className="lg:col-span-2 flex flex-col">
          <CardHeader className="border-b">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarFallback className="bg-blue-600 text-white">
                  DJ
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">Dr. Sarah Johnson</CardTitle>
                <CardDescription>
                  Cardiology • {isConnected ? "Online" : "Offline"}
                  {isTyping && " • Typing..."}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === 'doctor' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[70%] ${message.sender === 'doctor' ? 'order-2' : 'order-1'}`}>
                    <div className={`p-3 rounded-lg ${
                      message.sender === 'doctor' 
                        ? 'bg-gray-100 text-gray-900' 
                        : 'bg-blue-600 text-white'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                    </div>
                    <div className={`flex items-center mt-1 space-x-1 ${
                      message.sender === 'doctor' ? 'justify-start' : 'justify-end'
                    }`}>
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                  {message.sender === 'doctor' && (
                    <Avatar className="w-8 h-8 order-1 mr-2">
                      <AvatarFallback className="bg-blue-600 text-white text-xs">
                        DJ
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-end gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="bg-blue-600 text-white text-xs">
                        DJ
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-gray-100 px-4 py-2 rounded-lg">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>

          {/* Message Input */}
          <div className="border-t p-4">
            <div className="flex space-x-2 mb-2">
              <Button variant="outline" size="sm">
                <Paperclip className="w-4 h-4" />
              </Button>
              <VoiceMessageInterface 
                onVoiceMessage={handleVoiceMessage}
                lastDoctorMessage={lastDoctorMessage}
              />
            </div>
            <div className="flex space-x-2">
              <Textarea
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 min-h-[40px] max-h-[120px] resize-none"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={isTyping}
              />
              <Button 
                onClick={handleSendMessage}
                className="bg-blue-600 hover:bg-blue-700"
                disabled={!newMessage.trim() || isTyping}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Messages are encrypted and HIPAA compliant • Real-time messaging enabled
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Messages;
