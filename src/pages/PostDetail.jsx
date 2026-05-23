import { useParams, Link } from 'react-router-dom';
import { useMemo } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import postsData from '../data/posts.json';
import TagBadge from '../components/TagBadge';

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

export default function PostDetail() {
  const { postId } = useParams();
  const post = postsData.find(p => p.id === postId);

  const headings = useMemo(() => post ? extractHeadings(post.content) : [], [post]);

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
    <div className="page post-detail-page">
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
          <nav className="toc">
            <h3 className="toc-title">Table of Contents</h3>
            <ul className="toc-list">
              {headings.map((h, i) => (
                <li key={i} className={`toc-item toc-level-${h.level}`}>
                  <a href={`#${h.id}`}>{h.text}</a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <div className="post-detail-content markdown-body">
          <Markdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              h2: ({ children, ...props }) => {
                const text = extractTextFromChildren(children);
                return <h2 id={slugify(text)} {...props}>{children}</h2>;
              },
              h3: ({ children, ...props }) => {
                const text = extractTextFromChildren(children);
                return <h3 id={slugify(text)} {...props}>{children}</h3>;
              },
              h4: ({ children, ...props }) => {
                const text = extractTextFromChildren(children);
                return <h4 id={slugify(text)} {...props}>{children}</h4>;
              }
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
        </div>
      </article>

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
    </div>
  );
}