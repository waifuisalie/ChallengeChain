import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { WalletProvider } from "./contexts/WalletContext";
import { ChallengeProvider } from "./contexts/ChallengeContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <WalletProvider>
      <ChallengeProvider>
        <App />
      </ChallengeProvider>
    </WalletProvider>
  </QueryClientProvider>
);
