import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { businessInfo } from "../data/menu";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export default function CartDrawer({ isOpen, onClose, onCheckout }: CartDrawerProps) {
  const { items, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart();

  if (!isOpen) return null;

  const deliveryFee = totalPrice > 0 ? businessInfo.delivery_fee : 0;
  const grandTotal = totalPrice + deliveryFee;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-tomato-950/50 backdrop-blur-sm" onClick={onClose} />

      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col animate-[slideIn_0.3s_ease]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-tomato-100">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-tomato-700" />
            <h2 className="text-lg font-black text-tomato-900">Tu Pedido</h2>
            {totalItems > 0 && (
              <span className="px-2 py-0.5 bg-tomato-100 text-tomato-700 text-xs font-bold rounded-full">
                {totalItems}
              </span>
            )}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-tomato-50 rounded-full transition-colors">
            <X className="w-5 h-5 text-tomato-600" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3 scrollbar-hide">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 bg-cream-100 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8 text-tomato-300" />
              </div>
              <p className="text-tomato-700 font-bold mb-1">Tu pedido está vacío</p>
              <p className="text-sm text-tomato-500">Añade productos del menú</p>
            </div>
          ) : (
            items.map((ci) => (
              <div key={ci.item.id} className="flex gap-3 p-3 bg-cream-50 rounded-xl border border-tomato-100/50">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-gradient-to-br from-cream-100 to-warm-100 flex items-center justify-center shrink-0">
                  <span className="text-2xl sm:text-3xl">{ci.item.emoji}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-tomato-900 truncate">{ci.item.name}</h4>
                  <p className="text-xs text-tomato-500 mt-0.5">{ci.item.unit}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1.5 bg-white rounded-full border border-tomato-200/60 p-0.5">
                      <button
                        onClick={() => updateQuantity(ci.item.id, ci.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-cream-100 transition-colors"
                      >
                        <Minus className="w-3 h-3 text-tomato-600" />
                      </button>
                      <span className="w-6 text-center text-sm font-bold text-tomato-800">{ci.quantity}</span>
                      <button
                        onClick={() => updateQuantity(ci.item.id, ci.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-cream-100 transition-colors"
                      >
                        <Plus className="w-3 h-3 text-tomato-600" />
                      </button>
                    </div>
                    <span className="font-black text-sm text-tomato-800">${ci.item.price * ci.quantity}</span>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(ci.item.id)}
                  className="self-start p-1.5 hover:bg-red-50 rounded-full transition-colors group"
                >
                  <Trash2 className="w-4 h-4 text-tomato-300 group-hover:text-red-500 transition-colors" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-tomato-100 p-5 space-y-3 bg-cream-50/50">
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm text-tomato-600">
                <span>Subtotal</span>
                <span>${totalPrice} CUP</span>
              </div>
              <div className="flex justify-between text-sm text-tomato-600">
                <span>Envío ({businessInfo.delivery_zone})</span>
                <span>${deliveryFee} CUP</span>
              </div>
              <div className="flex justify-between text-lg font-black text-tomato-900 pt-2 border-t border-tomato-200/50">
                <span>Total</span>
                <span>${grandTotal} CUP</span>
              </div>
            </div>
            <p className="text-[10px] text-tomato-500 text-center leading-relaxed">
              💳 {businessInfo.payment_policy}
            </p>
            <button
              onClick={onCheckout}
              className="w-full py-3.5 bg-tomato-600 hover:bg-tomato-700 text-white font-bold rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-tomato-600/20 active:scale-[0.98]"
            >
              Hacer pedido
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
