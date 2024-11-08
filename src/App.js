import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './Login';
import Dashboard from './pages/dashboard';
import Cadastro from './pages/cadastro';
import { AuthProvider } from './AuthContext';
import Planilha from './pages/planilha';
import Confirmacao from './pages/confirmacao';
import Agendamento from './pages/agendamento';
import CPF from './pages/confirmaCPF';
import Agendar from './pages/agendar';
import Reagendamento from './pages/confirmaReagendamento';
import PrivateRoute from './PrivateRoute'; 
import Concluir from './pages/concluir';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Routes>
            {/* Redireciona a raiz para /login */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
            <Route path="/cadastro" element={<PrivateRoute element={<Cadastro />} />} />
            <Route path="/planilha" element={<PrivateRoute element={<Planilha />} />} />
            {/* <Route path="/planilha" element={<Planilha/>} /> */}
            <Route path="/confirmacao" element={<PrivateRoute element={<Confirmacao />} />} />
            <Route path="/confirmacpf" element={<PrivateRoute element={<CPF />} />} />
            <Route path="/agendamento" element={<PrivateRoute element={<Agendamento />} />} />
            <Route path="/agendar" element={<PrivateRoute element={<Agendar />} />} />
            <Route path="/reagendamento" element={<PrivateRoute element={<Reagendamento />} />} />
            <Route path="/concluir" element={<PrivateRoute element={<Concluir />} />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
