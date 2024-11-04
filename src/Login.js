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
  const [loading, setLoading] = useState(false); // Novo estado para o spinner

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Mostra o spinner ao iniciar o login
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
          setLoading(false); // Esconde o spinner
          window.location.reload();
        }, 1000);
      } else if (response.status === 422) {
        setIsSuccess(false);
        const errors = data.Errors.join(', ');
        setMessage(`Erro no login: ${errors}`);
        setLoading(false); // Esconde o spinner em caso de erro
      } else {
        setIsSuccess(false);
        setMessage('Erro no login. Tente novamente.');
        setLoading(false); // Esconde o spinner em caso de erro
      }
    } catch (error) {
      setIsSuccess(false);
      setMessage(`Erro ao conectar com o servidor: ${error.message}`);
      setLoading(false); // Esconde o spinner em caso de erro
    }
  };

  useEffect(() => {
    if (checkDailyLogin() || userId) {
      navigate('/dashboard');
    }
  }, [checkDailyLogin, userId, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-1" style={{ backgroundImage: `url('/fundologin.png')`,backgroundSize: 'cover', paddingTop:'30px' }}>
      <div className="rounded-lg shadow-md " 
        style={{ 
          height: 'auto', 
          width: '90%', 
          maxWidth: '800px', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center'
        }}>
        
        <div
          className="img tabletModelo-destino"
          style={{
            height: '34vh',
            width: '90vw',
            backgroundImage: 'url(destinos.png)',
            backgroundSize: 'cover', 
            backgroundPosition: 'center',
          }}
        ></div>

        {message && (
          <div
            className={`p-4 mb-4 text-sm rounded-lg ${isSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
            role="alert"
          >
            {message}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4" 
          style={{ 
            height: 'auto',
            width: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center'
          }}>
          <div className="relative responsive-width">
            <img
              src="/person.png"
              alt="Login Icon"
              className="absolute left-2 top-1/2 transform -translate-y-1/2" 
              width="40"  
              height="30" 
            />
            
            <input
              type="name"
              placeholder="Login"
              className="w-full shadow-x8 pl-12 pr-4 py-2  text-white  rounded-[20px]"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              style={{  backgroundColor: 'rgba(65, 105, 225, 0.3)', // Cor de fundo com opacidade (0.6, ajustável), 
                height: '60px',  boxShadow: '0px 10px 10px -5px rgba(0, 0, 0, 0.8)',
                borderBottom: '3px solid black',}}
              required
            />
          </div>

          <div className="relative responsive-width">
            <img
              src="cadeado.png"
              alt="Password Icon"
              className="absolute left-1 top-1/2 transform -translate-y-1/2" 
              width="50"  
              height="40" 
            />
            <input
                type="password"
                placeholder="Senha"
                className="w-full shadow-x8 pl-12 pr-4 py-2 border-transparent bg-gradient-to-r text-white focus:outline-none rounded-[20px]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  backgroundColor: 'rgba(65, 105, 225, 0.3)', // Cor de fundo com opacidade
                  height: '60px',
                  boxShadow: '0px 10px 10px -5px rgba(0, 0, 0, 0.8)',
                  borderBottom: '3px solid black',
                }}
                required
              />

          </div>
          
          <div className="relative responsive-width">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 hover:bg-blue-600 transition-colors rounded-[20px] flex justify-center items-center"
              style={{backgroundColor: 'rgba(65, 105, 225, 0.3)',
                 height: '50px',boxShadow: '0px 10px 10px -5px rgba(0, 0, 0, 0.8)',
                borderBottom: '3px solid black', }}
              disabled={loading} // Desabilita o botão enquanto está carregando
            >
              {loading ? (
                <div className="spinner-border animate-spin inline-block w-4 h-4 border-4 rounded-full text-white"></div>
              ) : (
                'Entrar'
              )}
            </button>
          </div>
        </form>

        <div className="flex justify-center tabletModelo-assinatura-login tabletModelo-assinatura" style={{
          height: '20vh',
          width: '40vh', 
          backgroundImage: 'url(assinatura.png)',
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          marginTop:'10vh'
        }}></div>
      </div>
    </div>
  );
};

export default Login;
