import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import VoluntarioRegister from './pages/VoluntarioRegister'
import EntidadeRegister from './pages/EntidadeRegister'
import Perfil from './pages/perfil'
import EventDatails from './pages/EventDatails'
import ErrorBoundary from './components/ErrorBoundary'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Navigate to="/cadastro-voluntario" replace />} />
        <Route path="/cadastro-voluntario" element={<VoluntarioRegister />} />
        <Route path="/cadastro-entidade" element={<EntidadeRegister />} />
        <Route path="/event/:id" element={<EventDatails />} />
        <Route path="/perfil" element={<ErrorBoundary><Perfil /></ErrorBoundary>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App