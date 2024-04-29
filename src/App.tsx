import './App.css'
import { Routes, Route } from 'react-router-dom'
import LandingPage from './page/LandingPage'
import AuthPage from './page/AuthPage'

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
    </>
  )
}

export default App
