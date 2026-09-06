// ==================== FUNGSI UTAMA ====================

// Data Storage
let dataAnggota = JSON.parse(localStorage.getItem('koperasiAnggota')) || [];
let dataSimpanan = JSON.parse(localStorage.getItem('koperasiSimpanan')) || [];
let dataPinjaman = JSON.parse(localStorage.getItem('koperasiPinjaman')) || [];
let dataAngsuran = JSON.parse(localStorage.getItem('koperasiAngsuran')) || [];

// Fungsi untuk menyimpan data ke localStorage
function saveData() {
    localStorage.setItem('koperasiAnggota', JSON.stringify(dataAnggota));
    localStorage.setItem('koperasiSimpanan', JSON.stringify(dataSimpanan));
    localStorage.setItem('koperasiPinjaman', JSON.stringify(dataPinjaman));
    localStorage.setItem('koperasiAngsuran', JSON.stringify(dataAngsuran));
}

// Fungsi untuk menampilkan halaman
function showPage(pageId) {
    // Sembunyikan semua halaman
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    // Tampilkan halaman yang dipilih
    document.getElementById(pageId).classList.add('active');
    
    // Refresh data
    refreshAllData();
}

// Fungsi untuk format Rupiah
function formatRupiah(angka) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(angka);
}

// Fungsi untuk format tanggal
function formatTanggal(tanggal) {
    const date = new Date(tanggal);
    return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

// ==================== DATA ANGGOTA ====================

// Form submit untuk anggota
document.getElementById('formAnggota').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const anggotaId = document.getElementById('anggotaId').value;
    const nama = document.getElementById('nama').value;
    const nik = document.getElementById('nik').value;
    const alamat = document.getElementById('alamat').value;
    const telepon = document.getElementById('telepon').value;
    const pekerjaan = document.getElementById('pekerjaan').value;
    
    if (anggotaId) {
        // Update anggota
        const index = dataAnggota.findIndex(a => a.id == anggotaId);
        if (index !== -1) {
            dataAnggota[index] = {
                ...dataAnggota[index],
                nama,
                nik,
                alamat,
                telepon,
                pekerjaan
            };
        }
    } else {
        // Tambah anggota baru
        const newAnggota = {
            id: Date.now(),
            nama,
            nik,
            alamat,
            telepon,
            pekerjaan,
            tanggalDaftar: new Date().toISOString()
        };
        dataAnggota.push(newAnggota);
    }
    
    saveData();
    refreshAllData();
    this.reset();
    document.getElementById('anggotaId').value = '';
});

// Fungsi untuk menampilkan data anggota
function tampilkanAnggota() {
    const tabelBody = document.getElementById('tabelAnggota');
    tabelBody.innerHTML = '';
    
    dataAnggota.forEach((anggota, index) => {
        const row = tabelBody.insertRow();
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${anggota.nama}</td>
            <td>${anggota.nik}</td>
            <td>${anggota.alamat}</td>
            <td>${anggota.telepon}</td>
            <td>${anggota.pekerjaan}</td>
            <td>
                <button class="action-btn btn-edit" onclick="editAnggota(${anggota.id})">Edit</button>
                <button class="action-btn btn-delete" onclick="hapusAnggota(${anggota.id})">Hapus</button>
            </td>
        `;
    });
}

// Fungsi untuk mengedit anggota
function editAnggota(id) {
    const anggota = dataAnggota.find(a => a.id === id);
    if (anggota) {
        document.getElementById('anggotaId').value = anggota.id;
        document.getElementById('nama').value = anggota.nama;
        document.getElementById('nik').value = anggota.nik;
        document.getElementById('alamat').value = anggota.alamat;
        document.getElementById('telepon').value = anggota.telepon;
        document.getElementById('pekerjaan').value = anggota.pekerjaan;
    }
}

// Fungsi untuk menghapus anggota
function hapusAnggota(id) {
    if (confirm('Apakah Anda yakin ingin menghapus anggota ini?')) {
        dataAnggota = dataAnggota.filter(a => a.id !== id);
        saveData();
        refreshAllData();
    }
}

// ==================== SIMPANAN ====================

// Form submit untuk simpanan
document.getElementById('formSimpanan').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const simpananId = document.getElementById('simpananId').value;
    const anggotaId = document.getElementById('simpananAnggota').value;
    const jenis = document.getElementById('jenisSimpanan').value;
    const jumlah = parseInt(document.getElementById('jumlahSimpanan').value);
    const tanggal = document.getElementById('tanggalSimpanan').value;
    
    if (simpananId) {
        // Update simpanan
        const index = dataSimpanan.findIndex(s => s.id == simpananId);
        if (index !== -1) {
            dataSimpanan[index] = {
                ...dataSimpanan[index],
                anggotaId,
                jenis,
                jumlah,
                tanggal
            };
        }
    } else {
        // Tambah simpanan baru
        const newSimpanan = {
            id: Date.now(),
            anggotaId,
            jenis,
            jumlah,
            tanggal
        };
        dataSimpanan.push(newSimpanan);
    }
    
    saveData();
    refreshAllData();
    this.reset();
    document.getElementById('simpananId').value = '';
});

// Fungsi untuk menampilkan data simpanan
function tampilkanSimpanan() {
    const tabelBody = document.getElementById('tabelSimpanan');
    tabelBody.innerHTML = '';
    
    dataSimpanan.forEach((simpanan, index) => {
        const anggota = dataAnggota.find(a => a.id == simpanan.anggotaId);
        const namaAnggota = anggota ? anggota.nama : 'Anggota tidak ditemukan';
        
        const row = tabelBody.insertRow();
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${namaAnggota}</td>
            <td>${simpanan.jenis}</td>
            <td>${formatRupiah(simpanan.jumlah)}</td>
            <td>${formatTanggal(simpanan.tanggal)}</td>
            <td>
                <button class="action-btn btn-edit" onclick="editSimpanan(${simpanan.id})">Edit</button>
                <button class="action-btn btn-delete" onclick="hapusSimpanan(${simpanan.id})">Hapus</button>
            </td>
        `;
    });
}

// Fungsi untuk mengedit simpanan
function editSimpanan(id) {
    const simpanan = dataSimpanan.find(s => s.id === id);
    if (simpanan) {
        document.getElementById('simpananId').value = simpanan.id;
        document.getElementById('simpananAnggota').value = simpanan.anggotaId;
        document.getElementById('jenisSimpanan').value = simpanan.jenis;
        document.getElementById('jumlahSimpanan').value = simpanan.jumlah;
        document.getElementById('tanggalSimpanan').value = simpanan.tanggal;
    }
}

// Fungsi untuk menghapus simpanan
function hapusSimpanan(id) {
    if (confirm('Apakah Anda yakin ingin menghapus data simpanan ini?')) {
        dataSimpanan = dataSimpanan.filter(s => s.id !== id);
        saveData();
        refreshAllData();
    }
}

// ==================== PINJAMAN ====================

// Form submit untuk pinjaman
document.getElementById('formPinjaman').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const pinjamanId = document.getElementById('pinjamanId').value;
    const anggotaId = document.getElementById('pinjamanAnggota').value;
    const jumlah = parseInt(document.getElementById('jumlahPinjaman').value);
    const tenor = parseInt(document.getElementById('tenor').value);
    const bunga = parseFloat(document.getElementById('bunga').value);
    const tanggal = document.getElementById('tanggalPinjaman').value;
    
    if (pinjamanId) {
        // Update pinjaman
        const index = dataPinjaman.findIndex(p => p.id == pinjamanId);
        if (index !== -1) {
            dataPinjaman[index] = {
                ...dataPinjaman[index],
                anggotaId,
                jumlah,
                tenor,
                bunga,
                tanggal
            };
        }
    } else {
        // Tambah pinjaman baru
        const newPinjaman = {
            id: Date.now(),
            anggotaId,
            jumlah,
            tenor,
            bunga,
            tanggal,
            status: 'Aktif'
        };
        dataPinjaman.push(newPinjaman);
    }
    
    saveData();
    refreshAllData();
    this.reset();
    document.getElementById('pinjamanId').value = '';
});

// Fungsi untuk menampilkan data pinjaman
function tampilkanPinjaman() {
    const tabelBody = document.getElementById('tabelPinjaman');
    tabelBody.innerHTML = '';
    
    dataPinjaman.forEach((pinjaman, index) => {
        const anggota = dataAnggota.find(a => a.id == pinjaman.anggotaId);
        const namaAnggota = anggota ? anggota.nama : 'Anggota tidak ditemukan';
        
        const row = tabelBody.insertRow();
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${namaAnggota}</td>
            <td>${formatRupiah(pinjaman.jumlah)}</td>
            <td>${pinjaman.tenor} bulan</td>
            <td>${pinjaman.bunga}%</td>
            <td>${formatTanggal(pinjaman.tanggal)}</td>
            <td>${pinjaman.status}</td>
            <td>
                <button class="action-btn btn-edit" onclick="editPinjaman(${pinjaman.id})">Edit</button>
                <button class="action-btn btn-delete" onclick="hapusPinjaman(${pinjaman.id})">Hapus</button>
            </td>
        `;
    });
}

// Fungsi untuk mengedit pinjaman
function editPinjaman(id) {
    const pinjaman = dataPinjaman.find(p => p.id === id);
    if (pinjaman) {
        document.getElementById('pinjamanId').value = pinjaman.id;
        document.getElementById('pinjamanAnggota').value = pinjaman.anggotaId;
        document.getElementById('jumlahPinjaman').value = pinjaman.jumlah;
        document.getElementById('tenor').value = pinjaman.tenor;
        document.getElementById('bunga').value = pinjaman.bunga;
        document.getElementById('tanggalPinjaman').value = pinjaman.tanggal;
    }
}

// Fungsi untuk menghapus pinjaman
function hapusPinjaman(id) {
    if (confirm('Apakah Anda yakin ingin menghapus data pinjaman ini?')) {
        dataPinjaman = dataPinjaman.filter(p => p.id !== id);
        saveData();
        refreshAllData();
    }
}

// ==================== ANGSURAN ====================

// Form submit untuk angsuran
document.getElementById('formAngsuran').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const angsuranId = document.getElementById('angsuranId').value;
    const pinjamanId = document.getElementById('angsuranPinjaman').value;
    const jumlah = parseInt(document.getElementById('jumlahAngsuran').value);
    const tanggal = document.getElementById('tanggalAngsuran').value;
    
    if (angsuranId) {
        // Update angsuran
        const index = dataAngsuran.findIndex(a => a.id == angsuranId);
        if (index !== -1) {
            dataAngsuran[index] = {
                ...dataAngsuran[index],
                pinjamanId,
                jumlah,
                tanggal
            };
        }
    } else {
        // Tambah angsuran baru
        const newAngsuran = {
            id: Date.now(),
            pinjamanId,
            jumlah,
            tanggal
        };
        dataAngsuran.push(newAngsuran);
        
        // Cek total angsuran vs pinjaman
        const pinjaman = dataPinjaman.find(p => p.id == pinjamanId);
        if (pinjaman) {
            const totalAngsuran = dataAngsuran
                .filter(a => a.pinjamanId == pinjamanId)
                .reduce((total, a) => total + a.jumlah, 0);
            
            if (totalAngsuran >= pinjaman.jumlah) {
                pinjaman.status = 'Lunas';
                saveData();
            }
        }
    }
    
    saveData();
    refreshAllData();
    this.reset();
    document.getElementById('angsuranId').value = '';
});

// Fungsi untuk menampilkan data angsuran
function tampilkanAngsuran() {
    const tabelBody = document.getElementById('tabelAngsuran');
    tabelBody.innerHTML = '';
    
    dataAngsuran.forEach((angsuran, index) => {
        const pinjaman = dataPinjaman.find(p => p.id == angsuran.pinjamanId);
        const anggota = pinjaman ? dataAnggota.find(a => a.id == pinjaman.anggotaId) : null;
        const namaAnggota = anggota ? anggota.nama : 'Tidak ditemukan';
        
        const row = tabelBody.insertRow();
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${namaAnggota}</td>
            <td>${formatRupiah(angsuran.jumlah)}</td>
            <td>${formatTanggal(angsuran.tanggal)}</td>
            <td>
                <button class="action-btn btn-edit" onclick="editAngsuran(${angsuran.id})">Edit</button>
                <button class="action-btn btn-delete" onclick="hapusAngsuran(${angsuran.id})">Hapus</button>
            </td>
        `;
    });
}

// Fungsi untuk mengedit angsuran
function editAngsuran(id) {
    const angsuran = dataAngsuran.find(a => a.id === id);
    if (angsuran) {
        document.getElementById('angsuranId').value = angsuran.id;
        document.getElementById('angsuranPinjaman').value = angsuran.pinjamanId;
        document.getElementById('jumlahAngsuran').value = angsuran.jumlah;
        document.getElementById('tanggalAngsuran').value = angsuran.tanggal;
    }
}

// Fungsi untuk menghapus angsuran
function hapusAngsuran(id) {
    if (confirm('Apakah Anda yakin ingin menghapus data angsuran ini?')) {
        dataAngsuran = dataAngsuran.filter(a => a.id !== id);
        saveData();
        refreshAllData();
    }
}

// ==================== LAPORAN ====================

function printLaporan(jenis) {
    const outputDiv = document.getElementById('laporanOutput');
    let laporanHTML = '';
    
    switch(jenis) {
        case 'anggota':
            laporanHTML = `
                <h3>Laporan Data Anggota</h3>
                <p>Tanggal: ${formatTanggal(new Date().toISOString())}</p>
                <table>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Nama</th>
                            <th>NIK</th>
                            <th>Alamat</th>
                            <th>Telepon</th>
                            <th>Pekerjaan</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${dataAnggota.map((anggota, index) => `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${anggota.nama}</td>
                                <td>${anggota.nik}</td>
                                <td>${anggota.alamat}</td>
                                <td>${anggota.telepon}</td>
                                <td>${anggota.pekerjaan}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
            break;
            
        case 'simpanan':
            laporanHTML = `
                <h3>Laporan Data Simpanan</h3>
                <p>Tanggal: ${formatTanggal(new Date().toISOString())}</p>
                <table>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Nama Anggota</th>
                            <th>Jenis Simpanan</th>
                            <th>Jumlah</th>
                            <th>Tanggal</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${dataSimpanan.map((simpanan, index) => {
                            const anggota = dataAnggota.find(a => a.id == simpanan.anggotaId);
                            return `
                                <tr>
                                    <td>${index + 1}</td>
                                    <td>${anggota ? anggota.nama : '-'}</td>
                                    <td>${simpanan.jenis}</td>
                                    <td>${formatRupiah(simpanan.jumlah)}</td>
                                    <td>${formatTanggal(simpanan.tanggal)}</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
                <p><strong>Total Simpanan: ${formatRupiah(dataSimpanan.reduce((total, s) => total + s.jumlah, 0))}</strong></p>
            `;
            break;
            
        case 'pinjaman':
            laporanHTML = `
                <h3>Laporan Data Pinjaman</h3>
                <p>Tanggal: ${formatTanggal(new Date().toISOString())}</p>
                <table>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Nama Anggota</th>
                            <th>Jumlah</th>
                            <th>Tenor</th>
                            <th>Bunga</th>
                            <th>Tanggal</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${dataPinjaman.map((pinjaman, index) => {
                            const anggota = dataAnggota.find(a => a.id == pinjaman.anggotaId);
                            return `
                                <tr>
                                    <td>${index + 1}</td>
                                    <td>${anggota ? anggota.nama : '-'}</td>
                                    <td>${formatRupiah(pinjaman.jumlah)}</td>
                                    <td>${pinjaman.tenor} bulan</td>
                                    <td>${pinjaman.bunga}%</td>
                                    <td>${formatTanggal(pinjaman.tanggal)}</td>
                                    <td>${pinjaman.status}</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
                <p><strong>Total Pinjaman: ${formatRupiah(dataPinjaman.reduce((total, p) => total + p.jumlah, 0))}</strong></p>
            `;
            break;
            
        case 'angsuran':
            laporanHTML = `
                <h3>Laporan Data Angsuran</h3>
                <p>Tanggal: ${formatTanggal(new Date().toISOString())}</p>
                <table>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Nama Anggota</th>
                            <th>Jumlah</th>
                            <th>Tanggal</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${dataAngsuran.map((angsuran, index) => {
                            const pinjaman = dataPinjaman.find(p => p.id == angsuran.pinjamanId);
                            const anggota = pinjaman ? dataAnggota.find(a => a.id == pinjaman.anggotaId) : null;
                            return `
                                <tr>
                                    <td>${index + 1}</td>
                                    <td>${anggota ? anggota.nama : '-'}</td>
                                    <td>${formatRupiah(angsuran.jumlah)}</td>
                                    <td>${formatTanggal(angsuran.tanggal)}</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
                <p><strong>Total Angsuran: ${formatRupiah(dataAngsuran.reduce((total, a) => total + a.jumlah, 0))}</strong></p>
            `;
            break;
    }
    
    outputDiv.innerHTML = laporanHTML;
    
    // Print window
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Laporan Koperasi Merah Putih</title>
                <style>
                    body { font-family: Arial, sans-serif; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { padding: 8px; border: 1px solid #ddd; text-align: left; }
                    th { background-color: #cc0000; color: white; }
                    h3 { color: #cc0000; }
                </style>
            </head>
            <body>
                ${laporanHTML}
                <script>
                    window.onload = function() {
                        window.print();
                    }
                <\/script>
            </body>
        </html>
    `);
    printWindow.document.close();
}

// ==================== REFRESH DATA ====================

function refreshAllData() {
    // Update dashboard
    document.getElementById('totalAnggota').textContent = dataAnggota.length;
    
    const totalSimpanan = dataSimpanan.reduce((total, s) => total + s.jumlah, 0);
    document.getElementById('totalSimpanan').textContent = formatRupiah(totalSimpanan);
    
    const totalPinjaman = dataPinjaman.reduce((total, p) => total + p.jumlah, 0);
    document.getElementById('totalPinjaman').textContent = formatRupiah(totalPinjaman);
    
    const totalAngsuran = dataAngsuran.reduce((total, a) => total + a.jumlah, 0);
    document.getElementById('totalAngsuran').textContent = formatRupiah(totalAngsuran);
    
    // Update tabel
    tampilkanAnggota();
    tampilkanSimpanan();
    tampilkanPinjaman();
    tampilkanAngsuran();
    
    // Update dropdown anggota
    updateDropdownAnggota();
    
    // Update dropdown pinjaman
    updateDropdownPinjaman();
}

function updateDropdownAnggota() {
    const dropdownSimpanan = document.getElementById('simpananAnggota');
    const dropdownPinjaman = document.getElementById('pinjamanAnggota');
    
    dropdownSimpanan.innerHTML = '<option value="">Pilih Anggota</option>';
    dropdownPinjaman.innerHTML = '<option value="">Pilih Anggota</option>';
    
    dataAnggota.forEach(anggota => {
        dropdownSimpanan.innerHTML += `<option value="${anggota.id}">${anggota.nama}</option>`;
        dropdownPinjaman.innerHTML += `<option value="${anggota.id}">${anggota.nama}</option>`;
    });
}

function updateDropdownPinjaman() {
    const dropdown = document.getElementById('angsuranPinjaman');
    dropdown.innerHTML = '<option value="">Pilih Pinjaman</option>';
    
    dataPinjaman.forEach(pinjaman => {
        const anggota = dataAnggota.find(a => a.id == pinjaman.anggotaId);
        const namaAnggota = anggota ? anggota.nama : 'Tidak ditemukan';
        dropdown.innerHTML += `<option value="${pinjaman.id}">${namaAnggota} - ${formatRupiah(pinjaman.jumlah)}</option>`;
    });
}

// ==================== INISIALISASI ====================

// Set tanggal default untuk form
document.getElementById('tanggalSimpanan').value = new Date().toISOString().split('T')[0];
document.getElementById('tanggalPinjaman').value = new Date().toISOString().split('T')[0];
document.getElementById('tanggalAngsuran').value = new Date().toISOString().split('T')[0];

// Load data saat halaman dimuat
refreshAllData();