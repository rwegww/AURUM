import React, { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, useParams } from 'react-router-dom'

const RedirectBaiHocGrade = () => {
  const { grade } = useParams();
  return <Navigate to={`/lectures?grade=${grade}`} replace />;
};

const RedirectBaiHocLesson = () => {
  const { grade, lessonId } = useParams();
  return <Navigate to={`/lectures/${grade}/${lessonId}`} replace />;
};

// Common Components (Static - small & frequently used)
import { AuthProvider } from '@/context/AuthContext'
import Navbar from '@/components/navigation/Navbar'
import FloatingWidget from '@/components/common/FloatingWidget'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import JourneyPlacementRoute from '@/components/auth/JourneyPlacementRoute'
import LoadingScreen from '@/components/common/LoadingScreen'
import { MotionSystem, PageTransition } from '@/components/common/MotionSystem'

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
const LessonPage = lazyWithRetry(() => import('@/pages/student/LessonPage'));
const Classroom = lazyWithRetry(() => import('@/pages/student/Classroom'));
const MyClass = lazyWithRetry(() => import('@/pages/student/MyClass'));
const GradeJourney = lazyWithRetry(() => import('@/pages/student/GradeJourney'));
const StageIntro = lazyWithRetry(() => import('@/pages/student/StageIntro'));
const StageStory = lazyWithRetry(() => import('@/pages/student/StageStory'));
const StageChallenge = lazyWithRetry(() => import('@/pages/student/StageChallenge'));
const StageQuiz = lazyWithRetry(() => import('@/pages/student/StageQuiz'));
const StageReward = lazyWithRetry(() => import('@/pages/student/StageReward'));
const Lectures = lazyWithRetry(() => import('@/pages/student/Lectures'));
const ChemLab = lazyWithRetry(() => import('@/pages/student/ChemLab'));
const LabSimulatorPage = lazyWithRetry(() => import('@/pages/student/LabSimulatorPage'));
const LabMoleculePage = lazyWithRetry(() => import('@/pages/student/LabMoleculePage'));
const LabSolverPage = lazyWithRetry(() => import('@/pages/student/LabSolverPage'));
const DiscoveryJournalPage = lazyWithRetry(() => import('@/pages/student/DiscoveryJournalPage'));
const CraftingPage = lazyWithRetry(() => import('@/pages/student/CraftingPage'));
const Arena = lazyWithRetry(() => import('@/pages/student/Arena'));
const Library = lazyWithRetry(() => import('@/pages/student/Library'));
const MaterialDetail = lazyWithRetry(() => import('@/pages/student/MaterialDetail'));
const About = lazyWithRetry(() => import('@/pages/student/About'));
const Contact = lazyWithRetry(() => import('@/pages/student/Contact'));
const Terms = lazyWithRetry(() => import('@/pages/student/Terms'));
const Profile = lazyWithRetry(() => import('@/pages/student/Profile'));
const Settings = lazyWithRetry(() => import('@/pages/student/Settings'));
const KnowledgeMap = lazyWithRetry(() => import('@/pages/student/KnowledgeMap'));
const ChemCalculator = lazyWithRetry(() => import('@/pages/student/ChemCalculator'));

// Lazy Loaded Auth Pages
const Login = lazyWithRetry(() => import('@/pages/auth/Login'));
const ForgotPassword = lazyWithRetry(() => import('@/pages/auth/ForgotPassword'));
const Register = lazyWithRetry(() => import('@/pages/auth/Register'));
const AuthCallback = lazyWithRetry(() => import('@/pages/auth/AuthCallback'));

// Lazy Loaded Admin Modules
const AdminLayout = lazyWithRetry(() => import('@/components/layout/AdminLayout'));
const AdminDashboard = lazyWithRetry(() => import('@/pages/admin/AdminDashboard'));
const LessonManager = lazyWithRetry(() => import('@/pages/admin/LessonManager'));
const UserManager = lazyWithRetry(() => import('@/pages/admin/UserManager'));
const UserDetail = lazyWithRetry(() => import('@/pages/admin/UserDetail'));
const JourneyManager = lazyWithRetry(() => import('@/pages/admin/JourneyManager'));
const JourneyDetail = lazyWithRetry(() => import('@/pages/admin/JourneyDetail'));
const FeedbackManager = lazyWithRetry(() => import('@/pages/admin/FeedbackManager'));
const ApprovalManager = lazyWithRetry(() => import('@/pages/admin/ApprovalManager'));

// Lazy Loaded Teacher Modules
const TeacherLayout = lazyWithRetry(() => import('@/components/layout/TeacherLayout'));
const TeacherDashboard = lazyWithRetry(() => import('@/pages/teacher/TeacherDashboard'));
const ClassManager = lazyWithRetry(() => import('@/pages/teacher/ClassManager'));
const ClassDetail = lazyWithRetry(() => import('@/pages/teacher/ClassDetail'));
const AssignmentManager = lazyWithRetry(() => import('@/pages/teacher/AssignmentManager'));
const TeacherLibrary = lazyWithRetry(() => import('@/pages/teacher/TeacherLibrary'));


function AppContent() {
  const location = useLocation();

  React.useEffect(() => {
    if (window.location.pathname === '/auth/login') {
      window.location.replace('/login' + window.location.hash);
    }
  }, []);

  React.useEffect(() => {
    if (location.state?.openMissions) {
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('aurum_open_nhiem_vu'));
      }, 300);
      // Clear location state
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const isAuthPage = ['/forgot-password', '/reset-password'].includes(location.pathname) || location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/auth/callback';
  const isImmersivePage = location.pathname.includes('/journey/') && (
    location.pathname.endsWith('/intro') ||
    location.pathname.endsWith('/story') ||
    location.pathname.endsWith('/challenge') ||
    location.pathname.endsWith('/quiz') ||
    location.pathname.endsWith('/reward')
  );

  const isManagementPage = ['/admin', '/teacher'].some((basePath) => (
    location.pathname === basePath || location.pathname.startsWith(`${basePath}/`)
  ));
  return (
    <>
      {!isAuthPage && !isImmersivePage && !isManagementPage && <Navbar />}
      <Suspense fallback={<LoadingScreen />}>
        <PageTransition disabled={isManagementPage}>
        <Routes>
          {/* ... standard routes ... */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/lectures" element={<Lectures />} />
          <Route path="/lectures/:grade" element={<RedirectBaiHocGrade />} />
          <Route path="/lectures/:grade/:lessonId" element={<LessonPage />} />
          
          {/* Legacy /bai_hoc route redirects */}
          <Route path="/bai_hoc" element={<Navigate to="/lectures" replace />} />
          <Route path="/bai_hoc/:grade" element={<RedirectBaiHocGrade />} />
          <Route path="/bai_hoc/:grade/:lessonId" element={<RedirectBaiHocLesson />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ForgotPassword />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/auth" element={<Navigate to="/login" replace />} />

          {/* Protected Student Routes */}
          <Route path="/periodic-table" element={<ProtectedRoute><PeriodicTable /></ProtectedRoute>} />
          <Route path="/classroom" element={<ProtectedRoute><Classroom /></ProtectedRoute>} />
          <Route path="/my-class" element={<ProtectedRoute><MyClass /></ProtectedRoute>} />
          <Route path="/classroom/:grade/journey" element={<ProtectedRoute><JourneyPlacementRoute><GradeJourney /></JourneyPlacementRoute></ProtectedRoute>} />
          <Route path="/classroom/:grade/journey/:lessonId/intro" element={<ProtectedRoute><JourneyPlacementRoute><StageIntro /></JourneyPlacementRoute></ProtectedRoute>} />
          <Route path="/classroom/:grade/journey/:lessonId/story" element={<ProtectedRoute><JourneyPlacementRoute><StageStory /></JourneyPlacementRoute></ProtectedRoute>} />
          <Route path="/classroom/:grade/journey/:lessonId/challenge" element={<ProtectedRoute><JourneyPlacementRoute><StageChallenge /></JourneyPlacementRoute></ProtectedRoute>} />
          <Route path="/classroom/:grade/journey/:lessonId/quiz" element={<ProtectedRoute><JourneyPlacementRoute><StageQuiz /></JourneyPlacementRoute></ProtectedRoute>} />
          <Route path="/classroom/:grade/journey/:lessonId/reward" element={<ProtectedRoute><JourneyPlacementRoute><StageReward /></JourneyPlacementRoute></ProtectedRoute>} />
          <Route path="/lab" element={<ProtectedRoute><ChemLab /></ProtectedRoute>} />
          <Route path="/lab/simulator" element={<ProtectedRoute><LabSimulatorPage /></ProtectedRoute>} />
          <Route path="/lab/discovery" element={<ProtectedRoute><DiscoveryJournalPage /></ProtectedRoute>} />
          <Route path="/lab/crafting" element={<ProtectedRoute><CraftingPage /></ProtectedRoute>} />

          <Route path="/lab/molecules" element={<ProtectedRoute><LabMoleculePage /></ProtectedRoute>} />
          <Route path="/lab/solver" element={<ProtectedRoute><LabSolverPage /></ProtectedRoute>} />
          <Route path="/arena" element={<ProtectedRoute><Arena /></ProtectedRoute>} />
          <Route path="/library" element={<ProtectedRoute><Library /></ProtectedRoute>} />
          <Route path="/library/:id" element={<ProtectedRoute><MaterialDetail /></ProtectedRoute>} />
          <Route path="/nhiem_vu" element={<Navigate to="/" replace state={{ openMissions: true }} />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/knowledge-map" element={<ProtectedRoute><KnowledgeMap /></ProtectedRoute>} />
          <Route path="/calculator" element={<ProtectedRoute><ChemCalculator /></ProtectedRoute>} />

          {/* Protected Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout /></ProtectedRoute>}>
             <Route index element={<AdminDashboard />} />
             <Route path="journey" element={<JourneyManager />} />
             <Route path="journey/:lessonId" element={<JourneyDetail />} />
             <Route path="bai_hoc" element={<LessonManager />} />
             <Route path="nguoi_dung" element={<UserManager />} />
             <Route path="nguoi_dung/:id" element={<UserDetail />} />
             <Route path="feedback" element={<FeedbackManager />} />
             <Route path="phan_hoi" element={<FeedbackManager />} />
             <Route path="approvals" element={<ApprovalManager />} />
             <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>

          {/* Protected Teacher Routes */}
          <Route path="/teacher" element={<ProtectedRoute allowedRoles={['teacher', 'admin']}><TeacherLayout /></ProtectedRoute>}>
             <Route index element={<TeacherDashboard />} />
             <Route path="lop" element={<ClassManager />} />
             <Route path="lop/:id" element={<ClassDetail />} />
             <Route path="assignments" element={<AssignmentManager />} />
             <Route path="library" element={<TeacherLibrary />} />
             <Route path="*" element={<Navigate to="/teacher" replace />} />
          </Route>
        </Routes>
        </PageTransition>
      </Suspense>
      
      {/* Floating Global UI */}
      {!isManagementPage && <FloatingWidget />}
    </>
  );
}

function App() {
  return (
    <MotionSystem>
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
    </MotionSystem>
  );
}

export default App;
