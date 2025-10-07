import { useState } from 'react';
import Header from '@/components/Header';
import LoginForm from '@/components/LoginForm';
import RegistrationForm from '@/components/RegistrationForm';
import BikeCatalog from '@/components/BikeCatalog';

export default function Index() {
  const [user, setUser] = useState<string | null>(null);
  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = (email: string) => {
    setUser(email);
    setShowRegister(false);
  };

  const handleRegister = (email: string) => {
    setUser(email);
    setShowRegister(false);
  };

  const handleLogout = () => {
    setUser(null);
    setShowRegister(false);
  };

  const handleShowRegister = () => {
    setShowRegister(true);
  };

  const handleBackToLogin = () => {
    setShowRegister(false);
  };

  if (!user) {
    if (showRegister) {
      return (
        <RegistrationForm
          onRegister={handleRegister}
          onBackToLogin={handleBackToLogin}
        />
      );
    }
    return (
      <LoginForm
        onLogin={handleLogin}
        onShowRegister={handleShowRegister}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={handleLogout} />
      <main>
        <BikeCatalog />
      </main>
    </div>
  );
}