import { useState } from "react";
import { useLocation } from "wouter";
import BottomNavigation from "@/components/BottomNavigation";
import Simple from "@/pages/applicant/Simple";

interface ApplicantDashboardProps {
  onLogout: () => void;
  userProfile: any;
}

export default function ApplicantDashboard({ onLogout, userProfile }: ApplicantDashboardProps) {
  // Mock notification count - replace with actual API call
  const notificationCount = 3;

  console.log("ApplicantDashboard rendered"); // Debug log

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Main Content */}
      <main className="min-h-screen">
        <Simple />
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation notificationCount={notificationCount} />
    </div>
  );
}