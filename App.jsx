import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Link, NavLink, Navigate, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import HomePage from './pages/HomePage.jsx';
import RoomsPage from './pages/RoomsPage.jsx';
import RoomDetailPage from './pages/RoomDetailPage.jsx';
import BookingPage from './pages/BookingPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const authAxios = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('hotelUser');
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const { data } = await authAxios.get('/auth/me');
      if (data?.user) {
        setUser(data.user);
        localStorage.setItem('hotelUser', JSON.stringify(data.user));
      }
    } catch {
      setUser(null);
      localStorage.removeItem('hotelUser');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const logout = async () => {
    try {
      await authAxios.post('/auth/logout');
    } catch (error) {
      console.warn('Logout request failed:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('hotelUser');
    }
  };

  const value = useMemo(() => ({ user, setUser, logout, refreshUser, loading }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Rooms', path: '/rooms' },
    { label: 'About Us', path: '/about' },
    { label: 'Facilities', path: '/#facilities' },
    { label: 'Gallery', path: '/#gallery' },
    { label: 'Restaurant', path: '/#restaurant' },
    { label: 'Offers', path: '/#offers' },
    { label: 'Booking', path: '/booking' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="section-shell flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-50 text-lg font-bold text-brand-700">HS</div>
          <div>
            <div className="font-serif text-2xl font-bold text-slate-900">Hotel Serenade</div>
            <div className="text-[10px] uppercase tracking-[0.35em] text-slate-500">Luxury Stay</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `text-sm font-medium transition ${isActive ? 'text-brand-700' : 'text-slate-700 hover:text-brand-700'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          {user ? (
            <>
              <Link to="/profile" className="text-sm font-medium text-slate-700 hover:text-brand-700">{user.fullName}</Link>
              {['super_admin', 'hotel_manager', 'receptionist'].includes(user.role) && (
                <Link to="/admin" className="button-secondary">Admin</Link>
              )}
              <button onClick={logout} className="button-primary">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-slate-700 hover:text-brand-700">Login</Link>
              <Link to="/register" className="button-primary">Register</Link>
            </>
          )}
        </div>

        <button className="rounded-xl border border-slate-200 p-2 lg:hidden" onClick={() => setMenuOpen((v) => !v)} aria-label="Toggle navigation">
          ☰
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-3">
            {navItems.map((item) => (
              <NavLink key={item.path} to={item.path} className="text-sm font-medium text-slate-700" onClick={() => setMenuOpen(false)}>
                {item.label}
              </NavLink>
            ))}
            {user ? (
              <>
                <Link to="/profile" className="text-sm font-medium text-slate-700" onClick={() => setMenuOpen(false)}>Profile</Link>
                <button onClick={logout} className="button-primary w-full">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="button-secondary w-full" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/register" className="button-primary w-full" onClick={() => setMenuOpen(false)}>Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-16 bg-slate-900 text-slate-200">
      <div className="section-shell grid gap-10 py-12 md:grid-cols-4">
        <div>
          <div className="font-serif text-3xl font-bold text-white">Hotel Serenade</div>
          <p className="mt-4 text-sm text-slate-300">A refined destination for comfort, travel, dining, and memorable stays in the heart of the city.</p>
        </div>
        <div>
          <h3 className="mb-4 text-lg font-semibold text-white">Contact</h3>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>12 River Avenue, Downtown</li>
            <li>+1 (415) 555-0188</li>
            <li>hello@hotelserenade.com</li>
          </ul>
        </div>
        <div>
          <h3 className="mb-4 text-lg font-semibold text-white">Quick Links</h3>
          <ul className="space-y-2 text-sm text-slate-300">
            <li><Link to="/rooms">Rooms</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/booking">Book Now</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-4 text-lg font-semibold text-white">Policies</h3>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>Privacy Policy</li>
            <li>Terms & Conditions</li>
            <li>Cancellation Policy</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-700 py-5 text-center text-sm text-slate-400">© 2026 Hotel Serenade. All rights reserved.</div>
    </footer>
  );
}

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="section-shell py-12 text-center text-slate-500">Loading ...</div>;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (adminOnly && !['super_admin', 'hotel_manager', 'receptionist'].includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function Layout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/rooms" element={<RoomsPage />} />
          <Route path="/rooms/:id" element={<RoomDetailPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboardPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Layout />
    </AuthProvider>
  );
}
