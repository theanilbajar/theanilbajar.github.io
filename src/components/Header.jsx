import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="site-title">Anil's Blog</Link>
        <nav className="nav">
          <Link to="/posts" className="nav-link">Posts</Link>
          <Link to="/archive" className="nav-link">Archive</Link>
          <Link to="/search" className="nav-link">Search</Link>
          <Link to="/tags" className="nav-link">Tags</Link>
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </nav>
      </div>
    </header>
  );
}