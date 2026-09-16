import { useState } from "react";
import { ArrowLeft, MessageCircle, ShoppingBag, MapPin, User, Phone } from "lucide-react";
import { useCart } from "../context/CartContext";

interface CheckoutProps {
  onBack: () => void;
}

const WHATSAPP_NUMBER = "5356803949";

export default function Checkout({ onBack }: CheckoutProps) {
  const { items, totalPrice, clearCart } = useCart();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    notes: "",
  });
  const [sent, setSent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const buildWhatsAppMessage = () => {
    const lines: string[] = [];
    lines.push("🛒 *Nuevo Pedido - Origen Coffee*");
    lines.push("");
    lines.push("👤 *Cliente:* " + formData.name);
    lines.push("📱 *Teléfono:* " + formData.phone);
    lines.push("📍 *Dirección:* " + formData.address);
    if (formData.notes.trim()) {
      lines.push("📝 *Notas:* " + formData.notes);
    }
    lines.push("");
    lines.push("━━━━━━━━━━━━━━━━━━━━");
    lines.push("*Productos:*");
    lines.push("");
    items.forEach((item, i) => {
      lines.push(`${i + 1}. ${item.product.name}`);
      lines.push(`   Cantidad: ${item.quantity} × €${item.product.price.toFixed(2)}`);
      lines.push(`   Subtotal: €${(item.product.price * item.quantity).toFixed(2)}`);
      lines.push("");
    });
    lines.push("━━━━━━━━━━━━━━━━━━━━");
    lines.push(`💰 *TOTAL: €${totalPrice.toFixed(2)}*`);
    lines.push("");
    lines.push("¡Gracias por tu pedido! ☕");
    return lines.join("\n");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = buildWhatsAppMessage();
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, "_blank");
    clearCart();
    setSent(true);
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50 px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-coffee-900 mb-3">
            ¡Pedido enviado!
          </h2>
          <p className="text-coffee-600 mb-2">
            Tu pedido se ha abierto en WhatsApp.
          </p>
          <p className="text-sm text-coffee-400 mb-8">
            Presiona enviar en WhatsApp para completar tu pedido. Te responderemos lo antes posible.
          </p>
          <button
            onClick={onBack}
            className="px-8 py-3.5 bg-coffee-800 hover:bg-coffee-900 text-white font-semibold rounded-full transition-all duration-200 hover:shadow-lg active:scale-[0.98]"
          >
            Volver a la tienda
          </button>
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

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium mb-4">
            <MessageCircle className="w-4 h-4" />
            Pedido vía WhatsApp
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-coffee-900 mb-2">
            Finaliza tu pedido
          </h1>
          <p className="text-coffee-500 text-sm sm:text-base">
            Completa tus datos y te enviaremos el pedido por WhatsApp
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-coffee-100/60">
              <h2 className="text-lg font-bold text-coffee-900 mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-coffee-500" />
                Tus datos
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-coffee-700 mb-1.5">
                    Nombre completo *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-coffee-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Juan García"
                      className="w-full pl-10 pr-4 py-3 bg-cream-50 border border-coffee-200/60 rounded-xl text-sm text-coffee-800 placeholder:text-coffee-300 focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-coffee-700 mb-1.5">
                    Teléfono *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-coffee-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="+34 612 345 678"
                      className="w-full pl-10 pr-4 py-3 bg-cream-50 border border-coffee-200/60 rounded-xl text-sm text-coffee-800 placeholder:text-coffee-300 focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-coffee-700 mb-1.5">
                    Dirección de entrega *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-coffee-400" />
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      placeholder="Calle, número, piso, ciudad, código postal"
                      rows={3}
                      className="w-full pl-10 pr-4 py-3 bg-cream-50 border border-coffee-200/60 rounded-xl text-sm text-coffee-800 placeholder:text-coffee-300 focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400 transition-all resize-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-coffee-700 mb-1.5">
                    Notas adicionales (opcional)
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Instrucciones especiales, horario preferido de entrega..."
                    rows={2}
                    className="w-full px-4 py-3 bg-cream-50 border border-coffee-200/60 rounded-xl text-sm text-coffee-800 placeholder:text-coffee-300 focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400 transition-all resize-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-6 py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-green-500/20 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Enviar pedido por WhatsApp
              </button>
              <p className="text-xs text-coffee-400 text-center mt-3">
                Se abrirá WhatsApp con tu pedido prellenado
              </p>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-coffee-100/60 sticky top-24">
              <h3 className="font-bold text-coffee-900 mb-4 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-coffee-500" />
                Tu pedido
              </h3>
              <div className="space-y-3 mb-4 max-h-80 overflow-y-auto scrollbar-hide">
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
                      <p className="text-xs text-coffee-500">
                        {item.quantity} × €{item.product.price.toFixed(2)}
                      </p>
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
                  <span className="text-green-600 font-medium">A coordinar</span>
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
