import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';
import BASE_URL from './config';
import { useAuth } from './AuthContext';

const Login = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { userId, checkDailyLogin } = useAuth();

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

        localStorage.setItem('userId', OrganizerId);
        localStorage.setItem('userName', OrganizerName);
        localStorage.setItem('lastLoginDate', new Date().toISOString());
        
        setIsSuccess(true);
        setMessage("Login bem-sucedido! Redirecionando...");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
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
    if (checkDailyLogin() || userId) {
      navigate('/dashboard');
    }
  }, [checkDailyLogin, userId, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4" style={{ backgroundImage: `url('/fundologin.png')`, backgroundSize: 'cover'  }}>
      <div className=" p-6 rounded-lg shadow-md w-full max-w-sm"  style={{ borderRadius: '15px',  marginRight:'100px' }}>
      
      <img 
        src="destinos.png" 
        alt="titulo"
        className="mx-auto mb-8" // Removi o `transform scale-700` inexistente
        style={{
          transform: 'scale(7)', // Aumenta em 700%
          transformOrigin: 'center',
          transition: 'transform 0.3s ease-in-out'
  }}
/>

        
        {message && (
          <div
            className={`p-4 mb-4 text-sm rounded-lg ${isSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
            role="alert"
          >
            {message}
          </div>
        )}
        
          <form onSubmit={handleLogin} className="space-y-4 form">
            <div className="relative ml-[-140px]">
              <img 
                src="/person.png" // Substitua pelo caminho correto do seu ícone
                alt="Login Icon" 
                className="absolute  left-3 top-1/2 transform -translate-y-1/2 opacity-50"
                width="20" 
                height="20" 
              />
              <input
                type="email"
                placeholder="login"
                className="w-full input-field font-normal  opacity-50 shadow-x8 pl-10 pr-4 py-2 border-4 border-transparent bg-gradient-to-r  text-white "
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                style={{ backgroundColor: '#4682B4'}} 
                required
              />
            </div>
            
            <div className="relative ml-[-140px]">
              <img 
                src="cadeado.png" // Substitua pelo caminho correto do seu ícone
                alt="Password Icon" 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-50"
                width="20" 
                height="20" 
              />
              <input
                type="password"
                placeholder="senha"
                className="w-full input-field font-normal  opacity-50 shadow-x8 pl-10 pr-4 py-2 border-4 border-transparent bg-gradient-to-r  text-white "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ backgroundColor: '#4682B4'}}
                required
              />
            </div>
            <div className=" ml-[-140px]">
            <button
              type="submit"
              className="w-full input-field bg-blue-500 text-white py-2 hover:bg-blue-600 transition-colors rounded-[20px]"
            >
              Entrar
            </button>
            </div>
  </form>
        {/* Imagem colocada abaixo dos inputs e botões */}
        <div className="flex justify-center mt-8">
          <img 
            src="assinatura.png" 
            alt="Assinatura"
            className="mx-auto mb-8" // Removi o `transform scale-700` inexistente
        style={{
          transform: 'scale(1.4)', // Aumenta em 700%
          transformOrigin: 'center',
          transition: 'transform 0.3s ease-in-out'
  }}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
