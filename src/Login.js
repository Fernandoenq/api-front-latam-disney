// Login.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';
import BASE_URL from './config';
import { useAuth } from './AuthContext'; // Importando o hook de autenticação

const Login = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { checkDailyLogin } = useAuth(); // Pegando a função do contexto

  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/Organizer/Login`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Login: login,
          SecretKey: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const organizerData = data.Organizers[0];
        const { OrganizerId, OrganizerName } = organizerData;

        // Salva o OrganizerId e a data do login no localStorage
        localStorage.setItem('userId', OrganizerId);
        localStorage.setItem('userName', OrganizerName);
        localStorage.setItem('lastLoginDate', new Date().toISOString());

        setIsSuccess(true);
        setMessage("Login bem-sucedido! Redirecionando...");
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else if (response.status === 422) {
        setIsSuccess(false);
        const errors = data.Errors.join(', ');
        setMessage(`Erro no login: ${errors}`);
      } else {
        setIsSuccess(false);
        setMessage('Erro no login. Tente novamente.');
      }
    } catch (error) {
      setIsSuccess(false);
      setMessage(`Erro ao conectar com o servidor: ${error.message}`);
    }
  };

  useEffect(() => {
    if (checkDailyLogin()) {
      // Se o usuário já fez login hoje, redireciona para o dashboard
      navigate('/dashboard');
    }
  }, [navigate, checkDailyLogin]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <img src="logoLATAM.png" alt="Logo" className="w-24 h-auto mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-center mb-6">Login Organizador</h2>
        {message && (
          <div
            className={`p-4 mb-4 text-sm rounded-lg ${isSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
            role="alert"
          >
            {message}
          </div>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
