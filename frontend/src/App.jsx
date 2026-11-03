import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { SocketProvider } from './context/SocketProvider';
import NotificationToast from './components/NotificationToast';
import ForceLogoutListener from './components/ForceLogoutListener';
import ProtectedRoute from './components/ProtectedRoute';
import RoleRoute from './components/RoleRoute';
import GuestRoute from './components/GuestRoute';
import Portfolio from './pages/Portfolio';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Notes from './pages/Notes';
import InterviewPrep from './pages/InterviewPrep';
import ResumeBuilder from './pages/ResumeBuilder';
import PortfolioEditor from './pages/PortfolioEditor';
import AdminDashboard from './pages/AdminDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import LearningTracker from './pages/LearningTracker';
import TodoBoard from './pages/TodoBoard';
import BookmarkManager from './pages/BookmarkManager';
import ProjectTracker from './pages/ProjectTracker';
import NotificationsPage from './pages/NotificationsPage';

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <SocketProvider>
          <BrowserRouter>
            <ForceLogoutListener />
            <NotificationToast />
            <Routes>
              {/* Public portfolio */}
              <Route path="/"               element={<Portfolio />} />
              <Route path="/login"          element={<GuestRoute><Login /></GuestRoute>} />
              <Route path="/register"       element={<Navigate to="/" replace />} />
              <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />

              {/* Private — any authenticated user */}
              <Route path="/dashboard" element={
                <ProtectedRoute><Dashboard /></ProtectedRoute>
              } />
              <Route path="/notifications" element={
                <ProtectedRoute><NotificationsPage /></ProtectedRoute>
              } />
              <Route path="/notes" element={
                <ProtectedRoute><Notes /></ProtectedRoute>
              } />
              <Route path="/interview" element={
                <ProtectedRoute><InterviewPrep /></ProtectedRoute>
              } />
              <Route path="/resume" element={
                <ProtectedRoute><ResumeBuilder /></ProtectedRoute>
              } />
              <Route path="/portfolio-editor" element={
                <ProtectedRoute><PortfolioEditor /></ProtectedRoute>
              } />
              <Route path="/learning" element={
                <ProtectedRoute><LearningTracker /></ProtectedRoute>
              } />
              <Route path="/todos" element={
                <ProtectedRoute><TodoBoard /></ProtectedRoute>
              } />
              <Route path="/bookmarks" element={
                <ProtectedRoute><BookmarkManager /></ProtectedRoute>
              } />
              <Route path="/projects" element={
                <ProtectedRoute><ProjectTracker /></ProtectedRoute>
              } />

              {/* Role-gated */}
              <Route path="/admin" element={
                <RoleRoute roles={['admin', 'super_admin']}><AdminDashboard /></RoleRoute>
              } />
              <Route path="/super-admin" element={
                <RoleRoute roles={['super_admin']}><SuperAdminDashboard /></RoleRoute>
              } />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </SocketProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}
