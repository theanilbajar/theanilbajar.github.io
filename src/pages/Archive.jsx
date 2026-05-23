import { Link } from 'react-router-dom';
import postsData from '../data/posts.json';

export default function Archive() {
  const groupedByYear = postsData.reduce((acc, post) => {
    const year = new Date(post.date).getFullYear();
    if (!acc[year]) acc[year] = [];
    acc[year].push(post);
    return acc;
  }, {});

  const years = Object.keys(groupedByYear).sort((a, b) => b - a);

  return (
    <div className="page archive-page">
      <h1 className="page-title">Archive</h1>
      {years.map(year => (
        <div key={year} className="archive-year">
          <h2 className="archive-year-title">{year}</h2>
          <ul className="archive-list">
            {groupedByYear[year]
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map(post => {
                const date = new Date(post.date);
                const formatted = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
                return (
                  <li key={post.id} className="archive-item">
                    <span className="archive-date">{formatted}</span>
                    <Link to={`/posts/${post.id}`} className="archive-link">{post.title}</Link>
                  </li>
                );
              })}
          </ul>
        </div>
      ))}
    </div>
  );
}