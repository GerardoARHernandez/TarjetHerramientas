// src/views/TerminosCondiciones.jsx
import { Link } from "react-router-dom";
import ClientHeader from "../components/ClientHeader";
import ClientFooter from "../components/ClientFooter";
import { useTheme } from "../context/ThemeContext";

const TerminosCondiciones = () => {
  const { isDark } = useTheme();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <ClientHeader esTitular={true} />

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Términos y Condiciones
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Lee detenidamente los términos de uso de nuestro servicio de cashback
            </p>
          </div>
          <Link
            to="/digitalwallet/client"
            className="inline-flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver al inicio
          </Link>
        </div>

        {/* Contenido de Términos y Condiciones */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-300 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-300 dark:border-gray-700">
            <h2 className="font-semibold text-gray-800 dark:text-white">
              Términos de Uso del Servicio Cashback
            </h2>
          </div>
          
          <div className="px-6 py-8 space-y-6 text-gray-700 dark:text-gray-300">
            {/* Sección 1: Descripción del Servicio */}
            <section>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                1. Descripción del Servicio
              </h3>
              <p className="leading-relaxed">
                El presente servicio de cashback permite a los usuarios realizar recargas de dinero real en su tarjeta 
                virtual y posteriormente canjear el saldo acumulado conforme a las reglas establecidas. El usuario declara 
                conocer y aceptar que el saldo en su cuenta no genera intereses y está sujeto a las condiciones de uso.
              </p>
            </section>

            {/* Sección 2: Datos Personales */}
            <section>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                2. Datos Personales
              </h3>
              <p className="leading-relaxed mb-2">
                Para hacer uso del servicio, el usuario deberá proporcionar la siguiente información personal:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Nombre completo</li>
                <li>Número de teléfono</li>
                <li>Correo electrónico</li>
              </ul>
              <p className="leading-relaxed mt-3">
                El usuario garantiza que los datos proporcionados son verdaderos, exactos y completos. La plataforma se 
                reserva el derecho de verificar la autenticidad de la información y solicitar documentación adicional si 
                se considera necesario.
              </p>
            </section>

            {/* Sección 3: Recargas de Saldo */}
            <section>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                3. Recargas de Saldo
              </h3>
              <p className="leading-relaxed">
                Las recargas de saldo se realizan con dinero real a través de los métodos de pago disponibles en la 
                plataforma. Una vez realizada la recarga, el saldo se verá reflejado en la cuenta del usuario y podrá 
                ser utilizado para canjear productos, servicios o beneficios conforme al programa de cashback.
              </p>
            </section>

            {/* Sección 4: Canje de Saldo */}
            <section>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                4. Canje de Saldo
              </h3>
              <p className="leading-relaxed">
                El usuario podrá canjear su saldo disponible en cualquier momento, siempre que cumpla con los requisitos 
                establecidos para cada tipo de canje. Los canjes son irrevocables una vez procesados y el saldo utilizado 
                no podrá ser reembolsado ni transferido a terceros.
              </p>
            </section>

            {/* Sección 5: Responsabilidades del Usuario */}
            <section>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                5. Responsabilidades del Usuario
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Mantener la confidencialidad de sus credenciales de acceso.</li>
                <li>Notificar de inmediato cualquier actividad no autorizada en su cuenta.</li>
                <li>No utilizar el servicio para actividades fraudulentas o ilegales.</li>
                <li>Cumplir con las políticas de uso establecidas por la plataforma.</li>
              </ul>
            </section>

            {/* Sección 6: Modificaciones */}
            <section>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                6. Modificaciones a los Términos
              </h3>
              <p className="leading-relaxed">
                Nos reservamos el derecho de modificar estos términos y condiciones en cualquier momento. Las modificaciones 
                serán notificadas a través de la plataforma y entrarán en vigor inmediatamente después de su publicación. 
                Se recomienda al usuario revisar periódicamente estos términos para estar informado de cualquier cambio.
              </p>
            </section>

            {/* Fecha de actualización */}
            <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
              <p>Última actualización: 30 de marzo de 2026</p>
            </div>
          </div>
        </div>
      </main>

      <ClientFooter />
    </div>
  );
};

export default TerminosCondiciones;