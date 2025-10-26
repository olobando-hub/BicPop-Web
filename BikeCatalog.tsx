import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Bike, Zap, MapPin } from 'lucide-react';
import { mockBikes, Bike as BikeType } from '@/lib/bikes';
import BikeCard from './BikeCard';
import PaymentModal from './PaymentModal';
import AccountBalance from './AccountBalance';

export default function BikeCatalog() {
  const [bikes] = useState<BikeType[]>(mockBikes);
  const [activeFilter, setActiveFilter] = useState<'all' | 'mechanical' | 'electric'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBike, setSelectedBike] = useState<BikeType | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [accountBalance, setAccountBalance] = useState(75000); // Starting balance

  // Memoized filtered bikes for better performance
  const filteredBikes = useMemo(() => {
    let filtered = bikes;
    
    // Apply type filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(bike => bike.type === activeFilter);
    }
    
    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(bike =>
        bike.name.toLowerCase().includes(searchLower) ||
        bike.location.toLowerCase().includes(searchLower)
      );
    }
    
    return filtered;
  }, [bikes, activeFilter, searchTerm]);

  // Memoized statistics
  const stats = useMemo(() => {
    const availableBikes = filteredBikes.filter(bike => bike.available).length;
    const mechanicalCount = bikes.filter(bike => bike.type === 'mechanical' && bike.available).length;
    const electricCount = bikes.filter(bike => bike.type === 'electric' && bike.available).length;
    const totalAvailable = bikes.filter(bike => bike.available).length;
    
    return {
      availableBikes,
      mechanicalCount,
      electricCount,
      totalAvailable
    };
  }, [bikes, filteredBikes]);

  const handleFilter = (type: 'all' | 'mechanical' | 'electric') => {
    setActiveFilter(type);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleBookBike = (bikeId: string) => {
    const bike = bikes.find(b => b.id === bikeId);
    if (bike && bike.available) {
      setSelectedBike(bike);
      setIsPaymentModalOpen(true);
    }
  };

  const handlePayment = (method: 'balance' | 'stripe', amount: number) => {
    if (method === 'balance') {
      setAccountBalance(prev => prev - amount);
    }
    // For Stripe payments, balance remains the same since payment is external
    console.log(`Payment processed: ${method}, amount: $${amount}`);
    
    // In a real app, you would also update the bike availability status
    // and send the booking information to your backend
  };

  const handleAddFunds = (amount: number) => {
    setAccountBalance(prev => prev + amount);
  };

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setSelectedBike(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Account Balance */}
      <div className="mb-6">
        <AccountBalance balance={accountBalance} onAddFunds={handleAddFunds} />
      </div>

      {/* Header Stats */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full p-2">
            <Bike className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Catálogo de Bicicletas</h2>
            <p className="text-gray-600">Encuentra la bicicleta perfecta para tu viaje por Popayán</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3 mb-6">
          <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50 px-3 py-1">
            <MapPin className="h-3 w-3 mr-1" />
            {stats.totalAvailable} disponibles en total
          </Badge>
          <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 px-3 py-1">
            <Bike className="h-3 w-3 mr-1" />
            {stats.mechanicalCount} mecánicas
          </Badge>
          <Badge variant="outline" className="text-purple-600 border-purple-200 bg-purple-50 px-3 py-1">
            <Zap className="h-3 w-3 mr-1" />
            {stats.electricCount} eléctricas
          </Badge>
          {activeFilter !== 'all' && (
            <Badge variant="default" className="bg-gradient-to-r from-emerald-500 to-blue-500 px-3 py-1">
              {stats.availableBikes} en filtro actual
            </Badge>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por nombre o ubicación..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 h-12 text-base border-gray-200 focus:border-emerald-300 focus:ring-emerald-200"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button
            variant={activeFilter === 'all' ? 'default' : 'outline'}
            onClick={() => handleFilter('all')}
            className={`flex items-center space-x-2 transition-all ${
              activeFilter === 'all' 
                ? 'bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600' 
                : 'hover:border-emerald-300 hover:bg-emerald-50'
            }`}
          >
            <Filter className="h-4 w-4" />
            <span>Todas ({stats.totalAvailable})</span>
          </Button>
          <Button
            variant={activeFilter === 'mechanical' ? 'default' : 'outline'}
            onClick={() => handleFilter('mechanical')}
            className={`flex items-center space-x-2 transition-all ${
              activeFilter === 'mechanical' 
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700' 
                : 'hover:border-blue-300 hover:bg-blue-50'
            }`}
          >
            <Bike className="h-4 w-4" />
            <span>Mecánicas ({stats.mechanicalCount})</span>
          </Button>
          <Button
            variant={activeFilter === 'electric' ? 'default' : 'outline'}
            onClick={() => handleFilter('electric')}
            className={`flex items-center space-x-2 transition-all ${
              activeFilter === 'electric' 
                ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700' 
                : 'hover:border-purple-300 hover:bg-purple-50'
            }`}
          >
            <Zap className="h-4 w-4" />
            <span>Eléctricas ({stats.electricCount})</span>
          </Button>
        </div>
      </div>

      {/* Results Summary */}
      {searchTerm && (
        <div className="mb-6 p-3 bg-gray-50 rounded-lg border">
          <p className="text-sm text-gray-600">
            Mostrando <span className="font-semibold text-gray-900">{filteredBikes.length}</span> resultado
            {filteredBikes.length !== 1 ? 's' : ''} para "<span className="font-semibold text-emerald-600">{searchTerm}</span>"
            {activeFilter !== 'all' && (
              <span> en categoría <span className="font-semibold text-blue-600">
                {activeFilter === 'mechanical' ? 'mecánicas' : 'eléctricas'}
              </span></span>
            )}
          </p>
        </div>
      )}

      {/* Bikes Grid */}
      {filteredBikes.length === 0 ? (
        <div className="text-center py-16">
          <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <Search className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">No se encontraron bicicletas</h3>
          <p className="text-gray-500 mb-4 max-w-md mx-auto">
            {searchTerm 
              ? `No hay bicicletas que coincidan con "${searchTerm}" en la categoría seleccionada.`
              : 'No hay bicicletas disponibles en la categoría seleccionada.'
            }
          </p>
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchTerm('');
              setActiveFilter('all');
            }}
            className="hover:bg-emerald-50 hover:border-emerald-300"
          >
            Limpiar filtros
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBikes.map((bike) => (
            <BikeCard
              key={bike.id}
              bike={bike}
              onBook={handleBookBike}
            />
          ))}
        </div>
      )}

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={handleClosePaymentModal}
        bike={selectedBike}
        accountBalance={accountBalance}
        onPayment={handlePayment}
      />
    </div>
  );
}