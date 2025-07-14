
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Eye, EyeOff, Plus, Trash2, Copy, Moon, Sun, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { WalletGenerator } from '@/components/WalletGenerator';

interface Wallet {
  id: string;
  publicKey: string;
  privateKey: string;
  index: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [visiblePrivateKeys, setVisiblePrivateKeys] = useState<Set<string>>(new Set());
  const [network, setNetwork] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [isDark, setIsDark] = useState(false);
  const [walletGenerator, setWalletGenerator] = useState<WalletGenerator | null>(null);

  useEffect(() => {
    const selectedNetwork = localStorage.getItem('selectedNetwork');
    const storedSecretKey = localStorage.getItem('secretKey');
    const darkMode = localStorage.getItem('darkMode');
    
    if (!selectedNetwork || !storedSecretKey) {
      navigate('/');
      return;
    }

    setNetwork(selectedNetwork);
    setSecretKey(storedSecretKey);
    setIsDark(darkMode === 'true');
    
    if (darkMode === 'true') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    const generator = new WalletGenerator(storedSecretKey, selectedNetwork);
    setWalletGenerator(generator);

    const savedWallets = localStorage.getItem('wallets');
    if (savedWallets) {
      setWallets(JSON.parse(savedWallets));
    }
  }, [navigate]);

  const generateNewWallet = async () => {
    if (!walletGenerator) return;

    try {
      const newWallet = await walletGenerator.generateWallet(wallets.length);
      const wallet: Wallet = {
        id: Date.now().toString(),
        publicKey: newWallet.publicKey,
        privateKey: newWallet.privateKey,
        index: wallets.length
      };

      const updatedWallets = [...wallets, wallet];
      setWallets(updatedWallets);
      localStorage.setItem('wallets', JSON.stringify(updatedWallets));
      
      toast({
        title: "Wallet Generated",
        description: `New ${network} wallet created successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate wallet",
        variant: "destructive"
      });
    }
  };

  const deleteAllWallets = () => {
    setWallets([]);
    setVisiblePrivateKeys(new Set());
    localStorage.removeItem('wallets');
    toast({
      title: "All Wallets Deleted",
      description: "Your wallet list has been cleared",
    });
  };

  const togglePrivateKeyVisibility = (walletId: string) => {
    const newVisible = new Set(visiblePrivateKeys);
    if (newVisible.has(walletId)) {
      newVisible.delete(walletId);
    } else {
      newVisible.add(walletId);
    }
    setVisiblePrivateKeys(newVisible);
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: `${type} copied to clipboard`,
    });
  };

  const exportWallets = () => {
    const exportData = wallets.map(wallet => ({
      index: wallet.index + 1,
      publicKey: wallet.publicKey,
      privateKey: wallet.privateKey
    }));

    const content = `${network.toUpperCase()} Wallets Export\n\n` +
      `Recovery Phrase: ${secretKey}\n\n` +
      exportData.map(wallet => 
        `Wallet ${wallet.index}:\nPublic Key: ${wallet.publicKey}\nPrivate Key: ${wallet.privateKey}\n`
      ).join('\n');

    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${network}-wallets.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast({
      title: "Export Complete",
      description: "Wallets exported to text file",
    });
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    localStorage.setItem('darkMode', (!isDark).toString());
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
      <div className="p-8">
        <div className="flex items-center justify-between mb-16">
          <h1 className={`text-6xl font-black tracking-wider ${
            isDark 
              ? 'bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent' 
              : 'bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500 bg-clip-text text-transparent'
          }`}>
            NEBULA
          </h1>
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

        {/* Network Info */}
        <div className="mb-10">
          <Card className={`p-8 border-2 shadow-none ${
            isDark 
              ? 'bg-white/10 backdrop-blur-sm border-white/20' 
              : 'bg-black/10 backdrop-blur-sm border-gray-300'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm uppercase tracking-widest font-bold ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Active Network
                </p>
                <p className={`font-black text-3xl mt-2 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {network.charAt(0).toUpperCase() + network.slice(1)}
                </p>
              </div>
              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportWallets}
                  disabled={wallets.length === 0}
                  className={`rounded-full font-bold border-2 transition-all duration-300 hover:bg-black hover:text-white ${
                    isDark 
                      ? 'border-white/30 text-white hover:bg-white/10' 
                      : 'border-gray-400 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-6 mb-16">
          <Button
            onClick={generateNewWallet}
            className={`rounded-full font-black px-10 py-3 text-lg transition-all duration-300 hover:bg-black hover:text-white ${
              isDark 
                ? 'bg-white text-black hover:bg-gray-800 hover:text-white' 
                : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            <Plus className="h-5 w-5 mr-2" />
            Generate New Wallet
          </Button>
          
          <Button
            variant="outline"
            onClick={deleteAllWallets}
            disabled={wallets.length === 0}
            className={`rounded-full font-black px-10 py-3 text-lg border-2 transition-all duration-300 hover:bg-black hover:text-white ${
              isDark 
                ? 'border-red-500/60 text-red-400 hover:bg-red-500/20' 
                : 'border-red-500 text-red-600 hover:bg-red-50'
            }`}
          >
            <Trash2 className="h-5 w-5 mr-2" />
            Delete All Wallets
          </Button>
        </div>

        {/* Wallets List */}
        <div className="space-y-8">
          {wallets.length === 0 ? (
            <Card className={`p-16 text-center border-2 shadow-none ${
              isDark 
                ? 'bg-white/10 backdrop-blur-sm border-white/20' 
                : 'bg-black/10 backdrop-blur-sm border-gray-300'
            }`}>
              <p className={`text-2xl font-black ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                No wallets generated yet
              </p>
              <p className={`text-lg font-bold mt-3 ${
                isDark ? 'text-gray-500' : 'text-gray-400'
              }`}>
                Click "Generate New Wallet" to create your first {network} wallet
              </p>
            </Card>
          ) : (
            wallets.map((wallet, index) => (
              <Card key={wallet.id} className={`p-10 border-2 shadow-none hover:scale-[1.01] transition-all duration-300 ${
                isDark 
                  ? 'bg-white/10 backdrop-blur-sm border-white/20' 
                  : 'bg-black/10 backdrop-blur-sm border-gray-300'
              }`}>
                <div className="flex items-center justify-between mb-8">
                  <h3 className={`text-2xl font-black tracking-wide ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    Wallet {index + 1}
                  </h3>
                </div>
                
                <div className="space-y-8">
                  {/* Public Key */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className={`text-sm uppercase tracking-widest font-bold ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        Public Key
                      </label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(wallet.publicKey, 'Public key')}
                        className={`rounded-full transition-all duration-300 hover:bg-black hover:text-white ${
                          isDark 
                            ? 'text-gray-300 hover:bg-white/10 hover:text-white' 
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-700'
                        }`}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className={`p-6 rounded-xl font-mono text-sm break-all leading-relaxed font-semibold ${
                      isDark 
                        ? 'bg-black/30 text-gray-200 border-2 border-white/20' 
                        : 'bg-white/70 text-gray-800 border-2 border-gray-300'
                    }`}>
                      {wallet.publicKey}
                    </div>
                  </div>

                  {/* Private Key */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className={`text-sm uppercase tracking-widest font-bold ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        Private Key
                      </label>
                      <div className="flex space-x-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => togglePrivateKeyVisibility(wallet.id)}
                          className={`rounded-full transition-all duration-300 hover:bg-black hover:text-white ${
                            isDark 
                              ? 'text-gray-300 hover:bg-white/10 hover:text-white' 
                              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-700'
                          }`}
                        >
                          {visiblePrivateKeys.has(wallet.id) ? 
                            <EyeOff className="h-4 w-4" /> : 
                            <Eye className="h-4 w-4" />
                          }
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(wallet.privateKey, 'Private key')}
                          className={`rounded-full transition-all duration-300 hover:bg-black hover:text-white ${
                            isDark 
                              ? 'text-gray-300 hover:bg-white/10 hover:text-white' 
                              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-700'
                          }`}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className={`p-6 rounded-xl font-mono text-sm break-all leading-relaxed font-semibold ${
                      isDark 
                        ? 'bg-black/30 text-gray-200 border-2 border-white/20' 
                        : 'bg-white/70 text-gray-800 border-2 border-gray-300'
                    }`}>
                      {visiblePrivateKeys.has(wallet.id) 
                        ? wallet.privateKey 
                        : '•'.repeat(wallet.privateKey.length)
                      }
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-24 text-center space-y-6">
          <p className={`text-lg font-bold tracking-wide ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Designed and Developed by Aditya Jha
          </p>
          <Button
            variant="ghost"
            onClick={() => {
              localStorage.clear();
              navigate('/');
            }}
            className={`font-bold text-lg transition-all duration-300 ${
              isDark 
                ? 'text-gray-400 hover:text-gray-200' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            ← Start Over
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
