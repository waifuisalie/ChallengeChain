/**
 * @vitest-environment jsdom
 */
import { render, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock modules before any imports that use them
vi.mock("../../lib/queryClient", () => ({
  apiRequest: vi.fn(() => Promise.resolve({})),
  queryClient: { invalidateQueries: vi.fn() }
}));

vi.mock("../../hooks/use-toast.ts", () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

// Import components and contexts after mocks
import CreateChallengeModal from "../CreateChallengeModal";
import { WalletContext } from "../../contexts/WalletContext";
import { ChallengeContext } from "../../contexts/ChallengeContext";
import * as queryClientModule from "../../lib/queryClient";

// Mock implementations
const mockRefreshChallenges = vi.fn();

// Type assertion for the mock
const mockedApiRequest = queryClientModule.apiRequest as unknown as ReturnType<typeof vi.fn>;

function Wrapper({ children }: { children: React.ReactNode }) {
  const wallet = {
    connected: true,
    address: "0x123",
    balance: 10,
    currency: "SOL",
  };
  const connect = vi.fn();
  const disconnect = vi.fn();

  return (
    <WalletContext.Provider value={{ wallet, connect, disconnect }}>
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

describe("CreateChallengeModal", () => {
  beforeEach(() => {
    console.log('Clearing mocks before test...');
    vi.clearAllMocks();
  });

  it("allows user to create a challenge", async () => {
    console.log('Starting create challenge test...');
    
    const onClose = vi.fn(() => console.log('Modal close callback triggered'));
    console.log('Rendering CreateChallengeModal...');
    
    const { getByLabelText, getByPlaceholderText, getByRole } = render(
      <CreateChallengeModal isOpen={true} onClose={onClose} />,
      { wrapper: Wrapper }
    );
    
    // Fill out required fields with logging
    console.log('Finding and filling form fields...');
    const nameInput = getByLabelText(/Challenge Name/i);
    const descriptionInput = getByLabelText(/Description/i);
    const rulesInput = getByLabelText(/Challenge Rules/i);
    
    console.log('Found form inputs:', {
      name: nameInput instanceof HTMLElement,
      description: descriptionInput instanceof HTMLElement,
      rules: rulesInput instanceof HTMLElement
    });

    fireEvent.change(nameInput, { target: { value: "Test Challenge" } });
    fireEvent.change(descriptionInput, { target: { value: "A test challenge description" } });
    fireEvent.change(rulesInput, { target: { value: "Some rules here" } });
    console.log('Basic fields filled');

    // Handle Select components with logging
    console.log('Handling category selection...');
    const categoryTrigger = getByRole('combobox', { name: /Category/i });
    fireEvent.click(categoryTrigger);
    const fitnessOption = getByRole('option', { name: /Fitness/i });
    fireEvent.click(fitnessOption);
    console.log('Category selected: Fitness');

    console.log('Handling verification method selection...');
    const verificationTrigger = getByRole('combobox', { name: /Verification Method/i });
    fireEvent.click(verificationTrigger);
    const photoOption = getByRole('option', { name: /Photo Evidence/i });
    fireEvent.click(photoOption);
    console.log('Verification method selected: Photo');

    // Fill out numeric and date inputs with logging
    console.log('Setting numeric and date fields...');
    const maxParticipantsInput = getByLabelText(/Maximum Participants/i);
    fireEvent.change(maxParticipantsInput, { target: { value: "10" } });
    console.log('Max participants set to: 10');
    
    const startDateInput = getByLabelText(/Start Date/i);
    const endDateInput = getByLabelText(/End Date/i);
    fireEvent.change(startDateInput, { target: { value: "2025-06-08" } });
    fireEvent.change(endDateInput, { target: { value: "2025-06-15" } });
    console.log('Dates set - Start: 2025-06-08, End: 2025-06-15');

    // Handle cryptocurrency selection with logging
    console.log('Handling cryptocurrency selection...');
    const cryptoTrigger = getByRole('combobox', { name: /Cryptocurrency/i });
    fireEvent.click(cryptoTrigger);
    const solOption = getByRole('option', { name: /Solana/i });
    fireEvent.click(solOption);
    console.log('Cryptocurrency selected: SOL');
    
    // Fill out remaining fields with logging
    console.log('Setting entry fee and image URL...');
    const entryFeeInput = getByLabelText(/Entry Fee/i);
    fireEvent.change(entryFeeInput, { target: { value: "1" } });
    
    const imageInput = getByPlaceholderText(/Enter image URL/i);
    fireEvent.change(imageInput, { target: { value: "http://example.com/image.png" } });
    
    // Submit form with logging
    console.log('Submitting form...');
    const createButton = getByRole("button", { name: /Create Challenge/i });
    fireEvent.click(createButton);

    // Wait for API call with logging
    console.log('Waiting for API call and verifying...');
    await waitFor(() => {
      console.log('Verifying API call...');
      expect(mockedApiRequest).toHaveBeenCalledWith(
        "POST",
        "/api/challenges",
        expect.objectContaining({
          name: "Test Challenge",
          description: "A test challenge description",
          rules: "Some rules here",
          category: "fitness",
          verificationMethod: "photo",
          maxParticipants: 10,
          cryptoType: "SOL",
          entryFee: 1,
          imageUrl: "http://example.com/image.png",
          startDate: expect.any(Date),
          endDate: expect.any(Date),
          status: expect.stringMatching(/^(active|upcoming)$/),
          creatorId: expect.any(Number)
        })
      );
      console.log('API call verified');
      
      console.log('Checking challenge refresh...');
      expect(mockRefreshChallenges).toHaveBeenCalled();
      
      console.log('Checking query invalidation...');
      expect(queryClientModule.queryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ["/api/challenges"]
      });
      console.log('All verifications complete');
    }, { timeout: 2000 });
  });
});