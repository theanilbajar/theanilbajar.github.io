import { useParams, Link } from 'react-router-dom';
import postsData from '../data/posts.json';
import PostCard from '../components/PostCard';

export default function Tags() {
  const { tag } = useParams();

  // Collect all tags with counts
  const tagCounts = postsData.reduce((acc, post) => {
    post.tags.forEach(t => {
      acc[t] = (acc[t] || 0) + 1;
    });
    return acc;
  }, {});
  const allTags = Object.keys(tagCounts).sort();

  // If a specific tag is selected, filter posts
  const filteredPosts = tag
    ? postsData.filter(post => post.tags.includes(tag))
    : null;

  if (tag && filteredPosts.length === 0) {
    return (
      <div className="page tags-page">
        <h1 className="page-title">Tags</h1>
        <p>No posts found with tag "{tag}".</p>
        <Link to="/tags">View all tags</Link>
      </div>
    );
  }

  if (tag) {
    return (
      <div className="page tags-page">
        <div className="breadcrumbs">
          <Link to="/">Home</Link> / <Link to="/tags">Tags</Link> / <span>{tag}</span>
        </div>
        <h1 className="page-title">Tag: {tag}</h1>
        <div className="post-list">
          {filteredPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="page tags-page">
      <h1 className="page-title">Tags</h1>
      <div className="tags-cloud">
        {allTags.map(t => (
          <Link
            key={t}
            to={`/tags/${encodeURIComponent(t)}`}
            className="tag-cloud-item"
          >
            {t} ({tagCounts[t]})
          </Link>
        ))}
      </div>
    </div>
  );
}