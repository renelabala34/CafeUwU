import { Clock, CreditCard, Truck, Calendar, HeadphonesIcon, Package } from "lucide-react";

export default function TermsSection() {
  const rules = [
    {
      icon: HeadphonesIcon,
      title: "Atención Permanente",
      description: "Nuestro equipo está disponible para consultas y soporte las 24 horas.",
      color: "bg-tomato-100 text-tomato-700",
    },
    {
      icon: Clock,
      title: "Gestión de Pedidos",
      description: "La recepción de órdenes se realiza exclusivamente de 7:00 a.m. a 7:00 p.m.",
      color: "bg-warm-100 text-warm-700",
    },
    {
      icon: Calendar,
      title: "Programación",
      description: "Para garantizar un servicio óptimo, cada pedido requiere 24 horas de antelación.",
      color: "bg-olive-100 text-olive-700",
    },
    {
      icon: CreditCard,
      title: "Método de Pago (Producto)",
      description: "Se requiere el 50% mediante transferencia y el 50% restante en efectivo en caso de que el pago sea por transferencia.",
      color: "bg-tomato-100 text-tomato-700",
    },
    {
      icon: Truck,
      title: "Logística y Entrega",
      description: "Contamos con una tarifa de mensajería de $200 en toda la zona de Alamar.",
      color: "bg-warm-100 text-warm-700",
    },
    {
      icon: Package,
      title: "Pago de Mensajería",
      description: "El costo del envío debe ser cubierto íntegramente en efectivo.",
      color: "bg-olive-100 text-olive-700",
    },
  ];

  return (
    <section className="bg-gradient-to-br from-cream-50 to-warm-50 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12">
          <p className="text-sm sm:text-base font-bold text-tomato-600 uppercase tracking-wider mb-2">
            Nuestras Reglas de Servicio
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-tomato-900 mb-3">
            Calidad y Exclusividad
          </h2>
          <p className="text-sm sm:text-base text-tomato-600 max-w-2xl mx-auto">
            En I'MAS nos comprometemos a brindarte la mejor experiencia. Estas son nuestras reglas fundamentales.
          </p>
        </div>

        {/* Rules Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {rules.map((rule, index) => {
            const Icon = rule.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-lg border border-tomato-100/60 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${rule.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-tomato-900 text-sm sm:text-base mb-2">
                      {index + 1}. {rule.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-tomato-600 leading-relaxed">
                      {rule.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <div className="mt-10 sm:mt-12 text-center">
          <p className="text-xs sm:text-sm text-tomato-500 italic">
            Gracias por confiar en I'MAS. Tu satisfacción es nuestra prioridad.
          </p>
        </div>
      </div>
    </section>
  );
}
