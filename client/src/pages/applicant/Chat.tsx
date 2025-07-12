import { useState } from "react";
import { MessageCircle, Send, Phone, Video, MoreVertical, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface ChatMessage {
  id: string;
  sender: "user" | "admin";
  content: string;
  timestamp: string;
  type: "text" | "file" | "interview_invite";
}

interface ChatConversation {
  id: string;
  adminName: string;
  adminAvatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
  jobTitle?: string;
}

export default function Chat() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");

  // Mock conversations
  const conversations: ChatConversation[] = [
    {
      id: "1",
      adminName: "Sarah HR Manager",
      adminAvatar: "/api/placeholder/40/40",
      lastMessage: "Terima kasih atas aplikasi Anda. Kami akan review dan...",
      lastMessageTime: "10:30",
      unreadCount: 2,
      isOnline: true,
      jobTitle: "Software Developer"
    },
    {
      id: "2", 
      adminName: "David Recruiter",
      adminAvatar: "/api/placeholder/40/40",
      lastMessage: "Interview dijadwalkan untuk hari Senin pukul 14:00",
      lastMessageTime: "Kemarin",
      unreadCount: 0,
      isOnline: false,
      jobTitle: "Marketing Manager"
    },
    {
      id: "3",
      adminName: "Lisa Talent Acquisition",
      adminAvatar: "/api/placeholder/40/40", 
      lastMessage: "Selamat! Anda telah lolos ke tahap selanjutnya",
      lastMessageTime: "2 hari lalu",
      unreadCount: 1,
      isOnline: true,
      jobTitle: "UI/UX Designer"
    }
  ];

  // Mock messages for selected chat
  const chatMessages: ChatMessage[] = [
    {
      id: "1",
      sender: "admin",
      content: "Halo Ahmad! Terima kasih atas aplikasi Anda untuk posisi Software Developer di PT Tech Indonesia.",
      timestamp: "09:00",
      type: "text"
    },
    {
      id: "2",
      sender: "admin", 
      content: "Kami telah mereview CV Anda dan tertarik untuk melanjutkan ke tahap interview. Apakah Anda tersedia untuk interview online minggu depan?",
      timestamp: "09:02",
      type: "text"
    },
    {
      id: "3",
      sender: "user",
      content: "Halo Sarah! Terima kasih atas kesempatannya. Ya, saya tersedia untuk interview minggu depan.",
      timestamp: "09:15",
      type: "text"
    },
    {
      id: "4",
      sender: "admin",
      content: "Perfect! Saya akan kirimkan undangan interview untuk hari Senin, 22 Januari 2024 pukul 10:00 WIB melalui Google Meet.",
      timestamp: "09:20",
      type: "interview_invite"
    },
    {
      id: "5",
      sender: "user",
      content: "Baik, saya sudah catat. Terima kasih!",
      timestamp: "09:25",
      type: "text"
    },
    {
      id: "6",
      sender: "admin",
      content: "Sebelum interview, mohon siapkan: 1) Portfolio terbaru 2) Laptop untuk demo coding 3) Pertanyaan tentang perusahaan",
      timestamp: "10:30",
      type: "text"
    }
  ];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Add message logic here
      setNewMessage("");
    }
  };

  const formatTime = (time: string) => {
    return time;
  };

  if (!selectedChat) {
    return (
      <div className="pb-20">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4">
          <h1 className="text-xl font-bold">Chat dengan Admin</h1>
          <p className="text-indigo-100">Komunikasi langsung dengan tim HR</p>
        </div>

        {/* Conversation List */}
        <div className="p-4 space-y-3">
          {conversations.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  Belum ada percakapan. Chat akan muncul setelah Anda melamar pekerjaan.
                </p>
              </CardContent>
            </Card>
          ) : (
            conversations.map((conversation) => (
              <Card 
                key={conversation.id} 
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedChat(conversation.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={conversation.adminAvatar} alt={conversation.adminName} />
                        <AvatarFallback>
                          {conversation.adminName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      {conversation.isOnline && (
                        <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                          {conversation.adminName}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            {conversation.lastMessageTime}
                          </span>
                          {conversation.unreadCount > 0 && (
                            <Badge className="bg-red-500 text-white text-xs px-2 py-1">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {conversation.jobTitle && (
                        <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">
                          Re: {conversation.jobTitle}
                        </p>
                      )}
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {conversation.lastMessage}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    );
  }

  const currentConversation = conversations.find(c => c.id === selectedChat);

  return (
    <div className="pb-20 flex flex-col h-screen">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={() => setSelectedChat(null)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="relative">
            <Avatar className="h-10 w-10">
              <AvatarImage src={currentConversation?.adminAvatar} alt={currentConversation?.adminName} />
              <AvatarFallback>
                {currentConversation?.adminName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            {currentConversation?.isOnline && (
              <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>
            )}
          </div>
          
          <div className="flex-1">
            <p className="font-semibold">{currentConversation?.adminName}</p>
            <p className="text-xs text-indigo-200">
              {currentConversation?.isOnline ? "Online" : "Terakhir dilihat kemarin"}
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <Phone className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <Video className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {currentConversation?.jobTitle && (
          <div className="mt-2 p-2 bg-white/10 rounded-lg">
            <p className="text-xs">Perihal: {currentConversation.jobTitle}</p>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.sender === "user"
                  ? "bg-blue-600 text-white"
                  : message.type === "interview_invite"
                  ? "bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-700"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              }`}
            >
              {message.type === "interview_invite" && (
                <div className="flex items-center gap-2 mb-2 text-green-700 dark:text-green-300">
                  <Video className="h-4 w-4" />
                  <span className="text-xs font-semibold">UNDANGAN INTERVIEW</span>
                </div>
              )}
              <p className="text-sm">{message.content}</p>
              <p className={`text-xs mt-1 ${
                message.sender === "user" ? "text-blue-100" : "text-gray-500 dark:text-gray-400"
              }`}>
                {formatTime(message.timestamp)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Ketik pesan..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1"
          />
          <Button onClick={handleSendMessage}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}