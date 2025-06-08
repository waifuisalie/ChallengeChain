/**
 * @vitest-environment jsdom
 */
import { render, act } from "@testing-library/react";
import { WalletProvider, useWallet } from "../../contexts/WalletContext";
import React from "react";
import { describe, it, expect} from 'vitest';


const TestComponent = () => {
  const { wallet, connect } = useWallet();

  React.useEffect(() => {
    console.log('Wallet state changed:', {
      connected: wallet.connected,
      address: wallet.address
    });
  }, [wallet.connected, wallet.address]);

  const handleConnect = () => {
    console.log('Connect button clicked');
    connect();
  };

  return (
    <div>
      <div data-testid="connected">{wallet.connected ? "yes" : "no"}</div>
      <div data-testid="address">{wallet.address}</div>
      <button onClick={handleConnect}>Connect</button>
    </div>
  );
};

describe("WalletContext", () => {  it("connects the wallet", async () => {
    console.log('Starting wallet connection test...');
    const { getByText, getByTestId } = render(
      <WalletProvider>
        <TestComponent />
      </WalletProvider>
    );

    const initialConnectedState = getByTestId("connected").textContent;
    console.log('Initial wallet connection state:', initialConnectedState);
    expect(initialConnectedState).toBe("no");

    console.log('Attempting to connect wallet...');
    await act(async () => {
      const connectButton = getByText("Connect");
      console.log('Found connect button:', connectButton.textContent);
      connectButton.click();
      console.log('Clicked connect button, waiting for connection...');
      // Wait for the simulated async connect
      await new Promise((r) => setTimeout(r, 600));
    });

    const finalConnectedState = getByTestId("connected").textContent;
    const walletAddress = getByTestId("address").textContent;
    console.log('Final connection state:', finalConnectedState);
    console.log('Wallet address:', walletAddress);
    expect(finalConnectedState).toBe("yes");
    expect(walletAddress).not.toBe("");
  });
});

