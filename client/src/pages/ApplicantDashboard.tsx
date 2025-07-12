import { useState } from "react";
import { useLocation } from "wouter";
import BottomNavigation from "@/components/BottomNavigation";
import JobListings from "@/pages/applicant/JobListings";
import Applications from "@/pages/applicant/Applications";
import Profile from "@/pages/applicant/Profile";
import Chat from "@/pages/applicant/Chat";

interface ApplicantDashboardProps {
  onLogout: () => void;
  userProfile: any;
}

export default function ApplicantDashboard({ onLogout, userProfile }: ApplicantDashboardProps) {
  const [location] = useLocation();
  const [activeTab, setActiveTab] = useState("menu");
  
  // Mock notification count - replace with actual API call
  const notificationCount = 3;

  // Determine which component to render based on current route or active tab
  const renderContent = () => {
    if (location.includes("/applications")) {
      return <Applications />;
    } else if (location.includes("/profile")) {
      return <Profile />;
    } else if (location.includes("/chat")) {
      return <Chat />;
    } else {
      // Default to job listings (menu)
      return <JobListings />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Main Content */}
      <main className="min-h-screen">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation notificationCount={notificationCount} />
    </div>
  );
}