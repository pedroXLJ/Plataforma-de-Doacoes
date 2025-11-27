import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Building2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function formatDateFromTimestamp(value) {
  if (!value) return null;
  // value may be seconds (iat) or ISO string or ms
  let d;
  if (typeof value === 'number') {
    // if looks like seconds (10 digits) convert to ms
    d = new Date(value > 1e12 ? value : value * 1000);
  } else if (typeof value === 'string') {
    // try ISO or numeric string
    const n = Number(value);
    if (!Number.isNaN(n)) {
      d = new Date(n > 1e12 ? n : n * 1000);
    } else {
      d = new Date(value);
    }
  } else {
    return null;
  }
  if (isNaN(d.getTime())) return null;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export default function Perfil() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  // Prefer profile loaded from backend; fallback to token claims
  const raw = profile || (user?.raw) || {};

  // normalize tipo to detect user kind
  const tipoStr = (raw.tipo || '').toString().toLowerCase();
  const isEntidade = Boolean(
    tipoStr.includes('entidade') || tipoStr.includes('org') || raw.cnpj
  );
  const isVoluntario = Boolean(tipoStr.includes('volunt')) && !isEntidade;

  // joined date candidates: createdAt, created_at, iat, issued_at, registeredAt
  const possibleDates = [raw.createdAt, raw.created_at, raw.iat, raw.iat_at, raw.issue_at, raw.issued_at, raw.registeredAt, raw.registered_at, raw.createdOn];
  let joined = possibleDates.map(formatDateFromTimestamp).find(Boolean) || null;
  // fallback: try token claims (user.raw) for issued at (iat) if profile didn't include createdAt
  if (!joined) {
    const tokenRaw = user?.raw || {};
    const tokenDates = [tokenRaw.iat, tokenRaw.iat_at, tokenRaw.registeredAt, tokenRaw.createdAt, tokenRaw.created_at];
    joined = tokenDates.map(formatDateFromTimestamp).find(Boolean) || null;
  }

  // ensure a consistent displayed email
  const displayEmail = raw.email || user?.email || 'Não informado';

  useEffect(() => {
    if (!user) return;

    let mounted = true;

    async function fetchProfile() {
      setIsLoading(true);
      setFetchError(null);
      try {
        // call the definitive endpoint implemented in backend
        const res = await api.get('/auth/me');
        console.log('[perfil] /auth/me response:', res);
        if (!mounted) return;
        const data = res.data?.user || res.data || null;
        console.log('[perfil] parsed profile data:', data);
        if (data) {
          setProfile(data);
        } else {
          setFetchError('Resposta inesperada do servidor ao buscar perfil.');
        }
      } catch (err) {
        console.error('[perfil] error fetching /auth/me', err);
        setFetchError('Não foi possível carregar os dados do perfil.');
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    fetchProfile();
    return () => { mounted = false; };
  }, [user]);

  // guard if not logged in (AFTER all hooks)
  if (!user) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center p-8 bg-white rounded-2xl border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Você não está logado</h3>
          <p className="text-sm text-gray-600 mt-2">Acesse sua conta para ver o perfil.</p>
          <div className="mt-6 flex justify-center">
            <Link to="/login" className="px-4 py-2 bg-rose-600 text-white rounded-md">Ir para Login</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-2xl w-full space-y-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Voltar para Home
        </Link>

        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-rose-600 rounded-xl flex items-center justify-center mb-4">
            {isEntidade ? <Building2 className="h-8 w-8 text-white" /> : <Heart className="h-8 w-8 text-white fill-current" />}
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Meu Perfil</h2>
          <p className="mt-2 text-gray-600">Informações da sua conta</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {isLoading && (
            <div className="p-4 bg-slate-50 rounded mb-4 text-sm text-gray-600">Carregando dados do perfil...</div>
          )}
          {fetchError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
              <p className="text-sm text-red-700">{fetchError}</p>
            </div>
          )}
          {isEntidade ? (
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-700">Nome (Fantasia)</div>
                <div className="font-semibold text-lg">{raw.nomeFantasia || raw.nome || user.name || 'Entidade'}</div>
              </div>

              <div>
                <div className="text-sm text-gray-700">E-mail</div>
                <div className="font-medium text-sm">{displayEmail}</div>
              </div>

              <div>
                <div className="text-sm text-gray-700">Telefone</div>
                <div className="font-medium text-sm">{raw.telefone || raw.phone || raw.contact || raw.contactPhone || 'Não informado'}</div>
              </div>

              <div>
                <div className="text-sm text-gray-700">Endereço</div>
                <div className="font-medium text-sm">
                  {raw.endereco?.rua || raw.rua || raw.logradouro || ''}{raw.endereco?.numero || raw.numero ? `, ${raw.endereco?.numero || raw.numero}` : ''}{raw.endereco?.bairro || raw.bairro ? ` - ${raw.endereco?.bairro || raw.bairro}` : ''}
                  {(raw.endereco?.cidade || raw.cidade || raw.estado) ? ` — ${raw.endereco?.cidade || raw.cidade || ''}${raw.endereco?.estado || raw.estado ? `/${raw.endereco?.estado || raw.estado}` : ''}` : ''}
                  {raw.endereco?.cep || raw.cep ? ` — CEP: ${raw.endereco?.cep || raw.cep}` : ''}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-700">Área de atuação</div>
                <div className="font-medium text-sm">{raw.areaAtuacao || raw.areaDeAtuacao || 'Não informado'}</div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-700">Nome</div>
                <div className="font-semibold text-lg">{raw.nome || user.name || 'Voluntário'}</div>
              </div>

              <div>
                <div className="text-sm text-gray-700">E-mail</div>
                <div className="font-medium text-sm">{displayEmail}</div>
              </div>

              <div>
                <div className="text-sm text-gray-700">Locais de preferência</div>
                <div className="font-medium text-sm">
                  {(() => {
                    const pref = raw.preferredCities ?? raw.preferred_locations ?? raw.cidades ?? raw.cities ?? raw.preferred;
                    if (Array.isArray(pref)) return pref.join(', ');
                    return pref || 'Não informado';
                  })()}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-700">Juntou-se em</div>
                <div className="font-medium text-sm">{joined || 'Data não disponível'}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
