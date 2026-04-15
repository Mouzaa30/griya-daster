// ============================================================
// KONFIGURASI GOOGLE SPREADSHEET
// Format sheet Produk: Nama | Kategori | Harga | Stok | Gambar (URL)
// Pastikan spreadsheet dibagikan ke publik (Anyone with link - Viewer)
// ============================================================
const SPREADSHEET_ID = '1iOYomM1rKKLfHyG-lJ3BBEUEnY-BSAMM7v_9zAxqOYo';
const SHEET_NAME = 'Produk';
const API_KEY = 'GANTI_DENGAN_API_KEY_GOOGLE_ANDA';

// URL Google Apps Script Web App untuk menyimpan pesanan
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwbHrJ_aJstK6U6jX3_QtWTV8asRM654LcpX2cYoHSvRM7VqWl6h5QuU9snNcVHO1yI/exec';

const SHEETS_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`;

// Nomor WhatsApp toko (format internasional tanpa +)
const WA_NUMBER = '6282334899699';

// ============================================================
// DATA PRODUK STATIS
// PENTING: harga pakai angka tanpa titik/koma (85000 bukan 85.000)
// Gambar: taruh file di folder img/ lalu tulis 'img/namafile.jpg'
// ============================================================
const PRODUK_STATIS = [
  { id: 0,  nama: 'Kemeja Wanita',            kategori: 'Wanita', harga: 188000, stok: 35, gambar: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4e5b?w=400&h=400&fit=crop' },
  { id: 1,  nama: 'Kaos Wanita',              kategori: 'Wanita', harga: 75000,  stok: 11, gambar: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop' },
  { id: 2,  nama: 'Jaket Jeans',              kategori: 'Wanita', harga: 285000, stok: 10, gambar: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=400&h=400&fit=crop' },
  { id: 3,  nama: 'Piyama Panjang',           kategori: 'Wanita', harga: 175000, stok: 12, gambar: 'https://images.unsplash.com/photo-1631947430066-48c30d57b943?w=400&h=400&fit=crop' },
  { id: 4,  nama: 'Piyama Perempuan Panjang', kategori: 'Wanita', harga: 160000, stok: 8,  gambar: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=400&h=400&fit=crop' },
  { id: 5,  nama: 'Piyama Perempuan Pendek',  kategori: 'Wanita', harga: 150000, stok: 14, gambar: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=400&fit=crop' },
  { id: 6,  nama: 'Daster Kutungan',          kategori: 'Wanita', harga: 120000, stok: 18, gambar: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&h=400&fit=crop' },
  { id: 7,  nama: 'Daster Rompi',             kategori: 'Wanita', harga: 110000, stok: 20, gambar: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=400&fit=crop' },
  { id: 8,  nama: 'Daster Pantai',            kategori: 'Wanita', harga: 115000, stok: 9,  gambar: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=400&fit=crop' },
  { id: 9,  nama: 'Daster Serut',             kategori: 'Wanita', harga: 120000, stok: 7,  gambar: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400&h=400&fit=crop' },
  { id: 10, nama: 'Daster Payung',            kategori: 'Wanita', harga: 105000, stok: 25, gambar: 'https://images.unsplash.com/photo-1566206091558-7f218b696731?w=400&h=400&fit=crop' },
  { id: 11, nama: 'Daster Kancing Depan',     kategori: 'Wanita', harga: 95000,  stok: 16, gambar: 'https://images.unsplash.com/photo-1583846783214-7229a91b20ed?w=400&h=400&fit=crop' },
  { id: 12, nama: 'Daster Standart',          kategori: 'Wanita', harga: 98000,  stok: 20, gambar: 'https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=400&h=400&fit=crop' },
  { id: 13, nama: 'Celana Jeans',             kategori: 'Wanita', harga: 255000, stok: 13, gambar: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop' },
];

// Gambar fallback jika foto belum ada
const GAMBAR_DEFAULT = 'https://picsum.photos/seed/griya/400/300';

// ============================================================
// MANAJEMEN FOTO PRODUK (tersimpan di localStorage)
// ============================================================
let fotoEditing = null;

function bukaModalFoto(id, namaProduk, gambarSaat) {
  fotoEditing = id;
  document.getElementById('foto-nama-produk').textContent = namaProduk;
  const src = gambarSaat || GAMBAR_DEFAULT;
  document.getElementById('foto-preview').src = src;
  document.getElementById('foto-url').value = src.startsWith('data:') ? '' : src;
  document.getElementById('foto-file').value = '';
  document.getElementById('modal-foto').style.display = 'flex';
}

function tutupModalFoto() {
  document.getElementById('modal-foto').style.display = 'none';
  fotoEditing = null;
}

function previewUrl(url) {
  if (url) document.getElementById('foto-preview').src = url;
}

function previewFile(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    document.getElementById('foto-preview').src = e.target.result;
    document.getElementById('foto-url').value = '';
  };
  reader.readAsDataURL(file);
}

function simpanFoto() {
  const preview = document.getElementById('foto-preview').src;
  if (!preview || fotoEditing === null) return;

  const fotoMap = JSON.parse(localStorage.getItem('fotoOverride') || '{}');
  fotoMap[fotoEditing] = preview;
  localStorage.setItem('fotoOverride', JSON.stringify(fotoMap));

  const produk = semuaProduk.find(p => p.id === fotoEditing);
  if (produk) produk.gambar = preview;

  tutupModalFoto();
  tampilkanProduk(semuaProduk);
}

function terapkanFotoOverride(produkList) {
  const fotoMap = JSON.parse(localStorage.getItem('fotoOverride') || '{}');
  produkList.forEach(p => {
    if (fotoMap[p.id]) p.gambar = fotoMap[p.id];
  });
}

// ============================================================
let semuaProduk = [];
let keranjang = [];

// Ambil data dari Google Sheets, fallback ke data statis
async function ambilProduk() {
  const loading = document.getElementById('loading');
  loading.style.display = 'block';

  if (API_KEY === 'GANTI_DENGAN_API_KEY_GOOGLE_ANDA') {
    semuaProduk = PRODUK_STATIS;
    terapkanFotoOverride(semuaProduk);
    loading.style.display = 'none';
    tampilkanProduk(semuaProduk);
    return;
  }

  try {
    const res = await fetch(SHEETS_URL);
    if (!res.ok) throw new Error('Gagal mengambil data');
    const data = await res.json();

    const rows = data.values.slice(1);
    semuaProduk = rows.map((row, i) => ({
      id: i,
      nama: row[0] || '',
      // Normalisasi kategori: huruf pertama kapital
      kategori: (row[1] || '').trim().replace(/^\w/, c => c.toUpperCase()),
      // Bersihkan harga: hapus titik/koma lalu parse
      harga: parseInt((row[2] || '0').toString().replace(/[.,]/g, '')) || 0,
      stok: parseInt(row[3]) || 0,
      gambar: row[4] || GAMBAR_DEFAULT
    }));

    terapkanFotoOverride(semuaProduk);
    loading.style.display = 'none';
    tampilkanProduk(semuaProduk);
  } catch (err) {
    console.warn('Spreadsheet gagal, pakai data statis:', err);
    semuaProduk = PRODUK_STATIS;
    terapkanFotoOverride(semuaProduk);
    loading.style.display = 'none';
    tampilkanProduk(semuaProduk);
  }
}

// Render kartu produk
function tampilkanProduk(produk) {
  const grid = document.getElementById('produk-grid');
  grid.innerHTML = '';

  if (produk.length === 0) {
    grid.innerHTML = '<p style="text-align:center;color:#888;grid-column:1/-1">Produk tidak ditemukan.</p>';
    return;
  }

  produk.forEach(p => {
    const habis = p.stok <= 0;
    // Escape nama untuk atribut onclick
    const namaEsc = p.nama.replace(/'/g, "\\'");
    const gambarEsc = p.gambar.startsWith('data:') ? '' : p.gambar.replace(/'/g, "\\'");

    const card = document.createElement('div');
    card.className = 'produk-card';
    card.innerHTML = `
      <div class="produk-img-wrap">
        <img src="${p.gambar}" alt="${p.nama}" onerror="this.src='${GAMBAR_DEFAULT}'" />
        <button class="btn-ganti-foto" onclick="bukaModalFoto(${p.id}, '${namaEsc}', '${gambarEsc}')">✏️ Ganti Foto</button>
      </div>
      <div class="produk-info">
        <p class="produk-kategori">${p.kategori}</p>
        <h3>${p.nama}</h3>
        <p class="produk-harga">${formatRupiah(p.harga)}</p>
        <p class="produk-stok ${habis ? 'habis' : ''}">${habis ? 'Stok Habis' : `Stok: ${p.stok}`}</p>
        <button class="btn-tambah" onclick="tambahKeKeranjang(${p.id})" ${habis ? 'disabled' : ''}>
          ${habis ? 'Habis' : '+ Keranjang'}
        </button>
      </div>
    `;
    grid.appendChild(card);
  });
}

// Filter produk berdasarkan search & kategori
function filterProduk() {
  const keyword = document.getElementById('search').value.toLowerCase();
  const kategori = document.getElementById('kategori').value;

  const hasil = semuaProduk.filter(p => {
    const cocokNama = p.nama.toLowerCase().includes(keyword);
    // Bandingkan case-insensitive
    const cocokKategori = kategori === '' || p.kategori.toLowerCase() === kategori.toLowerCase();
    return cocokNama && cocokKategori;
  });

  tampilkanProduk(hasil);
}

// Tambah produk ke keranjang
function tambahKeKeranjang(id) {
  const produk = semuaProduk.find(p => p.id === id);
  if (!produk) return;

  const existing = keranjang.find(item => item.id === id);
  if (existing) {
    if (existing.qty < produk.stok) existing.qty++;
  } else {
    keranjang.push({ ...produk, qty: 1 });
  }

  updateKeranjang();
  toggleCart(true);
}

// Update tampilan keranjang
function updateKeranjang() {
  const cartItems = document.getElementById('cart-items');
  const cartCount = document.getElementById('cart-count');
  const cartTotal = document.getElementById('cart-total');

  const totalItem = keranjang.reduce((sum, i) => sum + i.qty, 0);
  const totalHarga = keranjang.reduce((sum, i) => sum + i.harga * i.qty, 0);

  cartCount.textContent = totalItem;
  cartTotal.textContent = formatRupiah(totalHarga);

  if (keranjang.length === 0) {
    cartItems.innerHTML = '<p style="text-align:center;color:#aaa;padding:40px 0">Keranjang kosong</p>';
    return;
  }

  cartItems.innerHTML = keranjang.map(item => `
    <div class="cart-item">
      <img src="${item.gambar}" alt="${item.nama}" onerror="this.src='${GAMBAR_DEFAULT}'" />
      <div class="cart-item-info">
        <h4>${item.nama}</h4>
        <p>${formatRupiah(item.harga)}</p>
      </div>
      <div class="cart-item-qty">
        <button onclick="ubahQty(${item.id}, -1)">−</button>
        <span>${item.qty}</span>
        <button onclick="ubahQty(${item.id}, 1)">+</button>
      </div>
    </div>
  `).join('');
}

// Ubah jumlah item di keranjang
function ubahQty(id, delta) {
  const idx = keranjang.findIndex(i => i.id === id);
  if (idx === -1) return;

  keranjang[idx].qty += delta;
  if (keranjang[idx].qty <= 0) keranjang.splice(idx, 1);

  updateKeranjang();
}

// Toggle sidebar keranjang
function toggleCart(forceOpen = false) {
  const sidebar = document.getElementById('cart-sidebar');
  const overlay = document.getElementById('cart-overlay');

  if (forceOpen === true) {
    sidebar.classList.add('open');
    overlay.classList.add('show');
  } else {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('show');
  }
}

// Checkout — tampilkan form data pembeli
function checkout() {
  if (keranjang.length === 0) {
    alert('Keranjang masih kosong!');
    return;
  }

  const total = keranjang.reduce((sum, i) => sum + i.harga * i.qty, 0);
  const ringkasan = document.getElementById('modal-ringkasan');
  ringkasan.innerHTML = keranjang.map(i =>
    `<p>• ${i.nama} x${i.qty} = ${formatRupiah(i.harga * i.qty)}</p>`
  ).join('') + `<p style="margin-top:8px"><strong>Total: ${formatRupiah(total)}</strong></p>`;

  document.getElementById('modal-checkout').style.display = 'flex';
}

// Kirim pesanan ke Google Spreadsheet via Apps Script
async function kirimPesanan() {
  const nama   = document.getElementById('co-nama').value.trim();
  const hp     = document.getElementById('co-hp').value.trim();
  const alamat = document.getElementById('co-alamat').value.trim();
  const bayar  = document.getElementById('co-bayar').value;

  if (!nama || !hp || !alamat) {
    alert('Lengkapi semua data terlebih dahulu.');
    return;
  }

  const total = keranjang.reduce((sum, i) => sum + i.harga * i.qty, 0);
  const itemStr = keranjang.map(i => `${i.nama} x${i.qty}`).join(', ');
  const tgl = new Date().toLocaleString('id-ID');
  const noOrder = 'ORD-' + Date.now();

  const payload = { noOrder, tgl, nama, hp, alamat, items: itemStr, total, bayar, status: 'Pending' };

  const btnKirim = document.getElementById('btn-kirim-pesanan');
  btnKirim.disabled = true;
  btnKirim.textContent = 'Mengirim...';

  try {
    await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    tutupModal();
    keranjang = [];
    updateKeranjang();
    document.getElementById('cart-sidebar').classList.remove('open');
    document.getElementById('cart-overlay').classList.remove('show');

    const notif = document.getElementById('notif-sukses');
    notif.querySelector('span').textContent = noOrder;
    notif.style.display = 'flex';
    setTimeout(() => notif.style.display = 'none', 5000);

  } catch (err) {
    alert('Gagal mengirim pesanan. Coba lagi.');
    console.error(err);
  } finally {
    btnKirim.disabled = false;
    btnKirim.textContent = 'Konfirmasi Pesanan';
  }
}

function tutupModal() {
  document.getElementById('modal-checkout').style.display = 'none';
  document.getElementById('co-nama').value = '';
  document.getElementById('co-hp').value = '';
  document.getElementById('co-alamat').value = '';
}

// Format angka ke Rupiah
function formatRupiah(angka) {
  return 'Rp ' + angka.toLocaleString('id-ID');
}

// Init
ambilProduk();
updateKeranjang();
