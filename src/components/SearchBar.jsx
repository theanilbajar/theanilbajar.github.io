import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import postsData from '../data/posts.json';

export default function SearchBar({ placeholder }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowResults(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([]);
      return;
    }
    const q = query.toLowerCase();
    const filtered = postsData.filter(post =>
      post.title.toLowerCase().includes(q) ||
      post.content.toLowerCase().includes(q) ||
      post.tags.some(tag => tag.toLowerCase().includes(q))
    );
    setResults(filtered);
    setShowResults(true);
  }, [query]);

  return (
    <div className="search-wrapper" ref={wrapperRef}>
      <div className="search-input-wrapper">
        <input
          type="search"
          className="search-input"
          placeholder={placeholder || "Search posts..."}
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setShowResults(true)}
        />
      </div>
      {showResults && results.length > 0 && (
        <div className="search-results">
          {results.map(post => (
            <Link
              key={post.id}
              to={`/posts/${post.id}`}
              className="search-result-item"
              onClick={() => { setShowResults(false); setQuery(''); }}
            >
              <span className="search-result-title">{post.title}</span>
              <span className="search-result-date">
                {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </Link>
          ))}
        </div>
      )}
      {showResults && query.trim() && results.length === 0 && (
        <div className="search-results">
          <div className="search-result-empty">No posts found.</div>
        </div>
      )}
    </div>
  );
}