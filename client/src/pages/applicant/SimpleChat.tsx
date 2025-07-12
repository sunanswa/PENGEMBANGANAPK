export default function SimpleChat() {
  return (
    <div className="p-4 pb-20">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Chat dengan Admin
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Komunikasi langsung dengan tim rekrutmen
      </p>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 h-96 flex flex-col">
        {/* Chat Messages Area */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="text-center py-12">
            <div className="mb-4">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mx-auto flex items-center justify-center">
                <span className="text-2xl">💬</span>
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Belum Ada Percakapan
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Mulai percakapan dengan tim rekrutmen untuk mendapatkan informasi lebih lanjut
            </p>
          </div>
        </div>
        
        {/* Message Input */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Ketik pesan Anda..."
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              Kirim
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}