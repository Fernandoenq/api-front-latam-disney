// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './Login';
import Dashboard from './pages/dashboard';
import Cadastro from './pages/cadastro';
import { AuthProvider } from './AuthContext';
import Planilha from './pages/planilha';
import Confirmacao from './pages/confirmacao';
import Agendamento from './pages/agendamento';
import CPF from './pages/confirmaCPF'
import Agendar from './pages/agendar';
import Reagendamento from './pages/confirmaReagendamento';
import PrivateRoute from './PrivateRoute'; // Importa o PrivateRoute
import Concluir from './pages/concluir';

// colcoar os booleand nos cadastros
//numero no cadastro ter validacao pra enivar pro zap 
// aumentar as coisas pra ficar bonito pro tablet, front real


function App() {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
            <Route path="/cadastro" element={<PrivateRoute element={<Cadastro />} />} />
            <Route path="/planilha" element={<PrivateRoute element={<Planilha />} />} />
            <Route path="/confirmacao" element={<PrivateRoute element={<Confirmacao />} />} />
            <Route path="/confirmacpf" element={<PrivateRoute element={<CPF />} />} />
            {/* agendamentos dos clientes */}
            <Route path="/agendamento" element={<PrivateRoute element={<Agendamento />} />} />
            <Route path="/agendar" element={<PrivateRoute element={<Agendar />} />} />
            <Route path="/reagendamento" element={<PrivateRoute element={<Reagendamento />} />} />
            <Route path="/concluir" element={<PrivateRoute element={<Concluir />} />} />
            <Route path="/planilha" element={<PrivateRoute element={<Planilha />} />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

