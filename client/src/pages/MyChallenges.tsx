import { useState } from "react";
import { useChallenges } from "@/contexts/ChallengeContext";
import { useWallet } from "@/contexts/WalletContext";
import ChallengeCard from "@/components/ChallengeCard";
import JoinChallengeModal from "@/components/JoinChallengeModal";
import { ChallengeWithParticipants } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CreateChallengeModal from "@/components/CreateChallengeModal";
import { useToast } from "@/hooks/use-toast";

const MyChallenges = () => {
  const { challenges, isLoading, error } = useChallenges();
  const { wallet } = useWallet();
  const { toast } = useToast();
  
  // Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<ChallengeWithParticipants | null>(null);
  
  // Get challenges created by the user or that the user has joined
  // In a real app, this would filter based on authenticated user ID
  // For demo, we'll just use the wallet address
  const myChallenges = challenges.filter((challenge) => {
    if (!wallet.connected) return false;
    
    // Challenges the user has joined (based on wallet address)
    const hasJoined = challenge.participants.some(
      (p) => p.walletAddress.toLowerCase() === wallet.address.toLowerCase()
    );
    
    // In a real app, we would also check if user created the challenge
    // const isCreator = challenge.creatorId === currentUserId;
    
    return hasJoined;
  });
  
  // Handle create challenge button click
  const handleCreateClick = () => {
    if (!wallet.connected) {
      toast({
        variant: "destructive",
        title: "Wallet Not Connected",
        description: "Please connect your wallet first!",
      });
      return;
    }
    
    setIsCreateModalOpen(true);
  };
  
  // Handle join challenge click
  const handleJoinClick = (challenge: ChallengeWithParticipants) => {
    setSelectedChallenge(challenge);
    setIsJoinModalOpen(true);
  };
  
  if (!wallet.connected) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-lg text-gray-500 mb-4">Connect your wallet to view your challenges</div>
      </div>
    );
  }
  
  return (
    <>
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Challenges</h1>
        <Button onClick={handleCreateClick} className="flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Create Challenge
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-500">Loading your challenges...</div>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-500">Error loading challenges: {error.message}</div>
        </div>
      ) : myChallenges.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-64">
          <div className="text-lg text-gray-500 mb-4">You haven't joined any challenges yet</div>
          <Button onClick={handleCreateClick}>Create Your First Challenge</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myChallenges.map((challenge) => (
            <ChallengeCard 
              key={challenge.id} 
              challenge={challenge} 
              onJoinClick={handleJoinClick} 
            />
          ))}
        </div>
      )}
      
      {/* Modals */}
      <CreateChallengeModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
      
      <JoinChallengeModal 
        isOpen={isJoinModalOpen} 
        onClose={() => setIsJoinModalOpen(false)} 
        challenge={selectedChallenge} 
      />
    </>
  );
};

export default MyChallenges;
