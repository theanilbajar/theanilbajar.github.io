import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import postsData from '../data/posts.json';
import PostCard from '../components/PostCard';

const PER_PAGE = 5;

export default function Posts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const totalPages = Math.ceil(postsData.length / PER_PAGE);
  const start = (currentPage - 1) * PER_PAGE;
  const pagePosts = postsData.slice(start, start + PER_PAGE);

  const goToPage = (page) => {
    setSearchParams({ page: String(page) });
    window.scrollTo(0, 0);
  };

  return (
    <div className="page posts-page">
      <h1 className="page-title">Posts</h1>
      <div className="post-list">
        {pagePosts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            disabled={currentPage <= 1}
            onClick={() => goToPage(currentPage - 1)}
          >
            &laquo; Prev
          </button>
          <div className="pagination-pages">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`pagination-page ${page === currentPage ? 'active' : ''}`}
                onClick={() => goToPage(page)}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            className="pagination-btn"
            disabled={currentPage >= totalPages}
            onClick={() => goToPage(currentPage + 1)}
          >
            Next &raquo;
          </button>
        </div>
      )}
    </div>
  );
}