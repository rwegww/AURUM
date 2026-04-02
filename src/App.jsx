import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Home from '@/pages/student/Home'
import PeriodicTable from '@/pages/student/PeriodicTable'
import Lessons from '@/pages/student/Lessons'
import LessonPage from '@/pages/student/LessonPage'
import Classroom from '@/pages/student/Classroom'
import GradeJourney from '@/pages/student/GradeJourney'
import StageIntro from '@/pages/student/StageIntro'
import StageChallenge from '@/pages/student/StageChallenge'
import StageReward from '@/pages/student/StageReward'
import Lectures from '@/pages/student/Lectures'
import ChemLab from '@/pages/student/ChemLab'
import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'
import AuthCallback from '@/pages/auth/AuthCallback'
import AdminDashboard from '@/pages/admin/AdminDashboard'
import LessonManager from '@/pages/admin/LessonManager'
import UserManager from '@/pages/admin/UserManager'
import FeedbackManager from '@/pages/admin/FeedbackManager'
import Navbar from '@/components/navigation/Navbar'
import FeedbackButton from '@/components/common/FeedbackButton'
import { AuthProvider } from '@/context/AuthContext'

function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/auth/callback';
  const isImmersivePage = location.pathname.includes('/journey/') && (
    location.pathname.endsWith('/intro') || 
    location.pathname.endsWith('/challenge') || 
    location.pathname.endsWith('/reward')
  );

  return (
    <>
      {!isAuthPage && !isImmersivePage && <Navbar />}
      <Routes>
        {/* Student Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/periodic-table" element={<PeriodicTable />} />
        <Route path="/classroom" element={<Classroom />} />
        <Route path="/classroom/:grade/journey" element={<GradeJourney />} />
        <Route path="/classroom/:grade/journey/:lessonId/intro" element={<StageIntro />} />
        <Route path="/classroom/:grade/journey/:lessonId/challenge" element={<StageChallenge />} />
        <Route path="/classroom/:grade/journey/:lessonId/reward" element={<StageReward />} />
        <Route path="/lectures" element={<Lectures />} />
        <Route path="/lessons" element={<Lessons />} />
        <Route path="/lessons/:grade" element={<Lessons />} />
        <Route path="/lessons/:grade/:lessonId" element={<LessonPage />} />
        <Route path="/lab" element={<ChemLab />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/lessons" element={<LessonManager />} />
        <Route path="/admin/users" element={<UserManager />} />
        <Route path="/admin/feedback" element={<FeedbackManager />} />
      </Routes>
      
      {/* Floating Student Feedback UI */}
      <FeedbackButton />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

export default App
