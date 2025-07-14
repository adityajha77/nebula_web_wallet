
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Moon, Sun } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);

  const handleNetworkSelect = (network: string) => {
    setSelectedNetwork(network);
    localStorage.setItem('selectedNetwork', network);
    localStorage.setItem('darkMode', isDark.toString());
    setTimeout(() => {
      navigate('/generate');
    }, 200);
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDark 
        ? 'bg-gradient-to-br from-slate-950 via-gray-950 to-zinc-950' 
        : 'bg-gradient-to-br from-gray-50 via-white to-slate-50'
    }`}>
      {/* Theme Toggle */}
      <div className="absolute top-8 right-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className={`rounded-full border-2 transition-all duration-300 ${
            isDark 
              ? 'text-white hover:bg-white/10 border-white/30 hover:border-white/50' 
              : 'text-gray-700 hover:bg-gray-100 border-gray-400 hover:border-gray-600'
          }`}
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>

      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-16">
            <h1 className={`text-7xl font-black tracking-wider mb-8 ${
              isDark 
                ? 'bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent' 
                : 'bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500 bg-clip-text text-transparent'
            }`}>
              NEBULA
            </h1>
            <p className={`text-2xl font-bold tracking-wide ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Choose your network to begin
            </p>
          </div>

          <div className="space-y-8">
            <Card 
              className={`p-10 backdrop-blur-xl border-2 hover:scale-[1.03] transition-all duration-500 cursor-pointer transform shadow-2xl ${
                isDark 
                  ? 'bg-white/10 border-white/20 hover:bg-white/20' 
                  : 'bg-black/10 border-gray-300 hover:bg-black/20'
              } ${selectedNetwork === 'solana' ? 'ring-2 ring-white/50' : ''}`}
              onClick={() => handleNetworkSelect('solana')}
            >
              <div className="flex items-center justify-center space-x-8">
                <div className={`w-4 h-4 rounded-full ${
                  isDark ? 'bg-white' : 'bg-gray-900'
                }`}></div>
                <div className="text-center">
                  <h3 className={`text-3xl font-black tracking-wide ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    Solana
                  </h3>
                  <p className={`text-base font-semibold mt-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Fast & low-cost blockchain
                  </p>
                </div>
              </div>
            </Card>

            <Card 
              className={`p-10 backdrop-blur-xl border-2 hover:scale-[1.03] transition-all duration-500 cursor-pointer transform shadow-2xl ${
                isDark 
                  ? 'bg-white/10 border-white/20 hover:bg-white/20' 
                  : 'bg-black/10 border-gray-300 hover:bg-black/20'
              } ${selectedNetwork === 'ethereum' ? 'ring-2 ring-white/50' : ''}`}
              onClick={() => handleNetworkSelect('ethereum')}
            >
              <div className="flex items-center justify-center space-x-8">
                <div className={`w-4 h-4 rounded-full ${
                  isDark ? 'bg-white' : 'bg-gray-900'
                }`}></div>
                <div className="text-center">
                  <h3 className={`text-3xl font-black tracking-wide ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    Ethereum
                  </h3>
                  <p className={`text-base font-semibold mt-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Decentralized world computer
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div className="mt-16 text-center">
            <p className={`text-sm font-bold tracking-widest uppercase ${
              isDark ? 'text-gray-500' : 'text-gray-400'
            }`}>
              Select a blockchain network to generate your wallet
            </p>
          </div>

          {/* Footer */}
          <div className="mt-20 text-center">
            <p className={`text-sm font-semibold tracking-wide ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Designed and Developed by Aditya Jha
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
