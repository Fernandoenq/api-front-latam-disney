import React from "react";
import "../index.css"; // Certifique-se de que o Tailwind CSS está sendo importado corretamente
import { useNavigate } from 'react-router-dom';
const Dashboard = () => {
const navigate = useNavigate();


//verificando se o usuario ja esta logado colocar no aurthcontext e passar na rota no app? 
const userId = localStorage.getItem('userId');
if (userId) {
  // Agora você pode usar o ID do usuário em qualquer ação
  console.log(`Ação sendo executada com o ID do usuário: ${userId}`);
} else {
  // Se o usuário não está logado, redireciona para a página de login
  navigate('/login');
}


const handleCadastroClick = () => {
        navigate('/cadastro'); // Redireciona para a rota de cadastro
};
// const handlePlanilhaClick = () => {
//     navigate('/agendamento'); // Redireciona para a rota de cadastro
// };

const handleConfirmCPFClick = () => {
  navigate('/confirmacpf'); // Redireciona para a rota de cadastro
};
const handleConfirmarClick = () => {
    navigate('/confirmacao'); // Redireciona para a rota de cadastro
};


  return (
    <div className="flex flex-col min-h-screen items-center bg-gray-100">
      {/* Logo */}
      <img
        src="logoLATAMextenso.png" 
        alt="Logo"
        className="w-64 h-auto  mt-4 object-contain" // Ajuste o tamanho conforme necessário e adicione margem superior
      />

      {/* Container das divs */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 w-full flex-grow items-center">
       
        <div onClick={handleCadastroClick} // Adiciona o evento de clique 
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-xs flex items-center justify-center mx-auto card-dashboard left">
          <h2 className="text-lg font-semibold text-center">CADASTRO</h2>
        </div>
        
       
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
