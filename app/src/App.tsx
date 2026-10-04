// src/App.tsx
import { HashRouter, Routes, Route } from 'react-router-dom';
import { lazy } from 'react';
import RouteLayout from './components/RouteLayout';
import ScrollToTop from './components/ScrollToTop';

const Home = lazy(() => import('./pages/Home'));
const CollectionPage = lazy(() => import('./pages/CollectionPage'));
const ArticleDetail = lazy(() => import('./pages/ArticleDetail'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const Board = lazy(() => import('./pages/Board'));
const BoardDetail = lazy(() => import('./pages/BoardDetail'));

function App() {
  return (
    <HashRouter>
      <ScrollToTop />
        <Routes>
          <Route element={<RouteLayout />}>
          <Route path="/" element={<Home />} />
          <Route
            path="/experience"
            element={<CollectionPage category="experience" />}
          />
          <Route
            path="/projects"
            element={<CollectionPage category="projects" />}
          />
          <Route
            path="/writing"
            element={<CollectionPage category="writing" />}
          />
          <Route path="/articles/:slug" element={<ArticleDetail />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/board" element={<Board />} />
          <Route path="/board/:slug" element={<BoardDetail />} />
            <Route path="*" element={<p className="p-8 text-center">Page not found</p>} />
          </Route>
        </Routes>
    </HashRouter>
  );
}

export default App;
