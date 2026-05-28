// App.js — Router, layout wrapper, protected route guard
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar   from './components/Navbar';
import Footer   from './components/Footer';
import Home     from './pages/Home';
import Products from './pages/Products';
import Product  from './pages/Product';
import Login    from './pages/Login';
import Register from './pages/Register';
import Admin    from './pages/Admin';
import Contact  from './pages/Contact';

// Redirect unauthenticated or non-admin users
function Protected({ admin = false, children }) {
  const { user, ready } = useAuth();
  if (!ready) return <div className="flex-center" style={{height:'60vh'}}><div className="spinner"/></div>;
  if (!user)  return <Navigate to="/login" replace />;
  if (admin && user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: '80vh' }}>{children}</main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/"         element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<Product />} />
            <Route path="/contact"  element={<Contact />} />
            <Route path="/login"    element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin"    element={<Protected admin><Admin /></Protected>} />
            <Route path="*"         element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}
