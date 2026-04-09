import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Home from '@/pages/student/Home'
import PeriodicTable from '@/pages/student/PeriodicTable'
import Lessons from '@/pages/student/Lessons'
import LessonPage from '@/pages/student/LessonPage'
import Classroom from '@/pages/student/Classroom'
import MyClass from '@/pages/student/MyClass'
import GradeJourney from '@/pages/student/GradeJourney'
import StageIntro from '@/pages/student/StageIntro'
import StageChallenge from '@/pages/student/StageChallenge'
import StageReward from '@/pages/student/StageReward'
import Lectures from '@/pages/student/Lectures'
import ChemLab from '@/pages/student/ChemLab'
import LabSimulatorPage from '@/pages/student/LabSimulatorPage'
import LabBalancerPage from '@/pages/student/LabBalancerPage'
import LabMoleculePage from '@/pages/student/LabMoleculePage'
import Arena from '@/pages/student/Arena'
import Library from '@/pages/student/Library'
import MaterialDetail from '@/pages/student/MaterialDetail'
import Missions from '@/pages/student/Missions'
import About from '@/pages/student/About'
import Contact from '@/pages/student/Contact'
import Terms from '@/pages/student/Terms'
import Profile from '@/pages/student/Profile'
import Login from '@/pages/auth/Login'

import Register from '@/pages/auth/Register'
import AuthCallback from '@/pages/auth/AuthCallback'
import AdminDashboard from '@/pages/admin/AdminDashboard'
import LessonManager from '@/pages/admin/LessonManager'
import UserManager from '@/pages/admin/UserManager'
import FeedbackManager from '@/pages/admin/FeedbackManager'
import TeacherDashboard from '@/pages/teacher/TeacherDashboard'
import ClassManager from '@/pages/teacher/ClassManager'
import ClassDetail from '@/pages/teacher/ClassDetail'
import AssignmentManager from '@/pages/teacher/AssignmentManager'
import Navbar from '@/components/navigation/Navbar'
import AdminLayout from '@/components/layout/AdminLayout'
import TeacherLayout from '@/components/layout/TeacherLayout'
import FeedbackButton from '@/components/common/FeedbackButton'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { AuthProvider } from '@/context/AuthContext'

function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/auth/callback';
  const isImmersivePage = location.pathname.includes('/journey/') && (
    location.pathname.endsWith('/intro') || 
    location.pathname.endsWith('/challenge') || 
    location.pathname.endsWith('/reward')
  );

  const isManagementPage = location.pathname.startsWith('/admin') || location.pathname.startsWith('/teacher');

  return (
    <>
      {!isAuthPage && !isImmersivePage && !isManagementPage && <Navbar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/lectures" element={<Lectures />} />
        <Route path="/lessons" element={<Lessons />} />
        <Route path="/lessons/:grade" element={<Lessons />} />
        <Route path="/lessons/:grade/:lessonId" element={<LessonPage />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Protected Student Routes */}
        <Route path="/periodic-table" element={<ProtectedRoute><PeriodicTable /></ProtectedRoute>} />
        <Route path="/classroom" element={<ProtectedRoute><Classroom /></ProtectedRoute>} />
        <Route path="/my-class" element={<ProtectedRoute><MyClass /></ProtectedRoute>} />
        <Route path="/classroom/:grade/journey" element={<ProtectedRoute><GradeJourney /></ProtectedRoute>} />
        <Route path="/classroom/:grade/journey/:lessonId/intro" element={<ProtectedRoute><StageIntro /></ProtectedRoute>} />
        <Route path="/classroom/:grade/journey/:lessonId/challenge" element={<ProtectedRoute><StageChallenge /></ProtectedRoute>} />
        <Route path="/classroom/:grade/journey/:lessonId/reward" element={<ProtectedRoute><StageReward /></ProtectedRoute>} />
        <Route path="/lab" element={<ProtectedRoute><ChemLab /></ProtectedRoute>} />
        <Route path="/lab/simulator" element={<ProtectedRoute><LabSimulatorPage /></ProtectedRoute>} />
        <Route path="/lab/balancer" element={<ProtectedRoute><LabBalancerPage /></ProtectedRoute>} />
        <Route path="/lab/molecules" element={<ProtectedRoute><LabMoleculePage /></ProtectedRoute>} />
        <Route path="/arena" element={<ProtectedRoute><Arena /></ProtectedRoute>} />
        <Route path="/library" element={<ProtectedRoute><Library /></ProtectedRoute>} />
        <Route path="/library/:id" element={<ProtectedRoute><MaterialDetail /></ProtectedRoute>} />
        <Route path="/missions" element={<ProtectedRoute><Missions /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        {/* Protected Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
           <Route index element={<AdminDashboard />} />
           <Route path="lessons" element={<LessonManager />} />
           <Route path="users" element={<UserManager />} />
           <Route path="feedback" element={<FeedbackManager />} />
        </Route>

        {/* Protected Teacher Routes */}
        <Route path="/teacher" element={<ProtectedRoute><TeacherLayout /></ProtectedRoute>}>
           <Route index element={<TeacherDashboard />} />
           <Route path="classes" element={<ClassManager />} />
           <Route path="classes/:id" element={<ClassDetail />} />
           <Route path="assignments" element={<AssignmentManager />} />
        </Route>
      </Routes>
      
      {/* Floating Student Feedback UI */}
      {!isManagementPage && <FeedbackButton />}
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
