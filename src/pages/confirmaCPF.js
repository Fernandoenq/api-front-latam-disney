import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';

const CPF = () => {
  const [cpf, setCpf] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // Para abrir a modal
  const navigate = useNavigate();

  // Função para formatar o CPF
  const handleCpfChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não é dígito
    value = value.replace(/(\d{3})(\d)/, '$1.$2'); // Adiciona o primeiro ponto
    value = value.replace(/(\d{3})(\d)/, '$1.$2'); // Adiciona o segundo ponto
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // Adiciona o hífen
    setCpf(value);
  };

  // Função para verificar o CPF na API
  const verificaCpf = async (e) => {
    e.preventDefault();
    try {
      // Fazendo a requisição ao endpoint
      const response = await fetch(`http://3.133.92.17:3333/Person/PersonByCpf/${cpf.replace(/\D/g, '')}`);
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('cpf', cpf); // Armazenando o CPF no localStorage
        // Se o CPF existir e retornar dados, redireciona para agendamentos
        navigate('/agendamento');
      } else {
        // Se o CPF não for encontrado, abre a modal para cadastro
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error('Erro ao verificar o CPF:', error);
      setIsModalOpen(true);
    }
  };

  // Fechar a modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center"
      style={{ backgroundImage: `url('/fundomenu.png')`, backgroundSize: 'cover', 
      // border: 'solid red 1px' 
      }}>

<div
        className="img"
        style={{
          height: '38vh',
          width: '90vw',
          backgroundImage: 'url(destinos.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="p-6 rounded-lg shadow-md w-full max-w-sm md:max-w-md lg:max-w-lg largura"
        style={{ 
          // border: 'solid red 1px' 
          }}>

  

        {/* Formulário que pega o CPF */}
        <form onSubmit={verificaCpf} className="space-y-4" style={{ 
          // border: 'solid red 1px' 
          }}>
          <div>
            <input
              type="text"
              placeholder="CPF"
              className="w-full shadow-x8 pl-12 opacity-50 pr-4 py-2 border-transparent bg-gradient-to-r text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-[20px]"
              style={{ backgroundColor: '#1861af', height: '50px' }}
              value={cpf}
              onChange={handleCpfChange}
              required
            />
          </div>

          {/* Div para os botões Confirmar e Voltar */}
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0 md:space-x-4">
           

            <button
              type="button"
              className="w-[170px] h-[40px] voltar text-white text-xl font-bold hover:bg-blue-600 transition-colors rounded-[20px] flex justify-center items-center"
              style={{
                boxShadow: '0px 10px 10px -5px rgba(0, 0, 0, 0.8)',
                borderBottom: '3px solid black',
              }}
              onClick={() => navigate('/dashboard')}
            >
              Voltar
            </button>
            <button
              type="submit"
              className="w-[170px] h-[40px] cadastrar text-white text-xl font-bold hover:bg-blue-600 transition-colors rounded-[20px] flex justify-center items-center"
              style={{
                boxShadow: '0px 10px 10px -5px rgba(0, 0, 0, 0.8)',
                borderBottom: '3px solid black',
              }}
            >
              Confirmar
            </button>
          </div>
        </form>

        {/* Imagem de assinatura abaixo dos inputs e botões */}
        <div className="flex justify-center items-center mt-4 assinatura-confirma">
          <div
            className="assinatura-dashboard"
            style={{
              height: '20vh',
              width: '20vw',
              backgroundImage: 'url(assinatura.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        </div>
      </div>

      {/* Modal de confirmação */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
            <h2 className="text-xl font-semibold text-center mb-4">Esse CPF não foi cadastrado</h2>
            <div className="flex justify-between space-x-4">
              <button
                className="w-1/2 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
                onClick={closeModal}
              >
                Fechar
              </button>
              <button
                className="w-1/2 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
                onClick={() => navigate('/cadastro')}
              >
                Cadastrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CPF;
