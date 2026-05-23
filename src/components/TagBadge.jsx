import { Link } from 'react-router-dom';

export default function TagBadge({ tag }) {
  return (
    <Link to={`/tags/${encodeURIComponent(tag)}`} className="tag-badge">
      {tag}
    </Link>
  );
}