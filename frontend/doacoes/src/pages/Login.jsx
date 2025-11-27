import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Mail, Lock, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';
import authService from '../services/authService';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const { user, login, logout } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Use AuthContext login wrapper
      await login(formData.email, formData.password);
      navigate("/");
    } catch (err) {
      // Tratamento de erros
      if (err.response?.data?.errors) {
        // Erros de validação (400)
        const errorMessages = err.response.data.errors
          .map(e => e.message)
          .join(', ');
        setError(errorMessages);
      } else if (err.response?.status === 401 || err.response?.status === 400) {
        setError("Email ou senha inválidos.");
      } else {
        setError(err.response?.data || "Falha ao autenticar. Tente novamente.");
      }
      console.error("Erro no login:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex bg-white">
      {/* Left Side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img 
          src="https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
          alt="Voluntários sorrindo" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-blue-900/40 backdrop-blur-[2px] flex items-center justify-center">
          <div className="text-white text-center p-12 max-w-lg">
            <h2 className="text-4xl font-bold mb-6">Juntos somos mais fortes</h2>
            <p className="text-xl text-blue-100">
              Faça parte dessa corrente do bem. Sua atitude pode mudar o dia de alguém.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-16 bg-slate-50">
        <div className="w-full max-w-md space-y-8">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para Home
          </Link>
          
          <div className="text-center lg:text-left">
            <div className="flex justify-center lg:justify-start mb-6">
              <div className="bg-rose-600 p-2 rounded-xl inline-flex">
                <Heart className="h-8 w-8 text-white fill-current" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Bem-vindo de volta</h2>
            <p className="mt-2 text-gray-600">
              Entre para gerenciar seus eventos e doações.
            </p>
          </div>

          {user ? (
            <div className="mt-8 space-y-6">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700">Você já está logado.</p>
              </div>
              <div className="bg-white border rounded-lg p-6">
                <div className="text-sm text-gray-700 mb-2">Nome</div>
                <div className="font-semibold text-lg mb-4">{user.name || 'Usuário'}</div>
                <div className="text-sm text-gray-700 mb-2">E-mail</div>
                <div className="font-medium text-sm mb-4">{user.email}</div>
                <div className="flex items-center justify-center gap-3">
                  <button onClick={() => { logout(); }} className="px-4 py-2 bg-rose-600 text-white rounded-md text-base font-medium">Sair</button>
                  <button onClick={() => { logout(); navigate('/login'); }} className="px-4 py-2 bg-white border rounded-md">Trocar de conta</button>
                </div>
              </div>
            </div>
          ) : (
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    E-mail
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500 sm:text-sm transition-colors"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Senha
                    </label>
                    <div className="text-sm">
                      <a href="#" className="font-medium text-rose-600 hover:text-rose-500">
                        Esqueceu a senha?
                      </a>
                    </div>
                  </div>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500 sm:text-sm transition-colors"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-all transform hover:scale-[1.01] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Entrar <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-50 text-gray-500">
                  Não tem uma conta?
                </span>
              </div>
            </div>

            {!user && (
              <div className="mt-6 grid grid-cols-1">
                <Link
                  to="/cadastro-voluntario"
                  className="w-full flex justify-center items-center px-4 py-3 border border-gray-300 shadow-sm text-sm font-bold rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  Criar nova conta
                </Link>
              </div>
            )}
          </div>
          
          <div className="text-center mt-4">
             <p className="text-xs text-gray-500">
               Dica para teste: Use <strong>demo@appsomar.com</strong> / <strong>123456</strong>
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
