import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/WalletContext";
import { useToast } from "@/hooks/use-toast";
import { InfoIcon } from "lucide-react";
import { ChallengeWithParticipants } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useChallenges } from "@/contexts/ChallengeContext";

interface JoinChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  challenge: ChallengeWithParticipants | null;
}

const JoinChallengeModal = ({ isOpen, onClose, challenge }: JoinChallengeModalProps) => {
  const { wallet } = useWallet();
  const { toast } = useToast();
  const { refreshChallenges } = useChallenges();
  
  if (!challenge) return null;
  
  // Calculate time remaining
  const calculateTimeRemaining = () => {
    const now = new Date();
    const end = new Date(challenge.endDate);
    const diffTime = Math.abs(end.getTime() - now.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} days`;
  };
  
  // Format wallet address
  const formatWalletAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  const handleJoinChallenge = async () => {
    try {
      if (!wallet.connected) {
        toast({
          variant: "destructive",
          title: "Wallet Not Connected",
          description: "Please connect your wallet first!",
        });
        return;
      }
      
      // Check if enough balance
      if (wallet.balance < challenge.entryFee) {
        toast({
          variant: "destructive",
          title: "Insufficient Balance",
          description: `You need at least ${challenge.entryFee} ${challenge.cryptoType} to join this challenge.`,
        });
        return;
      }
      
      // For demonstration, we'll use user ID 1 (would come from auth in a real app)
      const participantData = {
        challengeId: challenge.id,
        userId: 1,
        walletAddress: wallet.address,
        score: 0
      };
      
      // Join challenge via API
      await apiRequest("POST", `/api/challenges/${challenge.id}/participants`, participantData);
      
      // Simulate deducting balance
      wallet.balance -= challenge.entryFee;
      
      // Invalidate challenges query to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/challenges"] });
      
      toast({
        title: "Challenge Joined",
        description: "You have successfully joined the challenge!",
      });
      
      onClose();
      refreshChallenges();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to Join",
        description: "There was an error joining the challenge.",
      });
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">Join Challenge</DialogTitle>
        </DialogHeader>
        
        <div className="mb-4">
          <h3 className="font-bold text-lg text-gray-900 mb-2">{challenge.name}</h3>
          <p className="text-gray-600 text-sm">{challenge.description}</p>
        </div>
        
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between mb-2">
            <div className="text-sm text-gray-500">Entry Fee</div>
            <div className="text-sm font-medium">{challenge.entryFee} {challenge.cryptoType}</div>
          </div>
          <div className="flex justify-between mb-2">
            <div className="text-sm text-gray-500">Current Pool</div>
            <div className="text-sm font-medium">{challenge.totalPool.toFixed(1)} {challenge.cryptoType}</div>
          </div>
          <div className="flex justify-between mb-2">
            <div className="text-sm text-gray-500">Participants</div>
            <div className="text-sm font-medium">{challenge.participants.length}/{challenge.maxParticipants}</div>
          </div>
          <div className="flex justify-between">
            <div className="text-sm text-gray-500">Ends In</div>
            <div className="text-sm font-medium">{calculateTimeRemaining()}</div>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Your Wallet</label>
          <div className="flex justify-between p-3 bg-gray-100 rounded-lg">
            <div className="text-sm font-mono">{formatWalletAddress(wallet.address)}</div>
            <div className="font-medium">{wallet.balance.toFixed(2)} {wallet.currency}</div>
          </div>
        </div>
        
        <div className="p-4 bg-blue-50 rounded-lg mb-6">
          <div className="flex items-start">
            <InfoIcon className="w-5 h-5 text-blue-500 mt-0.5 mr-2" />
            <div className="text-sm text-blue-700">
              <p>By joining this challenge:</p>
              <ul className="list-disc ml-5 mt-1">
                <li>{challenge.entryFee} {challenge.cryptoType} will be transferred from your wallet</li>
                <li>Your fee will be locked in the smart contract</li>
                <li>The winner will receive the entire pool</li>
              </ul>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex space-x-4">
          <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button className="flex-1" onClick={handleJoinChallenge}>Confirm & Join</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JoinChallengeModal;
