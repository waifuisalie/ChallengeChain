import { Link } from "wouter";

interface TabNavigationProps {
  currentPath: string;
}

const TabNavigation = ({ currentPath }: TabNavigationProps) => {
  const tabs = [
    { name: "Explore Challenges", path: "/" },
    { name: "My Challenges", path: "/my-challenges" },
    { name: "Leaderboard", path: "/leaderboard" },
    { name: "History", path: "/history" },
  ];

  return (
    <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <Link
              key={tab.path}
              href={tab.path}
              className={`px-3 py-4 text-sm font-medium border-b-2 ${
                currentPath === tab.path
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.name}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default TabNavigation;
