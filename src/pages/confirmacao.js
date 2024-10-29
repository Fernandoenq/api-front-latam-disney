import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';

const Confirmacao = () => {
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
        navigate('/concluir');
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
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm md:max-w-md lg:max-w-lg largura">
        {/* Logo */}
        <img
          src="logoLATAM.png"
          alt="Logo"
          className="w-24 h-auto mx-auto mb-4"
        />
        {/* Título */}
        <h2 className="text-2xl font-semibold text-center mb-6">Forneça o CPF para confirmar agendamento</h2>
        {/* Formulário que pega o CPF */}
        <form onSubmit={verificaCpf} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="CPF"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={cpf}
              onChange={handleCpfChange}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Confirmar
          </button>
        </form>

        <div className="mt-4 flex justify-between">
          <button
            className="bg-gray-300 text-black py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
            onClick={() => navigate('/dashboard')}
          >
            Voltar
          </button>
        </div>
      </div>

      {/* Modal de confirmação */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
            <h2 className="text-xl font-semibold text-center mb-4">Esse CPF não foi cadastrado</h2>
            {/* Flex para os botões */}
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

export default Confirmacao;
