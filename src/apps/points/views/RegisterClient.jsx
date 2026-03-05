// src/apps/points/views/RegisterClient.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { User, Phone, Mail, Calendar } from 'lucide-react';
import { usePoints } from '../../../contexts/PointsContext';

const RegisterClient = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    phone: '',
    email: '',
    birthDate: '' // Nuevo campo de fecha de nacimiento
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { addClient, clients } = usePoints();
  const [message, setMessage] = useState('');
  const { negocioId } = useParams();
  const [negocioInfo, setNegocioInfo] = useState(null);
  const [loadingNegocio, setLoadingNegocio] = useState(true);

  // Obtener información del negocio desde la API
  useEffect(() => {
    const fetchNegocioInfo = async () => {
      if (!negocioId || isNaN(parseInt(negocioId))) {
        setMessage('ID de negocio no válido. No se puede completar el registro.');
        
        setTimeout(() => {
          setMessage('');
          navigate('/points-loyalty/login');
        }, 3000);
        return;
      }

      try {
        setLoadingNegocio(true);
        const response = await fetch(`https://souvenir-site.com/WebPuntos/API1/Negocio/${negocioId}`);
        
        if (!response.ok) {
          throw new Error('Error al obtener información del negocio');
        }

        const result = await response.json();
        
        if (result.error) {
          throw new Error(result.Mensaje || 'Error en la información del negocio');
        }

        setNegocioInfo(result.listNegocio);
      } catch (error) {
        console.error('Error al cargar información del negocio:', error);
        setMessage('Error al cargar información del negocio. Por favor, intente nuevamente.');
        
        setTimeout(() => {
          setMessage('');
          navigate('/points-loyalty/login');
        }, 3000);
      } finally {
        setLoadingNegocio(false);
      }
    };

    fetchNegocioInfo();
  }, [negocioId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones básicas (solo nombre y teléfono son obligatorios)
    if (!formData.name || !formData.phone) {
      setMessage('Por favor completa los campos obligatorios (Nombre y Teléfono)');

      setTimeout(() => {
        setMessage('');
      }, 3000);
      return;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      setMessage('El número de teléfono debe tener exactamente 10 dígitos');

      setTimeout(() => {
        setMessage('');
      }, 3000);
      return;
    }

    // Validar formato de email solo si se proporcionó
    if (formData.email && formData.email.trim() !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setMessage('Por favor ingresa un correo electrónico válido');
        setTimeout(() => {
          setMessage('');
        }, 3000);
        return;
      }
    }

    // Verificar si el teléfono ya está registrado
    const phoneExists = clients.some(client => client.phone === formData.phone);
    if (phoneExists) {
      setMessage('Este número de teléfono ya está registrado. Por favor inicie sesión.');
      setTimeout(() => {
        setMessage('');
        navigate(`/points-loyalty/login/${negocioId}`);
      }, 3000);
      return;
    }

    // Verificar si el email ya está registrado (solo si se proporcionó)
    if (formData.email && formData.email.trim() !== '') {
      const emailExists = clients.some(client => client.email === formData.email);
      if (emailExists) {
        setMessage('Este correo electrónico ya está registrado. Por favor inicie sesión.');
        setTimeout(() => {
          setMessage('');
          navigate(`/points-loyalty/login/${negocioId}`);
        }, 3000);
        return;
      }
    }
    
    setIsSubmitting(true);

    try {
      // Dividir nombre en nombre y apellido
      const nameParts = formData.name.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ') || '';

      // Preparar datos para la API
      const requestData = {
        ListUsuario: {
          NegocioId: parseInt(negocioId),
          UsuarioNombre: firstName,
          UsuarioApellido: lastName,
          UsuarioTelefono: formData.phone,
          UsuarioCorreo: formData.email || '', // Si está vacío, enviar string vacío
        }
      };

      // Agregar fecha de nacimiento solo si se proporcionó
      if (formData.birthDate) {
        // Formatear fecha de YYYY-MM-DD a DD-MM-YYYY
        const [year, month, day] = formData.birthDate.split('-');
        requestData.ListUsuario.UsuarioFecha = `${day}-${month}-${year}`;
      }

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

      if (result.error) {
        setMessage('Ocurrió un error. Intente nuevamente o verifique si el usuario ya está registrado.');
        
        setTimeout(() => {
          setMessage('');
        }, 5000);
        return;
      }

      if (result.usuarioId == 0) {
        setMessage('Ocurrió un error. Intente nuevamente o verifique si el usuario ya está registrado.');
        
        setTimeout(() => {
          setMessage('');
        }, 5000);
        return;
      }

      // Crear el cliente localmente
      const newClient = {
        id: result.usuarioId || Date.now(),
        name: formData.name,
        phone: formData.phone,
        email: formData.email || '',
        birthDate: formData.birthDate || '',
        registrationDate: new Date().toLocaleDateString('es-MX'),
        points: 0
      };

      addClient(newClient);
      
      setMessage(`¡Registro exitoso! Bienvenido ${formData.name}\n\nAhora puede iniciar sesión con su teléfono`);

      setTimeout(() => {
        setMessage('');
        navigate(`/points-loyalty/login/${negocioId}`);
      }, 3000);
      
    } catch (error) {
      console.error('Error al registrar:', error);
      setMessage('Error en el registro. Por favor, intente nuevamente.');
      
      setTimeout(() => {
        setMessage('');
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getImagenFondo = () => {
    if (!negocioInfo || !negocioInfo.NegocioImagenUrl) {
      return '/images/header-client.jpeg';
    }
    
    if (negocioInfo.NegocioImagenUrl.trim() === '') {
      return '/images/header-client.jpeg';
    }
    
    return negocioInfo.NegocioImagenUrl;
  };
  const imagenFondo = getImagenFondo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 px-4 py-8">
      <div className="max-w-md mx-auto">
        {/* Loyalty Card Header */}
        <div className="p-2 mb-6">
          <img 
            src={imagenFondo} alt="Header de Cliente" 
            className='rounded-[20px] shadow-2xl w-full'
          />
        </div>

        {/* Register Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">REGISTRARSE</h1>
            <p className="text-gray-600">Únete a nuestro programa de fidelidad</p>
            
            {/* Mostrar información del negocio */}
            {loadingNegocio ? (
              <p className="text-sm text-gray-500 mt-1">Cargando información del negocio...</p>
            ) : negocioInfo ? (
              <p className="text-sm text-gray-500 mt-1">
                Negocio: <span className="font-semibold">{negocioInfo.NegocioDesc}</span>
              </p>
            ) : (
              <p className="text-sm text-red-500 mt-1">No se pudo cargar la información del negocio</p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo obligatorio - Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre Completo <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Ingrese su nombre completo"
                  required
                />
              </div>
            </div>

            {/* Campo obligatorio - Teléfono */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="10 dígitos sin espacios"
                  maxLength="10"
                  required
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">Ejemplo: 5512345678</p>
            </div>

            {/* Campo opcional - Correo Electrónico */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico <span className="text-gray-400 text-xs">(opcional)</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="correo@ejemplo.com"
                />
              </div>
            </div>

            {/* Nuevo campo opcional - Fecha de Nacimiento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Nacimiento <span className="text-gray-400 text-xs">(opcional)</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  max={new Date().toISOString().split('T')[0]} // No permitir fechas futuras
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">Formato: DD/MM/YYYY</p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || loadingNegocio}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all ${
                isSubmitting || loadingNegocio
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700 hover:cursor-pointer'
              }`}
            >
              {isSubmitting ? 'Registrando...' : 'Registrarse'}
            </button>
          </form>

          {message && (
            <div className={`mt-6 p-4 border-l-4 ${
              message.includes('¡Registro exitoso!') 
                ? 'bg-green-100 border-green-500 text-green-700'
                : 'bg-yellow-100 border-yellow-500 text-yellow-700'
            }`}>
              <p className="whitespace-pre-line">{message}</p>
            </div>
          )}

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">¿Ya tienes cuenta?</p>
            <button
              onClick={() => navigate(`/points-loyalty/login/${negocioId}`)}
              className="mt-2 text-red-600 hover:text-red-700 font-semibold hover:cursor-pointer"
            >
              INICIAR SESIÓN
            </button>
          </div>

          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-600 font-semibold mb-2">Información importante:</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Use su número de teléfono para iniciar sesión</li>
              <li>• Los campos marcados con <span className="text-red-500">*</span> son obligatorios</li>
              <li>• La fecha de nacimiento se podria utilizar para enviarte promociones y descuentos el día de tu cumpleaños.</li>
              <li>• Después del registro podrá iniciar sesión inmediatamente</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterClient;