import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Wallet, Plus, CreditCard, DollarSign } from 'lucide-react';

interface AccountBalanceProps {
  balance: number;
  onAddFunds: (amount: number) => void;
}

export default function AccountBalance({ balance, onAddFunds }: AccountBalanceProps) {
  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
  const [addAmount, setAddAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const predefinedAmounts = [10000, 25000, 50000, 100000];

  const handleAddFunds = async () => {
    const amount = parseInt(addAmount.replace(/[^\d]/g, ''));
    if (amount && amount > 0) {
      setIsProcessing(true);
      
      // Simulate processing time
      setTimeout(() => {
        onAddFunds(amount);
        setAddAmount('');
        setIsAddFundsOpen(false);
        setIsProcessing(false);
      }, 1500);
    }
  };

  const handlePredefinedAmount = (amount: number) => {
    setAddAmount(amount.toString());
  };

  const formatCurrency = (amount: string) => {
    const numericValue = amount.replace(/[^\d]/g, '');
    return numericValue ? parseInt(numericValue).toLocaleString() : '';
  };

  const handleAmountChange = (value: string) => {
    const formatted = formatCurrency(value);
    setAddAmount(formatted);
  };

  return (
    <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full p-2">
              <Wallet className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg text-gray-900">Saldo de Cuenta</span>
          </div>
          <Badge variant="outline" className="bg-white border-emerald-300 text-emerald-700 font-semibold">
            Activa
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold text-emerald-700 mb-1">
              ${balance.toLocaleString()}
            </div>
            <p className="text-sm text-gray-600">COP disponibles</p>
          </div>
          
          <Dialog open={isAddFundsOpen} onOpenChange={setIsAddFundsOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold shadow-md hover:shadow-lg transition-all"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Fondos
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-emerald-600" />
                  <span>Agregar Fondos</span>
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Current Balance */}
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-emerald-700 font-medium">Saldo actual:</span>
                    <span className="font-bold text-emerald-800 text-lg">${balance.toLocaleString()}</span>
                  </div>
                </div>

                {/* Quick Amount Selection */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">
                    Montos rápidos:
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {predefinedAmounts.map((amount) => (
                      <Button
                        key={amount}
                        variant="outline"
                        onClick={() => handlePredefinedAmount(amount)}
                        className="text-sm hover:bg-emerald-50 hover:border-emerald-300"
                      >
                        ${amount.toLocaleString()}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Custom Amount */}
                <div>
                  <Label htmlFor="amount" className="text-sm font-medium text-gray-700 mb-2 block">
                    Monto personalizado:
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="amount"
                      placeholder="0"
                      value={addAmount}
                      onChange={(e) => handleAmountChange(e.target.value)}
                      className="pl-10 text-right font-mono text-lg"
                    />
                  </div>
                  {addAmount && (
                    <p className="text-xs text-gray-500 mt-1">
                      Nuevo saldo: ${(balance + parseInt(addAmount.replace(/[^\d]/g, '') || '0')).toLocaleString()}
                    </p>
                  )}
                </div>

                {/* Payment Method Info */}
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <CreditCard className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Método de pago</span>
                  </div>
                  <p className="text-xs text-blue-700">
                    Los fondos se agregarán instantáneamente usando tu método de pago preferido.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddFundsOpen(false)}
                    className="flex-1"
                    disabled={isProcessing}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleAddFunds}
                    disabled={!addAmount || parseInt(addAmount.replace(/[^\d]/g, '') || '0') <= 0 || isProcessing}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold"
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
