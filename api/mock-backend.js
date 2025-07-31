// Mock backend untuk development - akan diganti dengan data dari localStorage
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Mock response untuk semua API calls
  res.status(200).json({ 
    message: 'Mock API response',
    data: [],
    success: true 
  });
}