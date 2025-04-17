import { useState } from "react";
import { useChallenges } from "@/contexts/ChallengeContext";
import { useWallet } from "@/contexts/WalletContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import ChallengeCard from "@/components/ChallengeCard";
import ChallengeFilters from "@/components/ChallengeFilters";
import CreateChallengeModal from "@/components/CreateChallengeModal";
import JoinChallengeModal from "@/components/JoinChallengeModal";
import { ChallengeWithParticipants } from "@shared/schema";
import { Plus } from "lucide-react";

const Home = () => {
  const { challenges, isLoading, error } = useChallenges();
  const { wallet } = useWallet();
  const { toast } = useToast();
  
  // Filtering state
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [entryFilter, setEntryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<ChallengeWithParticipants | null>(null);
  
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
  
  // Handle join challenge button click
  const handleJoinClick = (challenge: ChallengeWithParticipants) => {
    setSelectedChallenge(challenge);
    setIsJoinModalOpen(true);
  };
  
  // Filter challenges based on selected filters
  const filteredChallenges = challenges.filter((challenge) => {
    // Category filter
    if (categoryFilter !== "all" && challenge.category.toLowerCase() !== categoryFilter.toLowerCase()) {
      return false;
    }
    
    // Status filter
    if (statusFilter !== "all" && challenge.status !== statusFilter) {
      return false;
    }
    
    // Entry fee filter
    if (entryFilter !== "all") {
      if (entryFilter === "low" && (challenge.entryFee < 0.01 || challenge.entryFee > 0.1)) {
        return false;
      } else if (entryFilter === "medium" && (challenge.entryFee < 0.1 || challenge.entryFee > 1.0)) {
        return false;
      } else if (entryFilter === "high" && challenge.entryFee < 1.0) {
        return false;
      }
    }
    
    // Search query
    if (searchQuery && !challenge.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !challenge.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  return (
    <>
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Explore Challenges</h1>
        <Button onClick={handleCreateClick} className="flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Create Challenge
        </Button>
      </div>
      
      <ChallengeFilters
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        entryFilter={entryFilter}
        setEntryFilter={setEntryFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-500">Loading challenges...</div>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-500">Error loading challenges: {error.message}</div>
        </div>
      ) : filteredChallenges.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-64">
          <div className="text-lg text-gray-500 mb-4">No challenges found</div>
          <Button onClick={handleCreateClick}>Create Your First Challenge</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChallenges.map((challenge) => (
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

export default Home;
