import { useState, useEffect, useRef } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import './App.css'
import './pages/Blog.css'
import BlogList from './pages/BlogList'
import BlogDetail from './pages/BlogDetail'

/* ========================================
   PHA LÊ BEAUTY & ACADEMY — Landing Page
   ======================================== */

const GOLD = '#C9A96E'

// --- SVG Icon Components (Gold tone) ---
const Icon = ({ children, size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
)

const Icons = {
  // Philosophy icons
  goldenRatio: (
    <Icon>
      <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5" stroke={GOLD} fill="none" />
      <circle cx="12" cy="12" r="3.5" stroke={GOLD} fill="rgba(201,169,110,0.15)" />
      <line x1="12" y1="2" x2="12" y2="8.5" stroke={GOLD} strokeWidth="1" opacity="0.5" />
      <line x1="12" y1="15.5" x2="12" y2="22" stroke={GOLD} strokeWidth="1" opacity="0.5" />
    </Icon>
  ),
  inkFormula: (
    <Icon>
      <path d="M12 2C12 2 9 8 9 11C9 12.66 10.34 14 12 14C13.66 14 15 12.66 15 11C15 8 12 2 12 2Z" stroke={GOLD} fill="rgba(201,169,110,0.15)" />
      <path d="M7 18H17" stroke={GOLD} />
      <path d="M8 21H16" stroke={GOLD} />
      <circle cx="12" cy="10.5" r="1" fill={GOLD} stroke="none" />
    </Icon>
  ),
  shield: (
    <Icon>
      <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke={GOLD} fill="rgba(201,169,110,0.1)" />
      <polyline points="9 12 11 14 15 10" stroke={GOLD} strokeWidth="2" />
    </Icon>
  ),
  crown: (
    <Icon>
      <path d="M2 17L5 8L9 13L12 4L15 13L19 8L22 17H2Z" stroke={GOLD} fill="rgba(201,169,110,0.15)" />
      <line x1="3" y1="20" x2="21" y2="20" stroke={GOLD} strokeWidth="2" />
    </Icon>
  ),
  // Academy icons
  handshake: (
    <Icon size={24}>
      <path d="M7 11L4 14L7 17" stroke={GOLD} />
      <path d="M17 11L20 14L17 17" stroke={GOLD} />
      <path d="M4 14H11L13 12H20" stroke={GOLD} />
      <circle cx="12" cy="7" r="3" stroke={GOLD} fill="rgba(201,169,110,0.15)" />
    </Icon>
  ),
  target: (
    <Icon size={24}>
      <circle cx="12" cy="12" r="9" stroke={GOLD} />
      <circle cx="12" cy="12" r="5" stroke={GOLD} opacity="0.6" />
      <circle cx="12" cy="12" r="1.5" fill={GOLD} stroke="none" />
    </Icon>
  ),
  briefcase: (
    <Icon size={24}>
      <rect x="3" y="9" width="18" height="11" rx="2" stroke={GOLD} fill="rgba(201,169,110,0.1)" />
      <path d="M8 9V6C8 4.9 8.9 4 10 4H14C15.1 4 16 4.9 16 6V9" stroke={GOLD} />
      <line x1="3" y1="14" x2="21" y2="14" stroke={GOLD} opacity="0.5" />
    </Icon>
  ),
  // Contact icons
  phone: (
    <Icon size={22}>
      <path d="M22 16.92V19.92C22 20.48 21.56 20.93 21 20.97C17.63 20.73 14.42 19.63 11.68 17.85C9.14 16.22 7.02 14.1 5.39 11.56C3.61 8.82 2.51 5.61 2.27 2.24C2.23 1.68 2.67 1.24 3.23 1.2H6.23C6.71 1.2 7.13 1.54 7.21 2.01C7.36 2.87 7.62 3.71 7.99 4.5L6.3 6.19C7.77 8.81 9.93 10.97 12.55 12.44L14.24 10.75C15.03 11.12 15.87 11.38 16.73 11.53C17.2 11.61 17.54 12.03 17.54 12.51L17.54 16.92" stroke={GOLD} fill="none" />
    </Icon>
  ),
  mapPin: (
    <Icon size={22}>
      <path d="M12 21C12 21 19 14.5 19 9C19 5.13 15.87 2 12 2C8.13 2 5 5.13 5 9C5 14.5 12 21 12 21Z" stroke={GOLD} fill="rgba(201,169,110,0.1)" />
      <circle cx="12" cy="9" r="2.5" stroke={GOLD} fill="rgba(201,169,110,0.2)" />
    </Icon>
  ),
  clock: (
    <Icon size={22}>
      <circle cx="12" cy="12" r="9" stroke={GOLD} fill="rgba(201,169,110,0.08)" />
      <polyline points="12 7 12 12 15.5 14" stroke={GOLD} strokeWidth="2" />
    </Icon>
  ),
}

// --- Intersection Observer Hook ---
function useInView(options = {}) {
  const ref = useRef(null)
  const [isInView, setIsInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsInView(true); observer.unobserve(el) } },
      { threshold: 0.15, ...options }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return [ref, isInView]
}

// ============================
// HEADER
// ============================
function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('phale-theme') || 'dark'
    }
    return 'dark'
  })
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('phale-theme', theme)
  }, [theme])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark')

  const scrollNav = [
    { label: 'Dịch vụ', href: '/#services' },
    { label: 'Tác phẩm', href: '/#gallery' },
    { label: 'Đào tạo', href: '/#academy' },
  ]

  const handleHashClick = (e, href) => {
    setMenuOpen(false)
    if (isHome && href.startsWith('/#')) {
      e.preventDefault()
      const el = document.querySelector(href.replace('/', ''))
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`} id="header">
      <div className="header__inner container">
        <Link to="/" className="header__logo">
          <img src="/assets/logo.png" alt="Pha Lê" className="header__logo-icon" />
          <img src="/assets/logo_text.png" alt="Pha Lê Beauty & Academy" className="header__logo-text" />
        </Link>

        <nav className={`header__nav ${menuOpen ? 'header__nav--open' : ''}`}>
          {scrollNav.map(item => (
            <a key={item.href} href={item.href} className="header__link" onClick={(e) => handleHashClick(e, item.href)}>
              {item.label}
            </a>
          ))}
          <Link to="/blog" className="header__link" onClick={() => setMenuOpen(false)}>
            Blog
          </Link>

          {/* Theme Toggle */}
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Chuyển chế độ sáng/tối" title={theme === 'dark' ? 'Chế độ sáng' : 'Chế độ tối'}>
            {theme === 'dark' ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          <a href={isHome ? '#contact' : '/#contact'} className="btn btn--primary header__cta" onClick={(e) => handleHashClick(e, '/#contact')}>
            Đặt Lịch
          </a>
        </nav>

        <button
          className={`header__burger ${menuOpen ? 'header__burger--open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span /><span /><span />
        </button>
      </div>
    </header>
  )
}

// ============================
// HERO
// ============================
function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="hero__bg">
        <div className="hero__gradient" />
      </div>
      <div className="hero__inner container">
        <div className="hero__content">
          <p className="section-label animate-in">Pha Lê Beauty & Academy</p>
          <h1 className="hero__title animate-in animate-in--delay-1">
            Nghệ Thuật<br />
            <span className="hero__title--accent">Phun Xăm</span><br />
            Tự Nhiên
          </h1>
          <div className="divider animate-in animate-in--delay-2" />
          <p className="subtitle hero__subtitle animate-in animate-in--delay-2">
            Đánh thức vẻ đẹp tiềm ẩn qua bàn tay nghệ nhân.<br />
            Chuẩn tỷ lệ vàng — Tự nhiên tuyệt đối.
          </p>
          <div className="hero__actions animate-in animate-in--delay-3">
            <a href="#services" className="btn btn--primary">Khám Phá Dịch Vụ</a>
            <a href="#academy" className="btn btn--outline">Lộ Trình Khóa Học</a>
          </div>

          <div className="hero__stats animate-in animate-in--delay-4">
            <div className="hero__stat">
              <span className="hero__stat-number">2000+</span>
              <span className="hero__stat-label">Khách Hàng</span>
            </div>
            <div className="hero__stat-divider" />
            <div className="hero__stat">
              <span className="hero__stat-number">8+</span>
              <span className="hero__stat-label">Năm Kinh Nghiệm</span>
            </div>
            <div className="hero__stat-divider" />
            <div className="hero__stat">
              <span className="hero__stat-number">500+</span>
              <span className="hero__stat-label">Học Viên</span>
            </div>
          </div>
        </div>

        <div className="hero__portrait animate-in animate-in--delay-2">
          <div className="hero__portrait-frame">
            <img src="/assets/portrait.png" alt="Master Pha Lê" />
          </div>
          <div className="hero__portrait-badge">
            <img src="/assets/logo.png" alt="" className="hero__portrait-badge-logo" />
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================
// SERVICES
// ============================
function Services() {
  const [ref, inView] = useInView()
  const services = [
    {
      title: 'Điêu Khắc Hairstroke',
      desc: 'Phẩy sợi chân mày chuẩn tỷ lệ vàng, tự nhiên như sợi mày thật. Kỹ thuật Nano tinh xảo.',
      image: '/assets/eyebrows.png',
      tag: 'Signature',
      slug: 'dieu-khac-hairstroke-ky-thuat-nano'
    },
    {
      title: 'Phun Môi Pha Lê',
      desc: 'Khử thâm — tạo màu hồng tự nhiên. Công nghệ Crystal Lips độc quyền, giữ màu bền lâu.',
      image: '/assets/lips.png',
      tag: 'Premium',
      slug: 'phun-moi-crystal-lips-xu-huong-2026'
    },
    {
      title: 'Đào Tạo Phun Xăm',
      desc: 'Học để làm được nghề. Cầm tay chỉ việc — thực hành liên tục — hỗ trợ việc làm.',
      image: '/assets/course.png',
      tag: 'Academy',
      slug: 'hoc-phun-xam-tu-co-ban-den-chuyen-sau'
    },
  ]

  return (
    <section className="services section" id="services" ref={ref}>
      <div className="container">
        <div className="services__header">
          <p className="section-label">Dịch vụ nổi bật</p>
          <h2>Tôn Vinh Vẻ Đẹp<br /><span style={{ color: 'var(--accent)' }}>Tự Nhiên Nhất</span></h2>
          <div className="divider" />
        </div>

        <div className={`services__grid ${inView ? 'services__grid--visible' : ''}`}>
          {services.map((s, i) => (
            <div className="card services__card" key={i} style={{ animationDelay: `${i * 0.15}s` }}>
              <div className="services__card-img-wrap">
                <img src={s.image} alt={s.title} className="card__image" />
                <span className="services__tag">{s.tag}</span>
              </div>
              <div className="card__body">
                <h3 className="card__title">{s.title}</h3>
                <p className="card__desc">{s.desc}</p>
                <Link to={`/blog/${s.slug}`} className="btn btn--ghost services__link">
                  Tìm hiểu thêm →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================
// BEFORE / AFTER GALLERY
// ============================
function Gallery() {
  const [ref, inView] = useInView()
  const [sliderPos, setSliderPos] = useState(50)
  const sliderRef = useRef(null)
  const isDragging = useRef(false)

  const handleMove = (clientX) => {
    if (!isDragging.current || !sliderRef.current) return
    const rect = sliderRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const pct = Math.max(5, Math.min(95, (x / rect.width) * 100))
    setSliderPos(pct)
  }

  const handleMouseDown = () => { isDragging.current = true }
  const handleMouseUp = () => { isDragging.current = false }

  useEffect(() => {
    const onMove = (e) => handleMove(e.touches ? e.touches[0].clientX : e.clientX)
    const onUp = () => { isDragging.current = false }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchmove', onMove)
    window.addEventListener('touchend', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onUp)
    }
  }, [])

  return (
    <section className="gallery section--lg" id="gallery" ref={ref}>
      <div className="container">
        <div className="gallery__header" style={{ textAlign: 'center' }}>
          <p className="section-label">Thành Phẩm</p>
          <h2>Biến Đổi <span style={{ color: 'var(--accent)' }}>Hoàn Hảo</span></h2>
          <p className="subtitle" style={{ maxWidth: 560, margin: '12px auto 0' }}>
            Mỗi tác phẩm là một câu chuyện về sự tỉ mỉ và tâm huyết của Master Pha Lê.
          </p>
          <div className="divider divider--center" />
        </div>

        <div
          className={`gallery__slider ${inView ? 'gallery__slider--visible' : ''}`}
          ref={sliderRef}
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
        >
          {/* After image (full width background) */}
          <div className="gallery__after">
            <img src="/assets/lips.png" alt="After — Phun môi Pha Lê" />
          </div>

          {/* Before image (clipped by slider position) */}
          <div className="gallery__before" style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}>
            <img src="/assets/lips.png" alt="Before — Trước khi phun" />
            <div className="gallery__before-overlay" />
          </div>

          {/* Slider handle */}
          <div className="gallery__handle" style={{ left: `${sliderPos}%` }}>
            <div className="gallery__handle-line" />
            <div className="gallery__handle-knob">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7 4L3 10L7 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M13 4L17 10L13 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          <span className="gallery__label gallery__label--before">Before</span>
          <span className="gallery__label gallery__label--after">After</span>
        </div>

        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '16px' }}>
          ← Kéo thanh trượt để so sánh →
        </p>
      </div>
    </section>
  )
}

// ============================
// PHILOSOPHY / TRUST
// ============================
function Philosophy() {
  const [ref, inView] = useInView()
  const points = [
    { icon: Icons.goldenRatio, title: 'Chuẩn Tỷ Lệ Vàng', desc: 'Mỗi nét phẩy đều được đo đạc theo tỷ lệ khuôn mặt, tạo nên sự cân đối hoàn hảo.' },
    { icon: Icons.inkFormula, title: 'Công Thức Mực Riêng', desc: 'Pha chế mực chuyên biệt cho từng khách, đảm bảo màu sắc tự nhiên, không trổ xanh đỏ.' },
    { icon: Icons.shield, title: 'An Toàn Tuyệt Đối', desc: 'Dụng cụ 1 lần, mực nhập khẩu có chứng nhận, cam kết bảo hành màu.' },
    { icon: Icons.crown, title: 'Tay Nghề Master', desc: '8+ năm kinh nghiệm, hơn 2000 khách hàng tin tưởng, đào tạo 500+ học viên.' },
  ]

  return (
    <section className="philosophy section" id="philosophy" ref={ref}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-3xl)' }}>
          <p className="section-label">Triết Lý</p>
          <h2>Đừng Vội Quyết Định<br /><span style={{ color: 'var(--accent)' }}>Khi Chưa Hiểu Rõ</span></h2>
          <div className="divider divider--center" />
        </div>

        <div className={`philosophy__grid ${inView ? 'philosophy__grid--visible' : ''}`}>
          {points.map((p, i) => (
            <div className="philosophy__item" key={i} style={{ animationDelay: `${i * 0.12}s` }}>
              <span className="philosophy__icon">{p.icon}</span>
              <h4 className="philosophy__title">{p.title}</h4>
              <p className="philosophy__desc">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================
// ACADEMY SECTION
// ============================
function Academy() {
  const [ref, inView] = useInView()

  return (
    <section className="academy section" id="academy" ref={ref}>
      <div className="container">
        <div className={`academy__inner ${inView ? 'academy__inner--visible' : ''}`}>
          <div className="academy__image">
            <img src="/assets/course.png" alt="Đào tạo phun xăm Pha Lê" />
          </div>
          <div className="academy__content">
            <p className="section-label">Academy</p>
            <h2>Học Để Làm<br /><span style={{ color: 'var(--accent)' }}>Được Nghề</span></h2>
            <div className="divider" />
            <p className="subtitle">
              Đào tạo phun xăm từ cơ bản đến chuyên sâu. Lộ trình rõ ràng, 
              thực hành trên mẫu thật, cam kết đầu ra cho học viên.
            </p>

            <div className="academy__features">
              <div className="academy__feature">
                <span className="academy__feature-icon">{Icons.handshake}</span>
                <div>
                  <strong>Cầm Tay Chỉ Việc</strong>
                  <p>1-1 với Master Pha Lê, hướng dẫn chi tiết từng bước</p>
                </div>
              </div>
              <div className="academy__feature">
                <span className="academy__feature-icon">{Icons.target}</span>
                <div>
                  <strong>Thực Hành Liên Tục</strong>
                  <p>Luyện tập trên da giả và mẫu thật đến khi thành thạo</p>
                </div>
              </div>
              <div className="academy__feature">
                <span className="academy__feature-icon">{Icons.briefcase}</span>
                <div>
                  <strong>Hỗ Trợ Việc Làm</strong>
                  <p>Kết nối cơ hội việc làm sau khi tốt nghiệp</p>
                </div>
              </div>
            </div>

            <a href="#contact" className="btn btn--primary">Đăng Ký Tư Vấn Khóa Học</a>
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================
// CONTACT / LEAD FORM
// ============================
function Contact() {
  const [ref, inView] = useInView()
  const [formData, setFormData] = useState({ name: '', phone: '', service: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <section className="contact section--lg" id="contact" ref={ref}>
      <div className="container">
        <div className={`contact__inner ${inView ? 'contact__inner--visible' : ''}`}>
          <div className="contact__info">
            <p className="section-label">Liên Hệ</p>
            <h2>Kết Nối Với<br /><span style={{ color: 'var(--accent)' }}>Chúng Tôi</span></h2>
            <div className="divider" />
            <p className="subtitle">
              Tư vấn miễn phí — Đặt lịch hẹn hoặc đăng ký khóa học. 
              Master Pha Lê sẽ trao đổi trực tiếp với bạn.
            </p>

            <div className="contact__details">
              <div className="contact__detail">
                <span className="contact__detail-icon">{Icons.phone}</span>
                <div>
                  <strong>Hotline</strong>
                  <a href="tel:0906112500">090-611-2500</a>
                </div>
              </div>
              <div className="contact__detail">
                <span className="contact__detail-icon">{Icons.mapPin}</span>
                <div>
                  <strong>Địa chỉ</strong>
                  <span>112 Dương Văn Cam, P. Linh Xuân, TP. Thủ Đức</span>
                </div>
              </div>
              <div className="contact__detail">
                <span className="contact__detail-icon">{Icons.clock}</span>
                <div>
                  <strong>Giờ làm việc</strong>
                  <span>8:00 — 20:00 (Thứ 2 — Chủ nhật)</span>
                </div>
              </div>
            </div>
          </div>

          <form className="contact__form" onSubmit={handleSubmit}>
            <div className="contact__form-row">
              <div className="contact__field">
                <label htmlFor="contact-name">Họ và tên</label>
                <input
                  id="contact-name"
                  type="text"
                  placeholder="Nhập họ tên..."
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="contact__field">
                <label htmlFor="contact-phone">Số điện thoại</label>
                <input
                  id="contact-phone"
                  type="tel"
                  placeholder="0901 234 567"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="contact__field">
              <label htmlFor="contact-service">Bạn quan tâm</label>
              <select
                id="contact-service"
                value={formData.service}
                onChange={e => setFormData({ ...formData, service: e.target.value })}
                required
              >
                <option value="">Chọn dịch vụ / khóa học...</option>
                <option value="hairstroke">Điêu Khắc Hairstroke</option>
                <option value="lips">Phun Môi Pha Lê</option>
                <option value="pixel">Pixel Brows</option>
                <option value="fix">Khắc Phục Lỗi (Sửa mày/môi cũ)</option>
                <option value="course-basic">Khóa Học — Cơ Bản</option>
                <option value="course-advanced">Khóa Học — Chuyên Sâu</option>
              </select>
            </div>

            <div className="contact__field">
              <label htmlFor="contact-message">Lời nhắn</label>
              <textarea
                id="contact-message"
                rows="4"
                placeholder="Mô tả nhu cầu của bạn..."
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
              />
            </div>

            <button type="submit" className={`btn btn--primary contact__submit ${submitted ? 'contact__submit--sent' : ''}`}>
              {submitted ? '✓ Đã Gửi Thành Công!' : 'Gửi Yêu Cầu Tư Vấn'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

// ============================
// FOOTER
// ============================
function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__inner">
          <div className="footer__brand">
            <div className="footer__logo-group">
              <img src="/assets/logo.png" alt="Pha Lê" className="footer__logo" />
              <img src="/assets/logo_text.png" alt="Pha Lê" className="footer__logo-text" />
            </div>
            <p className="footer__tagline">Beauty & Academy</p>
            <p className="footer__copyright">© 2026 Pha Lê Beauty & Academy.<br />Nghệ Thuật Phun Xăm Tự Nhiên.</p>
          </div>

          <div className="footer__links">
            <h4>Dịch Vụ</h4>
            <a href="#services">Điêu Khắc Hairstroke</a>
            <a href="#services">Phun Môi Pha Lê</a>
            <a href="#services">Pixel Brows</a>
            <a href="#services">Khắc Phục Lỗi</a>
          </div>

          <div className="footer__links">
            <h4>Đào Tạo</h4>
            <a href="#academy">Khóa Cơ Bản</a>
            <a href="#academy">Khóa Chuyên Sâu</a>
            <a href="#academy">Master Class</a>
          </div>

          <div className="footer__links">
            <h4>Kết Nối</h4>
            <a href="https://www.facebook.com/dieukhachairstroke/" target="_blank" rel="noopener noreferrer">Facebook</a>
            <a href="https://www.tiktok.com/@xm.phun.pha.l" target="_blank" rel="noopener noreferrer">TikTok</a>
            <a href="tel:0906112500">090-611-2500</a>
          </div>
        </div>

        <div className="footer__bottom">
          <span>Thiết kế bởi <strong style={{ color: 'var(--accent)' }}>Wolf Label</strong></span>
        </div>
      </div>
    </footer>
  )
}

// ============================
// LANDING (Home sections)
// ============================
function Landing() {
  return (
    <>
      <Hero />
      <Services />
      <Gallery />
      <Philosophy />
      <Academy />
      <Contact />
    </>
  )
}

// ============================
// APP
// ============================
export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />
      </Routes>
      <Footer />
    </>
  )
}
