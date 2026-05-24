import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';

const Posts = lazy(() => import('./pages/Posts'));
const PostDetail = lazy(() => import('./pages/PostDetail'));
const Archive = lazy(() => import('./pages/Archive'));
const Search = lazy(() => import('./pages/Search'));
const Tags = lazy(() => import('./pages/Tags'));

function PageSkeleton() {
  return (
    <div className="page">
      <div className="skeleton skeleton-hero" />
      <div className="skeleton-grid">
        {[1, 2, 3].map(i => (
          <div key={i} className="skeleton skeleton-card">
            <div className="skeleton-line skeleton-line--short" />
            <div className="skeleton-line" />
            <div className="skeleton-line skeleton-line--medium" />
            <div className="skeleton-line skeleton-line--long" />
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="app">
          <Header />
          <main className="main">
            <Suspense fallback={<PageSkeleton />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/posts" element={<Posts />} />
                <Route path="/posts/:postId" element={<PostDetail />} />
                <Route path="/archive" element={<Archive />} />
                <Route path="/search" element={<Search />} />
                <Route path="/tags" element={<Tags />} />
                <Route path="/tags/:tag" element={<Tags />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;