import { useState } from "react";
import { ArrowLeft, CreditCard, Truck, Check, Lock } from "lucide-react";
import { useCart } from "../context/CartContext";

interface CheckoutProps {
  onBack: () => void;
  onComplete: () => void;
}

export default function Checkout({ onBack, onComplete }: CheckoutProps) {
  const { items, totalPrice, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    zip: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  });
  const [processing, setProcessing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      setProcessing(true);
      setTimeout(() => {
        clearCart();
        setProcessing(false);
        onComplete();
      }, 2000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (processing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-coffee-200 border-t-coffee-700 rounded-full animate-spin mx-auto mb-6" />
          <h2 className="text-xl font-bold text-coffee-900 mb-2">Procesando tu pedido...</h2>
          <p className="text-coffee-500">Estamos preparando tu café de especialidad</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        {/* Back button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-coffee-600 hover:text-coffee-800 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Volver a la tienda</span>
        </button>

        {/* Progress steps */}
        <div className="flex items-center justify-center mb-10">
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              step >= 1 ? "bg-coffee-800 text-white" : "bg-coffee-100 text-coffee-400"
            }`}>
              <Truck className="w-4 h-4" />
              <span className="hidden sm:inline">Envío</span>
            </div>
            <div className="w-8 h-0.5 bg-coffee-200">
              <div className={`h-full bg-coffee-700 transition-all duration-500 ${step >= 2 ? "w-full" : "w-0"}`} />
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              step >= 2 ? "bg-coffee-800 text-white" : "bg-coffee-100 text-coffee-400"
            }`}>
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">Pago</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-coffee-100/60">
                  <h2 className="text-xl font-bold text-coffee-900 mb-6">Información de envío</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-coffee-700 mb-1.5">
                        Nombre completo
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Juan García"
                        className="w-full px-4 py-3 bg-cream-50 border border-coffee-200/60 rounded-xl text-sm text-coffee-800 placeholder:text-coffee-300 focus:outline-none focus:ring-2 focus:ring-warm-400/50 focus:border-warm-400 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-coffee-700 mb-1.5">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="juan@email.com"
                        className="w-full px-4 py-3 bg-cream-50 border border-coffee-200/60 rounded-xl text-sm text-coffee-800 placeholder:text-coffee-300 focus:outline-none focus:ring-2 focus:ring-warm-400/50 focus:border-warm-400 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-coffee-700 mb-1.5">
                        Dirección
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        placeholder="Calle del Café 123, 2ºB"
                        className="w-full px-4 py-3 bg-cream-50 border border-coffee-200/60 rounded-xl text-sm text-coffee-800 placeholder:text-coffee-300 focus:outline-none focus:ring-2 focus:ring-warm-400/50 focus:border-warm-400 transition-all"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-coffee-700 mb-1.5">
                          Ciudad
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          required
                          placeholder="Madrid"
                          className="w-full px-4 py-3 bg-cream-50 border border-coffee-200/60 rounded-xl text-sm text-coffee-800 placeholder:text-coffee-300 focus:outline-none focus:ring-2 focus:ring-warm-400/50 focus:border-warm-400 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-coffee-700 mb-1.5">
                          Código postal
                        </label>
                        <input
                          type="text"
                          name="zip"
                          value={formData.zip}
                          onChange={handleChange}
                          required
                          placeholder="28001"
                          className="w-full px-4 py-3 bg-cream-50 border border-coffee-200/60 rounded-xl text-sm text-coffee-800 placeholder:text-coffee-300 focus:outline-none focus:ring-2 focus:ring-warm-400/50 focus:border-warm-400 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full mt-6 py-3.5 bg-coffee-800 hover:bg-coffee-900 text-white font-semibold rounded-full transition-all duration-200 hover:shadow-lg active:scale-[0.98]"
                  >
                    Continuar al pago
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-coffee-100/60">
                  <div className="flex items-center gap-2 mb-6">
                    <Lock className="w-4 h-4 text-green-600" />
                    <h2 className="text-xl font-bold text-coffee-900">Pago seguro</h2>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-coffee-700 mb-1.5">
                        Número de tarjeta
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        required
                        placeholder="4242 4242 4242 4242"
                        maxLength={19}
                        className="w-full px-4 py-3 bg-cream-50 border border-coffee-200/60 rounded-xl text-sm text-coffee-800 placeholder:text-coffee-300 focus:outline-none focus:ring-2 focus:ring-warm-400/50 focus:border-warm-400 transition-all"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-coffee-700 mb-1.5">
                          Fecha de expiración
                        </label>
                        <input
                          type="text"
                          name="cardExpiry"
                          value={formData.cardExpiry}
                          onChange={handleChange}
                          required
                          placeholder="MM/AA"
                          maxLength={5}
                          className="w-full px-4 py-3 bg-cream-50 border border-coffee-200/60 rounded-xl text-sm text-coffee-800 placeholder:text-coffee-300 focus:outline-none focus:ring-2 focus:ring-warm-400/50 focus:border-warm-400 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-coffee-700 mb-1.5">
                          CVC
                        </label>
                        <input
                          type="text"
                          name="cardCvc"
                          value={formData.cardCvc}
                          onChange={handleChange}
                          required
                          placeholder="123"
                          maxLength={4}
                          className="w-full px-4 py-3 bg-cream-50 border border-coffee-200/60 rounded-xl text-sm text-coffee-800 placeholder:text-coffee-300 focus:outline-none focus:ring-2 focus:ring-warm-400/50 focus:border-warm-400 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-6 py-3.5 border border-coffee-200 text-coffee-700 font-medium rounded-full hover:bg-coffee-50 transition-all"
                    >
                      Atrás
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3.5 bg-coffee-800 hover:bg-coffee-900 text-white font-semibold rounded-full transition-all duration-200 hover:shadow-lg active:scale-[0.98]"
                    >
                      Pagar €{totalPrice.toFixed(2)}
                    </button>
                  </div>
                  <p className="text-xs text-coffee-400 text-center mt-4 flex items-center justify-center gap-1">
                    <Lock className="w-3 h-3" />
                    Pago simulado — no se realizará ningún cargo
                  </p>
                </div>
              )}
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-coffee-100/60 sticky top-24">
              <h3 className="font-bold text-coffee-900 mb-4">Resumen del pedido</h3>
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-coffee-800 truncate">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-coffee-500">x{item.quantity}</p>
                    </div>
                    <span className="text-sm font-semibold text-coffee-900">
                      €{(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-coffee-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-coffee-600">
                  <span>Subtotal</span>
                  <span>€{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-coffee-600">
                  <span>Envío</span>
                  <span className="text-green-600 font-medium">Gratis</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-coffee-900 pt-2 border-t border-coffee-100">
                  <span>Total</span>
                  <span>€{totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function OrderConfirmation({ onBackToShop }: { onBackToShop: () => void }) {
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
