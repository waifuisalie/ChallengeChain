const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <svg className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" opacity="0.2"/>
              <path d="M17.657 9.343l-4-4a1 1 0 00-1.414 0l-4 4a1 1 0 001.414 1.414L12 8.414l2.343 2.343a1 1 0 001.414-1.414zM12 16l-3.657-3.657a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l4-4a1 1 0 00-1.414-1.414L12 16z"/>
            </svg>
            <span className="ml-2 text-lg font-bold text-gray-900">ChainChallenge</span>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-500 hover:text-gray-700">About</a>
            <a href="#" className="text-gray-500 hover:text-gray-700">Terms</a>
            <a href="#" className="text-gray-500 hover:text-gray-700">Privacy</a>
            <a href="#" className="text-gray-500 hover:text-gray-700">Help</a>
          </div>
        </div>
        <div className="mt-4 text-center text-sm text-gray-500">
          © 2023 ChainChallenge. All rights reserved. Not affiliated with any blockchain or cryptocurrency.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
