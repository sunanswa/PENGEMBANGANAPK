import { Switch, Route, useLocation } from "wouter";
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
  
  // Mock notification count - replace with actual API call
  const notificationCount = 3;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Main Content */}
      <main className="min-h-screen">
        <Switch>
          <Route path="/applicant" component={JobListings} />
          <Route path="/applicant/applications" component={Applications} />
          <Route path="/applicant/profile" component={Profile} />
          <Route path="/applicant/chat" component={Chat} />
          
          {/* Default route - redirect to job listings */}
          <Route>
            <JobListings />
          </Route>
        </Switch>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation notificationCount={notificationCount} />
    </div>
  );
}