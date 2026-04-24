import { useParams, Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { getPostBySlug, getRelatedPosts, formatDate } from '../data/posts'

export default function BlogDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const post = getPostBySlug(slug)
  const related = getRelatedPosts(slug, 3)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (!post) {
    return (
      <main className="blog-page">
        <div className="container" style={{ paddingTop: 160, textAlign: 'center', minHeight: '60vh' }}>
          <h1>Bài viết không tồn tại</h1>
          <p className="subtitle" style={{ margin: '16px 0 32px' }}>Bài viết bạn tìm kiếm đã bị xóa hoặc không tồn tại.</p>
          <Link to="/blog" className="btn btn--primary">← Quay về danh sách</Link>
        </div>
      </main>
    )
  }

  // Simple markdown-to-HTML converter for demo content
  function renderContent(markdown) {
    let html = markdown
      // Headers
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      // Bold
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      // Horizontal rule
      .replace(/^---$/gm, '<hr />')
      // Unordered list items
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      // Ordered list items
      .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
      // Table (basic support)
      .replace(/\|(.+)\|/g, (match) => {
        const cells = match.split('|').filter(c => c.trim())
        if (cells.some(c => /^[-\s]+$/.test(c.trim()))) return ''
        const tag = cells.length > 0 ? 'td' : 'td'
        return `<tr>${cells.map(c => `<${tag}>${c.trim()}</${tag}>`).join('')}</tr>`
      })
      // Paragraphs
      .replace(/\n\n/g, '</p><p>')

    // Wrap consecutive <li> in <ul>
    html = html.replace(/((<li>.+<\/li>\n?)+)/g, '<ul>$1</ul>')
    // Wrap <tr> in <table>
    html = html.replace(/((<tr>.+<\/tr>\n?)+)/g, '<table>$1</table>')

    return `<p>${html}</p>`
  }

  return (
    <main className="blog-page">
      {/* Article Header */}
      <section className="blog-detail__hero">
        <div className="container">
          <button className="blog-detail__back" onClick={() => navigate('/blog')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5" /><polyline points="12 19 5 12 12 5" />
            </svg>
            Quay lại Blog
          </button>

          <div className="blog-detail__meta-row">
            <span className="blog-tag">{post.category}</span>
            <span className="blog-date">{formatDate(post.date)}</span>
            <span className="blog-date">{post.readTime}</span>
          </div>

          <h1 className="blog-detail__title">{post.title}</h1>

          <div className="blog-detail__author">
            <div className="blog-detail__author-avatar">
              <img src="/assets/logo.png" alt="" />
            </div>
            <div>
              <strong>{post.author}</strong>
              <span>Pha Lê Beauty & Academy</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="blog-detail__image container">
        <img src={post.thumbnail} alt={post.title} />
      </section>

      {/* Article Content */}
      <article className="blog-detail__content container">
        <div
          className="blog-detail__body"
          dangerouslySetInnerHTML={{ __html: renderContent(post.content) }}
        />

        {/* Share / CTA */}
        <div className="blog-detail__cta">
          <div className="blog-detail__cta-inner">
            <h3>Bạn quan tâm đến dịch vụ này?</h3>
            <p>Liên hệ Master Pha Lê để được tư vấn miễn phí và đặt lịch hẹn.</p>
            <div className="blog-detail__cta-actions">
              <a href="tel:0906112500" className="btn btn--primary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92V19.92C22 20.48 21.56 20.93 21 20.97C17.63 20.73 14.42 19.63 11.68 17.85C9.14 16.22 7.02 14.1 5.39 11.56C3.61 8.82 2.51 5.61 2.27 2.24C2.23 1.68 2.67 1.24 3.23 1.2H6.23C6.71 1.2 7.13 1.54 7.21 2.01C7.36 2.87 7.62 3.71 7.99 4.5L6.3 6.19C7.77 8.81 9.93 10.97 12.55 12.44L14.24 10.75C15.03 11.12 15.87 11.38 16.73 11.53C17.2 11.61 17.54 12.03 17.54 12.51V16.92" /></svg>
                Gọi 090-611-2500
              </a>
              <a href="https://www.facebook.com/dieukhachairstroke/" target="_blank" rel="noopener noreferrer" className="btn btn--outline">
                Nhắn Tin Facebook
              </a>
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {related.length > 0 && (
        <section className="blog-related container">
          <h2>Bài Viết <span style={{ color: 'var(--accent)' }}>Liên Quan</span></h2>
          <div className="blog-related__grid">
            {related.map(r => (
              <Link to={`/blog/${r.id}`} className="blog-card" key={r.id}>
                <div className="blog-card__img">
                  <img src={r.thumbnail} alt={r.title} />
                  <span className="blog-tag blog-card__tag">{r.category}</span>
                </div>
                <div className="blog-card__body">
                  <div className="blog-card__meta">
                    <span>{formatDate(r.date)}</span>
                    <span>·</span>
                    <span>{r.readTime}</span>
                  </div>
                  <h3>{r.title}</h3>
                  <span className="blog-readmore">Đọc bài viết →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
