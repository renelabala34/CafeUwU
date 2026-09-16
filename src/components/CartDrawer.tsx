import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export default function CartDrawer({ isOpen, onClose, onCheckout }: CartDrawerProps) {
  const { items, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-coffee-950/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col animate-[slideIn_0.3s_ease]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-coffee-100">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-coffee-700" />
            <h2 className="text-lg font-bold text-coffee-900">Tu Carrito</h2>
            {totalItems > 0 && (
              <span className="px-2 py-0.5 bg-coffee-100 text-coffee-600 text-xs font-medium rounded-full">
                {totalItems} {totalItems === 1 ? "artículo" : "artículos"}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-coffee-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-coffee-600" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-hide">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 bg-cream-100 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8 text-coffee-300" />
              </div>
              <p className="text-coffee-600 font-medium mb-1">Tu carrito está vacío</p>
              <p className="text-sm text-coffee-400">Explora nuestros cafés y encuentra tu favorito</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-4 p-3 bg-cream-50 rounded-xl border border-coffee-100/50"
              >
                {/* Image */}
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover shrink-0"
                />

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm text-coffee-900 truncate">
                    {item.product.name}
                  </h4>
                  <p className="text-xs text-coffee-500 mt-0.5">
                    {item.product.weight} · {item.product.roast}
                  </p>

                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity controls */}
                    <div className="flex items-center gap-1.5 bg-white rounded-full border border-coffee-200/60 p-0.5">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-cream-100 transition-colors"
                      >
                        <Minus className="w-3 h-3 text-coffee-600" />
                      </button>
                      <span className="w-6 text-center text-sm font-semibold text-coffee-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-cream-100 transition-colors"
                      >
                        <Plus className="w-3 h-3 text-coffee-600" />
                      </button>
                    </div>

                    {/* Price */}
                    <span className="font-bold text-sm text-coffee-900">
                      €{(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="self-start p-1.5 hover:bg-red-50 rounded-full transition-colors group"
                >
                  <Trash2 className="w-4 h-4 text-coffee-300 group-hover:text-red-500 transition-colors" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-coffee-100 p-5 space-y-4 bg-cream-50/50">
            {/* Summary */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-coffee-600">
                <span>Subtotal</span>
                <span>€{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-coffee-600">
                <span>Envío</span>
                <span className="text-green-600 font-medium">Gratis</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-coffee-900 pt-2 border-t border-coffee-200/50">
                <span>Total</span>
                <span>€{totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={onCheckout}
              className="w-full py-3.5 bg-coffee-800 hover:bg-coffee-900 text-white font-semibold rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-coffee-800/20 active:scale-[0.98]"
            >
              Proceder al pago
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
