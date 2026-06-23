import { Outlet, useLocation } from 'react-router';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Toaster } from '../components/ui/sonner';

export function RootLayout() {
  const location = useLocation();
  
  // Don't show navbar/footer on login page
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="flex flex-col min-h-screen">
      {!isLoginPage && <Navbar />}
      <main className="flex-1">
        <Outlet />
      </main>
      {!isLoginPage && <Footer />}
      <Toaster />
    </div>
  );
}
