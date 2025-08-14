import React, { useState, useEffect } from 'react';
import { AuthModal } from '../components/AuthModal';
import { useAuth } from '../contexts/AuthContext';
import { 
    ArrowPathIcon, CloudArrowUpIcon, GlobeAltIcon, ShieldCheckIcon, 
    BoltIcon, CurrencyDollarIcon 
} from '@heroicons/react/24/outline';

// Reusable component for feature highlights
const Feature = ({ icon, title, children }) => (
    <div className="flex">
        <div className="flex-shrink-0">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                {icon}
            </div>
        </div>
        <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <p className="mt-2 text-base text-gray-500">{children}</p>
        </div>
    </div>
);

// Main Landing Page Component
const LandingPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const hasSeenModal = sessionStorage.getItem('hasSeenAuthModal');
    if (!user && !hasSeenModal) {
      const timer = setTimeout(() => {
        setIsModalOpen(true);
        sessionStorage.setItem('hasSeenAuthModal', 'true');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  return (
    <div className="bg-white">
      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      {/* Header */}
      <header className="absolute inset-x-0 top-0 z-10">
        <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <span className="text-2xl font-bold text-blue-600">ExpenSight</span>
          </div>
          <div className="flex lg:flex-1 lg:justify-end">
            <button onClick={() => setIsModalOpen(true)} className="rounded-md bg-blue-600 px-3.5 py-2.5 text-md font-semibold text-white shadow-sm hover:bg-blue-500">
              Log in
            </button>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <div className="relative isolate overflow-hidden bg-gradient-to-b from-blue-100/20 pt-14">
            <div className="absolute inset-y-0 right-1/2 -z-10 -mr-96 w-[200%] origin-top-right skew-x-[-30deg] bg-white shadow-xl shadow-blue-600/10 ring-1 ring-blue-50 sm:mr-20 lg:mr-0 xl:mr-[-20px] xl:origin-center" />
            <div className="mx-auto max-w-7xl px-6 py-32 sm:py-40 lg:px-8">
                <div className="mx-auto max-w-2xl lg:mx-0 lg:grid lg:max-w-none lg:grid-cols-2 lg:gap-x-16 lg:gap-y-6 xl:grid-cols-1 xl:grid-rows-1 xl:gap-x-8">
                    <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:col-span-2 xl:col-auto">
                        Expense Management, Reimagined.
                    </h1>
                    <div className="mt-6 max-w-xl lg:mt-0 xl:col-end-1 xl:row-start-1">
                        <p className="text-lg leading-8 text-gray-600">
                            Effortlessly track, upload, and reconcile global expenses. Our AI-powered platform converts currencies with historical accuracy, saving you time and eliminating costly errors. Stop chasing receipts and start making smarter financial decisions.
                        </p>
                        <div className="mt-10 flex items-center gap-x-6">
                            <button onClick={() => setIsModalOpen(true)} className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500">Get started for free</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        {/* Features Section */}
        <div className="py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:text-center">
                    <h2 className="text-base font-semibold leading-7 text-blue-600">Everything You Need</h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        A better workflow for global teams
                    </p>
                    <p className="mt-6 text-lg leading-8 text-gray-600">
                        From automated data entry to precise currency conversion, ExpenSight provides the tools to streamline your entire expense workflow.
                    </p>
                </div>
                <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
                    <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                        <Feature icon={<CloudArrowUpIcon className="h-6 w-6"/>} title="AI-Powered OCR">
                            Simply upload a receipt image or PDF. Our AI extracts key details like merchant, date, and amount in seconds, eliminating manual data entry.
                        </Feature>
                        <Feature icon={<ArrowPathIcon className="h-6 w-6"/>} title="Historical Reconciliation">
                            Convert any expense to your base currency using the exact exchange rate from the transaction date, not today's rate, for perfect accounting.
                        </Feature>
                        <Feature icon={<GlobeAltIcon className="h-6 w-6"/>} title="Multi-Currency Support">
                            Handle expenses in over 30 currencies seamlessly. Perfect for international business travel and teams working across borders.
                        </Feature>
                         <Feature icon={<BoltIcon className="h-6 w-6"/>} title="Instant Processing">
                            Your uploaded receipts are processed in real-time, appearing on your dashboard instantly, ready for reconciliation.
                        </Feature>
                    </dl>
                </div>
            </div>
        </div>

        {/* Testimonial Section */}
        <div className="bg-gray-50 py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:text-center">
                    <p className="text-xl font-semibold leading-8 tracking-tight text-gray-900">
                        “This tool has saved our finance team countless hours. The accuracy of the historical currency conversion is a feature we didn't know we needed but now can't live without.”
                    </p>
                    <figcaption className="mt-10">
                        <img className="mx-auto h-12 w-12 rounded-full" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt=""/>
                        <div className="mt-4 flex items-center justify-center space-x-3 text-base">
                            <div className="font-semibold text-gray-900">Alex Johnson</div>
                            <svg viewBox="0 0 2 2" width="3" height="3" aria-hidden="true" className="fill-gray-900"><circle cx="1" cy="1" r="1" /></svg>
                            <div className="text-gray-600">Finance Director, Innovate Inc.</div>
                        </div>
                    </figcaption>
                </div>
            </div>
        </div>

        {/* Final CTA Section */}
        <div className="py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Ready to Take Control of Your Expenses?</h2>
                <p className="mt-4 text-lg leading-8 text-gray-600">
                    Join today and experience a smarter way to manage your finances.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                    <button onClick={() => setIsModalOpen(true)} className="rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500">
                        Sign up for free
                    </button>
                </div>
            </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
            <div className="text-center">
                <p className="text-lg font-semibold">Made by Himanshu Yadav</p>
                <div className="mt-4 flex justify-center space-x-6">
                    <a href="https://github.com/Himanshu-Yadav-0" className="text-gray-400 hover:text-white">
                        <span className="sr-only">GitHub</span>
                        {/* Replace with a real SVG icon if you prefer */}
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.168 6.839 9.492.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.031-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.378.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.338 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                        </svg>
                    </a>
                    <a href="https://linkedin.com/in/hiimanshuyadav" className="text-gray-400 hover:text-white">
                        <span className="sr-only">LinkedIn</span>
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd"/>
                        </svg>
                    </a>
                </div>
                <p className="mt-8 text-xs leading-5 text-gray-400">&copy; 2025 ExpenSight. All rights reserved.</p>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;