import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Wallet, Plus, CreditCard } from 'lucide-react';

interface AccountBalanceProps {
  balance: number;
  onAddFunds: (amount: number) => void;
}

export default function AccountBalance({ balance, onAddFunds }: AccountBalanceProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const predefinedAmounts = [10000, 25000, 50000, 100000];

  const handleAddFunds = async () => {
    const fundAmount = parseInt(amount);
    if (!fundAmount || fundAmount < 1000) {
      alert('El monto mínimo es $1,000');
      return;
    }

    if (!cardNumber || !expiryDate || !cvv) {
      alert('Por favor completa todos los campos de la tarjeta');
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      onAddFunds(fundAmount);
      setIsProcessing(false);
      setIsOpen(false);
      setAmount('');
      setCardNumber('');
      setExpiryDate('');
      setCvv('');
      alert(`¡Fondos agregados exitosamente! +$${fundAmount.toLocaleString()}`);
    }, 2000);
  };

  return (
    <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Wallet className="h-5 w-5 text-emerald-600" />
            <span>Saldo de Cuenta</span>
          </div>
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
            ${balance.toLocaleString()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Usa tu saldo para pagar alquileres de forma rápida
          </p>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600">
                <Plus className="h-4 w-4 mr-1" />
                Agregar Fondos
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <Wallet className="h-5 w-5" />
                  <span>Agregar Fondos</span>
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="amount">Monto a Agregar</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="10000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="1000"
                  />
                  <p className="text-xs text-gray-500 mt-1">Monto mínimo: $1,000</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {predefinedAmounts.map((preAmount) => (
                    <Button
                      key={preAmount}
                      variant="outline"
                      size="sm"
                      onClick={() => setAmount(preAmount.toString())}
                      className="text-sm"
                    >
                      ${preAmount.toLocaleString()}
                    </Button>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3 flex items-center space-x-2">
                    <CreditCard className="h-4 w-4" />
                    <span>Información de Pago</span>
                  </h4>
                  
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="addCardNumber">Número de Tarjeta</Label>
                      <Input
                        id="addCardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        maxLength={19}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="addExpiry">MM/AA</Label>
                        <Input
                          id="addExpiry"
                          placeholder="12/25"
                          value={expiryDate}
                          onChange={(e) => setExpiryDate(e.target.value)}
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <Label htmlFor="addCvv">CVV</Label>
                        <Input
                          id="addCvv"
                          placeholder="123"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                          maxLength={4}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleAddFunds}
                    disabled={isProcessing}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                  >
                    {isProcessing ? 'Procesando...' : 'Agregar Fondos'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}