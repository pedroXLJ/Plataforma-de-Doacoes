import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, User, Loader2, Check, Building2, ArrowLeft } from "lucide-react";
import authService from "../services/authService";

export default function VoluntarioRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    cpf: "",
    preferredCities: "",
    hasVolunteered: false
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
      // Chamar API de cadastro voluntário
      await authService.registerVoluntario(
        formData.name,
        formData.cpf,
        formData.email,
        formData.password
      );

      alert("Cadastro realizado com sucesso!");
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
        setError(err.response?.data || "Falha ao cadastrar. Tente novamente.");
      }
      console.error("Erro no cadastro:", err);
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
          <div className="mx-auto h-12 w-12 bg-rose-600 rounded-xl flex items-center justify-center mb-4">
            <Heart className="h-8 w-8 text-white fill-current" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Cadastro de Voluntário</h2>
          <p className="mt-2 text-gray-600">
            Junte-se à comunidade e comece a fazer a diferença.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="bg-rose-50 border border-rose-100 rounded-lg p-4 mb-6 flex items-start gap-3">
            <User className="h-5 w-5 text-rose-600 mt-0.5" />
            <div>
              <h3 className="font-bold text-rose-900">Olá, Voluntário!</h3>
              <p className="text-sm text-rose-700">Preencha seus dados para encontrar os melhores eventos para você.</p>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                <input
                  type="text"
                  required
                  className="block w-full rounded-lg border border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 py-3 px-4"
                  value={formData.name}
                  onChange={e => updateField('name', e.target.value)}
                  placeholder="Seu nome completo"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                <input
                  type="email"
                  required
                  className="block w-full rounded-lg border border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 py-3 px-4"
                  value={formData.email}
                  onChange={e => updateField('email', e.target.value)}
                  placeholder="exemplo@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                <input
                  type="tel"
                  required
                  className="block w-full rounded-lg border border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 py-3 px-4"
                  value={formData.phone}
                  onChange={e => updateField('phone', e.target.value)}
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                <input
                  type="password"
                  required
                  className="block w-full rounded-lg border border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 py-3 px-4"
                  value={formData.password}
                  onChange={e => updateField('password', e.target.value)}
                  placeholder="Crie uma senha segura"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                <input
                  type="text"
                  required
                  className="block w-full rounded-lg border border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 py-3 px-4"
                  value={formData.cpf}
                  onChange={e => updateField('cpf', e.target.value)}
                  placeholder="000.000.000-00"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Cidades de Preferência</label>
                <input
                  type="text"
                  required
                  className="block w-full rounded-lg border border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 py-3 px-4"
                  value={formData.preferredCities}
                  onChange={e => updateField('preferredCities', e.target.value)}
                  placeholder="Ex: São Paulo, Rio de Janeiro, Belo Horizonte"
                />
              </div>

              <div className="col-span-2 flex items-center gap-3 p-4 border border-gray-200 rounded-lg">
                <input
                  type="checkbox"
                  id="hasVolunteered"
                  className="h-5 w-5 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
                  checked={formData.hasVolunteered}
                  onChange={e => updateField('hasVolunteered', e.target.checked)}
                />
                <label htmlFor="hasVolunteered" className="text-gray-700 font-medium cursor-pointer">
                  Já participei de ações voluntárias antes
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-all transform hover:scale-[1.01] flex items-center justify-center gap-2 disabled:opacity-70"
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
            <Link to="/login" className="font-medium text-rose-600 hover:text-rose-500">
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
            to="/cadastro-entidade" 
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            <Building2 className="h-4 w-4" />
            Cadastrar como Entidade
          </Link>
        </div>
      </div>
    </div>
  );
}
