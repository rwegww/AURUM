import React, { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'

// Common Components (Static - small & frequently used)
import { AuthProvider } from '@/context/AuthContext'
import Navbar from '@/components/navigation/Navbar'
import FeedbackButton from '@/components/common/FeedbackButton'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import LoadingScreen from '@/components/common/LoadingScreen'

// Lazy Loaded Student Pages
const Home = lazy(() => import('@/pages/student/Home'));
const PeriodicTable = lazy(() => import('@/pages/student/PeriodicTable'));
const Lessons = lazy(() => import('@/pages/student/Lessons'));
const LessonPage = lazy(() => import('@/pages/student/LessonPage'));
const Classroom = lazy(() => import('@/pages/student/Classroom'));
const MyClass = lazy(() => import('@/pages/student/MyClass'));
const GradeJourney = lazy(() => import('@/pages/student/GradeJourney'));
const StageIntro = lazy(() => import('@/pages/student/StageIntro'));
const StageChallenge = lazy(() => import('@/pages/student/StageChallenge'));
const StageReward = lazy(() => import('@/pages/student/StageReward'));
const Lectures = lazy(() => import('@/pages/student/Lectures'));
const ChemLab = lazy(() => import('@/pages/student/ChemLab'));
const LabSimulatorPage = lazy(() => import('@/pages/student/LabSimulatorPage'));
const LabBalancerPage = lazy(() => import('@/pages/student/LabBalancerPage'));
const LabMoleculePage = lazy(() => import('@/pages/student/LabMoleculePage'));
const Arena = lazy(() => import('@/pages/student/Arena'));
const Library = lazy(() => import('@/pages/student/Library'));
const MaterialDetail = lazy(() => import('@/pages/student/MaterialDetail'));
const Missions = lazy(() => import('@/pages/student/Missions'));
const About = lazy(() => import('@/pages/student/About'));
const Contact = lazy(() => import('@/pages/student/Contact'));
const Terms = lazy(() => import('@/pages/student/Terms'));
const Profile = lazy(() => import('@/pages/student/Profile'));
const KnowledgeMap = lazy(() => import('@/pages/student/KnowledgeMap'));

// Lazy Loaded Auth Pages
const Login = lazy(() => import('@/pages/auth/Login'));
const Register = lazy(() => import('@/pages/auth/Register'));
const AuthCallback = lazy(() => import('@/pages/auth/AuthCallback'));

// Lazy Loaded Admin Modules
const AdminLayout = lazy(() => import('@/components/layout/AdminLayout'));
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const LessonManager = lazy(() => import('@/pages/admin/LessonManager'));
const UserManager = lazy(() => import('@/pages/admin/UserManager'));
const UserDetail = lazy(() => import('@/pages/admin/UserDetail'));
const FeedbackManager = lazy(() => import('@/pages/admin/FeedbackManager'));

// Lazy Loaded Teacher Modules
const TeacherLayout = lazy(() => import('@/components/layout/TeacherLayout'));
const TeacherDashboard = lazy(() => import('@/pages/teacher/TeacherDashboard'));
const ClassManager = lazy(() => import('@/pages/teacher/ClassManager'));
const ClassDetail = lazy(() => import('@/pages/teacher/ClassDetail'));
const AssignmentManager = lazy(() => import('@/pages/teacher/AssignmentManager'));

import AurumAiAgent from '@/components/common/AurumAiAgent'

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
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* ... standard routes ... */}
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
          <Route path="/auth" element={<Navigate to="/login" replace />} />

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
          <Route path="/knowledge-map" element={<ProtectedRoute><KnowledgeMap /></ProtectedRoute>} />

          {/* Protected Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
             <Route index element={<AdminDashboard />} />
             <Route path="lessons" element={<LessonManager />} />
             <Route path="users" element={<UserManager />} />
             <Route path="users/:id" element={<UserDetail />} />
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
      </Suspense>
      
      {/* Floating Global UI */}
      <AurumAiAgent />
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
