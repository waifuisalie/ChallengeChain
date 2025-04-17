import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import MyChallenges from "@/pages/MyChallenges";
import Leaderboard from "@/pages/Leaderboard";
import History from "@/pages/History";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TabNavigation from "@/components/TabNavigation";
import { useLocation } from "wouter";
import { WalletProvider } from "@/contexts/WalletContext";
import { ChallengeProvider } from "@/contexts/ChallengeContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

function InnerRouter() {
  const [location] = useLocation();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <TabNavigation currentPath={location} />
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/my-challenges" component={MyChallenges} />
          <Route path="/leaderboard" component={Leaderboard} />
          <Route path="/history" component={History} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <ChallengeProvider>
          <InnerRouter />
          <Toaster />
        </ChallengeProvider>
      </WalletProvider>
    </QueryClientProvider>
  );
}

export default App;
