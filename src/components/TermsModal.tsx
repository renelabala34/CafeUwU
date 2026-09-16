import { X, Clock, CreditCard, Truck, Calendar, HeadphonesIcon, Package } from "lucide-react";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TermsModal({ isOpen, onClose }: TermsModalProps) {
  if (!isOpen) return null;

  const rules = [
    {
      icon: HeadphonesIcon,
      title: "Atención Permanente",
      description: "Nuestro equipo está disponible para consultas y soporte las 24 horas.",
    },
    {
      icon: Clock,
      title: "Gestión de Pedidos",
      description: "La recepción de órdenes se realiza exclusivamente de 7:00 a.m. a 7:00 p.m.",
    },
    {
      icon: Calendar,
      title: "Programación",
      description: "Para garantizar un servicio óptimo, cada pedido requiere 24 horas de antelación.",
    },
    {
      icon: CreditCard,
      title: "Método de Pago (Producto)",
      description: "Se requiere el 50% mediante transferencia y el 50% restante en efectivo en caso de que el pago sea por transferencia.",
    },
    {
      icon: Truck,
      title: "Logística y Entrega",
      description: "Contamos con una tarifa de mensajería de $200 en toda la zona de Alamar.",
    },
    {
      icon: Package,
      title: "Pago de Mensajería",
      description: "El costo del envío debe ser cubierto íntegramente en efectivo.",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-tomato-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-xl font-black text-tomato-900">Reglas de Servicio</h2>
            <p className="text-sm text-tomato-600">Calidad y Exclusividad</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-tomato-50 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-tomato-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {rules.map((rule, index) => {
            const Icon = rule.icon;
            return (
              <div
                key={index}
                className="flex items-start gap-4 p-4 bg-cream-50 rounded-xl border border-tomato-100/60"
              >
                <div className="w-10 h-10 rounded-lg bg-tomato-100 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-tomato-700" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-tomato-900 text-sm mb-1">
                    {index + 1}. {rule.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-tomato-600 leading-relaxed">
                    {rule.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-tomato-100 px-6 py-4 rounded-b-2xl">
          <button
            onClick={onClose}
            className="w-full py-3 bg-tomato-600 hover:bg-tomato-700 text-white font-bold rounded-full transition-all duration-200 active:scale-[0.98]"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
