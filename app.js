// App logic for Pencari Kerja PWA
const app = {
  data: {
    profile: {},
    jobs: [],
    saved: [],
    applied: []
  },
  currentSection: 'home',

  init() {
    this.loadData();
    this.renderHome();
    this.renderJobs('semua');
    this.renderApplied();
    this.setupInstallPrompt();
    this.updateStats();
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredInstall = e;
      document.getElementById('install-prompt').style.display = 'flex';
    });
  },

  loadData() {
    try {
      const raw = localStorage.getItem('pk_data');
      if (raw) this.data = JSON.parse(raw);
    } catch (e) { console.error(e); }
    if (!this.data.jobs || this.data.jobs.length === 0) {
      this.data.jobs = this.defaultJobs();
    }
    this.saveData();
  },
  saveData() {
    try { localStorage.setItem('pk_data', JSON.stringify(this.data)); } catch (e) {}
  },

  defaultJobs() {
    const j = [
      // --- Sumatera ---
      { id: 'j1', company: 'Seng Hap 1881', role: 'Social Media Officer', city: 'Medan', when: '17 jam lalu', type: 'Kontrak', desc: 'Mengelola jadwal konten media sosial, produksi video dan desain visual, riset tren Instagram/TikTok.', req: 'D3/S1 semua jurusan, bisa Canva & CapCut, paham Instagram dan TikTok, dasar desain grafis.', score: 85, tag: 'good', url: 'https://id.linkedin.com/jobs/view/social-media-officer-at-seng-hap-1881-4436023525' },
      { id: 'j2', company: 'Apical', role: 'Officer Sourcing', city: 'Medan', when: '4 hari lalu', type: 'Penuh waktu', desc: 'Tugas administrasi dan produksi, riset dasar, input data, dukungan tim.', req: 'Administrasi, riset, komunikasi, teliti dan bertanggung jawab.', score: 62, tag: 'mid', url: 'https://id.linkedin.com/jobs/view/officer-sourcing-at-apical-4483962034' },
      { id: 'j3', company: 'Sakapulo', role: 'Creative Brand Strategist (F&B)', city: 'Medan', when: '3 hari lalu', type: 'Penuh waktu', desc: 'Strategi branding dan marketing bulanan, narasi brand, campaign, koordinasi tim digital.', req: 'Pengalaman 2-3 tahun brand marketing/creative strategy, F&B diutamakan.', score: 55, tag: 'low', url: 'https://id.linkedin.com/jobs/view/creative-brand-strategist-4485175664' },
      { id: 'j4', company: 'JTI', role: 'Field Marketing Executive', city: 'Medan', when: '11 jam lalu', type: 'Penuh waktu', desc: 'Eksekusi program pemasaran lapangan, analisis kompetitor, laporan evaluasi program.', req: 'Min 2 tahun pengalaman marketing/field marketing, FMCG diutamakan, Inggris baik.', score: 60, tag: 'mid', url: 'https://id.linkedin.com/jobs/view/field-marketing-executive-medan-at-jti-4469417639' },
      { id: 'j5', company: 'PT Bank Sumut', role: 'Magang Account Officer', city: 'Medan', when: '2 hari lalu', type: 'Magang', desc: 'Pemasaran produk kredit, survei dan verifikasi berkas calon debitur, monitoring nasabah.', req: 'S1 semua jurusan, komunikasi baik, SIM C diutamakan.', score: 70, tag: 'mid', url: 'mailto:recruitment@banksumut.co.id?subject=Magang AO - [Nama]' },
      { id: 'j6', company: 'CV. Toko Maju', role: 'Gudang & Admin Gudang', city: 'Palembang', when: '1 hari lalu', type: 'Penuh waktu', desc: 'Menerima dan mencatat barang masuk keluar, administrasi gudang, pengiriman.', req: 'SMA/SMK, teliti, bisa komputer dasar, berpenampilan rapi.', score: 65, tag: 'mid', url: 'mailto:hrd@cvtokomaju.co.id?subject=Admin Gudang - [Nama]' },
      { id: 'j7', company: 'Warung Kopi Lampung', role: 'Barista & Pelayan', city: 'Bandar Lampung', when: '5 jam lalu', type: 'Penuh waktu', desc: 'Membuat kopi, melayani pelanggan, menata kafe, kasir.', req: 'SMA/SMK, ramah, bisa bekerja shift pagi dan sore.', score: 68, tag: 'mid', url: 'mailto:manager@warkoplampung.co.id?subject=Barista - [Nama]' },
      { id: 'j8', company: 'PT. Pertamina Patra Niaga', role: 'Admin Pusat', city: 'Palembang', when: '3 hari lalu', type: 'Penuh waktu', desc: 'Administrasi kantor, pengarsipan, pendataan, dukungan operasional.', req: 'D3/S1 Administrasi Perkantoran, menguasai Microsoft Office.', score: 72, tag: 'mid', url: 'https://www.pertamina.com/career' },
      { id: 'j9', company: 'Toko Elektronik Jaya', role: 'Sales Counter & Teknisi', city: 'Pekanbaru', when: '2 hari lalu', type: 'Penuh waktu', desc: 'Melayani pembeli di toko elektronik, pengecekan barang, service ringan.', req: 'SMK/S1, paham elektronik dasar, ramah, SIMA.', score: 63, tag: 'mid', url: 'mailto:hr@tokoelektronikjaya.co.id?subject=Sales - [Nama]' },
      { id: 'j10', company: 'Klinik Sehat Padang', role: 'Perawat & Administrasi Medis', city: 'Padang', when: '1 hari lalu', type: 'Penuh waktu', desc: 'Perawatan pasien, administrasi rekam medis, pendaftaran pasien.', req: 'Str/D3 Keperawatan, STIM, detail-oriented.', score: 75, tag: 'mid', url: 'mailto:hrd@kliniksehathpadang.co.id?subject=Perawat - [Nama]' },
      { id: 'j11', company: 'PT. Surya Bumi Jambi', role: 'Operator Produksi', city: 'Jambi', when: '4 hari lalu', type: 'Penuh waktu', desc: 'Operasi mesin produksi, pemeliharaan ringan, ketelitian dalam pencatatan.', req: 'SMK/S1 Teknik Mesin, siap shift, rajin dan teliti.', score: 60, tag: 'mid', url: 'mailto:recruit@suryabumijambi.co.id?subject=Operator - [Nama]' },
      { id: 'j12', company: 'Kantor Dispar Bengkulu', role: 'Administrasi Pemerintahan', city: 'Bengkulu', when: '2 hari lalu', type: 'Penuh waktu', desc: 'Administrasi kantor dinas, pengarsipan surat, pelayanan masyarakat.', req: 'D3/S1 Administrasi Negara, menguasai arsip dan email.', score: 66, tag: 'mid', url: 'https://dispar.bengkuluprov.go.id' },
      { id: 'j13', company: 'Agen Perusahaan Batam', role: 'Customer Service', city: 'Batam', when: '6 jam lalu', type: 'Penuh waktu', desc: 'Menangani telepon dan email pelanggan, komplain, informasi layanan.', req: 'SMA/SMK, komunikasi lisan dan tulisan baik, shift work.', score: 68, tag: 'mid', url: 'mailto:cs@agenperusahaanbatam.co.id?subject=CS - [Nama]' },

      // --- Jawa Barat & Banten ---
      { id: 'j14', company: 'Ruangguru', role: 'Student Advisor', city: 'Bandung', when: '1 hari lalu', type: 'Penuh waktu', desc: 'Membimbing calon siswa, follow up pelanggan, mencapai target presentasi dan penjualan.', req: 'Min D3/S1, pengalaman 1-2 tahun sales/marketing (diutamakan), punya laptop & smartphone.', score: 72, tag: 'mid', url: 'https://id.linkedin.com/jobs/view/student-advisor-bandung-buahbatu-at-ruangguru-4487046616' },
      { id: 'j15', company: 'UOB', role: 'Client Advisor', city: 'Bandung', when: '16 jam lalu', type: 'Penuh waktu', desc: 'Sales Privilege Banking, pertumbuhan portofolio produk bank, referral nasabah.', req: 'S1 semua jurusan, Mandarin/Hokkien diutamakan, fresh graduate dipersilakan.', score: 65, tag: 'mid', url: 'https://id.linkedin.com/jobs/view/client-advisor-bandung-at-uob-4424570357' },
      { id: 'j16', company: 'Ten Degrees', role: 'Social Media Marketing Specialist', city: 'Bandung', when: '4 hari lalu', type: 'Penuh waktu', desc: 'Membangun media sosial Ten Degrees dari nol (Instagram, TikTok, Facebook) untuk padel court baru.', req: 'Kreatif, paham media sosial, bisa membuat konten visual dan video pendek.', score: 80, tag: 'good', url: 'mailto:tendegreespadelcourt@gmail.com?subject=Social Media Marketing Specialist - [Nama]' },
      { id: 'j17', company: 'DHJ Fashion', role: 'Social Media Specialist (Wanita)', city: 'Bandung', when: '18 jam lalu', type: 'Penuh waktu', desc: 'Strategi media sosial fashion & lifestyle, content plan, creative brief, analisis performa.', req: 'Pengalaman sebagai Social Media Specialist, fashion sense baik, Instagram & TikTok.', score: 70, tag: 'mid', url: 'https://id.linkedin.com/jobs/view/social-media-specialist-wanita-at-dhj-fashion-4486330276' },
      { id: 'j18', company: 'Bobobox', role: 'Customer Care Unit Associate', city: 'Bandung', when: '2 hari lalu', type: 'Penuh waktu', desc: 'Menangani pertanyaan tamu via chat, ulasan Google & OTA, penanganan keluhan pelanggan.', req: 'S1, komunikasi baik, senang membantu pelanggan, shift work.', score: 68, tag: 'mid', url: 'https://id.linkedin.com/jobs/view/customer-care-unit-associate-at-bobobox-4485733683' },
      { id: 'j19', company: 'PT. Telkom Indonesia', role: 'Admin Pemasaran', city: 'Bandung', when: '3 hari lalu', type: 'Penuh waktu', desc: 'Administrasi pemasaran produk telco, pendataan calon pelanggan, laporan bulanan.', req: 'D3/S1, menguasai Excel, telepon dan email baik.', score: 70, tag: 'mid', url: 'https://career.telkom.co.id' },
      { id: 'j20', company: 'Cafe Rasa Sunda', role: 'Waitress & Kasir', city: 'Tasikmalaya', when: '1 hari lalu', type: 'Penuh waktu', desc: 'Melayani tamu, mengambil pesanan, kasir, membersihkan meja.', req: 'SMA/SMK, ramah, siap shift sore dan malam.', score: 64, tag: 'mid', url: 'mailto:manager@caferasasunda.co.id?subject=Waitress - [Nama]' },
      { id: 'j21', company: 'CV. Jaya Kain', role: 'Admin Pemasaran & Gudang', city: 'Cirebon', when: '2 hari lalu', type: 'Penuh waktu', desc: 'Pencatat penjualan kain, administrasi gudang, laporan stok.', req: 'SMA/SMK, teliti, bisa Microsoft Word dan Excel.', score: 61, tag: 'mid', url: 'mailto:admin@citajyakain.co.id?subject=Admin - [Nama]' },
      { id: 'j22', company: 'PT. Indofood', role: 'Supervisor Produksi', city: 'Bogor', when: '5 hari lalu', type: 'Penuh waktu', desc: 'Pengawasan linee produksi makanan, ketelakitan jumlah dan kualitas barang.', req: 'S1 Teknik Pangan/Mesin, pengalaman produksi minimal 1 tahun.', score: 69, tag: 'mid', url: 'https://career.indofood.co.id' },
      { id: 'j23', company: 'Toko Buku Gramedia', role: 'Kasir & Pengawas Toko', city: 'Bekasi', when: '1 hari lalu', type: 'Penuh waktu', desc: 'Transaksi kasir, pengawasan toko, tata letak buku.', req: 'SMA/SMK, jujur, teliti, ramah pelanggan.', score: 63, tag: 'mid', url: 'https://karir.gramedia.com' },
      { id: 'j24', company: 'PT. Berlian Laju Tanker', role: 'Admin Logistik', city: 'Tangerang', when: '3 hari lalu', type: 'Penuh waktu', desc: 'Administrasi pengiriman barang, koordinasi truk, pencatatan.', req: 'D3/S1 Logistik, paham proses pengiriman dan dokumen.', score: 67, tag: 'mid', url: 'mailto:hrd@blt.co.id?subject=Admin Logistik - [Nama]' },
      { id: 'j25', company: 'Rumah Sakit Umum Depok', role: 'Perawat & Admin Medis', city: 'Depok', when: '2 hari lalu', type: 'Penuh waktu', desc: 'Perawatan pasien, administrasi rekam medis, pendaftaran.', req: 'Str/D3 Keperawatan, STIM, siap shift.', score: 74, tag: 'mid', url: 'mailto:rsudepok@depok.go.id?subject=Perawat - [Nama]' },
      { id: 'j26', company: 'PT. Trans Retail', role: 'Sales Supermarket', city: 'Cimahi', when: '1 hari lalu', type: 'Penuh waktu', desc: 'Pengaturan rak, pelayanan pelanggan, kasir di supermarket.', req: 'SMA/SMK, ramah, siap shift pagi/malam.', score: 60, tag: 'mid', url: 'mailto:karir@transretail.co.id?subject=Sales - [Nama]' },

      // --- DKI Jakarta ---
      { id: 'j27', company: 'Tokopedia', role: 'Customer Support Associate', city: 'Jakarta', when: '6 jam lalu', type: 'Penuh waktu', desc: 'Menangani tiket dan chat pelanggan, resolusi komplain transaksi.', req: 'S1, komunikasi baik, shift work, paham e-commerce.', score: 78, tag: 'good', url: 'https://career.tokopedia.com' },
      { id: 'j28', company: 'Gojek', role: 'Rider Operations Specialist', city: 'Jakarta', when: '1 hari lalu', type: 'Penuh waktu', desc: 'Koordinasi operasional mitra, analisis data medan, dukungan tim.', req: 'S1, SIM A, mobilitas tinggi, analitis.', score: 73, tag: 'mid', url: 'https://career.gojek.com' },
      { id: 'j29', company: 'BukaLapak', role: 'Digital Marketing Executive', city: 'Jakarta', when: '2 hari lalu', type: 'Penuh waktu', desc: 'Manajemen kampanye iklan digital, konten media sosial, analisis performa.', req: 'S1, paham Meta Ads dan Google Ads, kreatif.', score: 76, tag: 'good', url: 'https://career.bukalapak.com' },
      { id: 'j30', company: 'Traveloka', role: 'Junior Product Designer', city: 'Jakarta', when: '3 hari lalu', type: 'Penuh waktu', desc: 'Desain antarmuka aplikasi travel, riset pengguna, prototipe.', req: 'S1 DKV/Teknik Informatika, bisa Figma, portofolio.', score: 70, tag: 'mid', url: 'https://career.traveloka.com' },
      { id: 'j31', company: 'PT. Bank Central Asia', role: 'Teller & CS', city: 'Jakarta', when: '1 hari lalu', type: 'Penuh waktu', desc: 'Layanan nasabah di balok teller, transaksi tunai, informasi produk.', req: 'S1, komunikasi jujur, penampilan rapi, SIM A.', score: 82, tag: 'good', url: 'https://karir.bca.co.id' },
      { id: 'j32', company: 'Kantor BPJS Kesehatan', role: 'Administrasi Pusat', city: 'Jakarta', when: '2 hari lalu', type: 'Penuh waktu', desc: 'Administrasi peserta, pengarsipan, pelayanan telepon.', req: 'D3/S1 Administrasi, teliti dan dapat bekerja tim.', score: 69, tag: 'mid', url: 'https://karir.bpjs-kesehatan.go.id' },
      { id: 'j33', company: 'PT. Pertamina', role: 'Admin Umum', city: 'Jakarta', when: '4 hari lalu', type: 'Penuh waktu', desc: 'Administrasi kantor umum, surat menyurat, pengarsipan.', req: 'D3/S1 Administrasi Perkantoran, menguasai Microsoft Office.', score: 66, tag: 'mid', url: 'https://career.pertamina.com' },
      { id: 'j34', company: 'PT. Garuda Indonesia', role: 'Cabin Crew & Ground Staff', city: 'Jakarta', when: '5 hari lalu', type: 'Penuh waktu', desc: 'Pelayanan penumpang penerbangan, check-in, koordinasi bandara.', req: 'S1, tinggi badan minimal 158 cm, Inggris aktif, sehat jasmani.', score: 80, tag: 'good', url: 'https://career.garuda-indonesia.com' },
      { id: 'j35', company: 'Startup EduTech', role: 'Content Creator Intern', city: 'Jakarta', when: '1 jam lalu', type: 'Magang', desc: 'Membuat konten TikTok dan Instagram untuk platform edukasi.', req: 'Mahasiswa/fresh graduate, kreatif, bisa editing video.', score: 64, tag: 'mid', url: 'mailto:hr@startupedutech.co.id?subject=CC Intern - [Nama]' },

      // --- Jawa Tengah ---
      { id: 'j36', company: 'PT. Djarum', role: 'Admin Produksi', city: 'Kudus', when: '3 hari lalu', type: 'Penuh waktu', desc: 'Administrasi produksi kretek, pencatatan hasil, laporan harian.', req: 'D3/S1, teliti, menguasai Excel.', score: 65, tag: 'mid', url: 'https://career.djarum.com' },
      { id: 'j37', company: 'Universitas Diponegoro', role: 'Administrasi Akademik', city: 'Semarang', when: '2 hari lalu', type: 'Penuh waktu', desc: 'Administrasi mahasiswa, pendaftaran, pengarsipan nilai.', req: 'D3/S1, menguasai sistem informasi akademik.', score: 70, tag: 'mid', url: 'https://hrd.undip.ac.id' },
      { id: 'j38', company: 'Toko Batik Solo', role: 'Admin & Pemasaran', city: 'Surakarta', when: '1 hari lalu', type: 'Penuh waktu', desc: 'Administrasi penjualan batak, media sosial toko, pelanggan.', req: 'SMA/SMK, kreatif, paham Instagram dan WhatsApp Business.', score: 62, tag: 'mid', url: 'mailto:toko@bataksolo.co.id?subject=Admin - [Nama]' },
      { id: 'j39', company: 'Rumah Sakit Umum Semarang', role: 'Perawat IGD', city: 'Semarang', when: '3 hari lalu', type: 'Penuh waktu', desc: 'Perawatan darurat, IGD, administrasi pasien.', req: 'Str/D3 Keperawatan, STIM, siap shift malam.', score: 77, tag: 'good', url: 'mailto:rsusemarang@semarang.go.id?subject=Perawat IGD - [Nama]' },
      { id: 'j40', company: 'CV. Indo Jaya', role: 'Driver Ekspedisi', city: 'Purwokerto', when: '2 hari lalu', type: 'Penuh waktu', desc: 'Mengantar barang antar kota, pencatatan delivery.', req: 'SMA, SIM C, jujur, siap keliling.', score: 60, tag: 'mid', url: 'mailto:driver@indojaya.co.id?subject=Driver - [Nama]' },

      // --- DI Yogyakarta ---
      { id: 'j41', company: 'Gadjah Mada University', role: 'Administrasi Kampus', city: 'Yogyakarta', when: '1 hari lalu', type: 'Penuh waktu', desc: 'Administrasi fakultas, pengarsipan, pelayanan mahasiswa dan dosen.', req: 'D3/S1, teliti, menguasai Microsoft Office.', score: 68, tag: 'mid', url: 'https://hrd.ugm.ac.id' },
      { id: 'j42', company: 'Kopi Klotok Jogja', role: 'Barista & Pelayan Kafe', city: 'Yogyakarta', when: '2 jam lalu', type: 'Penuh waktu', desc: 'Membuat kopi, melayani tamu, menata kafe.', req: 'SMA/SMK, ramah, senang kopi, siap shift.', score: 66, tag: 'mid', url: 'mailto:hr@kopiklotokjogja.co.id?subject=Barista - [Nama]' },
      { id: 'j43', company: 'PT. Tugu Pratama', role: 'Admin Gudang', city: 'Sleman', when: '4 hari lalu', type: 'Penuh waktu', desc: 'Administrasi gudang, pencatatan barang masuk keluar.', req: 'D3/S1 Logistik, teliti, bisa komputer.', score: 63, tag: 'mid', url: 'mailto:admin@tugupratama.co.id?subject=Gudang - [Nama]' },

      // --- Jawa Timur ---
      { id: 'j44', company: 'PT. Surya Internusa', role: 'Customer Service', city: 'Surabaya', when: '1 hari lalu', type: 'Penuh waktu', desc: 'Menangani telepon dan email pelanggan, komplain, informasi.', req: 'SMA/SMK, komunikasi baik, shift work.', score: 67, tag: 'mid', url: 'mailto:cs@suryainternusa.co.id?subject=CS - [Nama]' },
      { id: 'j45', company: 'Hotel Majapahit', role: 'Front Office & Housekeeping', city: 'Surabaya', when: '3 hari lalu', type: 'Penuh waktu', desc: 'Pelayanan tamu hotel, check-in, kebersihan kamar.', req: 'SMA/SMK D3 Perhotalan, ramah, siap shift.', score: 70, tag: 'mid', url: 'https://career.hotelmajapahit.com' },
      { id: 'j46', company: 'Toko Elektronik Cakra', role: 'Sales & Teknisi', city: 'Malang', when: '2 hari lalu', type: 'Penuh waktu', desc: 'Penjualan elektronik di toko, service ringan, pengecekan barang.', req: 'SMK Teknik, paham elektronik, SIMA.', score: 61, tag: 'mid', url: 'mailto:hr@tokoelektronikcakra.co.id?subject=Sales - [Nama]' },
      { id: 'j47', company: 'PT. Indocement', role: 'Admin Produksi', city: 'Citeureup', when: '5 hari lalu', type: 'Penuh waktu', desc: 'Administrasi pabrik semen, pencatatan, laporan.', req: 'D3/S1, teliti, menguasai Excel.', score: 64, tag: 'mid', url: 'https://career.indocement.com' },
      { id: 'j48', company: 'Universitas Brawijaya', role: 'Administrasi Akademik', city: 'Malang', when: '1 hari lalu', type: 'Penuh waktu', desc: 'Administrasi mahasiswa, pendaftaran, nilai.', req: 'D3/S1, menguasai sistem akademik.', score: 69, tag: 'mid', url: 'https://hrd.ub.ac.id' },

      // --- Bali & Nusa Tenggara ---
      { id: 'j49', company: 'Hotel Santrian', role: 'Front Desk & F&B', city: 'Denpasar', when: '2 hari lalu', type: 'Penuh waktu', desc: 'Pelayanan tamu hotel, check-in, restoran.', req: 'D3 Perhotalan, Inggris aktif, ramah, siap shift.', score: 73, tag: 'mid', url: 'mailto:hr@hotelsantrian.co.id?subject=Front Desk - [Nama]' },
      { id: 'j50', company: 'Warung Nasi Campur Bali', role: 'Pelayan & Kasir', city: 'Denpasar', when: '1 hari lalu', type: 'Penuh waktu', desc: 'Melayani tamu, kasir, membersihkan meja.', req: 'SMA/SMK, ramah, siap shift pagi dan malam.', score: 59, tag: 'mid', url: 'mailto:manager@warnasicampurbali.co.id?subject=Pelayan - [Nama]' },
      { id: 'j51', company: 'PT. Pertamina Kupang', role: 'Admin Pusat', city: 'Kupang', when: '3 hari lalu', type: 'Penuh waktu', desc: 'Administrasi kantor, surat menyurat, pengarsipan.', req: 'D3/S1 Administrasi, menguasai Microsoft Office.', score: 65, tag: 'mid', url: 'mailto:hrd@pertaminakupang.co.id?subject=Admin - [Nama]' },
      { id: 'j52', company: 'Toko Perhiasan Mataram', role: 'Sales Counter', city: 'Mataram', when: '2 hari lalu', type: 'Penuh waktu', desc: 'Melayani pembeli perhiasan, pencatatan transaksi.', req: 'SMA/SMK, jujur, ramah, SIMA.', score: 60, tag: 'mid', url: 'mailto:admin@tokoperhiasanmataram.co.id?subject=Sales - [Nama]' },
      { id: 'j53', company: 'Klinik Ambon', role: 'Perawat & Admin Medis', city: 'Ambon', when: '4 hari lalu', type: 'Penuh waktu', desc: 'Perawatan pasien, administrasi rekam medis, pendaftaran.', req: 'Str/D3 Keperawatan, STIM, siap shift.', score: 72, tag: 'mid', url: 'mailto:hrd@klinikambon.co.id?subject=Perawat - [Nama]' },

      // --- Kalimantan ---
      { id: 'j54', company: 'PT. Kaltim Prima Coal', role: 'Admin Site', city: 'Balikpapan', when: '3 hari lalu', type: 'Penuh waktu', desc: 'Administrasi pertambangan, pencatatan, laporan operasional.', req: 'D3/S1, siap site, teliti.', score: 68, tag: 'mid', url: 'https://career.kpc.co.id' },
      { id: 'j55', company: 'Toko Elektronik Banjarmasin', role: 'Sales & Teknisi', city: 'Banjarmasin', when: '1 hari lalu', type: 'Penuh waktu', desc: 'Penjualan elektronik, service ringan, pengecekan barang.', req: 'SMK Teknik, paham elektronik, SIMA.', score: 61, tag: 'mid', url: 'mailto:hr@tokoelektronikbanjarmasin.co.id?subject=Sales - [Nama]' },
      { id: 'j56', company: 'Pontianak Mall', role: 'Admin & Security', city: 'Pontianak', when: '2 hari lalu', type: 'Penuh waktu', desc: 'Administrasi mall, pengawasan, pelayanan penyewa.', req: 'SMA/SMK, jujur, siap shift.', score: 58, tag: 'mid', url: 'mailto:admin@pontianakmall.co.id?subject=Admin - [Nama]' },

      // --- Sulawesi ---
      { id: 'j57', company: 'PT. Vale Indonesia', role: 'Admin Operasional', city: 'Sorowako', when: '4 hari lalu', type: 'Penuh waktu', desc: 'Administrasi tambang nickel, pencatatan, laporan.', req: 'D3/S1, siap site, teliti.', score: 70, tag: 'mid', url: 'https://career.vale.com' },
      { id: 'j58', company: 'Rumah Sakit Umum Makassar', role: 'Perawat & Admin Medis', city: 'Makassar', when: '1 hari lalu', type: 'Penuh waktu', desc: 'Perawatan pasien, administrasi rekam medis, pendaftaran.', req: 'Str/D3 Keperawatan, STIM, siap shift.', score: 76, tag: 'mid', url: 'mailto:rsumakassar@makassar.go.id?subject=Perawat - [Nama]' },
      { id: 'j59', company: 'Toko Busana Manado', role: 'Sales Counter', city: 'Manado', when: '2 hari lalu', type: 'Penuh waktu', desc: 'Penjualan busana di toko, pencatatan transaksi.', req: 'SMA/SMK, ramah, jujur, SIMA.', score: 60, tag: 'mid', url: 'mailto:admin@tokobusanamanado.co.id?subject=Sales - [Nama]' },
      { id: 'j60', company: 'Kantor Dispar Palu', role: 'Administrasi Pemerintahan', city: 'Palu', when: '3 hari lalu', type: 'Penuh waktu', desc: 'Administrasi dinas, pengarsipan surat, pelayanan masyarakat.', req: 'D3/S1 Administrasi Negara.', score: 63, tag: 'mid', url: 'https://dispar.palukalteng.go.id' },

      // --- Papua ---
      { id: 'j61', company: 'PT. Freeport Indonesia', role: 'Admin Site', city: 'Timika', when: '2 hari lalu', type: 'Penuh waktu', desc: 'Administrasi tambang, pencatatan, laporan operasional.', req: 'D3/S1, siap site, Inggris pasif.', score: 67, tag: 'mid', url: 'https://career.freeport.co.id' },
      { id: 'j62', company: 'Rumah Sakit Umum Jayapura', role: 'Perawat & Admin Medis', city: 'Jayapura', when: '1 hari lalu', type: 'Penuh waktu', desc: 'Perawatan pasien, administrasi rekam medis, pendaftaran.', req: 'Str/D3 Keperawatan, STIM, siap shift.', score: 74, tag: 'mid', url: 'mailto:rsujayapura@jayapura.go.id?subject=Perawat - [Nama]' },
      { id: 'j63', company: 'Toko Elektronik Sorong', role: 'Sales & Teknisi', city: 'Sorong', when: '5 hari lalu', type: 'Penuh waktu', desc: 'Penjualan elektronik, service ringan, pengecekan barang.', req: 'SMK Teknik, paham elektronik, SIMA.', score: 59, tag: 'mid', url: 'mailto:hr@tokoelektroniksorong.co.id?subject=Sales - [Nama]' },

      // --- Remote / Nasional ---
      { id: 'j64', company: 'INFUSE', role: 'Marketing Analyst (Remote)', city: 'Remote', when: '4 jam lalu', type: 'Kontrak', desc: 'Analisis kebutuhan auditori B2B, performance marketing, test dan proyek pendek.', req: 'Analitis, kritis, paham platform pemasaran digital, Inggris aktif.', score: 45, tag: 'low', url: 'https://id.linkedin.com/jobs/view/marketing-analyst-remote-contract-at-infuse-4487528852' },
      { id: 'j65', company: 'Shopee Indonesia', role: 'Customer Care (Work from Home)', city: 'Remote', when: '1 hari lalu', type: 'Kontrak', desc: 'Menangani chat dan telepon pelanggan Shopee dari rumah.', req: 'SMA/SMK, komunikasi baik, laptop dan internet stabil.', score: 64, tag: 'mid', url: 'https://career.shopee.co.id' },
      { id: 'j66', company: 'Blibli.com', role: 'Content Writer Freelance', city: 'Remote', when: '3 hari lalu', type: 'Freelance', desc: 'Menulis artikel dan konten blog untuk platform e-commerce.', req: 'S1, bisa menulis SEO, paham media digital.', score: 58, tag: 'mid', url: 'mailto:hr@blibli.com?subject=Content Writer - [Nama]' }
    ];
    return j;
  },

  // Navigation
  goTo(section) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const el = document.getElementById('sec-' + section);
    if (el) el.classList.add('active');
    const nav = document.querySelectorAll('.nav-item');
    if (section === 'home') nav[0].classList.add('active');
    else if (section === 'profil') nav[1].classList.add('active');
    else if (section === 'lowongan') nav[2].classList.add('active');
    else if (section === 'cv') nav[3].classList.add('active');
    else if (section === 'lamaran') nav[4].classList.add('active');
    else if (section === 'pengaturan') nav[5].classList.add('active');
    this.currentSection = section;
    this.updateFab();
    if (section === 'profil') this.renderProfileForm();
    if (section === 'cv') this.renderCVPreview();
    if (section === 'lamaran') this.renderApplied();
    if (section === 'home') this.renderHome();
  },

  updateFab() {
    const fab = document.getElementById('fab');
    if (this.currentSection === 'lowongan') {
      fab.innerHTML = '+';
      fab.title = 'Simpan lowongan';
    } else if (this.currentSection === 'cv') {
      fab.innerHTML = '↓';
      fab.title = 'Unduh CV';
    } else {
      fab.innerHTML = '+';
      fab.title = 'Tambah';
    }
  },
  fabAction() {
    if (this.currentSection === 'cv') this.downloadCVPDF();
    else if (this.currentSection === 'lowongan') {
      // nada
    }
  },

  // Home
  renderHome() {
    const nameEl = document.getElementById('home-name');
    const statusEl = document.getElementById('home-status');
    if (this.data.profile.nama) {
      nameEl.textContent = this.data.profile.nama;
      statusEl.textContent = 'Profil lengkap · Siap melamar';
    } else {
      nameEl.textContent = 'Pengguna';
      statusEl.textContent = 'Profil belum lengkap';
    }
    const cont = document.getElementById('home-jobs');
    cont.innerHTML = '';
    const show = this.data.jobs.slice(0, 3);
    show.forEach(job => cont.appendChild(this.jobCardEl(job, true)));
  },
  updateStats() {
    document.getElementById('stat-saved').textContent = this.data.saved ? this.data.saved.length : 0;
    document.getElementById('stat-sent').textContent = this.data.applied ? this.data.applied.length : 0;
  },

  // Profile
  renderProfileForm() {
    const p = this.data.profile;
    document.getElementById('inp-nama').value = p.nama || '';
    document.getElementById('inp-email').value = p.email || '';
    document.getElementById('inp-phone').value = p.phone || '';
    document.getElementById('inp-loc').value = p.location || '';
    document.getElementById('inp-edu').value = p.edu || '';
    document.getElementById('inp-exp').value = p.exp || '';
    document.getElementById('inp-skills').value = p.skills || '';
    document.getElementById('inp-target').value = p.target || '';
  },
  saveProfile() {
    this.data.profile = {
      nama: document.getElementById('inp-nama').value.trim(),
      email: document.getElementById('inp-email').value.trim(),
      phone: document.getElementById('inp-phone').value.trim(),
      location: document.getElementById('inp-loc').value.trim(),
      edu: document.getElementById('inp-edu').value.trim(),
      exp: document.getElementById('inp-exp').value.trim(),
      skills: document.getElementById('inp-skills').value.trim(),
      target: document.getElementById('inp-target').value.trim()
    };
    this.saveData();
    this.renderHome();
    this.showAlert('Profil tersimpan', 'success');
    this.goTo('home');
  },

  // Jobs
  filterJobs(city) {
    document.getElementById('job-list').innerHTML = '';
    const list = city === 'semua'
      ? this.data.jobs
      : this.data.jobs.filter(j => j.city.toLowerCase() === city.toLowerCase());
    const cont = document.getElementById('job-list');
    if (list.length === 0) {
      cont.innerHTML = '<div class="empty-state"><svg viewBox="0 0 24 24"><path d="M3 17v2c0 2.2 1.8 4 4 4h4c2.2 0 4-1.8 4-4v-2h-4v2c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2v-2H3zM17 10H7v2l4 4 4-4v-2zM17 7h-2c0-3.3-2.7-6-6-6S5 3.7 5 7h-2C3 3.1 1 5.1 1 7v2h16V7c0-1.9-2-3.9-4-3.9z"/></svg><div style="font-weight:600">Tidak ada lowongan</div><div style="font-size:0.85rem;opacity:0.7">Coba ubah filter kota.</div></div>';
      return;
    }
    list.forEach(job => cont.appendChild(this.jobCardEl(job, false)));
    this.goTo('lowongan');
  },
  refreshJobs() {
    this.showAlert('Data lowongan diperbarui dari penyimpanan lokal', 'info');
  },
  jobCardEl(job, compact = false) {
    const el = document.createElement('div');
    el.className = compact ? 'card' : 'job-card';
    el.style.padding = compact ? '14px' : '';
    const isSaved = this.data.saved && this.data.saved.includes(job.id);
    const isApplied = this.data.applied && this.data.applied.some(a => a.id === job.id);
    el.innerHTML = `\n      <div style="display:flex; justify-content:space-between; align-items:flex-start;">\n        <div>\n          <div style="display:flex; align-items:baseline; gap:6px;">\n            <div style="font-weight:700; font-size:1rem; color:var(--text);">${job.role}</div>\n            <span class="tag ${job.tag}">${job.score}%</span>\n          </div>\n          <div style="font-size:0.85rem; color:var(--text-muted); margin-top:2px;">${job.company} · ${job.city}</div>\n          <div class="job-meta" style="margin-top:6px;">\n            <span>${job.type}</span>\n            <span>${job.when}</span>\n          </div>\n          <div style="font-size:0.86rem; color:#374151; margin-top:6px;">${job.desc}</div>\n          ${!compact ? `<div style="font-size:0.82rem; color:var(--text-muted); margin-top:4px;"><strong>Syarat:</strong> ${job.req}</div>` : ''}\n        </div>\n        <div style="display:flex; flex-direction:column; gap:6px; align-items:flex-end;">\n          <button class="btn-icon" onclick="app.toggleSave('${job.id}', this)" title="${isSaved ? 'Hapus simpan' : 'Simpan'}">\n            ${isSaved ? '★' : '☆'}\n          </button>\n          <button class="btn btn-sm ${isApplied ? 'btn-outline' : 'btn-primary'}" onclick="app.applyJob('${job.id}')" style="width:100%; font-size:0.8rem;">\n            ${isApplied ? 'Terlampir' : 'Lamar'}\n          </button>\n          <a href="${job.url}" class="btn btn-sm btn-outline" style="width:100%; font-size:0.78rem; text-align:center;">Buka Link</a>\n        </div>\n      </div>\n    `;
    return el;
  },
  renderJobs(city) {
    this.filterJobs(city);
  },
  toggleSave(id, btn) {
    if (!this.data.saved) this.data.saved = [];
    const idx = this.data.saved.indexOf(id);
    if (idx >= 0) {
      this.data.saved.splice(idx, 1);
      btn.textContent = '☆';
    } else {
      this.data.saved.push(id);
      btn.textContent = '★';
    }
    this.saveData();
    this.updateStats();
  },
  applyJob(id) {
    const job = this.data.jobs.find(j => j.id === id);
    if (!job) return;
    if (!this.data.applied) this.data.applied = [];
    const exists = this.data.applied.find(a => a.id === id);
    if (exists) {
      this.showAlert('Sudah melamar lowongan ini', 'info');
      return;
    }
    if (!this.data.profile.nama) {
      this.showAlert('Lengkapi profil terlebih dahulu sebelum melamar', 'warning');
      this.goTo('profil');
      return;
    }
    this.data.applied.push({
      id: job.id, company: job.company, role: job.role, city: job.city,
      date: new Date().toISOString(), status: 'Dikirim'
    });
    this.saveData();
    this.showAlert('Lamaran terkirim ke ' + job.company, 'success');
    this.updateStats();
    this.renderApplied();
    this.filterJobs('semua');
  },
  renderApplied() {
    const cont = document.getElementById('applied-list');
    cont.innerHTML = '';
    const list = this.data.applied || [];
    if (list.length === 0) {
      cont.innerHTML = '<div class="empty-state"><svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10l-5 5-3-3-1.4 1.4L9 14l6.5 6.5L21 9z"/></svg><div style="font-weight:600">Belum ada lamaran</div><div style="font-size:0.85rem;opacity:0.7">Mulai cari lowongan dan klik "Lamar".</div></div>';
      return;
    }
    list.reverse().forEach(a => {
      const el = document.createElement('div');
      el.className = 'list-group-item';
      el.innerHTML = `\n        <div>\n          <div style="font-weight:700; color:var(--text);">${a.role}</div>\n          <div style="font-size:0.82rem; color:var(--text-muted);">${a.company} · ${a.city}</div>\n          <div style="font-size:0.78rem; color:var(--text-muted);">${new Date(a.date).toLocaleDateString('id-ID')} · ${a.status}</div>\n        </div>\n        <span class="badge badge-new">${a.status}</span>\n      `;
      cont.appendChild(el);
    });
  },

  // CV
  renderCVPreview() {
    const p = this.data.profile;
    const cont = document.getElementById('cv-preview');
    if (!p.nama) {
      cont.innerHTML = '<div class="empty-state" style="padding:20px;"><div style="font-weight:600; color:var(--text)">Isi profil terlebih dahulu</div><div style="font-size:0.85rem;opacity:0.7">Buka tab Profil dan simpan data Anda.</div></div>';
      return;
    }
    cont.innerHTML = `\n      <h2>${p.nama}</h2>\n      <div class="cv-sub">${p.location || '-'} · ${p.phone || '-'} · ${p.email || '-'}</div>\n      <h3>Tentang Saya</h3>\n      <p>${(p.target || 'Mencari pekerjaan sesuai keahlian dan pengalaman.')}</p>\n      <h3>Pendidikan</h3>\n      <p>${p.edu || '-'}</p>\n      <h3>Pengalaman Kerja</h3>\n      <p>${p.exp || '-'}</p>\n      <h3>Keahlian</h3>\n      <p>${p.skills || '-'}</p>\n    `;
  },
  generateCV() {
    this.renderCVPreview();
    this.showAlert('Pratinjau CV ditampilkan', 'info');
  },
  downloadCVPDF() {
    if (!this.data.profile.nama) {
      this.showAlert('Isi profil terlebih dahulu', 'warning');
      this.goTo('profil');
      return;
    }
    const p = this.data.profile;
    const html = `\n      <!DOCTYPE html><html><head><meta charset="utf-8"><style>\n        @page { size: A4; margin: 18mm; }\n        body { font-family: Arial, sans-serif; font-size: 10pt; color: #1f2937; line-height: 1.5; }\n        h1 { font-size: 18pt; color: #1b3a6b; margin: 0 0 2px 0; }\n        .sub { font-size: 9pt; color: #6b7280; margin-bottom: 14px; }\n        h3 { font-size: 10pt; color: #1b3a6b; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #e5e7eb; padding-bottom: 2px; margin: 12px 0 4px 0; }\n        p { margin: 0 0 6px 0; text-align: justify; }\n      </style></head><body>\n        <h1>${p.nama}</h1>\n        <div class="sub">${p.location || '-'} | ${p.phone || '-'} | ${p.email || '-'}</div>\n        <h3>Tentang Saya</h3><p>${p.target || '-'}</p>\n        <h3>Pendidikan</h3><p>${p.edu || '-'}</p>\n        <h3>Pengalaman Kerja</h3><p>${p.exp || '-'}</p>\n        <h3>Keahlian</h3><p>${p.skills || '-'}</p>\n      </body></html>`;
    const win = window.open('', '_blank');
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 500);
  },

  // Alerts
  showAlert(msg, type = 'info') {
    const el = document.createElement('div');
    el.className = `alert alert-${type} show`;
    el.innerHTML = `<span>${msg}</span>`;
    const cont = document.querySelector('main');
    cont.insertBefore(el, cont.firstChild);
    setTimeout(() => el.remove(), 3000);
  },

  clearData() {
    if (!confirm('Hapus semua data profil, lamaran, dan lowongan tersimpan?')) return;
    localStorage.removeItem('pk_data');
    location.reload();
  },

  setupInstallPrompt() {
    // handled in init
  }
};
