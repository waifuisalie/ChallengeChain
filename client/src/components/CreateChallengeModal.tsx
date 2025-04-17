import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWallet } from "@/contexts/WalletContext";
import { useToast } from "@/hooks/use-toast";
import { InfoIcon } from "lucide-react";
import * as z from "zod";
import { useChallenges } from "@/contexts/ChallengeContext";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

interface CreateChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const formSchema = z.object({
  name: z.string().min(5, "Challenge name must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  rules: z.string().min(10, "Rules must be at least 10 characters"),
  category: z.string().min(1, "Please select a category"),
  verificationMethod: z.string().min(1, "Please select a verification method"),
  maxParticipants: z.coerce.number().min(2, "Must allow at least 2 participants").max(100, "Maximum 100 participants"),
  startDate: z.string().min(1, "Please select a start date"),
  endDate: z.string().min(1, "Please select an end date"),
  cryptoType: z.string().min(1, "Please select a cryptocurrency"),
  entryFee: z.coerce.number().min(0.01, "Minimum entry fee is 0.01")
}).refine(data => {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  return end > start;
}, {
  message: "End date must be after start date",
  path: ["endDate"]
});

type FormValues = z.infer<typeof formSchema>;

const CreateChallengeModal = ({ isOpen, onClose }: CreateChallengeModalProps) => {
  const { wallet } = useWallet();
  const { toast } = useToast();
  const { refreshChallenges } = useChallenges();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      rules: "",
      category: "",
      verificationMethod: "",
      maxParticipants: 20,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      cryptoType: "SOL",
      entryFee: 0.5
    }
  });
  
  const onSubmit = async (data: FormValues) => {
    try {
      if (!wallet.connected) {
        toast({
          variant: "destructive",
          title: "Wallet Not Connected",
          description: "Please connect your wallet first!",
        });
        return;
      }
      
      // Determine status based on start date
      const now = new Date();
      const startDate = new Date(data.startDate);
      const status = startDate <= now ? "active" : "upcoming";
      
      // Simulating a user ID 1 for now (would be from auth in a real app)
      const challengeData = {
        ...data,
        creatorId: 1,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        status
      };
      
      // Create challenge via API
      await apiRequest("POST", "/api/challenges", challengeData);
      
      // Invalidate challenges query to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/challenges"] });
      
      toast({
        title: "Challenge Created",
        description: "Your challenge has been created successfully!",
      });
      
      form.reset();
      onClose();
      refreshChallenges();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Challenge Creation Failed",
        description: "There was an error creating your challenge.",
      });
    }
  };
  
  // Update crypto symbol in the smart contract preview
  const cryptoType = form.watch("cryptoType");
  const challengeName = form.watch("name");
  const entryFee = form.watch("entryFee");
  const maxParticipants = form.watch("maxParticipants");
  const startDate = form.watch("startDate");
  const endDate = form.watch("endDate");
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">Create New Challenge</DialogTitle>
          <DialogDescription>
            Create a new challenge for others to join and compete in.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Challenge Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Give your challenge a catchy name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe your challenge in detail" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="fitness">Fitness</SelectItem>
                            <SelectItem value="food">Food & Eating</SelectItem>
                            <SelectItem value="learning">Learning</SelectItem>
                            <SelectItem value="creative">Creative</SelectItem>
                            <SelectItem value="social">Social</SelectItem>
                            <SelectItem value="health">Health</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="maxParticipants"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Participants</FormLabel>
                        <FormControl>
                          <Input type="number" min={2} max={100} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Rules & Verification */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Rules & Verification</h3>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="rules"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Challenge Rules</FormLabel>
                      <FormControl>
                        <Textarea placeholder="List the rules and how to win" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="verificationMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Verification Method</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="How will results be verified?" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="photo">Photo Evidence</SelectItem>
                          <SelectItem value="video">Video Evidence</SelectItem>
                          <SelectItem value="app">App Data/Screenshot</SelectItem>
                          <SelectItem value="witness">Witness Verification</SelectItem>
                          <SelectItem value="honor">Honor System</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Timing */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Timing</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Cryptocurrency Details */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Cryptocurrency Details</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="cryptoType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cryptocurrency</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select cryptocurrency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="SOL">Solana (SOL)</SelectItem>
                            <SelectItem value="DOT">Polkadot (DOT)</SelectItem>
                            <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="entryFee"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Entry Fee</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.01" 
                              min="0.01" 
                              placeholder="e.g. 0.5" 
                              {...field} 
                            />
                          </FormControl>
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="text-gray-500">{cryptoType}</span>
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start">
                    <InfoIcon className="w-5 h-5 text-blue-500 mt-0.5 mr-2" />
                    <div className="text-sm text-blue-700">
                      <p>By creating this challenge, you agree to the following:</p>
                      <ul className="list-disc ml-5 mt-1">
                        <li>You must participate in your own challenge</li>
                        <li>Your entry fee will be locked in the smart contract</li>
                        <li>All fees will be distributed to the winner(s) automatically</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Smart Contract Preview */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Smart Contract Preview</h3>
              <div className="text-sm text-gray-600">
                <div className="font-mono p-3 bg-gray-100 rounded overflow-x-auto text-xs">
                  <pre>// Challenge Smart Contract
{`contract ChallengeContract {
  address public creator;
  string public name = "${challengeName || "{challengeName}"}";
  uint256 public entryFee = ${entryFee || "{entryFee}"} * 10^9;
  uint256 public startDate = ${startDate ? new Date(startDate).getTime() / 1000 : "{startTimestamp}"};
  uint256 public endDate = ${endDate ? new Date(endDate).getTime() / 1000 : "{endTimestamp}"};
  uint8 public maxParticipants = ${maxParticipants || "{maxParticipants}"};
  
  mapping(address => bool) public participants;
  address[] public participantList;
  
  function join() public payable {
    require(block.timestamp < startDate, "Challenge already started");
    require(participantList.length < maxParticipants, "Challenge full");
    require(msg.value == entryFee, "Incorrect entry fee");
    
    participants[msg.sender] = true;
    participantList.push(msg.sender);
  }
  
  function declareWinner(address winner) public {
    // Only oracle can call this after verification
    require(block.timestamp > endDate, "Challenge not ended");
    require(participants[winner], "Not a participant");
    
    // Transfer all funds to winner
    payable(winner).transfer(address(this).balance);
  }
}`}</pre>
                </div>
              </div>
            </div>
            
            <DialogFooter className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit">Create Challenge</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChallengeModal;
