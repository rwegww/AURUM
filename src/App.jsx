import React, { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'

// Common Components (Static - small & frequently used)
import { AuthProvider } from '@/context/AuthContext'
import Navbar from '@/components/navigation/Navbar'
import FeedbackButton from '@/components/common/FeedbackButton'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import LoadingScreen from '@/components/common/LoadingScreen'

// Helper to handle lazy loading errors in production (due to new deployments/hash changes)
const lazyWithRetry = (componentImport) =>
  lazy(async () => {
    const pageHasAlreadyBeenForceRefreshed = JSON.parse(
      window.localStorage.getItem('page-has-been-force-refreshed') || 'false'
    );

    try {
      const component = await componentImport();
      window.localStorage.setItem('page-has-been-force-refreshed', 'false');
      return component;
    } catch (error) {
      if (!pageHasAlreadyBeenForceRefreshed) {
        window.localStorage.setItem('page-has-been-force-refreshed', 'true');
        return window.location.reload();
      }
      throw error;
    }
  });

// Lazy Loaded Student Pages
const Home = lazyWithRetry(() => import('@/pages/student/Home'));
const PeriodicTable = lazyWithRetry(() => import('@/pages/student/PeriodicTable'));
const Lessons = lazyWithRetry(() => import('@/pages/student/Lessons'));
const LessonPage = lazyWithRetry(() => import('@/pages/student/LessonPage'));
const Classroom = lazyWithRetry(() => import('@/pages/student/Classroom'));
const MyClass = lazyWithRetry(() => import('@/pages/student/MyClass'));
const GradeJourney = lazyWithRetry(() => import('@/pages/student/GradeJourney'));
const StageIntro = lazyWithRetry(() => import('@/pages/student/StageIntro'));
const StageChallenge = lazyWithRetry(() => import('@/pages/student/StageChallenge'));
const StageReward = lazyWithRetry(() => import('@/pages/student/StageReward'));
const Lectures = lazyWithRetry(() => import('@/pages/student/Lectures'));
const ChemLab = lazyWithRetry(() => import('@/pages/student/ChemLab'));
const LabSimulatorPage = lazyWithRetry(() => import('@/pages/student/LabSimulatorPage'));
const LabBalancerPage = lazyWithRetry(() => import('@/pages/student/LabBalancerPage'));
const LabMoleculePage = lazyWithRetry(() => import('@/pages/student/LabMoleculePage'));
const LabSolverPage = lazyWithRetry(() => import('@/pages/student/LabSolverPage'));
const Arena = lazyWithRetry(() => import('@/pages/student/Arena'));
const Library = lazyWithRetry(() => import('@/pages/student/Library'));
const MaterialDetail = lazyWithRetry(() => import('@/pages/student/MaterialDetail'));
const Missions = lazyWithRetry(() => import('@/pages/student/Missions'));
const About = lazyWithRetry(() => import('@/pages/student/About'));
const Contact = lazyWithRetry(() => import('@/pages/student/Contact'));
const Terms = lazyWithRetry(() => import('@/pages/student/Terms'));
const Profile = lazyWithRetry(() => import('@/pages/student/Profile'));
const KnowledgeMap = lazyWithRetry(() => import('@/pages/student/KnowledgeMap'));
const ChemCalculator = lazyWithRetry(() => import('@/pages/student/ChemCalculator'));

// Lazy Loaded Auth Pages
const Login = lazyWithRetry(() => import('@/pages/auth/Login'));
const Register = lazyWithRetry(() => import('@/pages/auth/Register'));
const AuthCallback = lazyWithRetry(() => import('@/pages/auth/AuthCallback'));

// Lazy Loaded Admin Modules
const AdminLayout = lazyWithRetry(() => import('@/components/layout/AdminLayout'));
const AdminDashboard = lazyWithRetry(() => import('@/pages/admin/AdminDashboard'));
const LessonManager = lazyWithRetry(() => import('@/pages/admin/LessonManager'));
const UserManager = lazyWithRetry(() => import('@/pages/admin/UserManager'));
const UserDetail = lazyWithRetry(() => import('@/pages/admin/UserDetail'));
const FeedbackManager = lazyWithRetry(() => import('@/pages/admin/FeedbackManager'));

// Lazy Loaded Teacher Modules
const TeacherLayout = lazyWithRetry(() => import('@/components/layout/TeacherLayout'));
const TeacherDashboard = lazyWithRetry(() => import('@/pages/teacher/TeacherDashboard'));
const ClassManager = lazyWithRetry(() => import('@/pages/teacher/ClassManager'));
const ClassDetail = lazyWithRetry(() => import('@/pages/teacher/ClassDetail'));
const AssignmentManager = lazyWithRetry(() => import('@/pages/teacher/AssignmentManager'));

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

  const functionalPaths = [
    '/lab', 
    '/arena', 
    '/library', 
    '/lessons', 
    '/periodic-table', 
    '/missions', 
    '/knowledge-map', 
    '/classroom',
    '/calculator'
  ];
  const isFunctionalPage = functionalPaths.some(path => location.pathname.startsWith(path));

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
          <Route path="/lab/solver" element={<ProtectedRoute><LabSolverPage /></ProtectedRoute>} />
          <Route path="/arena" element={<ProtectedRoute><Arena /></ProtectedRoute>} />
          <Route path="/library" element={<ProtectedRoute><Library /></ProtectedRoute>} />
          <Route path="/library/:id" element={<ProtectedRoute><MaterialDetail /></ProtectedRoute>} />
          <Route path="/missions" element={<ProtectedRoute><Missions /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/knowledge-map" element={<ProtectedRoute><KnowledgeMap /></ProtectedRoute>} />
          <Route path="/calculator" element={<ProtectedRoute><ChemCalculator /></ProtectedRoute>} />

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
      {isFunctionalPage && <AurumAiAgent />}
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
