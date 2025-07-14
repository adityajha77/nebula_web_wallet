import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Eye, EyeOff, ArrowRight, Moon, Sun } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import * as bip39 from 'bip39'; // ✅ Importing bip39

const Generate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [mnemonic, setMnemonic] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [network, setNetwork] = useState('');
  const [isDark, setIsDark] = useState(false);

  // Generate and apply theme and mnemonic
  useEffect(() => {
    const selectedNetwork = localStorage.getItem('selectedNetwork');
    const darkMode = localStorage.getItem('darkMode');

    if (!selectedNetwork) {
      navigate('/');
      return;
    }

    setNetwork(selectedNetwork);
    setIsDark(darkMode === 'true');
    document.documentElement.classList.toggle('dark', darkMode === 'true');

    const newMnemonic = bip39.generateMnemonic(); // ✅ Generate secure 12-word phrase
    setMnemonic(newMnemonic);
  }, [navigate]);

  const handleProceed = () => {
    if (!bip39.validateMnemonic(mnemonic)) {
      toast({
        title: 'Invalid Mnemonic',
        description: 'Please regenerate the phrase.',
        variant: 'destructive',
      });
      return;
    }

    localStorage.setItem('secretKey', mnemonic);
    toast({
      title: 'Secret key saved',
      description: 'You can now proceed to your wallet dashboard.',
    });
    navigate('/dashboard');
  };

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('darkMode', newTheme.toString());
    document.documentElement.classList.toggle('dark', newTheme);
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDark
        ? 'bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900'
        : 'bg-gradient-to-br from-gray-100 via-white to-slate-100'
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
        <div className="w-full max-w-2xl">
          <div className="text-center mb-10">
            <h1 className={`text-5xl font-black mb-4 ${
              isDark
                ? 'bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent'
                : 'bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent'
            }`}>
              Your Secret Recovery Phrase
            </h1>
            <p className={`text-xl font-bold ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Keep this safe! You'll need it to recover your {network} wallets.
            </p>
          </div>

          <Card className={`p-10 backdrop-blur-xl border-2 shadow-2xl ${
            isDark
              ? 'bg-white/10 border-white/20'
              : 'bg-black/10 border-gray-300'
          }`}>
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-2xl font-black ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Your Secret Key (Keep it Safe!)
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsVisible(!isVisible)}
                  className={`border-2 transition-all duration-300 ${
                    isDark
                      ? 'text-white hover:bg-white/10 border-white/30 hover:border-white/50'
                      : 'text-gray-700 hover:bg-gray-100 border-gray-400 hover:border-gray-600'
                  }`}
                >
                  {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>

             <div className={`p-8 rounded-xl border-2 font-mono tracking-wide font-semibold leading-relaxed text-base ${
  isDark
    ? 'bg-black/40 text-white border-white/20'
    : 'bg-white/60 text-gray-900 border-gray-300'
}`}>

                {isVisible ? mnemonic : mnemonic.replace(/\S/g, '•')}
              </div>
            </div>

            <div className="space-y-6">
              <div className={`p-6 rounded-xl border-2 ${
                isDark
                  ? 'bg-amber-500/20 border-amber-500/40'
                  : 'bg-amber-100 border-amber-300'
              }`}>
                <p className={`text-base font-bold ${
                  isDark ? 'text-amber-100' : 'text-amber-800'
                }`}>
                  ⚠️ <strong>Important:</strong> Write down this phrase and store it securely. 
                  Anyone with access can control your wallet.
                </p>
              </div>

              <Button 
                onClick={handleProceed}
                className={`w-full font-bold py-4 px-8 rounded-xl transition-all duration-300 text-lg hover:bg-black hover:text-white ${
                  isDark
                    ? 'bg-white text-black hover:bg-gray-800 hover:text-white'
                    : 'bg-gray-900 text-white hover:bg-black'
                }`}
                size="lg"
              >
                I've Saved My Recovery Phrase
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </Card>

          <div className="mt-8 text-center">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className={`font-bold transition-all duration-300 ${
                isDark
                  ? 'text-gray-300 hover:text-white hover:bg-white/10'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              ← Back to Network Selection
            </Button>
          </div>

          <div className="mt-16 text-center">
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

export default Generate;
