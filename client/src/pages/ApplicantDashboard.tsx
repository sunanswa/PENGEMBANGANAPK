import { useState } from "react";
import { useLocation } from "wouter";
import { Switch, Route } from "wouter";
import BottomNavigation from "@/components/BottomNavigation";
import SimpleJobListings from "@/pages/applicant/SimpleJobListings";
import SimpleApplications from "@/pages/applicant/SimpleApplications";
import SimpleProfile from "@/pages/applicant/SimpleProfile";
import SimpleChat from "@/pages/applicant/SimpleChat";

interface ApplicantDashboardProps {
  onLogout: () => void;
  userProfile: any;
}

export default function ApplicantDashboard({ onLogout, userProfile }: ApplicantDashboardProps) {
  // Mock notification count - replace with actual API call
  const notificationCount = 3;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Main Content */}
      <main className="min-h-screen pb-20">
        <Switch>
          <Route path="/applicant/applications">
            <SimpleApplications />
          </Route>
          <Route path="/applicant/profile">
            <SimpleProfile />
          </Route>
          <Route path="/applicant/chat">
            <SimpleChat />
          </Route>
          <Route path="/applicant" nest>
            <SimpleJobListings />
          </Route>
          <Route path="/">
            <SimpleJobListings />
          </Route>
        </Switch>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation notificationCount={notificationCount} />
    </div>
  );
}