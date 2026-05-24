import { Link } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScroll, setLastScroll] = useState(0);

  const handleScroll = useCallback(() => {
    const currentScroll = window.scrollY;
    if (currentScroll > 80 && currentScroll > lastScroll) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    setLastScroll(currentScroll);
  }, [lastScroll]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Close menu on route change (via link click)
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`header ${hidden ? 'header--hidden' : ''}`}>
      <div className="header-inner">
        <Link to="/" className="site-title" onClick={closeMenu}>Anil's Blog</Link>
        <button
          className={`hamburger ${menuOpen ? 'hamburger--active' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>
        <nav className={`nav ${menuOpen ? 'nav--open' : ''}`}>
          <Link to="/posts" className="nav-link" onClick={closeMenu}>Posts</Link>
          <Link to="/archive" className="nav-link" onClick={closeMenu}>Archive</Link>
          <Link to="/search" className="nav-link" onClick={closeMenu}>Search</Link>
          <Link to="/tags" className="nav-link" onClick={closeMenu}>Tags</Link>
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </nav>
      </div>
      {/* Overlay for mobile */}
      {menuOpen && <div className="nav-overlay" onClick={closeMenu} />}
    </header>
  );
}