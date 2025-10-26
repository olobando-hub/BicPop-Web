import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { MapPin, Zap, Battery, Clock } from 'lucide-react';
import { Bike } from '@/lib/bikes';

interface BikeCardProps {
  bike: Bike;
  onBook: (bikeId: string) => void;
}

export default function BikeCard({ bike, onBook }: BikeCardProps) {
  const handleBookClick = () => {
    if (bike.available) {
      onBook(bike.id);
    }
  };

  return (
    <Card className={`group transition-all duration-300 hover:shadow-lg ${
      bike.available 
        ? 'hover:shadow-emerald-100 border-gray-200 hover:border-emerald-300' 
        : 'opacity-60 bg-gray-50 border-gray-100'
    }`}>
      <CardHeader className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={bike.image}
            alt={bike.name}
            className={`w-full h-48 object-cover transition-transform duration-300 ${
              bike.available ? 'group-hover:scale-105' : 'grayscale'
            }`}
            loading="lazy"
          />
          <div className="absolute top-3 left-3">
            <Badge 
              variant={bike.type === 'electric' ? 'default' : 'secondary'}
              className={`${
                bike.type === 'electric' 
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700' 
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white font-medium`}
            >
              {bike.type === 'electric' ? (
                <><Zap className="h-3 w-3 mr-1" />Eléctrica</>
              ) : (
                'Mecánica'
              )}
            </Badge>
          </div>
          <div className="absolute top-3 right-3">
            <Badge 
              variant={bike.available ? 'default' : 'destructive'}
              className={bike.available 
                ? 'bg-green-500 hover:bg-green-600 text-white' 
                : 'bg-red-500 hover:bg-red-600'
              }
            >
              {bike.available ? 'Disponible' : 'No disponible'}
            </Badge>
          </div>
          {bike.type === 'electric' && bike.battery && (
            <div className="absolute bottom-3 right-3">
              <Badge variant="outline" className="bg-white/90 backdrop-blur-sm border-green-200">
                <Battery className="h-3 w-3 mr-1 text-green-600" />
                <span className="text-green-700 font-medium">{bike.battery}%</span>
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-bold text-lg text-gray-900 group-hover:text-emerald-700 transition-colors">
              {bike.name}
            </h3>
            <div className="flex items-center text-gray-600 mt-1">
              <MapPin className="h-4 w-4 mr-1 text-gray-400" />
              <span className="text-sm">{bike.location}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4 text-emerald-600" />
              <span className="text-sm text-gray-600">Por hora</span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-emerald-600">
                ${bike.price.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">COP</div>
            </div>
          </div>
          
          {bike.type === 'electric' && bike.battery && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Autonomía estimada:</span>
              <span className="font-medium text-gray-900">
                {Math.round((bike.battery / 100) * 50)} km
              </span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={handleBookClick}
          disabled={!bike.available}
          className={`w-full font-semibold transition-all ${
            bike.available
              ? 'bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white shadow-md hover:shadow-lg'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {bike.available ? 'Reservar Ahora' : 'No Disponible'}
        </Button>
      </CardFooter>
    </Card>
  );
}
