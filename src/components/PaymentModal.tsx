import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Wallet, Clock, MapPin, Bike, CheckCircle } from 'lucide-react';
import { Bike as BikeType } from '@/lib/bikes';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  bike: BikeType | null;
  accountBalance: number;
  onPayment: (method: 'balance' | 'card', amount: number) => void;
}

export default function PaymentModal({ isOpen, onClose, bike, accountBalance, onPayment }: PaymentModalProps) {
  const [selectedHours, setSelectedHours] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'balance' | 'card'>('balance');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  if (!bike) return null;

  const totalAmount = bike.price * selectedHours;
  const canPayWithBalance = accountBalance >= totalAmount;

  const handlePayment = async () => {
    if (paymentMethod === 'card' && (!cardNumber || !expiryDate || !cvv || !cardName)) {
      alert('Por favor completa todos los campos de la tarjeta');
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentComplete(true);
      onPayment(paymentMethod, totalAmount);
      
      // Close modal after showing success
      setTimeout(() => {
        setPaymentComplete(false);
        onClose();
        // Reset form
        setSelectedHours(1);
        setCardNumber('');
        setExpiryDate('');
        setCvv('');
        setCardName('');
      }, 2000);
    }, 2000);
  };

  if (paymentComplete) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <div className="text-center py-8">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">¡Pago Exitoso!</h3>
            <p className="text-gray-600 mb-4">Tu bicicleta ha sido reservada</p>
            <Badge className="bg-green-500">Reserva Confirmada</Badge>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Bike className="h-5 w-5" />
            <span>Confirmar Reserva</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Bike Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Resumen de Reserva</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3">
                <img src={bike.image} alt={bike.name} className="w-16 h-16 rounded-lg object-cover" />
                <div>
                  <h4 className="font-semibold">{bike.name}</h4>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{bike.location}</span>
                  </div>
                  <Badge variant={bike.type === 'electric' ? 'default' : 'secondary'} className="mt-1">
                    {bike.type === 'electric' ? 'Eléctrica' : 'Mecánica'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Duration Selection */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Duración del Alquiler</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4, 6, 8, 12, 24].map((hours) => (
                  <Button
                    key={hours}
                    variant={selectedHours === hours ? 'default' : 'outline'}
                    onClick={() => setSelectedHours(hours)}
                    className="text-sm"
                  >
                    {hours}h
                  </Button>
                ))}
              </div>
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span>Precio por hora:</span>
                  <span className="font-semibold">${bike.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Duración:</span>
                  <span className="font-semibold">{selectedHours} hora{selectedHours > 1 ? 's' : ''}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between items-center text-lg font-bold text-emerald-600">
                  <span>Total:</span>
                  <span>${totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Método de Pago</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as 'balance' | 'card')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="balance" className="flex items-center space-x-2">
                    <Wallet className="h-4 w-4" />
                    <span>Saldo de Cuenta</span>
                  </TabsTrigger>
                  <TabsTrigger value="card" className="flex items-center space-x-2">
                    <CreditCard className="h-4 w-4" />
                    <span>Tarjeta de Crédito</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="balance" className="space-y-4">
                  <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-emerald-700">Saldo Disponible:</span>
                      <span className="font-bold text-emerald-800">${accountBalance.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-emerald-700">Después del pago:</span>
                      <span className="font-bold text-emerald-800">
                        ${(accountBalance - totalAmount).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  {!canPayWithBalance && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-700">
                        Saldo insuficiente. Necesitas ${(totalAmount - accountBalance).toLocaleString()} adicionales.
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="card" className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="cardName">Nombre del Titular</Label>
                      <Input
                        id="cardName"
                        placeholder="Juan Pérez"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cardNumber">Número de Tarjeta</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        maxLength={19}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Fecha de Vencimiento</Label>
                        <Input
                          id="expiry"
                          placeholder="MM/AA"
                          value={expiryDate}
                          onChange={(e) => setExpiryDate(e.target.value)}
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                          maxLength={4}
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button
              onClick={handlePayment}
              disabled={isProcessing || (paymentMethod === 'balance' && !canPayWithBalance)}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600"
            >
              {isProcessing ? 'Procesando...' : `Pagar $${totalAmount.toLocaleString()}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}