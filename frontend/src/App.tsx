import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Signin } from '@/pages/Signin'
import { Signup } from '@/pages/Signup'
import { Dashboard } from '@/pages/Dashboard'
import { Header } from '@/components/Header'

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/signin' element={<Signin />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/dashboard' element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
