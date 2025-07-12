import { MailService } from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  console.warn('SENDGRID_API_KEY not found. Email functionality will be mocked.');
}

const mailService = new MailService();
if (process.env.SENDGRID_API_KEY) {
  mailService.setApiKey(process.env.SENDGRID_API_KEY);
}

interface EmailData {
  to: string[];
  subject: string;
  content: string;
  from?: string;
}

interface SMSData {
  to: string[];
  message: string;
}

interface WhatsAppData {
  to: string[];
  message: string;
}

interface CommunicationTemplate {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'whatsapp';
  subject?: string;
  content: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  lastUsed?: Date;
}

interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  action: 'email' | 'sms' | 'whatsapp' | 'email+sms' | 'email+whatsapp';
  templateId: string;
  delay: number; // minutes
  status: 'active' | 'inactive';
}

interface MessageHistory {
  id: string;
  type: 'email' | 'sms' | 'whatsapp';
  recipient: string;
  subject?: string;
  content: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  sentAt: Date;
  templateId?: string;
}

// Mock storage - in real implementation, this would use database
let templates: CommunicationTemplate[] = [
  {
    id: '1',
    name: 'Interview Invitation',
    type: 'email',
    subject: 'Undangan Interview - {jobTitle}',
    content: 'Selamat! Kami mengundang Anda untuk interview posisi {jobTitle} pada {date} pukul {time}.',
    status: 'active',
    createdAt: new Date(),
    lastUsed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    id: '2',
    name: 'Application Received',
    type: 'email',
    subject: 'Aplikasi Anda Telah Diterima',
    content: 'Terima kasih atas lamaran Anda untuk posisi {jobTitle}. Kami akan meninjau aplikasi Anda.',
    status: 'active',
    createdAt: new Date(),
    lastUsed: new Date(Date.now() - 24 * 60 * 60 * 1000)
  },
  {
    id: '3',
    name: 'Interview Reminder',
    type: 'sms',
    content: 'Reminder: Interview Anda untuk posisi {jobTitle} besok jam {time}.',
    status: 'active',
    createdAt: new Date(),
    lastUsed: new Date(Date.now() - 5 * 60 * 60 * 1000)
  },
  {
    id: '4',
    name: 'Welcome Message',
    type: 'whatsapp',
    content: 'Halo! Selamat datang di SWAPRO. Terima kasih sudah melamar untuk posisi {jobTitle}.',
    status: 'active',
    createdAt: new Date()
  }
];

let automationRules: AutomationRule[] = [
  {
    id: '1',
    name: 'Interview Confirmation',
    trigger: 'Interview Scheduled',
    action: 'email+sms',
    templateId: '1',
    delay: 0,
    status: 'active'
  },
  {
    id: '2',
    name: 'Interview Reminder',
    trigger: 'Interview in 24 hours',
    action: 'sms',
    templateId: '3',
    delay: 1440, // 24 hours
    status: 'active'
  },
  {
    id: '3',
    name: 'Application Acknowledgment',
    trigger: 'Application Received',
    action: 'email',
    templateId: '2',
    delay: 5,
    status: 'active'
  }
];

let messageHistory: MessageHistory[] = [
  {
    id: '1',
    type: 'email',
    recipient: 'sarah.wijaya@email.com',
    subject: 'Interview Invitation - Sales Officer',
    content: 'Selamat! Kami mengundang Anda untuk interview...',
    status: 'sent',
    sentAt: new Date(Date.now() - 10 * 60 * 1000),
    templateId: '1'
  },
  {
    id: '2',
    type: 'sms',
    recipient: '+62812345678',
    content: 'Reminder: Interview Anda besok jam 10:00 WIB',
    status: 'delivered',
    sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    templateId: '3'
  },
  {
    id: '3',
    type: 'whatsapp',
    recipient: '+62812345679',
    content: 'Selamat! Aplikasi Anda untuk posisi Credit Marketing diterima',
    status: 'read',
    sentAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    templateId: '4'
  }
];

// Email service
export async function sendEmail(data: EmailData): Promise<boolean> {
  try {
    if (!process.env.SENDGRID_API_KEY) {
      console.log('Mock email sent:', data);
      // Add to message history
      data.to.forEach(recipient => {
        messageHistory.push({
          id: Date.now().toString() + Math.random(),
          type: 'email',
          recipient,
          subject: data.subject,
          content: data.content,
          status: 'sent',
          sentAt: new Date()
        });
      });
      return true;
    }

    const messages = data.to.map(recipient => ({
      to: recipient,
      from: data.from || 'noreply@swapro.com',
      subject: data.subject,
      html: data.content
    }));

    await mailService.send(messages);
    
    // Add to message history
    data.to.forEach(recipient => {
      messageHistory.push({
        id: Date.now().toString() + Math.random(),
        type: 'email',
        recipient,
        subject: data.subject,
        content: data.content,
        status: 'sent',
        sentAt: new Date()
      });
    });

    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
}

// SMS service (mock implementation)
export async function sendSMS(data: SMSData): Promise<boolean> {
  try {
    // In real implementation, integrate with Twilio or similar service
    console.log('Mock SMS sent:', data);
    
    // Add to message history
    data.to.forEach(recipient => {
      messageHistory.push({
        id: Date.now().toString() + Math.random(),
        type: 'sms',
        recipient,
        content: data.message,
        status: 'delivered',
        sentAt: new Date()
      });
    });

    return true;
  } catch (error) {
    console.error('SMS sending failed:', error);
    return false;
  }
}

// WhatsApp service (mock implementation)
export async function sendWhatsApp(data: WhatsAppData): Promise<boolean> {
  try {
    // In real implementation, integrate with WhatsApp Business API
    console.log('Mock WhatsApp sent:', data);
    
    // Add to message history
    data.to.forEach(recipient => {
      messageHistory.push({
        id: Date.now().toString() + Math.random(),
        type: 'whatsapp',
        recipient,
        content: data.message,
        status: 'read',
        sentAt: new Date()
      });
    });

    return true;
  } catch (error) {
    console.error('WhatsApp sending failed:', error);
    return false;
  }
}

// Template replacement function
export function replaceTemplateVariables(content: string, variables: Record<string, string>): string {
  let result = content;
  Object.keys(variables).forEach(key => {
    const regex = new RegExp(`{${key}}`, 'g');
    result = result.replace(regex, variables[key]);
  });
  return result;
}

// Get all templates
export function getTemplates(): CommunicationTemplate[] {
  return templates;
}

// Get template by ID
export function getTemplate(id: string): CommunicationTemplate | undefined {
  return templates.find(t => t.id === id);
}

// Create new template
export function createTemplate(template: Omit<CommunicationTemplate, 'id' | 'createdAt'>): CommunicationTemplate {
  const newTemplate: CommunicationTemplate = {
    ...template,
    id: Date.now().toString(),
    createdAt: new Date()
  };
  templates.push(newTemplate);
  return newTemplate;
}

// Update template
export function updateTemplate(id: string, updates: Partial<CommunicationTemplate>): CommunicationTemplate | undefined {
  const index = templates.findIndex(t => t.id === id);
  if (index === -1) return undefined;
  
  templates[index] = { ...templates[index], ...updates };
  return templates[index];
}

// Delete template
export function deleteTemplate(id: string): boolean {
  const index = templates.findIndex(t => t.id === id);
  if (index === -1) return false;
  
  templates.splice(index, 1);
  return true;
}

// Get automation rules
export function getAutomationRules(): AutomationRule[] {
  return automationRules;
}

// Get message history
export function getMessageHistory(): MessageHistory[] {
  return messageHistory.sort((a, b) => b.sentAt.getTime() - a.sentAt.getTime());
}

// Communication stats
export function getCommunicationStats() {
  const now = new Date();
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  const thisMonthMessages = messageHistory.filter(m => m.sentAt >= thisMonth);
  
  const emailCount = thisMonthMessages.filter(m => m.type === 'email').length;
  const smsCount = thisMonthMessages.filter(m => m.type === 'sms').length;
  const whatsappCount = thisMonthMessages.filter(m => m.type === 'whatsapp').length;
  
  const totalSent = thisMonthMessages.length;
  const successfulSent = thisMonthMessages.filter(m => m.status !== 'failed').length;
  const successRate = totalSent > 0 ? Math.round((successfulSent / totalSent) * 100) : 0;

  return {
    emailCount,
    smsCount,
    whatsappCount,
    totalSent,
    successRate
  };
}

// Send bulk message
export async function sendBulkMessage(
  type: 'email' | 'sms' | 'whatsapp',
  recipients: string[],
  content: string,
  subject?: string,
  templateId?: string
): Promise<{ success: boolean; results: Array<{ recipient: string; success: boolean }> }> {
  const results: Array<{ recipient: string; success: boolean }> = [];
  
  try {
    if (type === 'email') {
      if (!subject) throw new Error('Subject required for email');
      const success = await sendEmail({ to: recipients, subject, content });
      recipients.forEach(recipient => {
        results.push({ recipient, success });
      });
    } else if (type === 'sms') {
      const success = await sendSMS({ to: recipients, message: content });
      recipients.forEach(recipient => {
        results.push({ recipient, success });
      });
    } else if (type === 'whatsapp') {
      const success = await sendWhatsApp({ to: recipients, message: content });
      recipients.forEach(recipient => {
        results.push({ recipient, success });
      });
    }

    // Update template last used if templateId provided
    if (templateId) {
      updateTemplate(templateId, { lastUsed: new Date() });
    }

    return { success: true, results };
  } catch (error) {
    console.error('Bulk message sending failed:', error);
    return { success: false, results };
  }
}