import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './features/auth/LoginPage';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import UsersPage from './pages/UsersPage';
import ProductsPage from './pages/ProductsPage';
import ProtectedRoute from './components/protected-route';
import CartPage from './features/transactions/CartPage';
import TransactionHistory from './features/transactions/TransactionHistory';
import AdminTransactionPage from './features/transactions/AdminTransactionPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path='/login' element={<LoginPage />} />

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
        <Route path='/dashboard' element={<DashboardPage />} />
        <Route path='/users' element={<UsersPage />} />
        <Route path='/products' element={<ProductsPage />} />
        <Route path='/cart' element={<CartPage />} />
        <Route path='/transactions' element={<TransactionHistory />} />
        <Route path='/admin/transactions' element={<AdminTransactionPage />} />
      </Route>

      <Route path='*' element={<Navigate to='/dashboard' />} />
    </Routes>
  );
}
