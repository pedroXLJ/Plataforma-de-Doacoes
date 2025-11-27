import React from 'react';
import { X, Heart } from 'lucide-react';

export default function DonationModal({ isOpen, onClose, userProfile, event, onSuccess }) {
  if (!isOpen) return null;

  const displayName = userProfile?.nome || 'Usuário';
  const displayEmail = userProfile?.email || 'não informado';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Heart className="h-6 w-6 text-rose-600 fill-current" />
            <h2 className="text-2xl font-bold text-gray-900">Fazer Doação</h2>
          </div>
          <p className="text-sm text-gray-600">Contribua com {event.organization}</p>
        </div>

        {/* User Info */}
        <div className="bg-slate-50 rounded-lg p-4 mb-6 space-y-2">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Nome</p>
            <p className="font-semibold text-gray-900">{displayName}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">E-mail</p>
            <p className="font-semibold text-gray-900 break-all">{displayEmail}</p>
          </div>
        </div>

        {/* Donation Event Info */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Doando para</p>
          <p className="font-semibold text-gray-900">{event.title}</p>
          <p className="text-sm text-gray-600 mt-1">{event.organization}</p>
        </div>

        {/* QR Code Template */}
        <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 mb-6 flex flex-col items-center justify-center">
          <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
            <img
              src="https://via.placeholder.com/200x200?text=QR+Code+Pix"
              alt="QR Code Pix"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <p className="text-xs text-gray-500 mt-3 text-center">
            Escaneie o código QR com seu celular para fazer o pagamento via Pix
          </p>
        </div>

        {/* Pix Key (optional display) */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-xs text-yellow-800 uppercase tracking-wide font-semibold mb-2">Chave Pix</p>
          <p className="text-sm font-mono text-yellow-900 break-all">chave-pix@organizacao.com.br</p>
          <p className="text-xs text-yellow-700 mt-2">Copie a chave caso o QR code não funcione</p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => {
              if (onSuccess) {
                onSuccess();
              } else {
                alert('Obrigado! Sua doação foi registrada. (Simulação)');
              }
              onClose();
            }}
            className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg transition-all transform hover:scale-[1.01] flex items-center justify-center gap-2"
          >
            <Heart className="h-5 w-5 fill-current" />
            Confirmar Doação
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg transition-colors"
          >
            Cancelar
          </button>
        </div>

        <p className="text-xs text-center text-gray-500 mt-4">
          Esta é uma simulação. Nenhuma transação real será realizada.
        </p>
      </div>
    </div>
  );
}
