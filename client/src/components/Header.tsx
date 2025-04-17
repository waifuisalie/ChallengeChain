import { useWallet } from "@/contexts/WalletContext";
import WalletConnector from "./WalletConnector";

const Header = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <svg className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" opacity="0.2"/>
                <path d="M17.657 9.343l-4-4a1 1 0 00-1.414 0l-4 4a1 1 0 001.414 1.414L12 8.414l2.343 2.343a1 1 0 001.414-1.414zM12 16l-3.657-3.657a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l4-4a1 1 0 00-1.414-1.414L12 16z"/>
              </svg>
              <span className="ml-2 text-xl font-bold text-gray-900">ChainChallenge</span>
            </div>
          </div>
          <div className="flex items-center">
            <WalletConnector />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
