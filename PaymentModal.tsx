import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CreditCard, Wallet, Clock, MapPin, Bike, CheckCircle, ExternalLink, AlertCircle } from 'lucide-react';
import { Bike as BikeType } from '@/lib/bikes';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  bike: BikeType | null;
  accountBalance: number;
  onPayment: (method: 'balance' | 'stripe', amount: number) => void;
}

export default function PaymentModal({ isOpen, onClose, bike, accountBalance, onPayment }: PaymentModalProps) {
  const [selectedHours, setSelectedHours] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'balance' | 'stripe'>('balance');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [stripeRedirecting, setStripeRedirecting] = useState(false);

  // Stripe payment link
  const STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/test_eVqfZa94vatael2asTfUQ00';

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedHours(1);
      setPaymentMethod('balance');
      setIsProcessing(false);
      setPaymentComplete(false);
      setStripeRedirecting(false);
    }
  }, [isOpen]);

  if (!bike) return null;

  const totalAmount = bike.price * selectedHours;
  const canPayWithBalance = accountBalance >= totalAmount;

  const handleBalancePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentComplete(true);
      onPayment('balance', totalAmount);
      
      // Close modal after showing success
      setTimeout(() => {
        setPaymentComplete(false);
        onClose();
      }, 2000);
    }, 2000);
  };

  const handleStripePayment = () => {
    setStripeRedirecting(true);
    
    // Create URL with custom parameters for better tracking
    const stripeUrl = new URL(STRIPE_PAYMENT_LINK);
    stripeUrl.searchParams.set('client_reference_id', `bike_${bike.id}_${selectedHours}h`);
    stripeUrl.searchParams.set('prefilled_email', ''); // Could be populated with user email
    
    // Open Stripe payment link in new tab
    window.open(stripeUrl.toString(), '_blank', 'noopener,noreferrer');
    
    // Simulate successful payment after redirect (in real app, this would be handled by webhook)
    setTimeout(() => {
      setStripeRedirecting(false);
      setPaymentComplete(true);
      onPayment('stripe', totalAmount);
      
      setTimeout(() => {
        setPaymentComplete(false);
        onClose();
      }, 2000);
    }, 3000);
  };

  const handlePayment = () => {
    if (paymentMethod === 'balance') {
      handleBalancePayment();
    } else {
      handleStripePayment();
    }
  };

  // Success screen
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
            <Badge className="bg-green-500 hover:bg-green-600">Reserva Confirmada</Badge>
            <div className="mt-4 text-sm text-gray-500">
              <p>Duración: {selectedHours} hora{selectedHours > 1 ? 's' : ''}</p>
              <p>Total pagado: ${totalAmount.toLocaleString()}</p>
            </div>
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
            <Bike className="h-5 w-5 text-emerald-600" />
            <span>Confirmar Reserva</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Bike Summary */}
          <Card className="border-emerald-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <span>Resumen de Reserva</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3">
                <img 
                  src={bike.image} 
                  alt={bike.name} 
                  className="w-16 h-16 rounded-lg object-cover border-2 border-gray-100" 
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{bike.name}</h4>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{bike.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant={bike.type === 'electric' ? 'default' : 'secondary'} className="text-xs">
                      {bike.type === 'electric' ? 'Eléctrica' : 'Mecánica'}
                    </Badge>
                    {bike.type === 'electric' && bike.battery && (
                      <Badge variant="outline" className="text-xs text-green-600 border-green-200">
                        {bike.battery}% batería
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Duration Selection */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <span>Duración del Alquiler</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {[1, 2, 3, 4, 6, 8, 12, 24].map((hours) => (
                  <Button
                    key={hours}
                    variant={selectedHours === hours ? 'default' : 'outline'}
                    onClick={() => setSelectedHours(hours)}
                    className={`text-sm transition-all ${
                      selectedHours === hours 
                        ? 'bg-emerald-500 hover:bg-emerald-600' 
                        : 'hover:border-emerald-300'
                    }`}
                  >
                    {hours}h
                  </Button>
                ))}
              </div>
              <div className="p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg border border-emerald-100">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-700">Precio por hora:</span>
                  <span className="font-semibold text-gray-900">${bike.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm mt-1">
                  <span className="text-gray-700">Duración:</span>
                  <span className="font-semibold text-gray-900">{selectedHours} hora{selectedHours > 1 ? 's' : ''}</span>
                </div>
                <Separator className="my-3" />
                <div className="flex justify-between items-center text-lg font-bold text-emerald-700">
                  <span>Total a pagar:</span>
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
              <Tabs value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as 'balance' | 'stripe')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="balance" className="flex items-center space-x-2">
                    <Wallet className="h-4 w-4" />
                    <span>Saldo de Cuenta</span>
                  </TabsTrigger>
                  <TabsTrigger value="stripe" className="flex items-center space-x-2">
                    <CreditCard className="h-4 w-4" />
                    <span>Stripe Checkout</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="balance" className="space-y-4 mt-4">
                  <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-emerald-700 font-medium">Saldo Disponible:</span>
                      <span className="font-bold text-emerald-800 text-lg">${accountBalance.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-emerald-700 font-medium">Después del pago:</span>
                      <span className={`font-bold text-lg ${
                        canPayWithBalance ? 'text-emerald-800' : 'text-red-600'
                      }`}>
                        ${(accountBalance - totalAmount).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  {!canPayWithBalance && (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-700">
                        <strong>Saldo insuficiente.</strong> Necesitas ${(totalAmount - accountBalance).toLocaleString()} adicionales.
                        Puedes agregar fondos desde tu panel de cuenta o usar Stripe Checkout.
                      </AlertDescription>
                    </Alert>
                  )}
                </TabsContent>

                <TabsContent value="stripe" className="space-y-4 mt-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start space-x-3">
                      <div className="bg-blue-100 rounded-full p-2">
                        <CreditCard className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-blue-900 mb-2">Pago Seguro con Stripe</h4>
                        <p className="text-sm text-blue-700 mb-3">
                          Serás redirigido a Stripe Checkout para completar tu pago de forma segura. 
                          Acepta tarjetas de crédito, débito y otros métodos de pago.
                        </p>
                        <div className="flex items-center space-x-2 text-xs text-blue-600">
                          <ExternalLink className="h-3 w-3" />
                          <span>Se abrirá en una nueva pestaña</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Alert className="border-blue-200 bg-blue-50">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-700">
                      <strong>Nota:</strong> Este es un enlace de pago de prueba de Stripe. 
                      En producción, aquí se procesarían pagos reales.
                    </AlertDescription>
                  </Alert>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-2">
            <Button 
              variant="outline" 
              onClick={onClose} 
              className="flex-1 border-gray-300 hover:bg-gray-50"
              disabled={isProcessing || stripeRedirecting}
            >
              Cancelar
            </Button>
            <Button
              onClick={handlePayment}
              disabled={
                isProcessing || 
                stripeRedirecting || 
                (paymentMethod === 'balance' && !canPayWithBalance)
              }
              className="flex-1 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold"
            >
              {isProcessing && paymentMethod === 'balance' && 'Procesando...'}
              {stripeRedirecting && paymentMethod === 'stripe' && 'Redirigiendo...'}
              {!isProcessing && !stripeRedirecting && (
                <>
                  {paymentMethod === 'stripe' && <ExternalLink className="h-4 w-4 mr-2" />}
                  Pagar ${totalAmount.toLocaleString()}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}