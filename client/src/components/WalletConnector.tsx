import { useWallet } from "@/contexts/WalletContext";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Wallet } from "lucide-react";

const WalletConnector = () => {
  const { wallet, connect, disconnect } = useWallet();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  
  const handleConnectWallet = async () => {
    try {
      await connect();
      toast({
        title: "Wallet Connected",
        description: "Your wallet has been successfully connected.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: "Failed to connect to wallet.",
      });
    }
  };

  const handleDisconnectWallet = () => {
    disconnect();
    setIsOpen(false);
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    });
  };
  
  // Format wallet address for display
  const formatWalletAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  if (!wallet.connected) {
    return (
      <Button onClick={handleConnectWallet} className="flex items-center">
        <Wallet className="w-5 h-5 mr-2" />
        Connect Wallet
      </Button>
    );
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="border-green-500 text-green-600 hover:bg-green-50">
          <Wallet className="w-5 h-5 mr-2" />
          {formatWalletAddress(wallet.address)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <div className="p-4">
          <div className="text-sm font-medium text-gray-700">Connected Wallet</div>
          <div className="text-gray-600 text-xs mt-1 font-mono">
            {wallet.address}
          </div>
          <div className="mt-2 flex justify-between items-center">
            <div>
              <div className="text-xs text-gray-500">Balance</div>
              <div className="font-medium">{wallet.balance} {wallet.currency}</div>
            </div>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={handleDisconnectWallet} 
              className="text-xs"
            >
              Disconnect
            </Button>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default WalletConnector;
