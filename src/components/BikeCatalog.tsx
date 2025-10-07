import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Bike, Zap } from 'lucide-react';
import { mockBikes, Bike as BikeType } from '@/lib/bikes';
import BikeCard from './BikeCard';
import PaymentModal from './PaymentModal';
import AccountBalance from './AccountBalance';

export default function BikeCatalog() {
  const [bikes] = useState<BikeType[]>(mockBikes);
  const [filteredBikes, setFilteredBikes] = useState<BikeType[]>(mockBikes);
  const [activeFilter, setActiveFilter] = useState<'all' | 'mechanical' | 'electric'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBike, setSelectedBike] = useState<BikeType | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [accountBalance, setAccountBalance] = useState(75000); // Starting balance

  const handleFilter = (type: 'all' | 'mechanical' | 'electric') => {
    setActiveFilter(type);
    let filtered = bikes;
    
    if (type !== 'all') {
      filtered = bikes.filter(bike => bike.type === type);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(bike =>
        bike.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bike.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredBikes(filtered);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    let filtered = bikes;
    
    if (activeFilter !== 'all') {
      filtered = bikes.filter(bike => bike.type === activeFilter);
    }
    
    if (term) {
      filtered = filtered.filter(bike =>
        bike.name.toLowerCase().includes(term.toLowerCase()) ||
        bike.location.toLowerCase().includes(term.toLowerCase())
      );
    }
    
    setFilteredBikes(filtered);
  };

  const handleBookBike = (bikeId: string) => {
    const bike = bikes.find(b => b.id === bikeId);
    if (bike) {
      setSelectedBike(bike);
      setIsPaymentModalOpen(true);
    }
  };

  const handlePayment = (method: 'balance' | 'card', amount: number) => {
    if (method === 'balance') {
      setAccountBalance(prev => prev - amount);
    }
    // For card payments, balance remains the same
    console.log(`Payment processed: ${method}, amount: $${amount}`);
  };

  const handleAddFunds = (amount: number) => {
    setAccountBalance(prev => prev + amount);
  };

  const availableBikes = filteredBikes.filter(bike => bike.available).length;
  const mechanicalCount = bikes.filter(bike => bike.type === 'mechanical' && bike.available).length;
  const electricCount = bikes.filter(bike => bike.type === 'electric' && bike.available).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Account Balance */}
      <div className="mb-6">
        <AccountBalance balance={accountBalance} onAddFunds={handleAddFunds} />
      </div>

      {/* Header Stats */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Catálogo de Bicicletas</h2>
        <p className="text-gray-600 mb-4">Encuentra la bicicleta perfecta para tu viaje por Popayán</p>
        
        <div className="flex flex-wrap gap-4 mb-6">
          <Badge variant="outline" className="text-emerald-600 border-emerald-200">
            {availableBikes} bicicletas disponibles
          </Badge>
          <Badge variant="outline" className="text-blue-600 border-blue-200">
            {mechanicalCount} mecánicas
          </Badge>
          <Badge variant="outline" className="text-purple-600 border-purple-200">
            {electricCount} eléctricas
          </Badge>
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
            className="pl-10"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button
            variant={activeFilter === 'all' ? 'default' : 'outline'}
            onClick={() => handleFilter('all')}
            className="flex items-center space-x-1"
          >
            <Filter className="h-4 w-4" />
            <span>Todas</span>
          </Button>
          <Button
            variant={activeFilter === 'mechanical' ? 'default' : 'outline'}
            onClick={() => handleFilter('mechanical')}
            className="flex items-center space-x-1"
          >
            <Bike className="h-4 w-4" />
            <span>Mecánicas</span>
          </Button>
          <Button
            variant={activeFilter === 'electric' ? 'default' : 'outline'}
            onClick={() => handleFilter('electric')}
            className="flex items-center space-x-1"
          >
            <Zap className="h-4 w-4" />
            <span>Eléctricas</span>
          </Button>
        </div>
      </div>

      {/* Bikes Grid */}
      {filteredBikes.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron bicicletas</h3>
          <p className="text-gray-500">Intenta ajustar tus filtros de búsqueda</p>
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
        onClose={() => setIsPaymentModalOpen(false)}
        bike={selectedBike}
        accountBalance={accountBalance}
        onPayment={handlePayment}
      />
    </div>
  );
}