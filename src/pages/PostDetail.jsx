import { useParams, Link } from 'react-router-dom';
import { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import postsData from '../data/posts.json';
import TagBadge from '../components/TagBadge';
import ImageLightbox from '../components/ImageLightbox';

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function extractTextFromChildren(children) {
  if (typeof children === 'string') return children;
  if (Array.isArray(children)) {
    return children.map(child => extractTextFromChildren(child)).join('');
  }
  if (children?.props?.children) return extractTextFromChildren(children.props.children);
  if (children?.props?.node?.children) {
    return children.props.node.children.map(n => n.value || '').join('');
  }
  return '';
}

function extractHeadings(markdown) {
  const regex = /^(#{1,3})\s+(.+)$/gm;
  const headings = [];
  let match;
  while ((match = regex.exec(markdown)) !== null) {
    headings.push({
      level: match[1].length,
      text: match[2],
      id: slugify(match[2])
    });
  }
  return headings;
}

function getRelatedPosts(currentPost, allPosts, max = 3) {
  const tagSet = new Set(currentPost.tags);
  const scored = allPosts
    .filter(p => p.id !== currentPost.id)
    .map(p => ({
      ...p,
      score: p.tags.filter(t => tagSet.has(t)).length,
    }))
    .filter(p => p.score > 0)
    .sort((a, b) => b.score - a.score || new Date(b.date) - new Date(a.date));
  return scored.slice(0, max);
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button className="copy-btn" onClick={handleCopy} aria-label="Copy code">
      {copied ? '✓' : '📋'}
    </button>
  );
}

function HeadingLink({ level: Tag, id, children }) {
  const [tooltip, setTooltip] = useState('');

  const handleCopyLink = (e) => {
    e.preventDefault();
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    navigator.clipboard.writeText(url).then(() => {
      setTooltip('Copied!');
      setTimeout(() => setTooltip(''), 1500);
    });
  };

  return (
    <Tag id={id} className="heading-with-link" style={{ position: 'relative' }}>
      <a href={`#${id}`} className="heading-link" onClick={handleCopyLink} aria-label="Copy link to heading">#</a>
      {children}
      {tooltip && <span className="heading-copy-tooltip">{tooltip}</span>}
    </Tag>
  );
}

export default function PostDetail() {
  const { postId } = useParams();
  const post = postsData.find(p => p.id === postId);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [tocOpen, setTocOpen] = useState(true);
  const [activeHeadingId, setActiveHeadingId] = useState('');
  const [lightboxSrc, setLightboxSrc] = useState(null);
  const [lightboxAlt, setLightboxAlt] = useState('');
  const tocRef = useRef(null);
  const contentRef = useRef(null);

  const headings = useMemo(() => post ? extractHeadings(post.content) : [], [post]);
  const relatedPosts = useMemo(() => post ? getRelatedPosts(post, postsData) : [], [post]);

  const handleScroll = useCallback(() => {
    const winScroll = document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    setScrollProgress(Math.min(parseInt((winScroll / height) * 100), 100));
    setShowBackToTop(winScroll > 400);
  }, []);

  // Scroll-active TOC via IntersectionObserver
  useEffect(() => {
    if (!headings.length || headings.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveHeadingId(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -70% 0px' }
    );

    headings.forEach(h => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Keyboard shortcut: Escape to close lightbox
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape' && lightboxSrc) {
        setLightboxSrc(null);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxSrc]);

  if (!post) {
    return (
      <div className="page">
        <h1>Post not found</h1>
        <Link to="/posts">Back to posts</Link>
      </div>
    );
  }

  const date = new Date(post.date);
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  const currentIndex = postsData.findIndex(p => p.id === postId);
  const prevPost = currentIndex > 0 ? postsData[currentIndex - 1] : null;
  const nextPost = currentIndex < postsData.length - 1 ? postsData[currentIndex + 1] : null;

  const readingTime = Math.ceil(post.content.split(/\s+/).length / 200);

  const shareUrl = window.location.href;
  const shareText = encodeURIComponent(`Check out: ${post.title}`);

  return (
    <div className="page post-detail-page" ref={contentRef}>
      {/* Reading progress bar */}
      <div className="progress-bar" style={{ width: `${scrollProgress}%` }} />

      <nav className="breadcrumbs">
        <Link to="/">Home</Link> / <Link to="/posts">Posts</Link> / <span>{post.title}</span>
      </nav>

      <article className="post-detail">
        <header className="post-detail-header">
          <h1 className="post-detail-title">{post.title}</h1>
          <div className="post-detail-meta">
            <time dateTime={post.date}>{formattedDate}</time>
            <span className="reading-time">~{readingTime} min read</span>
          </div>
          <div className="post-detail-tags">
            {post.tags.map(tag => <TagBadge key={tag} tag={tag} />)}
          </div>
        </header>

        {headings.length > 0 && (
          <nav className={`toc ${tocOpen ? 'toc--open' : ''}`} ref={tocRef}>
            <button
              className="toc-toggle"
              onClick={() => setTocOpen(!tocOpen)}
              aria-expanded={tocOpen}
            >
              <span className="toc-title">Table of Contents</span>
              <span className="toc-chevron">{tocOpen ? '▼' : '▶'}</span>
            </button>
            <div className="toc-collapse">
              <ul className="toc-list">
                {headings.map((h, i) => (
                  <li key={i} className={`toc-item toc-level-${h.level} ${activeHeadingId === h.id ? 'toc-item--active' : ''}`}>
                    <a href={`#${h.id}`} onClick={() => setTocOpen(false)}>{h.text}</a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        )}

        <div className="post-detail-content markdown-body">
          <Markdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeHighlight]}
            components={{
              h2: ({ children, ...props }) => {
                const text = extractTextFromChildren(children);
                return <HeadingLink level="h2" id={slugify(text)}>{children}</HeadingLink>;
              },
              h3: ({ children, ...props }) => {
                const text = extractTextFromChildren(children);
                return <HeadingLink level="h3" id={slugify(text)}>{children}</HeadingLink>;
              },
              h4: ({ children, ...props }) => {
                const text = extractTextFromChildren(children);
                return <HeadingLink level="h4" id={slugify(text)}>{children}</HeadingLink>;
              },
              img: ({ src, alt, ...props }) => (
                <span className="lightbox-trigger-wrapper">
                  <img
                    src={src}
                    alt={alt || ''}
                    className="post-image"
                    onClick={() => { setLightboxSrc(src); setLightboxAlt(alt || ''); }}
                    style={{ cursor: 'pointer' }}
                    loading="lazy"
                    {...props}
                  />
                </span>
              ),
              pre: ({ children }) => {
                const codeText = extractTextFromChildren(children);
                return (
                  <div className="code-block-wrapper">
                    <CopyButton text={codeText} />
                    <pre>{children}</pre>
                  </div>
                );
              },
            }}
          >
            {post.content}
          </Markdown>
        </div>

        <div className="share-buttons">
          <a
            href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="share-btn"
          >
            Share on X
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="share-btn"
          >
            Share on LinkedIn
          </a>
          <button
            className="share-btn"
            onClick={() => {
              navigator.clipboard.writeText(shareUrl);
              alert('Link copied!');
            }}
          >
            Copy Link
          </button>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="related-posts">
          <h2 className="section-title related-posts-title">Related Posts</h2>
          <div className="related-posts-grid">
            {relatedPosts.map(rp => (
              <Link key={rp.id} to={`/posts/${rp.id}`} className="related-post-card">
                <div className="related-post-card-tags">
                  {rp.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="tag-badge">{tag}</span>
                  ))}
                </div>
                <h3 className="related-post-card-title">{rp.title}</h3>
                <span className="related-post-card-date">
                  {new Date(rp.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <nav className="post-nav">
        {prevPost && (
          <Link to={`/posts/${prevPost.id}`} className="post-nav-link post-nav-prev">
            <span className="post-nav-label">← Previous</span>
            <span className="post-nav-title">{prevPost.title}</span>
          </Link>
        )}
        {nextPost && (
          <Link to={`/posts/${nextPost.id}`} className="post-nav-link post-nav-next">
            <span className="post-nav-label">Next →</span>
            <span className="post-nav-title">{nextPost.title}</span>
          </Link>
        )}
      </nav>

      {/* Back to top button */}
      {showBackToTop && (
        <button
          className="back-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
        >
          ↑
        </button>
      )}

      {/* Image Lightbox */}
      {lightboxSrc && (
        <ImageLightbox src={lightboxSrc} alt={lightboxAlt} onClose={() => setLightboxSrc(null)} />
      )}
    </div>
  );
}