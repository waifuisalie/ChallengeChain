import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { ChallengeWithParticipants } from "@shared/schema";

interface ChallengeContextType {
  challenges: ChallengeWithParticipants[];
  isLoading: boolean;
  error: Error | null;
  refreshChallenges: () => void;
}

const ChallengeContext = createContext<ChallengeContextType | undefined>(undefined);

export const useChallenges = (): ChallengeContextType => {
  const context = useContext(ChallengeContext);
  if (!context) {
    throw new Error("useChallenges must be used within a ChallengeProvider");
  }
  return context;
};

interface ChallengeProviderProps {
  children: ReactNode;
}

export const ChallengeProvider = ({ children }: ChallengeProviderProps) => {
  const [challenges, setChallenges] = useState<ChallengeWithParticipants[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchChallenges = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/challenges');
      
      if (!response.ok) {
        throw new Error(`Error fetching challenges: ${response.status}`);
      }
      
      const data = await response.json();
      setChallenges(data);
    } catch (err) {
      console.error("Error fetching challenges:", err);
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchChallenges();
  }, []);

  const refreshChallenges = () => {
    fetchChallenges();
  };

  return (
    <ChallengeContext.Provider value={{ challenges, isLoading, error, refreshChallenges }}>
      {children}
    </ChallengeContext.Provider>
  );
};
