import { Link } from 'react-router-dom';
import TagBadge from './TagBadge';

export default function PostCard({ post }) {
  const date = new Date(post.date);
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <article className="post-card">
      <h2 className="post-card-title">
        <Link to={`/posts/${post.id}`}>{post.title}</Link>
      </h2>
      <div className="post-card-meta">
        <time dateTime={post.date}>{formattedDate}</time>
        <span className="reading-time">~{Math.ceil(post.content.split(/\s+/).length / 200)} min read</span>
      </div>
      <div className="post-card-tags">
        {post.tags.map(tag => <TagBadge key={tag} tag={tag} />)}
      </div>
    </article>
  );
}