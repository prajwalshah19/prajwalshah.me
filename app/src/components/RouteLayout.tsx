import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import ContentPage from './ContentPage';
import ErrorBoundary from './ErrorBoundary';
import LoadingScreen from './LoadingScreen';

export default function RouteLayout() {
  const { pathname } = useLocation();
  return (
    <ContentPage>
      <ErrorBoundary key={pathname} compact>
        <Suspense fallback={<LoadingScreen />}>
          <Outlet />
        </Suspense>
      </ErrorBoundary>
    </ContentPage>
  );
}
