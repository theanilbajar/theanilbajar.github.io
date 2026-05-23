import { Link } from 'react-router-dom';
import postsData from '../data/posts.json';
import TagBadge from '../components/TagBadge';

function readingTime(content) {
  return Math.ceil(content.split(/\s+/).length / 200);
}

export default function Home() {
  const posts = postsData;

  return (
    <div className="page home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-greeting">👋 Hi, this is Anil.</h1>
          <p className="hero-tagline">Sharing my learnings and new research notes on LLMs, Generative AI, and Machine Learning.</p>
        </div>
      </section>

      {/* Latest Posts Grid */}
      <section className="posts-section">
        <div className="section-header">
          <h2 className="section-title">Latest Posts</h2>
          <Link to="/posts" className="section-link">View all →</Link>
        </div>
        <div className="posts-grid">
          {posts.map(post => (
            <article key={post.id} className="grid-card">
              <div className="grid-card-body">
                <div className="grid-card-tags">
                  {post.tags.map(tag => <TagBadge key={tag} tag={tag} />)}
                </div>
                <h3 className="grid-card-title">
                  <Link to={`/posts/${post.id}`}>{post.title}</Link>
                </h3>
                <p className="grid-card-excerpt">
                  {post.content.replace(/<[^>]*>/g, '').substring(0, 120)}...
                </p>
              </div>
              <div className="grid-card-footer">
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </time>
                <span>{readingTime(post.content)} min read</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Browse by Tags */}
      <section className="tags-section">
        <div className="section-header">
          <h2 className="section-title">Browse by Topic</h2>
          <Link to="/tags" className="section-link">All tags →</Link>
        </div>
        <div className="tag-list">
          {[...new Set(posts.flatMap(p => p.tags))].sort().map(tag => (
            <Link key={tag} to={`/tags/${encodeURIComponent(tag)}`} className="tag-pill">
              {tag}
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <p>Subscribe to the <a href="/feed.xml" target="_blank" rel="noopener noreferrer">RSS feed</a> to stay updated.</p>
      </section>
    </div>
  );
}