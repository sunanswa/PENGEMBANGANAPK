import React, { useState } from 'react';
import SwaprosHeader from '@/components/SwaprosHeader';
import { 
  Send, 
  Search, 
  Phone, 
  Video, 
  MoreHorizontal,
  Paperclip,
  Smile,
  Building2,
  Circle,
  CheckCheck
} from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  company: string;
  role: string;
  avatar?: string;
  isOnline: boolean;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  type: 'text' | 'file' | 'image';
}

export default function ChatPage() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data untuk demonstrasi
  const contacts: Contact[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      company: 'PT BESS TREND INDONESIA',
      role: 'HR Manager',
      isOnline: true,
      lastMessage: 'Terima kasih atas aplikasi Anda. Kami akan meninjau CV Anda.',
      lastMessageTime: '10:30',
      unreadCount: 2
    },
    {
      id: '2',
      name: 'Ahmad Rizky',
      company: 'PT SWAPRO',
      role: 'Recruitment Specialist',
      isOnline: true,
      lastMessage: 'Interview dijadwalkan untuk hari Rabu jam 14:00',
      lastMessageTime: '09:15',
      unreadCount: 0
    },
    {
      id: '3',
      name: 'Maya Sari',
      company: 'PT DIGITAL SOLUTIONS',
      role: 'Team Lead',
      isOnline: false,
      lastMessage: 'Selamat! Anda lolos ke tahap selanjutnya',
      lastMessageTime: 'Kemarin',
      unreadCount: 1
    }
  ];

  const messages: Message[] = [
    {
      id: '1',
      senderId: 'hr',
      content: 'Halo! Terima kasih telah melamar posisi Sales Promotion Boy di perusahaan kami.',
      timestamp: '09:00',
      isRead: true,
      type: 'text'
    },
    {
      id: '2',
      senderId: 'me',
      content: 'Halo, terima kasih atas responnya. Saya sangat tertarik dengan posisi ini.',
      timestamp: '09:05',
      isRead: true,
      type: 'text'
    },
    {
      id: '3',
      senderId: 'hr',
      content: 'Kami akan meninjau aplikasi Anda dalam 2-3 hari kerja. Apakah Anda memiliki pertanyaan tentang posisi ini?',
      timestamp: '09:10',
      isRead: true,
      type: 'text'
    },
    {
      id: '4',
      senderId: 'me',
      content: 'Boleh saya tahu lebih detail tentang job description dan benefit yang ditawarkan?',
      timestamp: '09:15',
      isRead: true,
      type: 'text'
    },
    {
      id: '5',
      senderId: 'hr',
      content: 'Tentu! Posisi ini melibatkan promosi produk di berbagai lokasi retail. Benefit termasuk gaji pokok, komisi, dan BPJS.',
      timestamp: '10:25',
      isRead: false,
      type: 'text'
    },
    {
      id: '6',
      senderId: 'hr',
      content: 'Kami juga menyediakan training untuk semua karyawan baru.',
      timestamp: '10:30',
      isRead: false,
      type: 'text'
    }
  ];

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // Kirim pesan logic here
      setMessageInput('');
    }
  };

  const QuickReplies = () => (
    <div className="flex gap-2 p-3 border-t border-gray-200">
      <button className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors">
        Terima kasih
      </button>
      <button className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors">
        Saya tertarik
      </button>
      <button className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors">
        Kapan interview?
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <SwaprosHeader 
        title="Chat & Komunikasi" 
        subtitle="Berkomunikasi langsung dengan HR dan recruiter"
        showSearch={false}
        userRole="applicant"
      />
      
      <div className="flex h-[calc(100vh-140px)] bg-white mx-4 rounded-xl shadow-lg overflow-hidden">
        {/* Contacts Sidebar */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col">
          {/* Search */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari kontak..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>

          {/* Contacts List */}
          <div className="flex-1 overflow-y-auto">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => setSelectedContact(contact)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedContact?.id === contact.id ? 'bg-purple-50 border-purple-200' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-orange-500 rounded-full flex items-center justify-center shadow-md">
                      <Building2 size={20} className="text-white" />
                    </div>
                    {contact.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-900 truncate">{contact.name}</h4>
                      <span className="text-xs text-gray-500">{contact.lastMessageTime}</span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{contact.company}</p>
                    <p className="text-xs text-gray-500 truncate">{contact.role}</p>
                    <p className="text-sm text-gray-700 truncate mt-1">{contact.lastMessage}</p>
                  </div>
                  
                  {contact.unreadCount > 0 && (
                    <div className="w-5 h-5 bg-purple-500 text-white text-xs rounded-full flex items-center justify-center">
                      {contact.unreadCount}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedContact ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-orange-500 rounded-full flex items-center justify-center">
                        <Building2 size={16} className="text-white" />
                      </div>
                      {selectedContact.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{selectedContact.name}</h3>
                      <p className="text-sm text-gray-600">{selectedContact.company} • {selectedContact.role}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <Phone size={18} />
                    </button>
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <Video size={18} />
                    </button>
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        message.senderId === 'me'
                          ? 'bg-gradient-to-r from-purple-500 to-orange-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <div className={`flex items-center justify-end gap-1 mt-1 ${
                        message.senderId === 'me' ? 'text-purple-100' : 'text-gray-500'
                      }`}>
                        <span className="text-xs">{message.timestamp}</span>
                        {message.senderId === 'me' && (
                          <CheckCheck size={12} className={message.isRead ? 'text-blue-300' : 'text-gray-300'} />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Replies */}
              <QuickReplies />

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Paperclip size={18} />
                  </button>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Ketik pesan..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Smile size={18} />
                  </button>
                  <button
                    onClick={handleSendMessage}
                    className="p-2 bg-gradient-to-r from-purple-500 to-orange-500 text-white rounded-lg hover:from-purple-600 hover:to-orange-600 transition-colors"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send size={24} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Pilih Kontak</h3>
                <p className="text-gray-500">Pilih kontak untuk memulai percakapan</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}