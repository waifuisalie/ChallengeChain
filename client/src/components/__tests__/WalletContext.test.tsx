/**
 * @vitest-environment jsdom
 */
import { render, act } from "@testing-library/react";
import { WalletProvider, useWallet } from "../../contexts/WalletContext";
import React from "react";
import { describe, it, expect} from 'vitest';


const TestComponent = () => {
  const { wallet, connect } = useWallet();

  return (
    <div>
      <div data-testid="connected">{wallet.connected ? "yes" : "no"}</div>
      <div data-testid="address">{wallet.address}</div>
      <button onClick={connect}>Connect</button>
    </div>
  );
};

describe("WalletContext", () => {
  it("connects the wallet", async () => {
    const { getByText, getByTestId } = render(
      <WalletProvider>
        <TestComponent />
      </WalletProvider>
    );

    expect(getByTestId("connected").textContent).toBe("no");

    await act(async () => {
      getByText("Connect").click();
      // Wait for the simulated async connect
      await new Promise((r) => setTimeout(r, 600));
    });

    expect(getByTestId("connected").textContent).toBe("yes");
    expect(getByTestId("address").textContent).not.toBe("");
  });
});

