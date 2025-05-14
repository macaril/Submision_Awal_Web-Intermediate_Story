export default class AboutPage {
  async render() {
    return `
      <section class="container about-section">
        <h1 class="section-title">About Story App</h1>
        
        <div class="about-content">
          <div class="about-description">
            <p>
              Story App adalah platform tempat pengguna dapat berbagi cerita dan pengalaman mereka dengan orang lain di seluruh dunia. Dengan fokus pada aksesibilitas dan kemudahan penggunaan, aplikasi kami memungkinkan Anda untuk mengabadikan momen, menambahkan lokasi Anda, dan membagikannya dengan komunitas.
            </p>
            
            <h2>Fitur</h2>
            <ul>
              <li>Buat dan bagikan cerita dengan foto</li>
              <li>Lihat cerita dari pengguna di seluruh dunia</li>
              <li>Lihat lokasi cerita di peta interaktif</li>
              <li>Ambil foto langsung dengan kamera perangkat Anda</li>
              <li>Tandai lokasi Anda saat membuat cerita</li>
            </ul>
            
            <h2>Teknologi</h2>
            <p>
              Aplikasi ini dibangun menggunakan teknologi web modern yang mengikuti arsitektur single-page-aplication (SPA). Aplikasi ini menerapkan pola Model-View-Presenter (MVP) untuk pemisahan masalah yang jelas dan kode yang dapat dipelihara.
            </p>
            
            <ul>
              <li>HTML5, CSS3, dan JavaScript ES6+</li>
              <li>Leaflet.js untuk peta interaktif</li>
              <li>Camera API untuk pengambilan foto</li>
              <li>Geolocation API untuk penentuan posisi pengguna</li>
              <li>Web Storage API untuk autentikasi pengguna</li>
              <li>View Transitions API untuk transisi halaman yang mulus</li>
            </ul>
            
            <h2>Fitur Aksebilitas</h2>
            <p>
              Kami telah merancang aplikasi ini dengan mempertimbangkan aksesibilitas, mengikuti Web Content
              Accessibility Guidelines (WCAG):
            </p>
            
            <ul>
              <li>Semantic HTML5 struktur</li>
              <li>Skip to content links</li>
              <li>Atribut ARIA untuk pengalaman screen reader yang lebih baik</li>
              <li>Keyboard navigation support</li>
              <li>Pelabelan dan instruksi bentuk yang benar</li>
              <li>Alternative text for images</li>
              <li>Responsive design untuk semua ukuran device</li>
            </ul>
          </div>
        </div>
      </section>
    `;
  }

  async afterRender() {
  }
}