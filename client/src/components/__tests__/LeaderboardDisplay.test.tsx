/**
 * @vitest-environment jsdom
 */
import { render, fireEvent, screen, cleanup } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import Leaderboard from "../../pages/Leaderboard";
import { ChallengeContext } from "../../contexts/ChallengeContext";

// Mock the challenges data
const mockChallenges = [
  {
    id: 1,
    name: "Fitness Challenge",
    creatorId: 1,
    description: "Test fitness challenge",
    rules: "Do 100 pushups daily",
    category: "fitness",
    verificationMethod: "photo",
    startDate: new Date("2025-06-01"),
    endDate: new Date("2025-06-30"),
    maxParticipants: 10,
    status: "active",
    cryptoType: "SOL",
    entryFee: 1.0,
    totalPool: 10.0,
    imageUrl: "http://example.com/image.jpg",
    creatorName: "Test Creator",
    participants: [
      {
        id: 1,
        userId: 1,
        walletAddress: "0x111",
        score: 100,
        isWinner: false,
        joinedAt: new Date(),
        challengeId: 1
      },
      {
        id: 2,
        userId: 2,
        walletAddress: "0x222",
        score: 150,
        isWinner: false,
        joinedAt: new Date(),
        challengeId: 1
      },
      {
        id: 3,
        userId: 3,
        walletAddress: "0x333",
        score: 75,
        isWinner: false,
        joinedAt: new Date(),
        challengeId: 1
      }
    ]
  }
];

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <ChallengeContext.Provider
      value={{
        challenges: mockChallenges,
        isLoading: false,
        error: null,
        refreshChallenges: vi.fn()
      }}
    >
      {children}
    </ChallengeContext.Provider>
  );
}

describe("Leaderboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  afterEach(() => {
    cleanup();
  });

  it("displays participants in descending order by score", () => {
    const { container } = render(<Leaderboard />, { wrapper: Wrapper });
    const scoreCells = screen.getAllByTestId('score-cell');

    // Extract scores and verify they're in descending order
    const scores = scoreCells.map(cell => Number(cell.textContent));
    const sortedScores = [...scores].sort((a, b) => b - a);
    expect(scores).toEqual(sortedScores);

    // Verify the highest scorer is first
    expect(screen.getByText("150")).toBeTruthy();
    expect(screen.getByText("User 2")).toBeTruthy();
    
    // Verify challenge selector functionality
    const selector = container.querySelector('[data-testid="challenge-selector"]');
    expect(selector).toBeTruthy();
  });it("shows trophy icons for top 3 participants", () => {
    render(<Leaderboard />, { wrapper: Wrapper });

    // Check for trophy icons
    const trophyIcons = screen.getAllByTestId('trophy-icon');
      // Get unique trophy icons based on their parent text
    const uniqueTrophyIcons = Array.from(new Map(
      trophyIcons.map(icon => [icon.parentElement?.textContent?.trim(), icon])
    ).values());
    
    expect(uniqueTrophyIcons).toHaveLength(3);

    // Verify trophy colors by checking if the classes are in the classList
    expect(uniqueTrophyIcons[0].classList.contains('text-yellow-500')).toBe(true); // Gold
    expect(uniqueTrophyIcons[1].classList.contains('text-gray-400')).toBe(true);   // Silver
    expect(uniqueTrophyIcons[2].classList.contains('text-amber-700')).toBe(true);  // Bronze
  });  it("filters participants when selecting a specific challenge", async () => {
    const { container } = render(<Leaderboard />, { wrapper: Wrapper });

    // Click the challenge selector
    const selector = container.querySelector('[data-testid="challenge-selector"]');
    expect(selector).toBeTruthy();
    fireEvent.click(selector!);

    // Select the specific challenge
    const option = screen.getByRole('option', { name: /Fitness Challenge/i });
    fireEvent.click(option);

    // Verify only participants from selected challenge are shown
    expect(screen.getAllByRole('row')).toHaveLength(4); // Header + 3 participants
  });
  it("shows correct potential rewards", () => {
    render(<Leaderboard />, { wrapper: Wrapper });

    // Get all reward elements
    const rewardElements = screen.getAllByTestId('winner-reward');
    
    // Verify there are 3 reward elements (for top 3 places)
    expect(rewardElements).toHaveLength(3);
      // First place should show total pool
    expect(rewardElements[0].textContent).toBe("10.0 SOL");
    
    // Second and third place should show 0 SOL
    expect(rewardElements[1].textContent).toBe("0 SOL");
    expect(rewardElements[2].textContent).toBe("0 SOL");
  });
});