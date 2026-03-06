// src/apps/points/components/admin/RegisterPurchase/ClientSearch.jsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { Search, User, Phone, Mail, Check, List, QrCode, X, MapPin } from 'lucide-react';

const ClientSearch = ({ 
  selectedClientId, 
  onClientSelect,
  onClientsUpdate,
  onCampaignSelect 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showQrScanner, setShowQrScanner] = useState(false);
  const [qrMessage, setQrMessage] = useState('');
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState('');
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const { business } = useAuth();

  // Función para obtener la ubicación actual
  const getCurrentLocation = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocalización no soportada por el navegador'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date().toISOString()
          };
          setLocation(coords);
          resolve(coords);
        },
        (error) => {
          let errorMessage = 'Error al obtener ubicación';
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Permiso de ubicación denegado';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Información de ubicación no disponible';
              break;
            case error.TIMEOUT:
              errorMessage = 'Tiempo de espera agotado';
              break;
            default:
              errorMessage = error.message;
          }
          setLocationError(errorMessage);
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  }, []);

  // Cargar clientes del negocio al montar el componente
  useEffect(() => {
    const fetchClients = async () => {
      if (!business?.NegocioId) return;
      
      setIsLoading(true);
      const timestamp = new Date().getTime();

      try {
        const response = await fetch(
          `https://souvenir-site.com/WebPuntos/API1/GetClientesxNegocio?Negocioid=${business.NegocioId}&t=${timestamp}`
        );
        
        if (!response.ok) {
          throw new Error('Error al cargar clientes');
        }
        
        const data = await response.json();
        
        // Mapear la respuesta de la API usando UsuarioId real
        const formattedClients = data.map(client => ({
          id: client.UsuarioId,
          name: `${client.UsuarioNombre} ${client.UsuarioApellido}`.trim(),
          phone: client.UsuarioTelefono,
          email: client.UsuarioCorreo,
          rawData: client
        }));
        
        setClients(formattedClients);
        setFilteredClients(formattedClients);
        
        if (onClientsUpdate && formattedClients.length > 0) {
          onClientsUpdate(formattedClients);
        }
      } catch (error) {
        console.error('Error fetching clients:', error);
        alert('Error al cargar la lista de clientes');
        if (onClientsUpdate) {
          onClientsUpdate([]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, [business?.NegocioId, onClientsUpdate]);

  // Filtrar clientes en tiempo real según el término de búsqueda
  const filterClients = useCallback((term, clientsList) => {
    if (term.length >= 2) {
      const searchLower = term.toLowerCase();
      
      const filtered = clientsList.filter(client => {
        return (
          client.name.toLowerCase().includes(searchLower) ||
          (client.phone && client.phone.includes(term)) ||
          (client.email?.toLowerCase().includes(searchLower) || false)
        );
      });
      
      setFilteredClients(filtered);
      setShowSuggestions(true);
    } else {
      setFilteredClients(clientsList);
      setShowSuggestions(false);
    }
  }, []);

  useEffect(() => {
    filterClients(searchTerm, clients);
  }, [searchTerm, clients, filterClients]);

  // Buscar cliente por teléfono exacto
  const findClientByPhone = useCallback((phoneNumber) => {
    if (!phoneNumber || !clients || clients.length === 0) return null;
    
    // Limpiar el número de teléfono (remover espacios, guiones, etc.)
    const cleanPhone = phoneNumber.toString().replace(/\D/g, '');
    
    if (cleanPhone.length < 10) return null;
    
    // Buscar coincidencia
    return clients.find(c => {
      if (!c.phone) return false;
      const clientPhone = c.phone.toString().replace(/\D/g, '');
      return clientPhone.includes(cleanPhone) || cleanPhone.includes(clientPhone);
    });
  }, [clients]);

  // Función auxiliar para parsear QR de promoción
  const parsePromoQR = useCallback((qrData) => {
    if (!qrData) return null;
    
    // Verificar si es un QR de promoción
    if (qrData.startsWith('PROMO:')) {
      const parts = qrData.split(':');
      if (parts.length >= 3) {
        return {
          type: 'promo',
          campaignId: parts[1],
          phoneNumber: parts[2],
          rawData: qrData
        };
      }
    }
    
    // Si no es promoción, verificar si es solo teléfono
    const cleanPhone = qrData.replace(/\D/g, '');
    if (cleanPhone.length >= 10) {
      return {
        type: 'phone',
        phoneNumber: cleanPhone,
        rawData: qrData
      };
    }
    
    return null;
  }, []);

  // Mostrar ubicación en alerta (solo para negocio ID 3)
  const showLocationAlert = useCallback((locationData, qrType, clientInfo = null) => {
    if (business?.NegocioId == 3 && locationData) {
      const locationMessage = 
        `📍 INFORMACIÓN DE UBICACIÓN 📍\n\n` +
        `Latitud: ${locationData.latitude}\n` +
        `Longitud: ${locationData.longitude}\n` +
        `Precisión: ±${locationData.accuracy.toFixed(2)} metros\n` +
        `Timestamp: ${new Date(locationData.timestamp).toLocaleString()}\n\n` +
        `📱 Tipo QR: ${qrType === 'promo' ? 'Promoción' : 'Teléfono'}\n` +
        (clientInfo ? `👤 Cliente: ${clientInfo.name}\n` : '') +
        (clientInfo?.phone ? `📞 Teléfono: ${clientInfo.phone}\n` : '') +
        `\n🌍 Enlace a Google Maps:\n` +
        `https://www.google.com/maps?q=${locationData.latitude},${locationData.longitude}`;

      alert(locationMessage);
      
      // También mostrar en consola para debugging
      console.log('📍 Ubicación del escaneo:', {
        ...locationData,
        negocioId: business.NegocioId,
        qrType,
        client: clientInfo
      });
    }
  }, [business?.NegocioId]);

  // Manejar QR de promoción
  const handlePromoQR = useCallback(async (parsedQR) => {
    const { campaignId, phoneNumber } = parsedQR;
    
    let locationData = null;
    
    // Solicitar ubicación SOLO si el negocioId es 3
    if (business?.NegocioId == 3) {
      try {
        locationData = await getCurrentLocation();
      } catch (error) {
        console.warn('No se pudo obtener ubicación:', error.message);
        // Continuamos aunque no tengamos ubicación
      }
    }
    
    // Buscar cliente por teléfono
    const client = findClientByPhone(phoneNumber);
    
    if (client) {
      // Cliente encontrado
      onClientSelect(client.id.toString());
      
      // Si existe la prop onCampaignSelect, llamarla para seleccionar la campaña
      if (onCampaignSelect && campaignId) {
        onCampaignSelect(campaignId);
      }
      
      setQrMessage(`✅ Cliente encontrado: ${client.name} | Promoción ID: ${campaignId}`);
      
      // Detener la cámara
      stopQrScanner();
      
      // Mostrar alerta con ubicación si aplica
      if (locationData) {
        showLocationAlert(locationData, 'promo', client);
      }
      
      // Solo mostrar mensaje informativo, sin preguntar redirección
      setTimeout(() => {
        setQrMessage('');
        
        // Mostrar alerta informativa (solo información)
        const alertMessage = 
          `🎉 ¡QR de Promoción Escaneado!\n\n` +
          `Cliente: ${client.name}\n` +
          `Teléfono: ${phoneNumber}\n` +
          `ID Promoción: ${campaignId}\n\n` +
          (locationData ? 
            `📍 Ubicación registrada: ${locationData.latitude}, ${locationData.longitude}\n` +
            `🔍 Precisión: ±${locationData.accuracy.toFixed(2)} metros\n\n` : 
            '') +
          `El cliente y la promoción han sido preseleccionados automáticamente.`;
        
        alert(alertMessage);
      }, 1500);
    } else {
      // Cliente no encontrado
      setQrMessage(`❌ No se encontró cliente con teléfono: ${phoneNumber}`);
      
      // Mostrar alerta con ubicación si aplica
      if (locationData) {
        showLocationAlert(locationData, 'promo');
      }
      
      // Preguntar si quiere buscar manualmente
      setTimeout(() => {
        const searchChoice = window.confirm(
          `No se encontró cliente con teléfono ${phoneNumber}.\n\n` +
          `ID de Promoción: ${campaignId}\n\n` +
          (locationData ? 
            `📍 Ubicación registrada: ${locationData.latitude}, ${locationData.longitude}\n\n` : 
            '') +
          `¿Quieres buscar el cliente manualmente?`
        );
        
        if (searchChoice) {
          setSearchTerm(phoneNumber);
        }
      }, 500);
      
      // Mostrar mensaje por 5 segundos
      setTimeout(() => {
        setQrMessage('');
      }, 5000);
    }
  }, [findClientByPhone, onClientSelect, onCampaignSelect, getCurrentLocation, showLocationAlert, business?.NegocioId]);

  // Manejar QR de teléfono normal
  const handlePhoneQR = useCallback(async (parsedQR) => {
    const { phoneNumber } = parsedQR;
    
    let locationData = null;
    
    // Solicitar ubicación SOLO si el negocioId es 3
    if (business?.NegocioId == 3) {
      try {
        locationData = await getCurrentLocation();
      } catch (error) {
        console.warn('No se pudo obtener ubicación:', error.message);
        // Continuamos aunque no tengamos ubicación
      }
    }
    
    // Buscar cliente por teléfono
    const client = findClientByPhone(phoneNumber);
    
    if (client) {
      // Cliente encontrado
      onClientSelect(client.id.toString());
      setQrMessage(`✅ Cliente encontrado: ${client.name}`);
      
      // Detener la cámara
      stopQrScanner();
      
      // Mostrar alerta con ubicación si aplica
      if (locationData) {
        showLocationAlert(locationData, 'phone', client);
        
        // Mostrar confirmación con ubicación
        setTimeout(() => {
          alert(
            `✅ Cliente encontrado: ${client.name}\n` +
            `📍 Ubicación registrada: ${locationData.latitude}, ${locationData.longitude}\n` +
            `🔍 Precisión: ±${locationData.accuracy.toFixed(2)} metros`
          );
        }, 1000);
      }
      
      // Mostrar confirmación visual
      setTimeout(() => {
        setQrMessage('');
      }, 3000);
    } else {
      // Cliente no encontrado
      setQrMessage(`❌ No se encontró cliente con teléfono: ${phoneNumber}`);
      
      // Mostrar alerta con ubicación si aplica
      if (locationData) {
        showLocationAlert(locationData, 'phone');
      }
      
      // Preguntar si quiere buscar manualmente
      setTimeout(() => {
        const searchChoice = window.confirm(
          `No se encontró cliente con teléfono ${phoneNumber}.\n\n` +
          (locationData ? 
            `📍 Ubicación registrada: ${locationData.latitude}, ${locationData.longitude}\n\n` : 
            '') +
          `¿Quieres buscarlo manualmente?`
        );
        
        if (searchChoice) {
          setSearchTerm(phoneNumber);
        }
      }, 500);
      
      setTimeout(() => {
        setQrMessage('');
      }, 5000);
    }
  }, [findClientByPhone, onClientSelect, getCurrentLocation, showLocationAlert, business?.NegocioId]);

  // Procesar el código QR leído
  const processQrCode = useCallback(async (qrData) => {
    // Parsear el QR
    const parsedQR = parsePromoQR(qrData);
    
    if (!parsedQR) {
      setQrMessage('❌ Código QR no válido');
      setTimeout(() => setQrMessage(''), 3000);
      return;
    }
    
    if (parsedQR.type === 'promo') {
      // Es un QR de promoción: PROMO:CampaId:PhoneNumber
      await handlePromoQR(parsedQR);
    } else if (parsedQR.type === 'phone') {
      // Es solo un teléfono
      await handlePhoneQR(parsedQR);
    }
  }, [parsePromoQR, handlePromoQR, handlePhoneQR]);

  // Iniciar escáner QR
  const startQrScanner = async () => {
    try {
      setShowQrScanner(true);
      setQrMessage('Iniciando cámara...');
      setLocation(null);
      setLocationError('');
      
      // Solicitar acceso a la cámara
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' } // Usar cámara trasera si está disponible
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      
      setQrMessage('Apunte al código QR...');
      
      // Importar dinámicamente la librería jsQR
      const { default: jsQR } = await import('jsqr');
      
      // Crear canvas para procesar la imagen
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      // Función para procesar cada frame
      const scanFrame = () => {
        if (!videoRef.current || videoRef.current.readyState !== 4 || !streamRef.current) {
          requestAnimationFrame(scanFrame);
          return;
        }
        
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const qrCode = jsQR(imageData.data, imageData.width, imageData.height);
        
        if (qrCode) {
          // Detener la cámara
          stopQrScanner();
          
          // Procesar el código QR
          processQrCode(qrCode.data);
          return;
        }
        
        requestAnimationFrame(scanFrame);
      };
      
      scanFrame();
      
    } catch (error) {
      console.error('Error al acceder a la cámara:', error);
      setQrMessage('Error: No se pudo acceder a la cámara');
      setTimeout(() => setShowQrScanner(false), 2000);
    }
  };

  // Detener escáner QR
  const stopQrScanner = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setShowQrScanner(false);
    setQrMessage('');
  };

  // Escanear QR desde un archivo (alternativa)
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      const image = new Image();
      image.onload = async () => {
        try {
          const { default: jsQR } = await import('jsqr');
          
          const canvas = document.createElement('canvas');
          canvas.width = image.width;
          canvas.height = image.height;
          const context = canvas.getContext('2d');
          context.drawImage(image, 0, 0);
          
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          const qrCode = jsQR(imageData.data, imageData.width, imageData.height);
          
          if (qrCode) {
            await processQrCode(qrCode.data);
          } else {
            setQrMessage('No se encontró código QR en la imagen');
            setTimeout(() => setQrMessage(''), 3000);
          }
        } catch (error) {
          console.error('Error al procesar QR:', error);
          setQrMessage('Error al leer el código QR');
          setTimeout(() => setQrMessage(''), 3000);
        }
      };
      image.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setShowDropdown(false);
  };

  const handleClientSelectFromSearch = (client) => {
    onClientSelect(client.id.toString());
    setSearchTerm('');
    setShowSuggestions(false);
  };

  const handleClientSelectFromDropdown = (clientId) => {
    onClientSelect(clientId);
    setShowDropdown(false);
  };

  const handleInputFocus = () => {
    if (searchTerm.length >= 2 && filteredClients.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
    setShowSuggestions(false);
  };

  const selectedClient = clients.find(client => client.id.toString() === selectedClientId);

  // Mostrar badge de ubicación si es negocio ID 3
  const renderLocationBadge = () => {
    if (business?.NegocioId == 3) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium ml-2">
          <MapPin className="w-3 h-3" />
          Geo-activado
        </span>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Buscador unificado con sugerencias */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Buscar Cliente
          </label>
          
          {/* Botón para ver todos los clientes */}
          <div className="flex items-center gap-2">
            {renderLocationBadge()}
            <button
              type="button"
              onClick={toggleDropdown}
              disabled={isLoading || clients.length === 0}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <List className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium">Ver Todos</span>
            </button>
          </div>
        </div>
        
        <div className="flex gap-3">
          {/* Campo de búsqueda */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Buscar por nombre, teléfono o correo..."
              disabled={isLoading}
            />
            
            {/* Sugerencias en tiempo real */}
            {showSuggestions && filteredClients.length > 0 && (
              <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                <div className="p-2 border-b border-gray-200">
                  <p className="text-xs text-gray-500 font-medium">
                    {filteredClients.length} cliente(s) encontrado(s)
                  </p>
                </div>
                {filteredClients.map(client => (
                  <button
                    key={client.id}
                    type="button"
                    onClick={() => handleClientSelectFromSearch(client)}
                    className="w-full px-4 py-3 text-left hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <User className="w-4 h-4 text-blue-600" />
                          <span className="font-medium text-gray-900">{client.name}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            <span>{client.phone || 'Sin teléfono'}</span>
                          </div>
                          {client.email && (
                            <div className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              <span className="truncate max-w-[120px]">{client.email}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      {selectedClientId === client.id.toString() && (
                        <Check className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Botón para escanear QR */}
          <button
            type="button"
            onClick={startQrScanner}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-lg text-sm font-medium transition-colors"
          >
            <QrCode className="w-4 h-4" />
            Escanear QR
          </button>
          
        </div>
        
        <p className="text-sm text-gray-500 mt-1">
          {isLoading ? 'Cargando clientes...' : 'Busca por nombre, teléfono o correo, escanea QR o haz clic en "Ver Todos"'}
          {business?.NegocioId == 3 && (
            <span className="block text-xs text-purple-600 mt-1">
              ⚡ Este negocio tiene geo-localización activada - se registrará la ubicación al escanear QR
            </span>
          )}
        </p>
      </div>

      {/* Modal para escanear QR */}
      {showQrScanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <QrCode className="w-5 h-5" />
                Escanear Código QR
                {business?.NegocioId == 3 && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                    <MapPin className="w-3 h-3" />
                    Geo-activado
                  </span>
                )}
              </h3>
              <button
                onClick={stopQrScanner}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-4">
              <div className="relative rounded-xl overflow-hidden bg-black">
                <video
                  ref={videoRef}
                  className="w-full h-64 object-cover"
                  playsInline
                />
                {/* Marco de escaneo */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-64 border-2 border-white rounded-lg relative">
                    <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-blue-500"></div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-blue-500"></div>
                    <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-blue-500"></div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-blue-500"></div>
                  </div>
                </div>
              </div>
              
              {qrMessage && (
                <div className={`mt-3 p-3 rounded-lg text-center ${
                  qrMessage.includes('✅') 
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : qrMessage.includes('❌')
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : 'bg-blue-50 text-blue-700 border border-blue-200'
                }`}>
                  {qrMessage}
                </div>
              )}
              
              {locationError && business?.NegocioId == 3 && (
                <div className="mt-2 p-2 bg-yellow-50 text-yellow-700 rounded-lg text-xs border border-yellow-200">
                  ⚠️ {locationError}
                </div>
              )}
              
              <div className="mt-3 text-center">
                <p className="text-sm text-gray-600">
                  Apunte el código QR del cliente hacia la cámara
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  El código debe contener el número de teléfono del cliente o una promoción
                </p>
                {business?.NegocioId == 3 && (
                  <p className="text-xs text-purple-600 mt-2 flex items-center justify-center gap-1">
                    <MapPin className="w-3 h-3" />
                    Se solicitará permiso de ubicación al escanear
                  </p>
                )}
              </div>
              
              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={stopQrScanner}
                  className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <label className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div className="py-2 bg-blue-600 text-white rounded-lg text-center hover:bg-blue-700 cursor-pointer">
                    Subir imagen
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dropdown para ver todos los clientes */}
      {showDropdown && (
        <div className="border border-gray-300 rounded-lg bg-white shadow-lg">
          <div className="p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-700 flex items-center gap-2">
                <List className="w-4 h-4" />
                Todos los Clientes ({clients.length})
                {renderLocationBadge()}
              </h4>
              <button
                type="button"
                onClick={() => setShowDropdown(false)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Cerrar
              </button>
            </div>
          </div>
          
          <div className="max-h-60 overflow-y-auto">
            {clients.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No hay clientes registrados
              </div>
            ) : (
              <select
                value={selectedClientId || ''}
                onChange={(e) => handleClientSelectFromDropdown(e.target.value)}
                size={Math.min(clients.length, 8)}
                className="w-full border-0 focus:ring-0 text-sm"
              >
                <option value="">Selecciona un cliente</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.name} - 📞{client.phone || 'Sin teléfono'} 
                    {client.email && ` - ✉️${client.email}`}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      )}

      {/* Información del cliente seleccionado */}
      {selectedClient && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-green-800 flex items-center gap-2">
              <Check className="w-4 h-4" />
              Cliente Seleccionado
            </h4>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={startQrScanner}
                className="text-xs text-blue-700 hover:text-blue-800 underline flex items-center gap-1"
              >
                <QrCode className="w-3 h-3" />
                Escanear otro
              </button>
              <button
                type="button"
                onClick={() => {
                  onClientSelect('');
                  setSearchTerm('');
                  setShowDropdown(false);
                }}
                className="text-xs text-green-700 hover:text-green-800 underline"
              >
                Cambiar cliente
              </button>
            </div>
          </div>
          
          <div className="text-sm text-green-700 space-y-2">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span><strong>Nombre:</strong> {selectedClient.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span><strong>Teléfono:</strong> {selectedClient.phone || 'No registrado'}</span>
            </div>
            {selectedClient.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span><strong>Email:</strong> {selectedClient.email}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">
                ID: {selectedClient.id}
              </span>
              {selectedClient.phone && (
                <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">
                  📞 {selectedClient.phone}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Estados vacíos */}
      {!isLoading && clients.length === 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-center">
          <User className="w-8 h-8 text-amber-400 mx-auto mb-2" />
          <p className="text-sm text-amber-800 font-medium">
            No hay clientes registrados
          </p>
          <p className="text-xs text-amber-600 mt-1">
            Los clientes aparecerán aquí una vez que se registren en tu negocio.
          </p>
        </div>
      )}

      {!isLoading && searchTerm.length >= 2 && filteredClients.length === 0 && clients.length > 0 && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
          <Search className="w-8 h-8 text-blue-400 mx-auto mb-2" />
          <p className="text-sm text-blue-800 font-medium">
            No se encontraron coincidencias
          </p>
          <p className="text-xs text-blue-600 mt-1">
            No hay clientes que coincidan con "<strong>{searchTerm}</strong>"
          </p>
          <button
            type="button"
            onClick={startQrScanner}
            className="mt-2 text-sm text-blue-700 hover:text-blue-800 underline"
          >
            ¿Quieres escanear un código QR?
          </button>
        </div>
      )}
    </div>
  );
};

export default ClientSearch;