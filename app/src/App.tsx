// src/App.tsx
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import LoadingScreen from './components/LoadingScreen';
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
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
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
        </Routes>
      </Suspense>
    </HashRouter>
  );
}

export default App;
