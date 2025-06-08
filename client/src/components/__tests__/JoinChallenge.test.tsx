/**
 * @vitest-environment jsdom
 */
import { render, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from 'vitest';
import ChallengeCard from "../ChallengeCard";
import { WalletContext } from "../../contexts/WalletContext";
import { ChallengeContext } from "../../contexts/ChallengeContext";
import * as queryClientModule from "../../lib/queryClient";
import { ChallengeWithParticipants } from "@shared/schema";

// Mock modules before any imports that use them
vi.mock("../../lib/queryClient", () => {
  console.log('Setting up API request mock');
  return {
    apiRequest: vi.fn(() => {
      console.log('Mock API request called');
      return Promise.resolve({});
    }),
    queryClient: { 
      invalidateQueries: vi.fn(() => {
        console.log('Mock invalidateQueries called');
      })
    }
  };
});

// Type assertion for the mock
const mockedApiRequest = queryClientModule.apiRequest as unknown as ReturnType<typeof vi.fn>;

// Mock implementations
const mockRefreshChallenges = vi.fn(() => {
  console.log('Mock refreshChallenges called');
});

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <WalletContext.Provider 
      value={{ 
        wallet: {
          connected: true,
          address: "0x123",
          balance: 10,
          currency: "SOL",
        },
        connect: vi.fn(),
        disconnect: vi.fn()
      }}
    >
      <ChallengeContext.Provider
        value={{
          challenges: [],
          isLoading: false,
          error: null,
          refreshChallenges: mockRefreshChallenges,
        }}
      >
        {children}
      </ChallengeContext.Provider>
    </WalletContext.Provider>
  );
}

describe("ChallengeCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });  it("allows user to join a challenge", async () => {    
    console.log('Starting challenge join test...');
    
    const mockChallenge: ChallengeWithParticipants = {
      id: 123,
      name: "Test Challenge",
      description: "Test Description",
      rules: "Test Rules",
      category: "fitness",
      verificationMethod: "photo",
      maxParticipants: 10,
      startDate: new Date("2025-06-08"),
      endDate: new Date("2025-06-15"),
      status: "active",
      cryptoType: "SOL",
      entryFee: 1.0,
      totalPool: 5.0,
      creatorId: 2,
      imageUrl: "http://example.com/image.png",
      creatorName: "Test Creator",      
      participants: [{
        id: 1,
        walletAddress: "0x456", // Different from the test wallet address
        challengeId: 123,
        userId: 1,
        joinedAt: new Date(),
        isWinner: false,
        score: null
      }]
    };
    
    console.log('Mock challenge data:', {
      name: mockChallenge.name,
      participants: mockChallenge.participants.length,
      maxParticipants: mockChallenge.maxParticipants,
      entryFee: mockChallenge.entryFee,
      totalPool: mockChallenge.totalPool
    });

    const onJoinClick = vi.fn().mockImplementation((challenge) => {
      console.log('Join button clicked for challenge:', challenge.name);
    });

    console.log('Rendering ChallengeCard component...');
    const { getByRole, container } = render(
      <ChallengeCard 
        challenge={mockChallenge} 
        onJoinClick={onJoinClick} 
      />,
      { wrapper: Wrapper }
    );

    const joinButton = getByRole('button', { name: /join/i });
    console.log('Found join button:', joinButton.textContent);
    
    console.log('Clicking join button...');
    fireEvent.click(joinButton);
    
    // Verify that onJoinClick was called with the challenge
    expect(onJoinClick).toHaveBeenCalledWith(mockChallenge);
    console.log('onJoinClick was called successfully with challenge data');
  });
});