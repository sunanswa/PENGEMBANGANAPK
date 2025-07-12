export default function SimpleApplications() {
  return (
    <div className="p-4 pb-20">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Lamaran Saya
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Pantau progress lamaran kerja Anda
      </p>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="text-center py-12">
          <div className="mb-4">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mx-auto flex items-center justify-center">
              <span className="text-2xl">📄</span>
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Belum Ada Lamaran
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Anda belum memiliki lamaran kerja. Mulai lamar pekerjaan dari halaman Menu.
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
            Cari Lowongan
          </button>
        </div>
      </div>
    </div>
  );
}