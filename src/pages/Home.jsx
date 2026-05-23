import postsData from '../data/posts.json';
import PostCard from '../components/PostCard';

export default function Home() {
  return (
    <div className="page home-page">
      <div className="home-info">
        <h1 className="home-title">Anil's Blog</h1>
        <p className="home-description">👋 Hi, this is Anil. Sharing my learnings and new research notes.</p>
      </div>
      <div className="post-list">
        {postsData.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}