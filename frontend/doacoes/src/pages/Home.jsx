import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Search, Filter, Calendar, MapPin, Monitor } from "lucide-react";

// Mock data for events
const mockEvents = [
  {
    id: 1,
    title: "Mutirão de Limpeza na Praia",
    description: "Ajude a limpar e preservar nossas praias. Venha com sua família!",
    image: "https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?auto=compress&cs=tinysrgb&w=800",
    organization: "Oceanos Limpos",
    category: "Meio Ambiente",
    date: "15 de Dezembro",
    time: "08:00",
    location: "Praia de Copacabana, Rio de Janeiro",
    city: "Rio de Janeiro",
    state: "RJ",
    isOnline: false
  },
  {
    id: 2,
    title: "Aula de Programação Online",
    description: "Aprenda fundamentos de programação com nossos mentores voluntários.",
    image: "https://images.pexels.com/photos/3862132/pexels-photo-3862132.jpeg?auto=compress&cs=tinysrgb&w=800",
    organization: "Tech for Good",
    category: "Educação",
    date: "18 de Dezembro",
    time: "19:00",
    location: "Online",
    city: "São Paulo",
    state: "SP",
    isOnline: true
  },
  {
    id: 3,
    title: "Distribuição de Alimentos",
    description: "Ajude a distribuir alimentos e necessidades básicas à comunidade carente.",
    image: "https://images.pexels.com/photos/5632399/pexels-photo-5632399.jpeg?auto=compress&cs=tinysrgb&w=800",
    organization: "Ação Social Brasil",
    category: "Assistência Social",
    date: "20 de Dezembro",
    time: "09:00",
    location: "Comunidade da Zona Norte, São Paulo",
    city: "São Paulo",
    state: "SP",
    isOnline: false
  },
  {
    id: 4,
    title: "Reabilitação Ambiental",
    description: "Participar do reflorestamento de uma área degradada na Mata Atlântica.",
    image: "https://images.pexels.com/photos/2990644/pexels-photo-2990644.jpeg?auto=compress&cs=tinysrgb&w=800",
    organization: "Verde Esperança",
    category: "Meio Ambiente",
    date: "22 de Dezembro",
    time: "07:00",
    location: "Reserva da Mata Atlântica, Minas Gerais",
    city: "Belo Horizonte",
    state: "MG",
    isOnline: false
  }
];

const cities = ["São Paulo", "Rio de Janeiro", "Belo Horizonte", "Salvador", "Brasília"];
const states = ["SP", "RJ", "MG", "BA", "DF"];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [eventType, setEventType] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const { user, logout } = useAuth();

  const filteredEvents = useMemo(() => {
    return mockEvents.filter(event => {
      const matchesSearch = 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCity = !selectedCity || event.city === selectedCity;
      const matchesState = !selectedState || event.state === selectedState;
      const matchesType = eventType === "all" || 
        (eventType === "online" && event.isOnline) ||
        (eventType === "presencial" && !event.isOnline);

      return matchesSearch && matchesCity && matchesState && matchesType;
    });
  }, [searchTerm, selectedCity, selectedState, eventType]);

  return (
    <>
      <header className="bg-gray-50 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="flex-1"></div>
          <div className="flex-1 text-center">
            <Link to="/" className="text-2xl font-extrabold text-gray-900">App Somar</Link>
          </div>
          <div className="flex-1 flex justify-end items-center space-x-4">
            {user ? (
              <>
                <div className="text-sm text-gray-700 text-right">
                  <div className="font-semibold text-base">{user.name || 'Usuário'}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </div>
                <Link to="/perfil" className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">Perfil</Link>
                <button onClick={() => logout()} className="px-4 py-2 bg-rose-600 text-white rounded-md text-base font-medium">Sair</button>
              </>
            ) : (
              <Link to="/login" className="px-4 py-2 bg-rose-600 text-white rounded-md">Entrar</Link>
            )}
          </div>
        </div>
      </header>

      <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="relative bg-blue-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("https://static.lumi.new/5f/5f3f993ba13546f74dce1accdd541aec.png")' }}
          id="hero-bg"
        ></div>
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Juntos podemos <span className="text-rose-400">Somar</span> mais
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mb-10">
            Conectamos quem quer ajudar a quem precisa. Encontre causas sociais, participe de eventos e transforme vidas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link 
              to="#eventos" 
              className="px-8 py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
            >
              Encontrar Eventos <ArrowRight className="h-5 w-5" />
            </Link>
            <Link 
              to="/login" 
              className="px-8 py-4 bg-white hover:bg-gray-100 text-blue-900 rounded-lg font-bold text-lg transition-all transform hover:scale-105 shadow-lg"
            >
              Quero ser Voluntário
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-30">
        <div className="bg-white rounded-xl shadow-xl grid grid-cols-1 md:grid-cols-3 gap-8 p-8 text-center border border-gray-100">
          <div className="space-y-2">
            <div className="text-4xl font-bold text-rose-600">1.2k+</div>
            <div className="text-gray-600 font-medium">Voluntários Ativos</div>
          </div>
          <div className="space-y-2 border-t md:border-t-0 md:border-l border-gray-200 pt-8 md:pt-0">
            <div className="text-4xl font-bold text-blue-600">350+</div>
            <div className="text-gray-600 font-medium">Eventos Realizados</div>
          </div>
          <div className="space-y-2 border-t md:border-t-0 md:border-l border-gray-200 pt-8 md:pt-0">
            <div className="text-4xl font-bold text-amber-500">80+</div>
            <div className="text-gray-600 font-medium">Entidades Parceiras</div>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="eventos">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Eventos em Destaque</h2>
            <p className="mt-2 text-gray-600">Confira as próximas ações e participe.</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por evento ou entidade..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 font-medium text-gray-700"
            >
              <Filter className="h-5 w-5" />
              Filtros
            </button>
          </div>

          {showFilters && (
            <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cidade</label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  >
                    <option value="">Todas as cidades</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  >
                    <option value="">Todos os estados</option>
                    {states.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Evento</label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  >
                    <option value="all">Todos</option>
                    <option value="presencial">Presencial</option>
                    <option value="online">Online</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCity('');
                    setSelectedState('');
                    setEventType('all');
                  }}
                  className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                >
                  Limpar filtros
                </button>
              </div>
            </div>
          )}

          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Nenhum evento encontrado com esses filtros.</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <Link
              key={event.id}
              to={`/event/${event.id}`}
              state={{ event }}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden border border-gray-100 group cursor-pointer transform hover:scale-[1.02] duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-rose-600 uppercase tracking-wide shadow-sm">
                  {event.category}
                </div>
                {event.isOnline && (
                  <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm flex items-center gap-1">
                    <Monitor className="h-3 w-3" />
                    Online
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="text-sm text-blue-600 font-semibold mb-2">{event.organization}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-1 group-hover:text-rose-600 transition-colors">{event.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
                
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>{event.date} • {event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {event.isOnline ? <Monitor className="h-4 w-4 text-gray-400" /> : <MapPin className="h-4 w-4 text-gray-400" />}
                    <span className="line-clamp-1">{event.location}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden md:flex">
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Você representa uma ONG ou Entidade?</h2>
              <p className="text-lg text-gray-600 mb-8">
                Cadastre sua organização gratuitamente no App Somar. Divulgue seus eventos, gerencie voluntários e receba doações de forma simples e transparente.
              </p>
              <div>
                <Link 
                  to="/cadastro-entidade" 
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  Cadastrar Entidade
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 bg-blue-50 relative h-64 md:h-auto">
               <img 
                  src="https://images.pexels.com/photos/6994982/pexels-photo-6994982.jpeg?auto=compress&cs=tinysrgb&w=800" 
                  alt="Voluntários trabalhando" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}

