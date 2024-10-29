import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';

const Cadastro = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [celular, setCelular] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); //para abreir a modal
  const [isCadastroFeito, setIsCadastroFeito] = useState(false); // Estado para controlar se o cadastro foi feito
  
  const [message, setMessage] = useState(''); // Estado para a mensagem de erro ou sucesso
  const [isSuccess, setIsSuccess] = useState(false); // Para saber se foi sucesso ou erro

  const navigate = useNavigate();

 
  

  // Função para formatar o CPF
  const handleCpfChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não é dígito
    value = value.replace(/(\d{3})(\d)/, '$1.$2'); // Adiciona o primeiro ponto
    value = value.replace(/(\d{3})(\d)/, '$1.$2'); // Adiciona o segundo ponto
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // Adiciona o hífen
    setCpf(value);
  };

  // Função para validar CPF (simplesmente verifica o número de dígitos)
  const isValidCpf = (cpf) => {
    const cpfDigits = cpf.replace(/\D/g, ''); // Remove os caracteres especiais
    return cpfDigits.length === 11; // Verifica se tem 11 dígitos
  };

  const handleCadastro = async (e) => {
    e.preventDefault();

    // Validar se o CPF é válido
    if (!isValidCpf(cpf)) {
      alert("CPF inválido! Verifique o número e tente novamente.");
      return;
    }

    // Preparar os dados do cliente para o cadastro
    const clientData = {
      RegisterDate: new Date().toISOString().split('T')[0],
      PersonName: name,
      Cpf: cpf.replace(/\D/g, ''), // Remove a formatação do CPF antes de enviar
      Phone: celular,
      BirthDate: dataNascimento,
      Mail: email,
    };

    try {
      // Enviar os dados via POST para o endpoint
      const response = await fetch('http://3.133.92.17:3333/Person/Person', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientData),
      });

      // Pegar os dados retornados pela resposta do backend
      const data = await response.json();

      if (response.ok) {
        // Cadastro bem-sucedido, você pode realizar ações aqui
        setIsSuccess(true);
        setMessage("Cadastro realizado com sucesso!");
        setIsModalOpen(true);
        setIsCadastroFeito(true);
        localStorage.setItem('cpf', cpf); // Armazenando o CPF no localStorage
        localStorage.setItem('personId', data.PersonId);
        console.log(cpf);
       
      } else if (response.status === 422) {
        // Erro de validação (422 Unprocessable Entity) vindo do backend
        setIsSuccess(false);
        const errors = data.Errors ? data.Errors.join(', ') : 'Erro desconhecido';
        setMessage(`Erro no cadastro: ${errors}`);
       
      } else {
        // Outros tipos de erros (400, 500, etc.)
        setIsSuccess(false);
        setMessage('Erro no cadastro. Tente novamente.');
       
      }
    } catch (error) {
      // Caso ocorra um erro na requisição
      setIsSuccess(false);
      setMessage(`Erro na comunicação com o servidor: ${error.message}`);
      
    }
  };

  //fechando a modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm md:max-w-md lg:max-w-lg largura">
        {/* Logo */}
        <img src="logoLATAM.png" alt="Logo" className="w-24 h-auto mx-auto mb-4" />
        {/* Título */}
        <h2 className="text-2xl font-semibold text-center mb-6">Cadastro do Cliente</h2>
        {/* Formulário que pega email e senha */}
        <form onSubmit={handleCadastro} className="space-y-4">
          <div>
            <input
              type="name"
              placeholder="Nome e Sobrenome"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="celular"
              placeholder="Celular"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={celular}
              onChange={(e) => setCelular(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="cpf"
              placeholder="CPF"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={cpf}
              onChange={(e) => {
                setCpf(e.target.value); // Atualiza a data de nascimento
                handleCpfChange(e); // Executa a função handleCpfChange
              }}
              required
            />
          </div>
          <div>
            <input
              type="date"
              placeholder="Data de Nascimento"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={dataNascimento}
              onChange={(e) => {
                setDataNascimento(e.target.value); // Atualiza a data de nascimento
              }}
              required
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="w-1/3 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Cadastrar
            </button>
          </div>
        </form>

        {/* Exibição de mensagem de erro ou sucesso */}
        {message && (
          <div className={`mt-4 text-center ${isSuccess ? 'text-green-500' : 'text-red-500'}`}>
            {message}
          </div>
        )}

        <div className="mt-4 flex justify-between">
          <button
            className="bg-gray-300 text-black py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
            onClick={() => navigate('/dashboard')}
          >
            Voltar
          </button>

          {/* Exibir após o cadastro */}
          {isCadastroFeito && (
            <button
            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors"
            onClick={() => navigate('/agendar', { state: { cpf } })} // Corrigido para passar o segundo argumento corretamente
        >
            Agendar
            
        </button>
        
            
          )}
        </div>
      </div>

      {/* Modal de confirmação */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
            <h2 className="text-xl font-semibold text-center mb-4">Cadastro realizado com sucesso!</h2>
            <button
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
              onClick={closeModal}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cadastro;
