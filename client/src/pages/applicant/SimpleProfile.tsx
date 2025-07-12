export default function SimpleProfile() {
  return (
    <div className="p-4 pb-20">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Profil Saya
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Kelola informasi profil dan pengaturan akun Anda
      </p>
      
      <div className="space-y-4">
        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <span className="text-2xl font-semibold text-blue-600 dark:text-blue-400">JD</span>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">John Doe</h3>
              <p className="text-gray-500 dark:text-gray-400">john.doe@example.com</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          <button className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <h4 className="font-medium text-gray-900 dark:text-white">Edit Profil</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">Perbarui informasi personal Anda</p>
          </button>
          
          <button className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <h4 className="font-medium text-gray-900 dark:text-white">CV & Dokumen</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">Upload dan kelola dokumen lamaran</p>
          </button>
          
          <button className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <h4 className="font-medium text-gray-900 dark:text-white">Pengaturan</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">Atur notifikasi dan preferensi</p>
          </button>
          
          <button className="w-full bg-white dark:bg-gray-800 border border-red-200 dark:border-red-700 rounded-lg p-4 text-left hover:bg-red-50 dark:hover:bg-red-900 transition-colors">
            <h4 className="font-medium text-red-600 dark:text-red-400">Keluar</h4>
            <p className="text-sm text-red-500 dark:text-red-400">Logout dari akun Anda</p>
          </button>
        </div>
      </div>
    </div>
  );
}