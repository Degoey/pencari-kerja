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
    // PWA install event
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
    // Seed default jobs if none
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
      {
        id: 'j1', company: 'Seng Hap 1881', role: 'Social Media Officer',
        city: 'Medan', when: '17 jam lalu', type: 'Kontrak',
        desc: 'Mengelola jadwal konten media sosial, produksi video dan desain visual, riset tren Instagram/TikTok.',
        req: 'D3/S1 semua jurusan, bisa Canva & CapCut, paham Instagram dan TikTok, dasar desain grafis.',
        score: 85, tag: 'good', url: 'https://id.linkedin.com/jobs/view/social-media-officer-at-seng-hap-1881-4436023525'
      },
      {
        id: 'j2', company: 'Ruangguru', role: 'Student Advisor',
        city: 'Bandung', when: '1 hari lalu', type: 'Penuh waktu',
        desc: 'Membimbing calon siswa, follow up pelanggan, mencapai target presentasi dan penjualan.',
        req: 'Min D3/S1, pengalaman 1-2 tahun sales/marketing (diutamakan), punya laptop & smartphone.',
        score: 72, tag: 'mid', url: 'https://id.linkedin.com/jobs/view/student-advisor-bandung-buahbatu-at-ruangguru-4487046616'
      },
      {
        id: 'j3', company: 'UOB', role: 'Client Advisor',
        city: 'Bandung', when: '16 jam lalu', type: 'Penuh waktu',
        desc: 'Sales Privilege Banking, pertumbuhan portofolio produk bank, referral nasabah.',
        req: 'S1 semua jurusan, Mandarin/Hokkien diutamakan, fresh graduate dipersilakan.',
        score: 65, tag: 'mid', url: 'https://id.linkedin.com/jobs/view/client-advisor-bandung-at-uob-4424570357'
      },
      {
        id: 'j4', company: 'Ten Degrees', role: 'Social Media Marketing Specialist',
        city: 'Bandung', when: '4 hari lalu', type: 'Penuh waktu',
        desc: 'Membangun media sosial Ten Degrees dari nol (Instagram, TikTok, Facebook) untuk padel court baru.',
        req: 'Kreatif, paham media sosial, bisa membuat konten visual dan video pendek.',
        score: 80, tag: 'good', url: 'mailto:tendegreespadelcourt@gmail.com?subject=Social Media Marketing Specialist - [Nama]'
      },
      {
        id: 'j5', company: 'JTI', role: 'Field Marketing Executive',
        city: 'Medan', when: '11 jam lalu', type: 'Penuh waktu',
        desc: 'Eksekusi program pemasaran lapangan, analisis kompetitor, laporan evaluasi program.',
        req: 'Min 2 tahun pengalaman marketing/field marketing, FMCG diutamakan, Inggris baik.',
        score: 60, tag: 'mid', url: 'https://id.linkedin.com/jobs/view/field-marketing-executive-medan-at-jti-4469417639'
      },
      {
        id: 'j6', company: 'DHJ Fashion', role: 'Social Media Specialist (Wanita)',
        city: 'Bandung', when: '18 jam lalu', type: 'Penuh waktu',
        desc: 'Strategi media sosial fashion & lifestyle, content plan, creative brief, analisis performa.',
        req: 'Pengalaman sebagai Social Media Specialist, fashion sense baik, Instagram & TikTok.',
        score: 70, tag: 'mid', url: 'https://id.linkedin.com/jobs/view/social-media-specialist-wanita-at-dhj-fashion-4486330276'
      },
      {
        id: 'j7', company: 'Bobobox', role: 'Customer Care Unit Associate',
        city: 'Bandung', when: '2 hari lalu', type: 'Penuh waktu',
        desc: 'Menangani pertanyaan tamu via chat, ulasan Google & OTA, penanganan keluhan pelanggan.',
        req: 'S1, komunikasi baik, senang membantu pelanggan, shift work.',
        score: 68, tag: 'mid', url: 'https://id.linkedin.com/jobs/view/customer-care-unit-associate-at-bobobox-4485733683'
      },
      {
        id: 'j8', company: 'Apical', role: 'Officer Sourcing',
        city: 'Medan', when: '4 hari lalu', type: 'Penuh waktu',
        desc: 'Tugas administrasi dan produksi, riset dasar, input data, dukungan tim.',
        req: 'Administrasi, riset, komunikasi, teliti dan bertanggung jawab.',
        score: 62, tag: 'mid', url: 'https://id.linkedin.com/jobs/view/officer-sourcing-at-apical-4483962034'
      },
      {
        id: 'j9', company: 'Sakapulo', role: 'Creative Brand Strategist (F&B)',
        city: 'Medan', when: '3 hari lalu', type: 'Penuh waktu',
        desc: 'Strategi branding dan marketing bulanan, narasi brand, campaign, koordinasi tim digital.',
        req: 'Pengalaman 2-3 tahun brand marketing/creative strategy, F&B diutamakan.',
        score: 55, tag: 'low', url: 'https://id.linkedin.com/jobs/view/creative-brand-strategist-4485175664'
      },
      {
        id: 'j10', company: 'INFUSE', role: 'Marketing Analyst (Remote)',
        city: 'Remote', when: '4 jam lalu', type: 'Kontrak',
        desc: 'Analisis kebutuhan auditori B2B, performance marketing, test dan proyek pendek.',
        req: 'Analitis, kritis, paham platform pemasaran digital, Inggris aktif.',
        score: 45, tag: 'low', url: 'https://id.linkedin.com/jobs/view/marketing-analyst-remote-contract-at-infuse-4487528852'
      }
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
    el.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start;">
        <div>
          <div style="display:flex; align-items:baseline; gap:6px;">
            <div style="font-weight:700; font-size:1rem; color:var(--text);">${job.role}</div>
            <span class="tag ${job.tag}">${job.score}%</span>
          </div>
          <div style="font-size:0.85rem; color:var(--text-muted); margin-top:2px;">${job.company} · ${job.city}</div>
          <div class="job-meta" style="margin-top:6px;">
            <span>${job.type}</span>
            <span>${job.when}</span>
          </div>
          <div style="font-size:0.86rem; color:#374151; margin-top:6px;">${job.desc}</div>
          ${!compact ? `<div style="font-size:0.82rem; color:var(--text-muted); margin-top:4px;"><strong>Syarat:</strong> ${job.req}</div>` : ''}
        </div>
        <div style="display:flex; flex-direction:column; gap:6px; align-items:flex-end;">
          <button class="btn-icon" onclick="app.toggleSave('${job.id}', this)" title="${isSaved ? 'Hapus simpan' : 'Simpan'}">
            ${isSaved ? '★' : '☆'}
          </button>
          <button class="btn btn-sm ${isApplied ? 'btn-outline' : 'btn-primary'}" onclick="app.applyJob('${job.id}')" style="width:100%; font-size:0.8rem;">
            ${isApplied ? 'Terlampir' : 'Lamar'}
          </button>
          <a href="${job.url}" class="btn btn-sm btn-outline" style="width:100%; font-size:0.78rem; text-align:center;">Buka Link</a>
        </div>
      </div>
    `;
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
    // Refresh job cards
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
      el.innerHTML = `
        <div>
          <div style="font-weight:700; color:var(--text);">${a.role}</div>
          <div style="font-size:0.82rem; color:var(--text-muted);">${a.company} · ${a.city}</div>
          <div style="font-size:0.78rem; color:var(--text-muted);">${new Date(a.date).toLocaleDateString('id-ID')} · ${a.status}</div>
        </div>
        <span class="badge badge-new">${a.status}</span>
      `;
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
    cont.innerHTML = `
      <h2>${p.nama}</h2>
      <div class="cv-sub">${p.location || '-'} · ${p.phone || '-'} · ${p.email || '-'}</div>
      <h3>Tentang Saya</h3>
      <p>${(p.target || 'Mencari pekerjaan sesuai keahlian dan pengalaman.')}</p>
      <h3>Pendidikan</h3>
      <p>${p.edu || '-'}</p>
      <h3>Pengalaman Kerja</h3>
      <p>${p.exp || '-'}</p>
      <h3>Keahlian</h3>
      <p>${p.skills || '-'}</p>
    `;
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
    const html = `
      <!DOCTYPE html><html><head><meta charset="utf-8"><style>
        @page { size: A4; margin: 18mm; }
        body { font-family: Arial, sans-serif; font-size: 10pt; color: #1f2937; line-height: 1.5; }
        h1 { font-size: 18pt; color: #1b3a6b; margin: 0 0 2px 0; }
        .sub { font-size: 9pt; color: #6b7280; margin-bottom: 14px; }
        h3 { font-size: 10pt; color: #1b3a6b; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #e5e7eb; padding-bottom: 2px; margin: 12px 0 4px 0; }
        p { margin: 0 0 6px 0; text-align: justify; }
      </style></head><body>
        <h1>${p.nama}</h1>
        <div class="sub">${p.location || '-'} | ${p.phone || '-'} | ${p.email || '-'}</div>
        <h3>Tentang Saya</h3><p>${p.target || '-'}</p>
        <h3>Pendidikan</h3><p>${p.edu || '-'}</p>
        <h3>Pengalaman Kerja</h3><p>${p.exp || '-'}</p>
        <h3>Keahlian</h3><p>${p.skills || '-'}</p>
      </body></html>`;
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
