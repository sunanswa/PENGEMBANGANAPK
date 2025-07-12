import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Paperclip, 
  Smile, 
  Phone, 
  Video, 
  MoreVertical, 
  Clock, 
  CheckCircle, 
  User, 
  Search,
  ArrowLeft,
  Download,
  FileText,
  Image,
  Mic,
  MicOff,
  Camera,
  X,
  Star,
  Archive,
  Trash2,
  Pin,
  UserPlus,
  Building,
  Calendar,
  MessageSquare,
  Info
} from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  type: 'text' | 'file' | 'image' | 'system';
  fileName?: string;
  fileSize?: string;
  fileUrl?: string;
  status: 'sent' | 'delivered' | 'read';
  isMe: boolean;
}

interface ChatContact {
  id: string;
  name: string;
  company: string;
  avatar: string;
  role: string;
  status: 'online' | 'offline' | 'away';
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  jobTitle?: string;
  isStarred: boolean;
  isArchived: boolean;
}

interface QuickResponse {
  id: string;
  text: string;
  category: 'greeting' | 'thanks' | 'question' | 'availability';
}

export default function EnhancedChat() {
  const [selectedContact, setSelectedContact] = useState<ChatContact | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showQuickResponses, setShowQuickResponses] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const contacts: ChatContact[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      company: 'PT Tech Solutions',
      avatar: '👩‍💼',
      role: 'HR Manager',
      status: 'online',
      lastMessage: 'Terima kasih atas lamaran Anda. Kami akan menghubungi Anda dalam 2-3 hari kerja.',
      lastMessageTime: '10:30',
      unreadCount: 2,
      jobTitle: 'Senior Software Developer',
      isStarred: true,
      isArchived: false
    },
    {
      id: '2',
      name: 'Michael Chen',
      company: 'PT Digital Innovation',
      avatar: '👨‍💻',
      role: 'Technical Lead',
      status: 'online',
      lastMessage: 'Bagaimana dengan interview teknis minggu depan?',
      lastMessageTime: '09:15',
      unreadCount: 0,
      jobTitle: 'Frontend Developer',
      isStarred: false,
      isArchived: false
    },
    {
      id: '3',
      name: 'Lisa Wang',
      company: 'PT Startup Unicorn',
      avatar: '👩‍🎨',
      role: 'Recruiter',
      status: 'away',
      lastMessage: 'Selamat! Anda diterima untuk posisi Full Stack Developer.',
      lastMessageTime: 'Kemarin',
      unreadCount: 0,
      jobTitle: 'Full Stack Developer',
      isStarred: true,
      isArchived: false
    },
    {
      id: '4',
      name: 'David Kim',
      company: 'PT Enterprise Corp',
      avatar: '👨‍💼',
      role: 'HR Business Partner',
      status: 'offline',
      lastMessage: 'Mohon maaf, kali ini kami memilih kandidat lain.',
      lastMessageTime: '2 hari lalu',
      unreadCount: 0,
      jobTitle: 'Backend Developer',
      isStarred: false,
      isArchived: true
    }
  ];

  const messages: { [contactId: string]: Message[] } = {
    '1': [
      {
        id: '1',
        senderId: '1',
        senderName: 'Sarah Johnson',
        content: 'Halo John, terima kasih sudah melamar posisi Senior Software Developer di perusahaan kami.',
        timestamp: '10:00',
        type: 'text',
        status: 'read',
        isMe: false
      },
      {
        id: '2',
        senderId: 'me',
        senderName: 'John Doe',
        content: 'Terima kasih sudah menghubungi saya. Saya sangat tertarik dengan posisi ini.',
        timestamp: '10:05',
        type: 'text',
        status: 'read',
        isMe: true
      },
      {
        id: '3',
        senderId: '1',
        senderName: 'Sarah Johnson',
        content: 'Kami telah mereview CV Anda dan ingin mengundang Anda untuk wawancara tahap pertama.',
        timestamp: '10:15',
        type: 'text',
        status: 'read',
        isMe: false
      },
      {
        id: '4',
        senderId: '1',
        senderName: 'Sarah Johnson',
        content: 'Detail_Interview_Teknis.pdf',
        timestamp: '10:20',
        type: 'file',
        fileName: 'Detail_Interview_Teknis.pdf',
        fileSize: '245 KB',
        status: 'read',
        isMe: false
      },
      {
        id: '5',
        senderId: '1',
        senderName: 'Sarah Johnson',
        content: 'Terima kasih atas lamaran Anda. Kami akan menghubungi Anda dalam 2-3 hari kerja.',
        timestamp: '10:30',
        type: 'text',
        status: 'delivered',
        isMe: false
      }
    ],
    '2': [
      {
        id: '1',
        senderId: '2',
        senderName: 'Michael Chen',
        content: 'Hi John! Saya Michael, Technical Lead di PT Digital Innovation.',
        timestamp: '09:00',
        type: 'text',
        status: 'read',
        isMe: false
      },
      {
        id: '2',
        senderId: '2',
        senderName: 'Michael Chen',
        content: 'Bagaimana dengan interview teknis minggu depan?',
        timestamp: '09:15',
        type: 'text',
        status: 'sent',
        isMe: false
      }
    ]
  };

  const quickResponses: QuickResponse[] = [
    { id: '1', text: 'Terima kasih atas informasinya', category: 'thanks' },
    { id: '2', text: 'Saya tersedia untuk interview', category: 'availability' },
    { id: '3', text: 'Bisa tolong dijelaskan lebih detail?', category: 'question' },
    { id: '4', text: 'Selamat pagi/siang/sore', category: 'greeting' },
    { id: '5', text: 'Saya sangat tertarik dengan posisi ini', category: 'question' },
    { id: '6', text: 'Kapan jadwal yang tepat untuk Anda?', category: 'availability' }
  ];

  const filteredContacts = contacts.filter(contact => 
    !contact.isArchived && (
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedContact, messages]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedContact) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      senderName: 'John Doe',
      content: messageInput,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      type: 'text',
      status: 'sent',
      isMe: true
    };

    // In real app, this would send to backend
    if (!messages[selectedContact.id]) {
      messages[selectedContact.id] = [];
    }
    messages[selectedContact.id].push(newMessage);

    setMessageInput('');
    setShowQuickResponses(false);
  };

  const handleQuickResponse = (response: QuickResponse) => {
    setMessageInput(response.text);
    setShowQuickResponses(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedContact) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      senderName: 'John Doe',
      content: file.name,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      type: 'file',
      fileName: file.name,
      fileSize: `${(file.size / 1024).toFixed(1)} KB`,
      status: 'sent',
      isMe: true
    };

    messages[selectedContact.id].push(newMessage);
    event.target.value = '';
  };

  const toggleContactStar = (contactId: string) => {
    const contact = contacts.find(c => c.id === contactId);
    if (contact) {
      contact.isStarred = !contact.isStarred;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getMessageStatus = (status: string) => {
    switch (status) {
      case 'sent': return <Clock className="h-3 w-3 text-gray-400" />;
      case 'delivered': return <CheckCircle className="h-3 w-3 text-gray-400" />;
      case 'read': return <CheckCircle className="h-3 w-3 text-blue-500" />;
      default: return null;
    }
  };

  const renderContactList = () => (
    <div className="w-full md:w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Pesan</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari kontak..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      {/* Contact List */}
      <div className="flex-1 overflow-y-auto">
        {filteredContacts.map((contact) => (
          <div
            key={contact.id}
            className={`p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
              selectedContact?.id === contact.id ? 'bg-blue-50 dark:bg-blue-900/20 border-r-2 border-r-blue-500' : ''
            }`}
            onClick={() => setSelectedContact(contact)}
          >
            <div className="flex items-start space-x-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-lg">
                  {contact.avatar}
                </div>
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 ${getStatusColor(contact.status)}`}></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">{contact.name}</h3>
                  <div className="flex items-center space-x-1">
                    {contact.isStarred && <Star className="h-3 w-3 text-yellow-500 fill-current" />}
                    <span className="text-xs text-gray-500 dark:text-gray-400">{contact.lastMessageTime}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">{contact.company}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{contact.role}</p>
                  </div>
                  {contact.unreadCount > 0 && (
                    <div className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {contact.unreadCount}
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-1">{contact.lastMessage}</p>
                {contact.jobTitle && (
                  <div className="flex items-center mt-1">
                    <Building className="h-3 w-3 text-gray-400 mr-1" />
                    <span className="text-xs text-gray-500 dark:text-gray-400 truncate">{contact.jobTitle}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredContacts.length === 0 && (
          <div className="p-8 text-center">
            <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Tidak ada pesan</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchQuery ? 'Tidak ada pesan yang sesuai dengan pencarian' : 'Belum ada pesan masuk'}
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const renderChatHeader = () => (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="flex items-center space-x-3">
        <button
          className="md:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          onClick={() => setSelectedContact(null)}
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white">
            {selectedContact?.avatar}
          </div>
          <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${getStatusColor(selectedContact?.status || 'offline')}`}></div>
        </div>
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white">{selectedContact?.name}</h3>
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-blue-600 dark:text-blue-400">{selectedContact?.company}</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-500 dark:text-gray-400">{selectedContact?.role}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => toggleContactStar(selectedContact?.id || '')}
          className={`p-2 rounded-lg transition-colors ${
            selectedContact?.isStarred 
              ? 'text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20' 
              : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          <Star className={`h-5 w-5 ${selectedContact?.isStarred ? 'fill-current' : ''}`} />
        </button>
        <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
          <Phone className="h-5 w-5" />
        </button>
        <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
          <Video className="h-5 w-5" />
        </button>
        <button
          onClick={() => setShowContactInfo(!showContactInfo)}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <Info className="h-5 w-5" />
        </button>
      </div>
    </div>
  );

  const renderMessages = () => (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {selectedContact && messages[selectedContact.id]?.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
        >
          <div className={`max-w-xs lg:max-w-md ${message.isMe ? 'order-2' : 'order-1'}`}>
            <div
              className={`rounded-lg px-4 py-2 ${
                message.isMe
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
              }`}
            >
              {message.type === 'file' ? (
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <div>
                    <p className="text-sm font-medium">{message.fileName}</p>
                    <p className="text-xs opacity-75">{message.fileSize}</p>
                  </div>
                  <button className="p-1 hover:bg-black/10 rounded">
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <p className="text-sm">{message.content}</p>
              )}
            </div>
            <div className={`flex items-center mt-1 space-x-1 ${message.isMe ? 'justify-end' : 'justify-start'}`}>
              <span className="text-xs text-gray-500 dark:text-gray-400">{message.timestamp}</span>
              {message.isMe && getMessageStatus(message.status)}
            </div>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );

  const renderChatInput = () => (
    <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      {showQuickResponses && (
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Respon Cepat:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {quickResponses.map((response) => (
              <button
                key={response.id}
                onClick={() => handleQuickResponse(response)}
                className="text-left px-3 py-2 text-sm bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors"
              >
                {response.text}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-end space-x-2">
        <div className="flex space-x-1">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Paperclip className="h-5 w-5" />
          </button>
          <button
            onClick={() => setShowQuickResponses(!showQuickResponses)}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <MessageSquare className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 relative">
          <textarea
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Ketik pesan..."
            rows={1}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
          />
        </div>

        <div className="flex space-x-1">
          <button
            onClick={() => setIsRecording(!isRecording)}
            className={`p-2 rounded-lg transition-colors ${
              isRecording 
                ? 'bg-red-500 text-white' 
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </button>
          <button
            onClick={handleSendMessage}
            disabled={!messageInput.trim()}
            className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileUpload}
        accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
      />
    </div>
  );

  const renderContactInfo = () => (
    <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Info Kontak</h3>
        <button
          onClick={() => setShowContactInfo(false)}
          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {selectedContact && (
        <div className="space-y-6">
          {/* Contact Avatar */}
          <div className="text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl mb-3">
              {selectedContact.avatar}
            </div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white">{selectedContact.name}</h4>
            <p className="text-sm text-blue-600 dark:text-blue-400">{selectedContact.role}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{selectedContact.company}</p>
          </div>

          {/* Status */}
          <div className="flex items-center justify-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${getStatusColor(selectedContact.status)}`}></div>
            <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">{selectedContact.status}</span>
          </div>

          {/* Job Info */}
          {selectedContact.jobTitle && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Posisi Lamaran</h5>
              <p className="text-sm text-gray-600 dark:text-gray-400">{selectedContact.jobTitle}</p>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-2">
            <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <Phone className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-900 dark:text-white">Panggilan Telepon</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <Video className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-900 dark:text-white">Video Call</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <Calendar className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-900 dark:text-white">Jadwalkan Meeting</span>
            </button>
          </div>

          {/* More Actions */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
            <button
              onClick={() => toggleContactStar(selectedContact.id)}
              className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Star className={`h-5 w-5 ${selectedContact.isStarred ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} />
              <span className="text-sm text-gray-900 dark:text-white">
                {selectedContact.isStarred ? 'Hapus dari Favorit' : 'Tambah ke Favorit'}
              </span>
            </button>
            <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <Archive className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-900 dark:text-white">Arsipkan Chat</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 pb-16 md:pb-0">
      <div className="h-full flex">
        {/* Contact List - Mobile: full width when no contact selected, Desktop: always visible */}
        <div className={`${selectedContact ? 'hidden md:flex' : 'flex'} md:w-80`}>
          {renderContactList()}
        </div>

        {/* Chat Area */}
        {selectedContact ? (
          <div className="flex-1 flex flex-col">
            {renderChatHeader()}
            {renderMessages()}
            {renderChatInput()}
          </div>
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center bg-white dark:bg-gray-800">
            <div className="text-center">
              <MessageSquare className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Pilih kontak untuk memulai chat</h3>
              <p className="text-gray-600 dark:text-gray-400">Klik pada salah satu kontak di sebelah kiri untuk memulai percakapan</p>
            </div>
          </div>
        )}

        {/* Contact Info Panel */}
        {showContactInfo && selectedContact && (
          <div className="hidden lg:block">
            {renderContactInfo()}
          </div>
        )}
      </div>
    </div>
  );
}