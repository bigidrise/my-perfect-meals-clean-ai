import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  User,
  Shield,
  CreditCard,
  LogOut,
  ChevronRight,
  MessageCircle,
  Video,
  RotateCcw,
  Grid,
} from "lucide-react";
import { logout } from "@/lib/auth";
import { useAuth } from "@/contexts/AuthContext";

interface ProfileSheetProps {
  children: React.ReactNode;
}

export function ProfileSheet({ children }: ProfileSheetProps) {
  const [, setLocation] = useLocation();
  const { setUser } = useAuth();

  const { data: fullUserData } = useQuery<{ name?: string; email?: string }>({
    queryKey: ["/api/users/1"],
    retry: false,
    refetchOnWindowFocus: false,
  });

  const userName = fullUserData?.name || "User";
  const userEmail = fullUserData?.email || "user@example.com";
  
  // Get user initials for avatar
  const userInitials = userName
    .split(" ")
    .map(word => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setLocation("/");
  };

  const menuItems = [
    {
      title: "Privacy & Security",
      description: "Manage your privacy settings",
      icon: Shield,
      route: "/privacy",
      testId: "menu-privacy",
    },
    {
      title: "Subscription",
      description: "Manage your plan & billing",
      icon: CreditCard,
      route: "/pricing",
      testId: "menu-subscription",
    },
    {
      title: "Tutorial Hub",
      description: "Nutrition guides & how-to videos",
      icon: Video,
      route: "/learn",
      testId: "menu-tutorials",
    },
    {
      title: "About My Perfect Meals",
      description: "Message from our founders",
      icon: MessageCircle,
      route: "/founders",
      testId: "menu-about",
    },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="bg-gradient-to-br from-black/95 via-orange-900/40 to-black/95 border-l border-white/10 backdrop-blur-xl">
        <SheetHeader>
          <SheetTitle className="text-white">My Hub</SheetTitle>
          <SheetDescription className="text-white/70">
            Your personal space
          </SheetDescription>
        </SheetHeader>

        {/* User Info Section */}
        <div className="mt-6 p-4 bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-orange-600/80 border-2 border-orange-400/30 flex items-center justify-center text-white font-semibold text-lg shadow-lg">
              {userInitials || "?"}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold truncate">{userName}</h3>
              <p className="text-white/70 text-sm truncate">{userEmail}</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="mt-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.route}
                onClick={() => setLocation(item.route)}
                className="w-full flex items-center gap-2 p-2 bg-black/20 hover:bg-black/40 border border-white/10 rounded-lg transition-all group"
                data-testid={item.testId}
              >
                <Icon className="h-4 w-4 text-orange-400" />
                <div className="flex-1 text-left">
                  <p className="text-white font-medium text-xs">{item.title}</p>
                  <p className="text-white/60 text-[10px]">{item.description}</p>
                </div>
                <ChevronRight className="h-3 w-3 text-white/40 group-hover:text-white/70 transition-colors" />
              </button>
            );
          })}
        </div>

        {/* Reset Tutorial Button */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <Button
            onClick={() => {
              localStorage.removeItem("coachMode");
              setLocation("/");
            }}
            variant="outline"
            className="w-full bg-purple-700/90 hover:bg-purple-800 border-purple-600 text-white hover:text-white mb-3"
            data-testid="button-reset-tutorial"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset Tutorial & Coach Mode
          </Button>

          {/* Logout Button */}
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full bg-orange-700/90 hover:bg-orange-800 border-orange-600 text-white hover:text-white"
            data-testid="button-logout"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
