import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from '@/pages/student/Home'
import PeriodicTable from '@/pages/student/PeriodicTable'
import Lessons from '@/pages/student/Lessons'
import LessonPage from '@/pages/student/LessonPage'
import ChemLab from '@/pages/student/ChemLab'
import Navbar from '@/components/navigation/Navbar'
import { AuthProvider } from '@/context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/periodic-table" element={<PeriodicTable />} />
          <Route path="/lessons" element={<Lessons />} />
          <Route path="/lessons/:grade/:lessonId" element={<LessonPage />} />
          <Route path="/lab" element={<ChemLab />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
