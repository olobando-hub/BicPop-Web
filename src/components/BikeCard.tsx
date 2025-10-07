import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bike, Battery, MapPin, Zap } from 'lucide-react';
import { Bike as BikeType } from '@/lib/bikes';

interface BikeCardProps {
  bike: BikeType;
  onBook: (bikeId: string) => void;
}

export default function BikeCard({ bike, onBook }: BikeCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative">
        <img
          src={bike.image}
          alt={bike.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2">
          <Badge
            variant={bike.type === 'electric' ? 'default' : 'secondary'}
            className={
              bike.type === 'electric'
                ? 'bg-blue-500 hover:bg-blue-600'
                : 'bg-emerald-500 hover:bg-emerald-600'
            }
          >
            {bike.type === 'electric' ? (
              <Zap className="h-3 w-3 mr-1" />
            ) : (
              <Bike className="h-3 w-3 mr-1" />
            )}
            {bike.type === 'electric' ? 'Eléctrica' : 'Mecánica'}
          </Badge>
        </div>
        {!bike.available && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Badge variant="destructive">No disponible</Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2">{bike.name}</h3>
        
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{bike.location}</span>
        </div>
        
        {bike.type === 'electric' && bike.battery && (
          <div className="flex items-center text-sm text-green-600 mb-2">
            <Battery className="h-4 w-4 mr-1" />
            <span>Batería: {bike.battery}%</span>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-emerald-600">
            ${bike.price.toLocaleString()}
            <span className="text-sm font-normal text-gray-500">/hora</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={() => onBook(bike.id)}
          disabled={!bike.available}
          className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {bike.available ? 'Reservar Ahora' : 'No Disponible'}
        </Button>
      </CardFooter>
    </Card>
  );
}