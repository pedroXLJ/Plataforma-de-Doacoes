import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Clock, Users, Share2, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import DonationModal from '../components/DonationModal';
import Toast from '../components/Toast';

// Fallback mock data in case location.state não for fornecido
const mockEvents = [
  {
    id: 1,
    title: 'Mutirão de Limpeza na Praia',
    description: 'Ajude a limpar e preservar nossas praias. Venha com sua família!',
    details: 'Traga luvas e água. A ação terá duração aproximada de 4 horas.',
    image: 'https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?auto=compress&cs=tinysrgb&w=800',
    organizerAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    organization: 'Oceanos Limpos',
    category: 'Meio Ambiente',
    date: '15 de Dezembro',
    time: '08:00',
    location: 'Praia de Copacabana, Rio de Janeiro',
    participants: 128,
  },
  {
    id: 2,
    title: 'Aula de Programação Online',
    description: 'Aprenda fundamentos de programação com nossos mentores voluntários.',
    details: 'Sessão interativa com exercícios e Q&A.',
    image: 'https://images.pexels.com/photos/3862132/pexels-photo-3862132.jpeg?auto=compress&cs=tinysrgb&w=800',
    organizerAvatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
    organization: 'Tech for Good',
    category: 'Educação',
    date: '18 de Dezembro',
    time: '19:00',
    location: 'Online',
    participants: 56,
  }
];

export default function EventDatails() {
  const { user } = useAuth();
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const eventFromState = location.state?.event;
  const [showDonationModal, setShowDonationModal] = React.useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [toast, setToast] = useState(null);

  // Fetch user profile from backend
  useEffect(() => {
    if (user) {
      api.get('/auth/me')
        .then(res => {
          const data = res.data?.user || res.data || null;
          setUserProfile(data);
        })
        .catch(err => {
          console.error('Erro ao carregar perfil:', err);
          setUserProfile(null);
        });
    } else {
      setUserProfile(null);
    }
  }, [user]);

  const event = eventFromState || mockEvents.find(e => String(e.id) === String(id)) || mockEvents[0];

  // detect user type from token claims
  const tipoStr = (userProfile?.tipo || '').toString().toLowerCase();
  const isVoluntario = tipoStr.includes('volunt') && !tipoStr.includes('entidade');

  function handleParticipate() {
    if (!user) {
      // Usuário não está logado: mostrar toast e redirecionar com next
      setToast({ type: 'info', title: 'Login necessário', message: 'Faça login ou cadastre-se para fazer uma doação. Redirecionando...' });
      const next = encodeURIComponent(location.pathname + (location.search || ''));
      setTimeout(() => navigate(`/login?next=${next}`), 1200);
      return;
    }

    if (!isVoluntario) {
      setToast({ type: 'error', title: 'Apenas voluntários', message: 'Apenas voluntários podem fazer doações. Atualize seu perfil para se tornar voluntário.' });
      return;
    }

    setShowDonationModal(true);
  }


  return (
    <>
      <div className="bg-white min-h-screen pb-12">
      {/* Hero Banner */}
      <div className="relative h-[400px] w-full">
        <img 
          src={event.image} 
          alt={event.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <Link to="/" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" /> Voltar para eventos
          </Link>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-bold uppercase tracking-wide mb-4">
                {event.category}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{event.title}</h1>
              <div className="flex flex-wrap items-center gap-6 text-white/90">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-rose-400" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-rose-400" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-rose-400" />
                  <span>{event.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Sobre a Ação</h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                {event.description}
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                {event.details}
              </p>

              <div className="mt-8 pt-8 border-t border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Organizado por</h3>
                <div className="flex items-center gap-4">
                  <img 
                    src={event.organizerAvatar} 
                    alt={event.organization} 
                    className="w-16 h-16 rounded-full border-2 border-gray-100"
                  />
                  <div>
                    <div className="font-bold text-gray-900 text-lg">{event.organization}</div>
                    <div className="text-rose-600 text-sm font-medium cursor-pointer hover:underline">Ver perfil da entidade</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-gray-700">
                  <Users className="h-5 w-5 text-blue-500" />
                  <span className="font-bold text-xl">{event.participants}</span>
                  <span className="text-gray-500">participantes</span>
                </div>
                <button className="text-gray-400 hover:text-rose-500 transition-colors p-2 rounded-full hover:bg-rose-50">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>

              {user ? (
                isVoluntario ? (
                  <button 
                    onClick={handleParticipate}
                    className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white text-lg font-bold rounded-xl shadow-lg shadow-rose-200 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
                  >
                    <Heart className="h-5 w-5 fill-current" />
                    Quero Doar
                  </button>
                ) : (
                  <div className="w-full py-4 bg-gray-100 text-gray-600 text-lg font-bold rounded-xl text-center">
                    Apenas voluntários podem fazer doações
                  </div>
                )
              ) : (
                <button 
                  onClick={handleParticipate}
                  className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white text-lg font-bold rounded-xl shadow-lg shadow-rose-200 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <Heart className="h-5 w-5 fill-current" />
                  Quero Doar
                </button>
              )}
              
              <p className="text-xs text-center text-gray-500 mt-4">
                Ao participar, você concorda com os termos de voluntariado da plataforma.
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>

      <DonationModal
        isOpen={showDonationModal}
        onClose={() => setShowDonationModal(false)}
        userProfile={userProfile}
        onSuccess={() => setToast({ type: 'success', title: 'Doação registrada', message: 'Obrigado! Sua doação foi registrada. (Simulação)' })}
        event={event}
      />
      <Toast toast={toast} onClose={() => setToast(null)} />
    </>
  );
}
