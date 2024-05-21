import './App.css'
import { Routes, Route } from 'react-router-dom'
import LandingPage from './page/LandingPage'
import AuthPage from './page/AuthPage'
import Profile from './page/ProfilePage'
import ProjectPage from './page/ProjectPage'

function App() {
 
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/project" element={<ProjectPage/>}/>
      </Routes>
    </>
  )
}

export default App
