import { useState } from "react";
import { ArrowLeft, MessageCircle, ShoppingBag, MapPin, User, Phone, Clock, Info } from "lucide-react";
import { useCart } from "../context/CartContext";
import { businessInfo } from "../data/menu";

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

  const deliveryFee = totalPrice > 0 ? businessInfo.delivery_fee : 0;
  const grandTotal = totalPrice + deliveryFee;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const buildWhatsAppMessage = () => {
    const lines: string[] = [];
    lines.push("🛒 *Nuevo Pedido — I'MAS*");
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
    items.forEach((ci, i) => {
      lines.push(`${i + 1}. ${ci.item.name}`);
      lines.push(`   ${ci.quantity} × $${ci.item.price} = $${ci.item.price * ci.quantity} CUP`);
    });
    lines.push("");
    lines.push("━━━━━━━━━━━━━━━━━━━━");
    lines.push(`Subtotal: $${totalPrice} CUP`);
    lines.push(`Envío: $${deliveryFee} CUP`);
    lines.push(`💰 *TOTAL: $${grandTotal} CUP*`);
    lines.push("");
    lines.push("💳 *Pago:* " + businessInfo.payment_policy);
    lines.push("");
    lines.push("¡Gracias por tu pedido! 🍽️");
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
          <div className="w-20 h-20 bg-olive-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageCircle className="w-10 h-10 text-olive-700" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-tomato-900 mb-3">¡Pedido enviado!</h2>
          <p className="text-tomato-700 mb-2">Tu pedido se ha abierto en WhatsApp.</p>
          <p className="text-sm text-tomato-500 mb-8">
            Presiona enviar en WhatsApp para completar. Te responderemos en menos de {businessInfo.lead_time_hours}h.
          </p>
          <button
            onClick={onBack}
            className="px-8 py-3.5 bg-tomato-600 hover:bg-tomato-700 text-white font-bold rounded-full transition-all duration-200 hover:shadow-lg active:scale-[0.98]"
          >
            Volver al menú
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-tomato-600 hover:text-tomato-800 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Volver al menú</span>
        </button>

        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-bold mb-4">
            <MessageCircle className="w-4 h-4" />
            Pedido vía WhatsApp
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-tomato-900 mb-2">Finaliza tu pedido</h1>
          <p className="text-tomato-600 text-sm sm:text-base">
            Completa tus datos y te enviaremos el pedido por WhatsApp
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-tomato-100/60">
              <h2 className="text-lg font-black text-tomato-900 mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-tomato-500" />
                Tus datos
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-tomato-800 mb-1.5">Nombre completo *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tomato-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Tu nombre"
                      className="w-full pl-10 pr-4 py-3 bg-cream-50 border border-tomato-100 rounded-xl text-sm text-tomato-900 placeholder:text-tomato-300 focus:outline-none focus:ring-2 focus:ring-warm-400/50 focus:border-warm-400 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-tomato-800 mb-1.5">Teléfono *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tomato-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="+53 XXXXXXXX"
                      className="w-full pl-10 pr-4 py-3 bg-cream-50 border border-tomato-100 rounded-xl text-sm text-tomato-900 placeholder:text-tomato-300 focus:outline-none focus:ring-2 focus:ring-warm-400/50 focus:border-warm-400 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-tomato-800 mb-1.5">Dirección de entrega *</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-tomato-400" />
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      placeholder="Dirección completa en Alamar"
                      rows={3}
                      className="w-full pl-10 pr-4 py-3 bg-cream-50 border border-tomato-100 rounded-xl text-sm text-tomato-900 placeholder:text-tomato-300 focus:outline-none focus:ring-2 focus:ring-warm-400/50 focus:border-warm-400 transition-all resize-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-tomato-800 mb-1.5">Notas (opcional)</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Instrucciones especiales..."
                    rows={2}
                    className="w-full px-4 py-3 bg-cream-50 border border-tomato-100 rounded-xl text-sm text-tomato-900 placeholder:text-tomato-300 focus:outline-none focus:ring-2 focus:ring-warm-400/50 focus:border-warm-400 transition-all resize-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-6 py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-green-500/20 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Enviar pedido por WhatsApp
              </button>
            </form>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-tomato-100/60 sticky top-24">
              <h3 className="font-black text-tomato-900 mb-4 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-tomato-500" />
                Tu pedido
              </h3>
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto scrollbar-hide">
                {items.map((ci) => (
                  <div key={ci.item.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cream-100 to-warm-100 flex items-center justify-center shrink-0">
                      <span className="text-lg">{ci.item.emoji}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-tomato-900 truncate">{ci.item.name}</p>
                      <p className="text-xs text-tomato-500">{ci.quantity} × ${ci.item.price}</p>
                    </div>
                    <span className="text-sm font-black text-tomato-800">${ci.item.price * ci.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-tomato-100 pt-4 space-y-1.5">
                <div className="flex justify-between text-sm text-tomato-600">
                  <span>Subtotal</span>
                  <span>${totalPrice} CUP</span>
                </div>
                <div className="flex justify-between text-sm text-tomato-600">
                  <span>Envío</span>
                  <span>${deliveryFee} CUP</span>
                </div>
                <div className="flex justify-between text-lg font-black text-tomato-900 pt-2 border-t border-tomato-100">
                  <span>Total</span>
                  <span>${grandTotal} CUP</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-warm-50 rounded-xl border border-warm-200">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-warm-700 shrink-0 mt-0.5" />
                  <div className="text-xs text-warm-800 leading-relaxed">
                    <p className="font-bold mb-1">Política de pago:</p>
                    <p>{businessInfo.payment_policy}</p>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-tomato-500">
                <Clock className="w-3.5 h-3.5" />
                <span>Entrega estimada: {businessInfo.lead_time_hours}h</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
