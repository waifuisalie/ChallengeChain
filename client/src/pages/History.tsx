import { useChallenges } from "@/contexts/ChallengeContext";
import { useWallet } from "@/contexts/WalletContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChallengeWithParticipants } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const History = () => {
  const { challenges, isLoading, error } = useChallenges();
  const { wallet } = useWallet();
  const [activeTab, setActiveTab] = useState("all");
  
  const completedChallenges = challenges.filter(
    challenge => challenge.status === "completed"
  );
  
  // For user participation history (in a real app, would filter by user ID)
  const userParticipation = completedChallenges.filter(challenge => 
    wallet.connected && challenge.participants.some(
      p => p.walletAddress.toLowerCase() === wallet.address.toLowerCase()
    )
  );
  
  // Format date
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Get winner display
  const getWinnerDisplay = (challenge: ChallengeWithParticipants) => {
    const winner = challenge.participants.find(p => p.isWinner);
    if (!winner) return "No winner declared";
    
    return `User ${winner.userId} (${winner.walletAddress.substring(0, 6)}...)`;
  };
  
  // Get category label style
  const getCategoryStyle = (category: string) => {
    switch (category.toLowerCase()) {
      case 'fitness':
        return "bg-blue-100 text-blue-800";
      case 'learning':
        return "bg-green-100 text-green-800";
      case 'food':
        return "bg-red-100 text-red-800";
      case 'social':
        return "bg-purple-100 text-purple-800";
      case 'creative':
        return "bg-indigo-100 text-indigo-800";
      case 'health':
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  // Determine if user won a challenge
  const didUserWin = (challenge: ChallengeWithParticipants) => {
    if (!wallet.connected) return false;
    
    const winner = challenge.participants.find(p => p.isWinner);
    return winner && winner.walletAddress.toLowerCase() === wallet.address.toLowerCase();
  };
  
  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Challenge History</h1>
        <p className="text-gray-600 mt-2">View past challenges and their outcomes</p>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Completed Challenges</TabsTrigger>
          <TabsTrigger value="mine" disabled={!wallet.connected}>My Challenge History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-lg text-gray-500">Loading challenge history...</div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-lg text-red-500">Error loading history: {error.message}</div>
            </div>
          ) : completedChallenges.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-lg text-gray-500">No completed challenges yet</div>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Completed Challenges</CardTitle>
                <CardDescription>
                  Showing {completedChallenges.length} completed challenges with their results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Challenge</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Participants</TableHead>
                      <TableHead>Completed Date</TableHead>
                      <TableHead>Winner</TableHead>
                      <TableHead className="text-right">Prize Pool</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {completedChallenges.map(challenge => (
                      <TableRow key={challenge.id}>
                        <TableCell className="font-medium">{challenge.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getCategoryStyle(challenge.category)}>
                            {challenge.category}
                          </Badge>
                        </TableCell>
                        <TableCell>{challenge.participants.length}</TableCell>
                        <TableCell>{formatDate(challenge.endDate)}</TableCell>
                        <TableCell>{getWinnerDisplay(challenge)}</TableCell>
                        <TableCell className="text-right">{challenge.totalPool.toFixed(1)} {challenge.cryptoType}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="mine">
          {!wallet.connected ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-lg text-gray-500">Connect your wallet to view your challenge history</div>
            </div>
          ) : isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-lg text-gray-500">Loading your challenge history...</div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-lg text-red-500">Error loading history: {error.message}</div>
            </div>
          ) : userParticipation.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-lg text-gray-500">You haven't participated in any completed challenges yet</div>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Your Challenge History</CardTitle>
                <CardDescription>
                  Showing your participation in {userParticipation.length} completed challenges
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Challenge</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Completed Date</TableHead>
                      <TableHead>Result</TableHead>
                      <TableHead className="text-right">Your Earnings</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userParticipation.map(challenge => (
                      <TableRow key={challenge.id}>
                        <TableCell className="font-medium">{challenge.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getCategoryStyle(challenge.category)}>
                            {challenge.category}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(challenge.endDate)}</TableCell>
                        <TableCell>
                          {didUserWin(challenge) ? (
                            <Badge className="bg-green-100 text-green-800">Winner</Badge>
                          ) : (
                            <Badge variant="outline" className="bg-gray-100 text-gray-800">Participated</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {didUserWin(challenge) ? (
                            <span className="text-green-600 font-medium">
                              +{challenge.totalPool.toFixed(1)} {challenge.cryptoType}
                            </span>
                          ) : (
                            <span className="text-gray-500">
                              -0.0 {challenge.cryptoType}
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
        </TabsContent>
      </Tabs>
    </>
  );
};

export default History;
