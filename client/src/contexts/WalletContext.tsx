import { createContext, useContext, useState, ReactNode } from "react";

interface WalletState {
  connected: boolean;
  address: string;
  balance: number;
  currency: string;
}

interface WalletContextType {
  wallet: WalletState;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider = ({ children }: WalletProviderProps) => {
  const [wallet, setWallet] = useState<WalletState>({
    connected: false,
    address: "",
    balance: 0,
    currency: "SOL",
  });

  // Simulate connecting to a wallet
  const connect = async (): Promise<void> => {
    // In a real app, this would connect to an actual blockchain wallet
    return new Promise((resolve) => {
      setTimeout(() => {
        // Generate a random wallet address
        const address = "0x" + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join("");
        
        // Set random balance between 1 and 10
        const balance = Math.floor(Math.random() * 900 + 100) / 100;
        
        setWallet({
          connected: true,
          address,
          balance,
          currency: "SOL",
        });
        
        // Show success message (would use toast in components that use this context)
        console.log("Wallet connected successfully");
        
        resolve();
      }, 500);
    });
  };

  // Disconnect wallet
  const disconnect = () => {
    setWallet({
      connected: false,
      address: "",
      balance: 0,
      currency: "SOL",
    });
    
    // Show disconnect message (would use toast in components that use this context)
    console.log("Wallet disconnected");
  };

  return (
    <WalletContext.Provider value={{ wallet, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
};
