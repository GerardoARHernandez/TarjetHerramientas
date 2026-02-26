// src/apps/points/views/client/Privacity.jsx
import { useNavigate } from 'react-router-dom';
import { Shield, Camera, Database, Cookie, ArrowLeft, Lock, Eye, Info } from 'lucide-react';
import { useAuth } from '../../../../contexts/AuthContext';
import { useBusiness } from '../../../../contexts/BusinessContext';
import ClientHeader from '../../components/ClientHeader';
import ClientFooter from '../../components/ClientFooter';

const Privacity = () => {
  const { user } = useAuth();
  const { business } = useBusiness();
  const navigate = useNavigate();

  const userName = user?.name || 'Usuario';
  const businessName = business?.NegocioDesc || 'la aplicación';
  const color1 = business?.NegocioColor1 || '#FF9800';
  const color2 = business?.NegocioColor2 || '#FFC107';

  const sections = [
    {
      icon: <Camera className="w-6 h-6" />,
      title: "Uso de la Cámara",
      content: "Esta aplicación solicita acceso a la cámara de tu dispositivo únicamente para la funcionalidad de escaneo de códigos QR. Las imágenes no son almacenadas ni compartidas con terceros. El acceso a la cámara es opcional y puedes denegarlo en cualquier momento desde la configuración de tu dispositivo."
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "Datos Almacenados",
      content: "Recopilamos y almacenamos la siguiente información necesaria para el funcionamiento del programa de lealtad: nombre, teléfono, correo electrónico, historial de compras, puntos acumulados y sellos obtenidos. Esta información es utilizada exclusivamente para gestionar tu participación en el programa de lealtad."
    },
    {
      icon: <Cookie className="w-6 h-6" />,
      title: "Sesiones y Almacenamiento Local",
      content: "Utilizamos localStorage para mantener tu sesión activa y recordar tus preferencias. Esta información permanece en tu dispositivo y no es compartida con terceros. Puedes limpiar estos datos en cualquier momento desde la configuración de tu navegador."
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Seguridad de la Información",
      content: "Implementamos medidas de seguridad técnicas y organizativas para proteger tu información personal contra acceso no autorizado, pérdida o alteración. Tus datos son transmitidos mediante conexiones seguras (HTTPS) y almacenados de forma encriptada."
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Tus Derechos",
      content: "Tienes derecho a acceder, rectificar y solicitar la eliminación de tus datos personales en cualquier momento. Para ejercer estos derechos, puedes contactarnos a través del establecimiento o utilizar las opciones disponibles en la aplicación."
    }
  ];

  const fechaActualizacion = "16 de febrero de 2026";

  return (
    <>
      <div 
        className="min-h-screen"
        style={{ 
          background: `linear-gradient(to bottom right, ${color1}, ${color2})`,
          backgroundAttachment: 'fixed' 
        }}
      >
        <ClientHeader
          title="Aviso de Privacidad"
          userName={userName}
          businessName={businessName}
          showBackButton={true}
          onBack={() => navigate(-1)}
        />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Contenedor principal */}
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden mb-8">
            {/* Header del aviso */}
            <div 
              className="p-8 border-b"
              style={{ backgroundColor: `${color1}10` }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div 
                  className="p-3 rounded-2xl"
                  style={{ backgroundColor: `${color1}20` }}
                >
                  <Shield className="w-8 h-8" style={{ color: color1 }} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    Aviso de Privacidad
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Última actualización: {fechaActualizacion}
                  </p>
                </div>
              </div>
              
              <p className="text-gray-700 leading-relaxed">
                En {businessName}, nos tomamos muy en serio la protección de tus datos personales. 
                Este aviso de privacidad describe cómo recopilamos, utilizamos y protegemos tu 
                información cuando utilizas nuestra aplicación de programa de lealtad.
              </p>
            </div>

            {/* Secciones de información */}
            <div className="p-8 space-y-8">
              {sections.map((section, index) => (
                <div 
                  key={index}
                  className="border-b border-gray-400 last:border-0 pb-8 last:pb-0"
                >
                  <div className="flex items-start gap-4">
                    <div 
                      className="p-2 rounded-xl flex-shrink-0"
                      style={{ backgroundColor: `${color1}15` }}
                    >
                      <div style={{ color: color1 }}>
                        {section.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold text-gray-800 mb-2">
                        {section.title}
                      </h2>
                      <p className="text-gray-600 leading-relaxed">
                        {section.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Información adicional */}
              <div 
                className="mt-6 p-6 rounded-2xl"
                style={{ backgroundColor: `${color1}08` }}
              >
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: color1 }} />
                  <div className="text-sm text-gray-600">
                    <p className="font-medium text-gray-800 mb-2">Información adicional:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>No compartimos tus datos personales con terceros sin tu consentimiento explícito</li>
                      <li>Puedes solicitar la eliminación de tu cuenta y datos asociados en cualquier momento</li>
                      <li>Los datos de tus transacciones se conservan mientras mantengas una cuenta activa</li>
                      <li>Para cualquier duda sobre privacidad, contacta al establecimiento directamente</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Botón de regresar */}
              <div className="flex justify-center pt-4">
                <button
                  onClick={() => navigate(-1)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105"
                  style={{
                    backgroundColor: color1,
                    color: 'white'
                  }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Regresar
                </button>
              </div>
            </div>
          </div>

          {/* Espaciado extra para el footer */}
          <div className="h-1"></div>
        </div>
      </div>
      <ClientFooter />
    </>
  );
};

export default Privacity;