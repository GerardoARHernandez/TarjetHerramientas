import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, Mail, ArrowLeft } from 'lucide-react';
import { useBusiness } from '../../../../contexts/BusinessContext';
import { usePoints } from '../../../../contexts/PointsContext';

const RegistrarClienteFromAdmin = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    phone: '',
    email: '' 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  
  // Obtener datos del negocio desde el contexto
  const { business, isLoading: businessLoading } = useBusiness();
  const { addClient, clients } = usePoints();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!formData.name || !formData.phone || !formData.email) {
      setMessage('Por favor completa todos los campos');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      setMessage('El número de teléfono debe tener exactamente 10 dígitos');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessage('Por favor ingresa un correo electrónico válido');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    // Verificar si el teléfono ya está registrado
    const phoneExists = clients.some(client => client.phone === formData.phone);
    if (phoneExists) {
      setMessage('Este número de teléfono ya está registrado');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    // Verificar si el email ya está registrado
    const emailExists = clients.some(client => client.email === formData.email);
    if (emailExists) {
      setMessage('Este correo electrónico ya está registrado');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    // Verificar que tenemos información del negocio
    if (!business || !business.NegocioId) {
      setMessage('Error: No se pudo obtener la información del negocio');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setIsSubmitting(true);

    try {
      // Dividir nombre en nombre y apellido
      const nameParts = formData.name.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ') || ''; // Si no hay apellido, dejamos vacío

      // Preparar datos para la API según la nueva estructura
      const requestData = {
        ListUsuario: {
          NegocioId: parseInt(business.NegocioId), // Usar el negocioId del contexto
          UsuarioNombre: firstName,
          UsuarioApellido: lastName,
          UsuarioTelefono: formData.phone,
          UsuarioCorreo: formData.email
        }
      };

      // Llamar a la API
      const response = await fetch('https://souvenir-site.com/WebPuntos/API1/RegistrarCliente', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      const result = await response.json();

      // Validar respuesta del servidor
      if (!response.ok) {
        throw new Error('Error en el registro');
      }

      // Verificar si la respuesta contiene un error del servidor
      if (result.error) {
        setMessage(result.Mensaje || 'Error en el registro. Por favor, intente nuevamente.');
        setTimeout(() => setMessage(''), 5000);
        return;
      }

      // Verificar si el usuarioId es 0 (indicando error)
      if (result.usuarioId === 0) {
        setMessage(result.Mensaje || 'Error en el registro. Por favor, intente nuevamente.');
        setTimeout(() => setMessage(''), 5000);
        return;
      }

      // Si la API responde con éxito, crear el cliente localmente
      const newClient = {
        id: result.usuarioId || Date.now(),
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        registrationDate: new Date().toLocaleDateString('es-MX'),
        points: 0
      };

      addClient(newClient);
      
      setMessage(`¡Registro exitoso! Cliente ${formData.name} registrado correctamente`);

      // Limpiar formulario después de registro exitoso
      setFormData({ name: '', phone: '', email: '' });

      setTimeout(() => {
        setMessage('');
      }, 3000);
      
    } catch (error) {
      console.error('Error al registrar:', error);
      setMessage('Error en el registro. Por favor, intente nuevamente.');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 px-4 py-8">
      <div className="max-w-md mx-auto">

        {/* Card del formulario */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">REGISTRAR CLIENTE</h2>
            <p className="text-gray-600">Registra un nuevo cliente en el sistema</p>
            
            {/* Mostrar información del negocio desde el contexto */}
            {businessLoading ? (
              <p className="text-sm text-gray-500 mt-1">Cargando información del negocio...</p>
            ) : business ? (
              <p className="text-sm text-gray-500 mt-1">
                Negocio: <span className="font-semibold">{business.NegocioDesc}</span>
              </p>
            ) : (
              <p className="text-sm text-red-500 mt-1">No se pudo cargar la información del negocio</p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre Completo
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ingrese el nombre completo"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="10 dígitos sin espacios"
                  maxLength="10"
                  required
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">Ejemplo: 5512345678</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="correo@ejemplo.com"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || businessLoading}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all ${
                isSubmitting || businessLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 hover:cursor-pointer'
              }`}
            >
              {isSubmitting ? 'Registrando...' : 'Registrar Cliente'}
            </button>
          </form>

          {message && (
            <div className={`mt-6 p-4 rounded-lg border-l-4 ${
              message.includes('¡Registro exitoso!') 
                ? 'bg-green-100 border-green-500 text-green-700'
                : 'bg-yellow-100 border-yellow-500 text-yellow-700'
            }`}>
              <p className="whitespace-pre-line">{message}</p>
            </div>
          )}

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 font-semibold mb-2">Información importante:</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• El cliente usará su número de teléfono para iniciar sesión</li>
              <li>• El correo electrónico es necesario para notificaciones</li>
              <li>• El cliente podrá iniciar sesión inmediatamente después del registro</li>
              <li>• Se asignarán 0 puntos iniciales automáticamente</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrarClienteFromAdmin;