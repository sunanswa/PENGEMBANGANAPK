# Setup Google Apps Script untuk Integrasi Google Sheets & Google Drive

Untuk menghubungkan form dengan Google Spreadsheet dan Google Drive Anda, ikuti langkah-langkah berikut:

## 1. Buka Google Apps Script
- Kunjungi [script.google.com](https://script.google.com)
- Klik "New Project"

## 2. Ganti Code.gs dengan kode berikut:

```javascript
function doPost(e) {
  try {
    // Cek apakah ada postData
    if (!e || !e.postData || !e.postData.contents) {
      console.log('No postData found in request');
      return ContentService
        .createTextOutput(JSON.stringify({
          success: false, 
          error: 'No data received',
          message: 'Tidak ada data yang diterima'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // ID Spreadsheet Anda
    const SPREADSHEET_ID = '1f1SPwqEnCocOVKKTq-6T5U7hB4zK0ICB1huyyv40toA';
    
    // ID Google Drive Folder untuk CV
    const DRIVE_FOLDER_ID = '1CX03Rk8VImbIFVt1iR9BX17ie1T8IfC_';
    
    // Buka spreadsheet
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getActiveSheet();
    
    // Parse data dari request
    const data = JSON.parse(e.postData.contents);
    
    // FITUR BARU: Cek duplikasi berdasarkan NIK
    if (data.nik) {
      const existingData = sheet.getDataRange().getValues();
      for (let i = 1; i < existingData.length; i++) { // Skip header row
        if (existingData[i][4] === data.nik) { // Column 5 (index 4) is NIK
          console.log('Duplicate NIK found:', data.nik);
          return ContentService
            .createTextOutput(JSON.stringify({
              success: false, 
              error: 'Duplicate NIK',
              message: 'NIK sudah terdaftar! Anda sudah pernah mendaftar sebelumnya.',
              isDuplicate: true
            }))
            .setMimeType(ContentService.MimeType.JSON);
        }
      }
    }
    
    // Jika ini adalah baris pertama, tambahkan header
    if (sheet.getLastRow() === 0) {
      const headers = [
        'Timestamp',
        'Posisi Dilamar',
        'Penempatan',
        'Nama Lengkap',
        'NIK',
        'No HP',
        'Tempat Lahir',
        'Tanggal Lahir',
        'Umur',
        'Jenis Kelamin',
        'Status Perkawinan',
        'Agama',
        'Nama Ayah',
        'Nama Ibu',
        'Alamat KTP',
        'Alamat Domisili',
        'RT/RW',
        'Nomor Rumah',
        'Kelurahan',
        'Kecamatan',
        'Kota',
        'Kode Pos',
        'Tingkat Pendidikan',
        'Nama Sekolah',
        'Jurusan',
        'Tahun Masuk',
        'Tahun Lulus',
        'IPK',
        'Pengalaman Kerja',
        'Pengalaman Leasing',
        'Nama Perusahaan',
        'Posisi Jabatan',
        'Periode Kerja',
        'Deskripsi Tugas',
        'Kendaraan Pribadi',
        'KTP Asli',
        'SIM C',
        'SIM A',
        'SKCK',
        'NPWP',
        'Riwayat Buruk Kredit',
        'Alasan Melamar',
        'CV File Name',
        'CV Drive Link'
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      // Format header
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground('#4285f4');
      headerRange.setFontColor('#ffffff');
      headerRange.setFontWeight('bold');
      headerRange.setWrap(true);
      
      // Auto-resize columns
      sheet.autoResizeColumns(1, headers.length);
    }
    
    // Handle CV file upload jika ada
    let cvFileName = 'Tidak ada file';
    let cvDriveLink = '';
    
    if (data.cvFileData && data.cvFileName) {
      try {
        // Decode base64 file data
        const fileBlob = Utilities.newBlob(
          Utilities.base64Decode(data.cvFileData), 
          'application/pdf', 
          `${data.namaLengkap.replace(/[^a-zA-Z0-9]/g, '_')}_${data.posisiDilamar.replace(/[^a-zA-Z0-9]/g, '_')}_CV.pdf`
        );
        
        // Upload ke Google Drive folder
        const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
        const file = folder.createFile(fileBlob);
        
        cvFileName = file.getName();
        cvDriveLink = file.getUrl();
        
        // Set file permissions agar bisa diakses
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        
        console.log('CV uploaded successfully:', cvFileName);
        
      } catch (uploadError) {
        console.error('Error uploading CV:', uploadError);
        cvFileName = `Error: ${data.cvFileName}`;
        cvDriveLink = 'Upload failed';
      }
    }
    
    // Siapkan data untuk dimasukkan dengan fallback values
    const rowData = [
      new Date(data.timestamp || new Date()),
      data.posisiDilamar || '',
      data.penempatan || '',
      data.namaLengkap || '',
      data.nik || '',
      data.noHp || '',
      data.tempatLahir || '',
      data.tanggalLahir || '',
      data.umur || '',
      data.jenisKelamin || '',
      data.statusPerkawinan || '',
      data.agama || '',
      data.namaAyah || '',
      data.namaIbu || '',
      data.alamatKtp || '',
      data.alamatDomisili || '',
      data.rtRw || '',
      data.nomorRumah || '',
      data.kelurahan || '',
      data.kecamatan || '',
      data.kota || '',
      data.kodePos || '',
      data.tingkatPendidikan || '',
      data.namaSekolah || '',
      data.jurusan || '',
      data.tahunMasuk || '',
      data.tahunLulus || '',
      data.ipk || '',
      data.pengalamanKerja || 'Tidak',
      data.pengalamanLeasing || 'Tidak',
      data.namaPerusahaan || '',
      data.posisiJabatan || '',
      data.periodeKerja || '',
      data.deskripsiTugas || '',
      data.kendaraanPribadi || 'Tidak',
      data.ktpAsli || 'Tidak',
      data.simC || 'Tidak',
      data.simA || 'Tidak',
      data.skck || 'Tidak',
      data.npwp || 'Tidak',
      data.riwayatBurukKredit || 'Tidak',
      data.alasanMelamar || '',
      cvFileName,
      cvDriveLink
    ];
    
    // Tambahkan data ke baris baru
    const newRow = sheet.getLastRow() + 1;
    sheet.getRange(newRow, 1, 1, rowData.length).setValues([rowData]);
    
    // Format baris baru
    const newRowRange = sheet.getRange(newRow, 1, 1, rowData.length);
    newRowRange.setBorder(true, true, true, true, true, true);
    
    // Highlight CV link jika ada
    if (cvDriveLink && cvDriveLink !== 'Upload failed') {
      const cvLinkCell = sheet.getRange(newRow, rowData.length); // Last column
      cvLinkCell.setBackground('#e8f5e8');
      cvLinkCell.setFontColor('#1a73e8');
    }
    
    console.log('Data saved successfully for:', data.namaLengkap);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true, 
        cvUploaded: !!cvDriveLink && cvDriveLink !== 'Upload failed',
        message: 'Data berhasil disimpan'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Script error:', error);
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false, 
        error: error.toString(),
        message: 'Terjadi kesalahan saat menyimpan data'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput("Google Apps Script is working! Ready to receive form submissions.")
    .setMimeType(ContentService.MimeType.TEXT);
}

// Function untuk test koneksi
function testConnections() {
  try {
    // Test Spreadsheet
    const SPREADSHEET_ID = '1f1SPwqEnCocOVKKTq-6T5U7hB4zK0ICB1huyyv40toA';
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    console.log('✅ Spreadsheet accessible:', ss.getName());
    
    // Test Drive Folder
    const DRIVE_FOLDER_ID = '1CX03Rk8VImbIFVt1iR9BX17ie1T8IfC_';
    const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
    console.log('✅ Drive folder accessible:', folder.getName());
    
    return {
      spreadsheet: ss.getName(),
      driveFolder: folder.getName(),
      status: 'All connections working!'
    };
    
  } catch (error) {
    console.error('❌ Connection test failed:', error);
    return {
      error: error.toString(),
      status: 'Connection failed!'
    };
  }
}

// Function untuk test doPost dengan sample data
function testDoPost() {
  const sampleData = {
    timestamp: new Date().toISOString(),
    posisiDilamar: 'Sales Officer Chaneling (SOC)',
    penempatan: 'ADIRA TEBET MOTOR',
    namaLengkap: 'John Doe Test',
    nik: '1234567890123456',
    noHp: '081234567890',
    tempatLahir: 'Jakarta',
    tanggalLahir: '1990-01-01',
    umur: '34',
    jenisKelamin: 'Laki-laki',
    statusPerkawinan: 'Menikah',
    agama: 'Islam',
    namaAyah: 'John Senior',
    namaIbu: 'Jane Doe',
    alamatKtp: 'Jl. Contoh No. 123',
    alamatDomisili: 'Jl. Contoh No. 123',
    rtRw: '001/002',
    nomorRumah: '123',
    kelurahan: 'Kelurahan Contoh',
    kecamatan: 'Kecamatan Contoh',
    kota: 'Jakarta',
    kodePos: '12345',
    tingkatPendidikan: 'S1',
    namaSekolah: 'Universitas Contoh',
    jurusan: 'Ekonomi',
    tahunMasuk: '2008',
    tahunLulus: '2012',
    ipk: '3.5',
    pengalamanKerja: 'Ya',
    pengalamanLeasing: 'Ya',
    namaPerusahaan: 'PT. Contoh',
    posisiJabatan: 'Sales',
    periodeKerja: 'Jan 2020 - Des 2023',
    deskripsiTugas: 'Melakukan penjualan produk',
    kendaraanPribadi: 'Ya',
    ktpAsli: 'Ya',
    simC: 'Ya',
    simA: 'Tidak',
    skck: 'Ya',
    npwp: 'Ya',
    riwayatBurukKredit: 'Tidak',
    alasanMelamar: 'Tertarik dengan perusahaan dan posisi yang ditawarkan',
    cvFileName: 'sample_cv.pdf',
    cvFileData: null
  };
  
  // Simulate doPost with sample data
  const mockEvent = {
    postData: {
      contents: JSON.stringify(sampleData)
    }
  };
  
  console.log('Testing doPost with sample data...');
  const result = doPost(mockEvent);
  console.log('Test result:', result.getContent());
  
  return result;
}

// Function untuk cek duplikasi NIK
function checkDuplicateNIK(nik) {
  try {
    const SPREADSHEET_ID = '1f1SPwqEnCocOVKKTq-6T5U7hB4zK0ICB1huyyv40toA';
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getActiveSheet();
    
    const existingData = sheet.getDataRange().getValues();
    for (let i = 1; i < existingData.length; i++) { // Skip header row
      if (existingData[i][4] === nik) { // Column 5 (index 4) is NIK
        return {
          isDuplicate: true,
          existingName: existingData[i][3], // Column 4 (index 3) is Nama Lengkap
          registrationDate: existingData[i][0] // Column 1 (index 0) is Timestamp
        };
      }
    }
    
    return { isDuplicate: false };
    
  } catch (error) {
    console.error('Error checking duplicate NIK:', error);
    return { error: error.toString() };
  }
}
```

## 3. Enable Google Drive API
1. Di Google Apps Script, klik "Services" (ikon + di sebelah kiri)
2. Pilih "Google Drive API"
3. Klik "Add"

## 4. Test Koneksi & Script
1. **Test Koneksi**: Jalankan function `testConnections` untuk memastikan akses ke spreadsheet dan drive folder
2. **Test Script**: Jalankan function `testDoPost` untuk test dengan sample data
3. **Test Duplikasi**: Jalankan function `checkDuplicateNIK('1234567890123456')` untuk test pengecekan duplikasi
4. Authorize semua permissions yang diminta
5. Cek log untuk memastikan tidak ada error

## 5. Deploy Web App
1. Klik "Deploy" > "New deployment"
2. Pilih type: "Web app"
3. Execute as: "Me"
4. Who has access: "Anyone"
5. Klik "Deploy"
6. **PENTING**: Authorize semua permissions yang diminta
7. Copy URL yang diberikan

## 6. Update Form
Ganti `YOUR_GOOGLE_APPS_SCRIPT_URL_HERE` di file App.tsx dengan URL yang Anda dapatkan dari langkah 5.

## 7. Test Complete Integration
1. Coba submit form dengan file CV
2. Cek apakah data masuk ke spreadsheet: https://docs.google.com/spreadsheets/d/1f1SPwqEnCocOVKKTq-6T5U7hB4zK0ICB1huyyv40toA/edit
3. Cek apakah file CV terupload ke Google Drive: https://drive.google.com/drive/folders/1CX03Rk8VImbIFVt1iR9BX17ie1T8IfC_

## ✨ FITUR BARU - ANTI DUPLIKASI:

### 🚫 **Pencegahan Duplikasi Berdasarkan NIK**
- System akan cek NIK sebelum menyimpan data
- Jika NIK sudah ada, pendaftaran akan ditolak
- Pesan error akan muncul: "NIK sudah terdaftar! Anda sudah pernah mendaftar sebelumnya."

### 🔍 **Function Tambahan**
- `checkDuplicateNIK(nik)` - untuk cek manual duplikasi NIK
- `testDoPost()` - untuk test script dengan sample data
- Error handling yang lebih robust

## Troubleshooting Error yang Anda Alami:

### ❌ `No postData found in request`
**Penyebab**: Function `doPost` dipanggil tanpa data POST yang valid
**Solusi**: 
1. ✅ Sudah ditambahkan pengecekan `postData` yang lebih robust
2. ✅ Sudah ditambahkan fallback values untuk semua field
3. ✅ Sudah ditambahkan function `testDoPost` untuk testing

### 🔧 Langkah Debug:
1. **Jalankan `testConnections`** - pastikan akses ke spreadsheet & drive OK
2. **Jalankan `testDoPost`** - test script dengan sample data
3. **Cek Execution log** - lihat apakah ada error lain
4. **Deploy ulang** - setelah update kode

### 📝 Tips:
- Pastikan sudah authorize semua permissions
- Jangan test dengan "Run" button untuk `doPost` - gunakan `testDoPost` instead
- Error tersebut normal jika `doPost` dijalankan manual tanpa data
- NIK yang sama tidak bisa mendaftar 2 kali

## 🎯 **Cara Test Anti-Duplikasi:**
1. Submit form dengan NIK tertentu (misal: 1234567890123456)
2. Coba submit lagi dengan NIK yang sama
3. System akan menolak dan menampilkan pesan error
4. Coba dengan NIK berbeda - akan berhasil

Coba jalankan function `testConnections` dan `testDoPost` dulu untuk memastikan semuanya bekerja!