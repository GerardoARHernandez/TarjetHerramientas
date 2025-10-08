// src/apps/points/components/admin/RegisterPurchase/ClientSearch.jsx
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../../../contexts/AuthContext';
import { Search, User, Phone, Mail, Check, List } from 'lucide-react';

const ClientSearch = ({ 
  selectedClientId, 
  onClientSelect,
  onClientsUpdate
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { business } = useAuth();

  // Cargar clientes del negocio al montar el componente
  useEffect(() => {
    const fetchClients = async () => {
      if (!business?.NegocioId) return;
      
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://souvenir-site.com/WebPuntos/API1/GetClientesxNegocio?Negocioid=${business.NegocioId}`
        );
        
        if (!response.ok) {
          throw new Error('Error al cargar clientes');
        }
        
        const data = await response.json();
        
        // Mapear la respuesta de la API al formato esperado
        const formattedClients = data.map((client, index) => ({
          id: index + 1,
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
  }, [business?.NegocioId]);

  // Filtrar clientes en tiempo real según el término de búsqueda
  const filterClients = useCallback((term, clientsList) => {
    if (term.length >= 2) {
      const searchLower = term.toLowerCase();
      
      const filtered = clientsList.filter(client => {
        // Búsqueda exacta en nombre, teléfono y email
        return (
          client.name.toLowerCase().includes(searchLower) ||
          client.phone.includes(term) ||
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

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setShowDropdown(false); // Cerrar dropdown al buscar
  };

  const handleClientSelectFromSearch = (client) => {
    onClientSelect(client.id.toString());
    setSearchTerm(''); // Limpiar búsqueda al seleccionar
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
    // Pequeño delay para permitir hacer clic en las sugerencias
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
    setShowSuggestions(false); // Cerrar sugerencias al abrir dropdown
  };

  const selectedClient = clients.find(client => client.id.toString() === selectedClientId);

  return (
    <div className="space-y-6">
      {/* Buscador unificado con sugerencias */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Buscar Cliente
        </label>
        
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
                            <span>{client.phone}</span>
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

          {/* Botón para ver todos los clientes */}
          <button
            type="button"
            onClick={toggleDropdown}
            disabled={isLoading || clients.length === 0}
            className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <List className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium">Ver Todos</span>
          </button>
        </div>
        
        <p className="text-sm text-gray-500 mt-1">
          {isLoading ? 'Cargando clientes...' : 'Busca por nombre, teléfono o correo, o haz clic en "Ver Todos"'}
        </p>
      </div>

      {/* Dropdown para ver todos los clientes */}
      {showDropdown && (
        <div className="border border-gray-300 rounded-lg bg-white shadow-lg">
          <div className="p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-700 flex items-center gap-2">
                <List className="w-4 h-4" />
                Todos los Clientes ({clients.length})
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
                value={selectedClientId}
                onChange={(e) => handleClientSelectFromDropdown(e.target.value)}
                size={Math.min(clients.length, 8)}
                className="w-full border-0 focus:ring-0"
              >
                <option value="">Selecciona un cliente</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.name} - 📞{client.phone} 
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
          
          <div className="text-sm text-green-700 space-y-2">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span><strong>Nombre:</strong> {selectedClient.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span><strong>Teléfono:</strong> {selectedClient.phone}</span>
            </div>
            {selectedClient.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span><strong>Email:</strong> {selectedClient.email}</span>
              </div>
            )}
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
        </div>
      )}
    </div>
  );
};

export default ClientSearch;