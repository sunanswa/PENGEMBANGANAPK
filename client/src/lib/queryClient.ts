import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

// Mock data untuk frontend-only deployment
const mockData: Record<string, any[]> = {
  jobs: [
    {
      id: '1',
      title: 'Software Engineer',
      department: 'Engineering',
      location: ['Jakarta', 'Remote'],
      type: 'Full-time',
      status: 'active',
      description: 'Join our engineering team to build amazing products.',
      requirements: 'Bachelor degree in Computer Science or related field',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2', 
      title: 'Product Manager',
      department: 'Product',
      location: ['Jakarta'],
      type: 'Full-time',
      status: 'active',
      description: 'Lead product strategy and development.',
      requirements: 'Experience in product management',
      createdAt: new Date().toISOString(),
    }
  ],
  applications: [],
  interviews: [],
  users: []
};

const getFromLocalStorage = (key: string) => {
  if (typeof window === 'undefined') return mockData[key] || [];
  const stored = localStorage.getItem(`swapro_${key}`);
  return stored ? JSON.parse(stored) : mockData[key] || [];
};

const saveToLocalStorage = (key: string, data: any) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`swapro_${key}`, JSON.stringify(data));
};

export const apiRequest = async (url: string, options?: RequestInit) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));

  const method = options?.method || 'GET';
  const segments = url.replace('/api/', '').split('/');
  const resource = segments[0];
  const id = segments[1];

  try {
    switch (method) {
      case 'GET':
        if (id) {
          const items = getFromLocalStorage(resource);
          const item = items.find((item: any) => item.id === id);
          return item || null;
        }
        return getFromLocalStorage(resource);

      case 'POST':
        const bodyData = options?.body;
        if (!bodyData) throw new Error('No data provided');
        const newItem = JSON.parse(bodyData as string);
        newItem.id = Date.now().toString();
        newItem.createdAt = new Date().toISOString();
        const items = getFromLocalStorage(resource);
        items.push(newItem);
        saveToLocalStorage(resource, items);
        return newItem;

      case 'PUT':
        const bodyContent = options?.body;
        if (!bodyContent) throw new Error('No data provided');
        const updateData = JSON.parse(bodyContent as string);
        const allItems = getFromLocalStorage(resource);
        const index = allItems.findIndex((item: any) => item.id === id);
        if (index !== -1) {
          allItems[index] = { ...allItems[index], ...updateData, updatedAt: new Date().toISOString() };
          saveToLocalStorage(resource, allItems);
          return allItems[index];
        }
        throw new Error('Item not found');

      case 'DELETE':
        const itemsToFilter = getFromLocalStorage(resource);
        const filtered = itemsToFilter.filter((item: any) => item.id !== id);
        saveToLocalStorage(resource, filtered);
        return { success: true };

      default:
        throw new Error('Method not supported');
    }
  } catch (error: any) {
    console.error('API Request Error:', error);
    throw new Error(error?.message || 'Request failed');
  }
};