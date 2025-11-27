import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Building2, Loader2, Check, ArrowLeft } from "lucide-react";
import authService from "../services/authService";

export default function EntidadeRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    cnpj: "",
    rua: "",
    numero: "",
    cidade: "",
    estado: "",
    cep: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Chamar API de cadastro entidade
      await authService.registerEntidade(formData);

      alert("Cadastro de Entidade realizado com sucesso!");
      // Redirecionar para login
      navigate("/login");
    } catch (err) {
      // Tratamento de erros
      if (err.response?.data?.errors) {
        const errorMessages = err.response.data.errors
          .map(e => e.message)
          .join(', ');
        setError(errorMessages);
      } else {
        setError(err.response?.data || "Falha ao cadastrar entidade. Tente novamente.");
      }
      console.error("Erro no cadastro de entidade:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-2xl w-full space-y-8">
        {/* Back Button */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para Home
        </Link>

        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Cadastro de Entidade</h2>
          <p className="mt-2 text-gray-600">
            Registre sua organização e comece a gerenciar doações e voluntários.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 flex items-start gap-3">
            <Building2 className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-bold text-blue-900">Bem-vindo, Entidade!</h3>
              <p className="text-sm text-blue-700">Preencha os dados da sua organização para começar.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {error && (
                <div className="col-span-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Entidade</label>
                <input
                  type="text"
                  required
                  className="block w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 px-4"
                  value={formData.name}
                  onChange={e => updateField('name', e.target.value)}
                  placeholder="Nome da sua organização"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                <input
                  type="email"
                  required
                  className="block w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 px-4"
                  value={formData.email}
                  onChange={e => updateField('email', e.target.value)}
                  placeholder="contato@entidade.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                <input
                  type="tel"
                  required
                  className="block w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 px-4"
                  value={formData.phone}
                  onChange={e => updateField('phone', e.target.value)}
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">CNPJ</label>
                <input
                  type="text"
                  required
                  className="block w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 px-4"
                  value={formData.cnpj}
                  onChange={e => updateField('cnpj', e.target.value)}
                  placeholder="00.000.000/0000-00"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Rua</label>
                <input
                  type="text"
                  required
                  className="block w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 px-4"
                  value={formData.rua}
                  onChange={e => updateField('rua', e.target.value)}
                  placeholder="Nome da rua"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
                <input
                  type="text"
                  required
                  className="block w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 px-4"
                  value={formData.numero}
                  onChange={e => updateField('numero', e.target.value)}
                  placeholder="123"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
                <input
                  type="text"
                  required
                  className="block w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 px-4"
                  value={formData.cep}
                  onChange={e => updateField('cep', e.target.value)}
                  placeholder="00000-000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                <input
                  type="text"
                  required
                  className="block w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 px-4"
                  value={formData.cidade}
                  onChange={e => updateField('cidade', e.target.value)}
                  placeholder="São Paulo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select
                  required
                  className="block w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 px-4"
                  value={formData.estado}
                  onChange={e => updateField('estado', e.target.value)}
                >
                  <option value="">Selecione um estado</option>
                  <option value="AC">Acre</option>
                  <option value="AL">Alagoas</option>
                  <option value="AP">Amapá</option>
                  <option value="AM">Amazonas</option>
                  <option value="BA">Bahia</option>
                  <option value="CE">Ceará</option>
                  <option value="DF">Distrito Federal</option>
                  <option value="ES">Espírito Santo</option>
                  <option value="GO">Goiás</option>
                  <option value="MA">Maranhão</option>
                  <option value="MT">Mato Grosso</option>
                  <option value="MS">Mato Grosso do Sul</option>
                  <option value="MG">Minas Gerais</option>
                  <option value="PA">Pará</option>
                  <option value="PB">Paraíba</option>
                  <option value="PR">Paraná</option>
                  <option value="PE">Pernambuco</option>
                  <option value="PI">Piauí</option>
                  <option value="RJ">Rio de Janeiro</option>
                  <option value="RN">Rio Grande do Norte</option>
                  <option value="RS">Rio Grande do Sul</option>
                  <option value="RO">Rondônia</option>
                  <option value="RR">Roraima</option>
                  <option value="SC">Santa Catarina</option>
                  <option value="SP">São Paulo</option>
                  <option value="SE">Sergipe</option>
                  <option value="TO">Tocantins</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                <input
                  type="password"
                  required
                  className="block w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 px-4"
                  value={formData.password}
                  onChange={e => updateField('password', e.target.value)}
                  placeholder="Crie uma senha segura"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-[1.01] flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Finalizar Cadastro <Check className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="text-center space-y-3">
          <p className="text-sm text-gray-600">
            Já tem uma conta?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Fazer login
            </Link>
          </p>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-50 text-gray-500">ou</span>
            </div>
          </div>
          <Link 
            to="/cadastro-voluntario" 
            className="inline-flex items-center gap-2 text-sm font-medium text-rose-600 hover:text-rose-700 transition-colors"
          >
            Cadastrar como Voluntário
          </Link>
        </div>
      </div>
    </div>
  );
}
