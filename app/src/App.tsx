// src/App.tsx
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import LoadingScreen from './components/LoadingScreen';
import ScrollToTop from './components/ScrollToTop';

const Home = lazy(() => import('./pages/Home'));
const ArticleDetail = lazy(() => import('./pages/ArticleDetail'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));

function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/articles/:slug" element={<ArticleDetail />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
        </Routes>
      </Suspense>
    </HashRouter>
  );
}

export default App;
