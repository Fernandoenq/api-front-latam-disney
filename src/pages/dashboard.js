import React from "react";
import "../index.css"; // Certifique-se de que o Tailwind CSS está sendo importado corretamente
import { useNavigate } from 'react-router-dom';
const Dashboard = () => {
const navigate = useNavigate();


//verificando se o usuario ja esta logado colocar no aurthcontext e passar na rota no app? 
const userId = localStorage.getItem('userId');
if (userId) {
  // Agora você pode usar o ID do usuário em qualquer ação
  console.log(`Ação sendo executada com o ID do usuário DASHBOARD: ${userId}`);
} else {
  // Se o usuário não está logado, redireciona para a página de login
  navigate('/');
}

const logout = () => {
  localStorage.clear();  // Remove todos os itens do localStorage

  // Recarrega a página após a navegação para garantir que todos os dados de sessão estejam limpos
  navigate('/');
  window.location.reload();
};
const planilha = () => {
  

  
  navigate('/planilha');
 
};

const handleCadastroClick = () => {
        navigate('/cadastro'); // Redireciona para a rota de cadastro
};


const handleConfirmCPFClick = () => {
  navigate('/confirmacpf'); // Redireciona para a rota de cadastro
};
const handleConfirmarClick = () => {
    navigate('/concluir'); // Redireciona para a rota de cadastro
};


  return (
    <div className="flex flex-col min-h-screen items-center " style={{ backgroundImage: `url('/fundomenu.png')` }}>
    
      {/* Container das divs */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 w-full flex-grow items-center">
       
        <div onClick={handleCadastroClick} // Adiciona o evento de clique 
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-xs flex items-center justify-center mx-auto card-dashboard left">
          <h2 className="text-lg font-semibold text-center">CADASTRO</h2>
        </div>
        
       <button onClick={logout}> Logout</button>
       <button onClick={planilha}> planilha</button>


       
        <div onClick={handleConfirmCPFClick} className="bg-white p-6 rounded-lg shadow-md w-full max-w-xs flex items-center justify-center mx-auto card-dashboard">
          <h2 className="text-lg font-semibold text-center">AGENDAMENTO</h2>
        </div>
        
        
        <div onClick={handleConfirmarClick} className="bg-white p-6 rounded-lg shadow-md w-full max-w-xs flex items-center justify-center mx-auto card-dashboard right">
          <h2 className="text-lg font-semibold text-center">CONFIRMAR PRESENÇA</h2>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
