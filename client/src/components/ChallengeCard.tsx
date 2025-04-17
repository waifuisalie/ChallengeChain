import { ChallengeWithParticipants } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/WalletContext";
import { useToast } from "@/hooks/use-toast";
import { useChallenges } from "@/contexts/ChallengeContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ChallengeCardProps {
  challenge: ChallengeWithParticipants;
  onJoinClick: (challenge: ChallengeWithParticipants) => void;
}

const ChallengeCard = ({ challenge, onJoinClick }: ChallengeCardProps) => {
  const { wallet } = useWallet();
  const { toast } = useToast();
  
  // Format time remaining or time until start
  const formatTimeRemaining = (startDate: Date, endDate: Date) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (now < start) {
      // Challenge hasn't started yet
      const diffDays = Math.floor((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return `Starts in ${diffDays}d`;
    } else if (now > end) {
      // Challenge has ended
      const diffDays = Math.floor((now.getTime() - end.getTime()) / (1000 * 60 * 60 * 24));
      return `Ended ${diffDays}d ago`;
    } else {
      // Challenge is active
      const diffDays = Math.floor((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor(((end.getTime() - now.getTime()) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      return `${diffDays}d ${diffHours}h left`;
    }
  };
  
  // Get badge color based on status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'upcoming':
        return 'bg-yellow-500';
      case 'completed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  // Get gradient color based on category
  const getCategoryGradient = (category: string) => {
    switch (category.toLowerCase()) {
      case 'fitness':
        return 'from-blue-500 to-purple-600';
      case 'learning':
        return 'from-green-500 to-teal-600';
      case 'food':
        return 'from-amber-500 to-red-500';
      case 'social':
        return 'from-purple-500 to-pink-600';
      case 'creative':
        return 'from-blue-600 to-indigo-700';
      case 'health':
        return 'from-gray-700 to-gray-900';
      default:
        return 'from-gray-500 to-gray-700';
    }
  };
  
  // Get icon based on category
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'fitness':
        return (
          <svg className="h-16 w-16 text-white opacity-20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13.5 3.5a2 2 0 10-3 0H9a1 1 0 00-1 1v1h8V4.5a1 1 0 00-1-1h-1.5zM5 5.5V18a3 3 0 003 3h8a3 3 0 003-3V5.5H5z"></path>
            <path d="M9 11a1 1 0 011-1h4a1 1 0 110 2h-4a1 1 0 01-1-1zM9 14a1 1 0 011-1h4a1 1 0 110 2h-4a1 1 0 01-1-1z"></path>
          </svg>
        );
      case 'learning':
        return (
          <svg className="h-16 w-16 text-white opacity-20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 2a2 2 0 00-2 2v2a2 2 0 002 2h1v1a2 2 0 002 2h2a2 2 0 002-2V8h1a2 2 0 002-2V4a2 2 0 00-2-2H7zM3 14a2 2 0 012-2h14a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6z"></path>
          </svg>
        );
      case 'food':
        return (
          <svg className="h-16 w-16 text-white opacity-20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9.984 5.06a1 1 0 011.32-.78l5.197 2.024A1 1 0 0117 7.2V16.8a1 1 0 01-.498.916l-5.197 2.023a1 1 0 01-1.32-.78l-.633-8.7-3.925 1.626a.932.932 0 01-1.232-.527.93.93 0 01.463-1.229l3.925-1.626-.6-3.443z"></path>
          </svg>
        );
      case 'social':
        return (
          <svg className="h-16 w-16 text-white opacity-20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
          </svg>
        );
      case 'creative':
        return (
          <svg className="h-16 w-16 text-white opacity-20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
        );
      case 'health':
        return (
          <svg className="h-16 w-16 text-white opacity-20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 01-1.652.928l-.679-.906a1.125 1.125 0 00-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 00-8.862 12.872M12.75 3.031a9 9 0 016.69 14.036m0 0l-.177-.529A2.25 2.25 0 0017.128 15H16.5l-.324-.324a1.453 1.453 0 00-2.328.377l-.036.073a1.586 1.586 0 01-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 01-5.276 3.67m0 0a9 9 0 01-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25" />
          </svg>
        );
      default:
        return (
          <svg className="h-16 w-16 text-white opacity-20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 14l9-5-9-5-9 5 9 5z" />
            <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
          </svg>
        );
    }
  };
  
  // Generate initials for avatar
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  
  const handleJoinClick = () => {
    if (!wallet.connected) {
      toast({
        variant: "destructive",
        title: "Wallet Not Connected",
        description: "Please connect your wallet first!",
      });
      return;
    }
    
    onJoinClick(challenge);
  };
  
  // Get a winner if there is one
  const winner = challenge.participants.find(p => p.isWinner);
  
  return (
    <Card className="rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className={`h-36 relative bg-gradient-to-r ${getCategoryGradient(challenge.category)}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          {getCategoryIcon(challenge.category)}
        </div>
        <div className="absolute top-4 right-4 bg-accent text-white text-xs font-bold px-2 py-1 rounded-full">
          {challenge.entryFee} {challenge.cryptoType}
        </div>
        <div className="absolute bottom-4 left-4 bg-white/90 text-xs font-medium px-2 py-1 rounded-full flex items-center">
          <span className={`w-2 h-2 ${getStatusColor(challenge.status)} rounded-full mr-1.5`}></span>
          {challenge.status === 'completed' ? 'Ended' : (challenge.status === 'active' ? 'Active • ' : 'Upcoming • ')}
          {formatTimeRemaining(challenge.startDate, challenge.endDate)}
        </div>
      </div>
      
      <CardContent className="p-5">
        <h3 className="font-bold text-lg text-gray-900 mb-1">{challenge.name}</h3>
        <p className="text-gray-600 text-sm mb-4">{challenge.description}</p>
        
        <div className="flex justify-between text-sm mb-4">
          <div>
            <div className="text-gray-500">Participants</div>
            <div className="font-medium">{challenge.participants.length}/{challenge.maxParticipants}</div>
          </div>
          <div>
            <div className="text-gray-500">Total Pool</div>
            <div className="font-medium text-primary">{challenge.totalPool.toFixed(1)} {challenge.cryptoType}</div>
          </div>
          <div>
            <div className="text-gray-500">Category</div>
            <div className="font-medium">{challenge.category}</div>
          </div>
        </div>
        
        {challenge.status === 'completed' && winner ? (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <div className="text-xs font-medium text-gray-500">Winner</div>
              <div className="text-xs font-medium text-green-600">+{challenge.totalPool.toFixed(1)} {challenge.cryptoType}</div>
            </div>
            <div className="flex items-center">
              <Avatar className="h-8 w-8 border-2 border-green-500">
                <AvatarFallback className="text-xs">
                  {getInitials('Alex Johnson')}
                </AvatarFallback>
              </Avatar>
              <div className="ml-2">
                <div className="text-sm font-medium">Alex Johnson</div>
                <div className="text-xs text-gray-500">Outstanding Performance</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-4">
            <div className="text-xs font-medium text-gray-500 mb-1">Top Participants</div>
            <div className="flex -space-x-2">
              {challenge.participants.slice(0, 3).map((participant, index) => (
                <Avatar key={index} className="w-8 h-8 border-2 border-white">
                  <AvatarFallback className="text-xs">
                    {getInitials('User ' + (index + 1))}
                  </AvatarFallback>
                </Avatar>
              ))}
              {challenge.participants.length > 3 && (
                <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-500">
                  +{challenge.participants.length - 3}
                </div>
              )}
            </div>
          </div>
        )}
        
        {challenge.status === 'completed' ? (
          <Button 
            className="w-full py-2" 
            variant="secondary" 
            disabled 
          >
            Challenge Ended
          </Button>
        ) : (
          <Button 
            className="w-full py-2" 
            onClick={handleJoinClick}
          >
            Join Challenge
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ChallengeCard;
