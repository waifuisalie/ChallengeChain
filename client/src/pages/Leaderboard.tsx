import { useChallenges } from "@/contexts/ChallengeContext";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trophy } from "lucide-react";

const Leaderboard = () => {
  const { challenges, isLoading, error } = useChallenges();
  const [selectedChallenge, setSelectedChallenge] = useState<string>("all");
  
  // Get active and completed challenges for the dropdown
  const relevantChallenges = challenges.filter(
    c => c.status === "active" || c.status === "completed"
  );
  
  // Get all participants across challenges or for a specific challenge
  const getParticipants = () => {
    if (selectedChallenge === "all") {
      // Combine participants from all challenges
      return challenges
        .flatMap(challenge => 
          challenge.participants.map(participant => ({
            ...participant,
            challengeName: challenge.name,
            challengeId: challenge.id,
            cryptoType: challenge.cryptoType,
            entryFee: challenge.entryFee,
            totalPool: challenge.totalPool
          }))
        )
        // Sort by score (higher first)
        .sort((a, b) => (b.score || 0) - (a.score || 0));
    } else {
      // Get participants for the selected challenge
      const challenge = challenges.find(c => c.id.toString() === selectedChallenge);
      if (!challenge) return [];
      
      return challenge.participants
        .map(participant => ({
          ...participant,
          challengeName: challenge.name,
          challengeId: challenge.id,
          cryptoType: challenge.cryptoType,
          entryFee: challenge.entryFee,
          totalPool: challenge.totalPool
        }))
        .sort((a, b) => (b.score || 0) - (a.score || 0));
    }
  };
  
  const participants = getParticipants();
  
  // Generate initials for avatar
  const getInitials = (index: number) => {
    const names = ['JD', 'AS', 'BL', 'CM', 'DK', 'EW', 'FH', 'GS', 'HM', 'IP'];
    return names[index % names.length];
  };
  
  return (
    <>
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Leaderboard</h1>
        <Select value={selectedChallenge} onValueChange={setSelectedChallenge}>
          <SelectTrigger className="w-[240px]" data-testid="challenge-selector">
            <SelectValue placeholder="All Challenges" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Challenges</SelectItem>
            {relevantChallenges.map(challenge => (
              <SelectItem key={challenge.id} value={challenge.id.toString()}>
                {challenge.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-500">Loading leaderboard data...</div>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-500">Error loading leaderboard: {error.message}</div>
        </div>
      ) : participants.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-500">No participant data available</div>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedChallenge === "all" 
                ? "Top Performers Across All Challenges" 
                : `Leaderboard: ${challenges.find(c => c.id.toString() === selectedChallenge)?.name}`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Rank</TableHead>
                  <TableHead>Participant</TableHead>
                  {selectedChallenge === "all" && <TableHead>Challenge</TableHead>}
                  <TableHead>Score</TableHead>
                  <TableHead className="text-right">Potential Reward</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {participants.map((participant, index) => (
                  <TableRow key={participant.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        {index < 3 && (
                          <Trophy 
                            className={`h-5 w-5 mr-1 ${
                              index === 0 ? "text-yellow-500" : 
                              index === 1 ? "text-gray-400" : 
                              "text-amber-700"
                            }`}
                            data-testid="trophy-icon"
                          />
                        )}
                        {index + 1}
                      </div>
                    </TableCell>                    <TableCell>
                      <div className="flex items-center">
                        <Avatar className={`h-8 w-8 mr-2 ${index < 3 ? 'border-2 border-' + (index === 0 ? 'yellow-500' : index === 1 ? 'gray-400' : 'amber-700') : ''}`}>
                          <AvatarFallback className="text-xs">
                            {getInitials(index)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">User {participant.userId}</div>
                          <div className="text-xs text-gray-500 font-mono">
                            {`${participant.walletAddress.substring(0, 6)}...${participant.walletAddress.substring(participant.walletAddress.length - 4)}`}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    {selectedChallenge === "all" && (
                      <TableCell>{participant.challengeName}</TableCell>
                    )}
                    <TableCell data-testid="score-cell">{participant.score || "No score yet"}</TableCell>                    <TableCell className="text-right">
                      {index < 3 && (
                        <span 
                          className={index === 0 ? "text-green-600 font-medium" : "text-gray-500"}
                          data-testid="winner-reward"
                        >
                          {index === 0 ? participant.totalPool.toFixed(1) : "0"} {participant.cryptoType}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default Leaderboard;
