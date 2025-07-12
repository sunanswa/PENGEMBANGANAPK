import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import BottomNavigation from "@/components/BottomNavigation";
import ErrorBoundary from "@/components/ErrorBoundary";
import SimpleJobListings from "@/pages/applicant/SimpleJobListings";
import SimpleApplications from "@/pages/applicant/SimpleApplications";
import SimpleProfile from "@/pages/applicant/SimpleProfile";
import SimpleChat from "@/pages/applicant/SimpleChat";
import EnhancedDashboard from "@/pages/applicant/EnhancedDashboard";
import EnhancedApplications from "@/pages/applicant/EnhancedApplications";
import EnhancedChat from "@/pages/applicant/EnhancedChat";

interface ApplicantDashboardProps {
  onLogout: () => void;
  userProfile: any;
}

export default function ApplicantDashboard({ onLogout, userProfile }: ApplicantDashboardProps) {
  const [location] = useLocation();
  const [currentPage, setCurrentPage] = useState("menu");
  const notificationCount = 3;

  // Determine current page based on URL
  useEffect(() => {
    if (location.includes("/applications")) {
      setCurrentPage("applications");
    } else if (location.includes("/profile")) {
      setCurrentPage("profile");
    } else if (location.includes("/chat")) {
      setCurrentPage("chat");
    } else {
      setCurrentPage("menu");
    }
  }, [location]);

  // Render content based on current page
  const renderContent = () => {
    console.log("Rendering page:", currentPage); // Debug log
    
    switch (currentPage) {
      case "applications":
        return <EnhancedApplications />;
      case "profile":
        return <SimpleProfile />;
      case "chat":
        return <EnhancedChat />;
      default:
        return <EnhancedDashboard />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Main Content */}
        <main className="min-h-screen pb-20">
          {renderContent()}
        </main>

        {/* Bottom Navigation */}
        <BottomNavigation notificationCount={notificationCount} />
      </div>
    </ErrorBoundary>
  );
}