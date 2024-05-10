import ReactDOM from 'react-dom/client'
import '@/index.css'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Outlet, Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import { ReduxProvider } from '@/redux/provider';
import { Toaster } from 'react-hot-toast';
import AppInitializer from './lib/appInitializer';
import { ThemeProvider } from './components/themeProvider';
import LandingPage from './views/landing';
import LoginPage from './views/authentication/login';
import RegisterPage from './views/authentication/register';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Outlet />}>
      <Route index element={<LandingPage />} />

      {/* Authentication */}
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />
    </Route>
  )
)

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchIntervalInBackground: false,
      staleTime: 10000,
      refetchOnWindowFocus: false,
    }
  }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ReduxProvider>
    <QueryClientProvider client={queryClient}>
      <AppInitializer>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <RouterProvider router={router} />
        </ThemeProvider>
      </AppInitializer>
      <Toaster position='top-right' />
    </QueryClientProvider>
  </ReduxProvider>,
)
