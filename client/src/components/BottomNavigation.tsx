import { Home, FileText, User, MessageCircle, Bell } from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

interface BottomNavigationProps {
  notificationCount?: number;
}

export default function BottomNavigation({ notificationCount = 0 }: BottomNavigationProps) {
  const [location] = useLocation();

  const navItems = [
    {
      href: "/",
      icon: Home,
      label: "Menu",
      isActive: location === "/" || (!location.includes("/applications") && !location.includes("/profile") && !location.includes("/chat"))
    },
    {
      href: "/applicant/applications",
      icon: FileText,
      label: "Lamaran",
      isActive: location.includes("/applications")
    },
    {
      href: "/applicant/profile",
      icon: User,
      label: "Profile",
      isActive: location.includes("/profile")
    },
    {
      href: "/applicant/chat",
      icon: MessageCircle,
      label: "Chat",
      isActive: location.includes("/chat"),
      hasNotification: notificationCount > 0
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-40">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex flex-col items-center justify-center p-2 rounded-lg transition-colors relative",
                  item.isActive
                    ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                )}
              >
                <div className="relative">
                  <Icon className="h-5 w-5" />
                  {item.hasNotification && (
                    <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-[10px] text-white font-medium">
                        {notificationCount > 9 ? "9+" : notificationCount}
                      </span>
                    </div>
                  )}
                </div>
                <span className="text-xs mt-1 font-medium">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}