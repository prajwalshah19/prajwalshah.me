// src/App.tsx
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import LoadingScreen from './components/LoadingScreen';
import ScrollToTop from './components/ScrollToTop';

// Lazy load pages for performance
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Projects = lazy(() => import('./pages/Projects'));
const More = lazy(() => import('./pages/More'));
const Contact = lazy(() => import('./pages/Contact'));

function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/more" element={<More />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Suspense>
    </HashRouter>
  );
}

export default App;
