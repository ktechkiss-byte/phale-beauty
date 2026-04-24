import { useState } from 'react'
import { Link } from 'react-router-dom'
import posts, { getAllCategories, formatDate } from '../data/posts'

export default function BlogList() {
  const [activeCategory, setActiveCategory] = useState('Tất cả')
  const categories = ['Tất cả', ...getAllCategories()]

  const filtered = activeCategory === 'Tất cả'
    ? posts
    : posts.filter(p => p.category === activeCategory)

  const featured = posts.filter(p => p.featured)

  return (
    <main className="blog-page">
      {/* Hero Banner */}
      <section className="blog-hero">
        <div className="container">
          <p className="section-label">Blog & Kiến Thức</p>
          <h1>Thế Giới <span style={{ color: 'var(--accent)' }}>Phun Xăm</span></h1>
          <p className="subtitle" style={{ maxWidth: 600 }}>
            Chia sẻ kiến thức, bí quyết và xu hướng mới nhất trong ngành phun xăm thẩm mỹ từ Master Pha Lê.
          </p>
        </div>
      </section>

      {/* Featured Posts */}
      {activeCategory === 'Tất cả' && (
        <section className="blog-featured container">
          <div className="blog-featured__grid">
            {featured.map(post => (
              <Link to={`/blog/${post.id}`} className="blog-featured__card" key={post.id}>
                <div className="blog-featured__img">
                  <img src={post.thumbnail} alt={post.title} />
                  <span className="blog-featured__badge">Nổi bật</span>
                </div>
                <div className="blog-featured__body">
                  <div className="blog-featured__meta">
                    <span className="blog-tag">{post.category}</span>
                    <span className="blog-date">{formatDate(post.date)}</span>
                  </div>
                  <h2>{post.title}</h2>
                  <p>{post.excerpt}</p>
                  <span className="blog-readmore">Đọc tiếp →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Category Filter + Post Grid */}
      <section className="blog-list container">
        <div className="blog-list__header">
          <h2>{activeCategory === 'Tất cả' ? 'Tất Cả Bài Viết' : activeCategory}</h2>
          <div className="blog-filter">
            {categories.map(cat => (
              <button
                key={cat}
                className={`blog-filter__btn ${activeCategory === cat ? 'blog-filter__btn--active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="blog-list__grid">
          {filtered.map(post => (
            <Link to={`/blog/${post.id}`} className="blog-card" key={post.id}>
              <div className="blog-card__img">
                <img src={post.thumbnail} alt={post.title} />
                <span className="blog-tag blog-card__tag">{post.category}</span>
              </div>
              <div className="blog-card__body">
                <div className="blog-card__meta">
                  <span>{formatDate(post.date)}</span>
                  <span>·</span>
                  <span>{post.readTime}</span>
                </div>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <span className="blog-readmore">Đọc bài viết →</span>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="blog-empty">
            <p>Chưa có bài viết nào trong danh mục này.</p>
          </div>
        )}
      </section>
    </main>
  )
}
