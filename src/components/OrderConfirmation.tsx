import { Check } from "lucide-react";

export default function OrderConfirmation({ onBackToShop }: { onBackToShop: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-50 px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-coffee-900 mb-3">
          ¡Pedido confirmado!
        </h2>
        <p className="text-coffee-600 mb-2">
          Tu café de especialidad está en camino.
        </p>
        <p className="text-sm text-coffee-400 mb-8">
          Recibirás un email con los detalles del seguimiento.
        </p>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-coffee-100/60 mb-8">
          <p className="text-xs text-coffee-500 uppercase tracking-wider mb-2">Número de pedido</p>
          <p className="text-lg font-mono font-bold text-coffee-800">
            #ORC-{Math.random().toString(36).substring(2, 8).toUpperCase()}
          </p>
        </div>
        <button
          onClick={onBackToShop}
          className="px-8 py-3.5 bg-coffee-800 hover:bg-coffee-900 text-white font-semibold rounded-full transition-all duration-200 hover:shadow-lg active:scale-[0.98]"
        >
          Volver a la tienda
        </button>
      </div>
    </div>
  );
}
