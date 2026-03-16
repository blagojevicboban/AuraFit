import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Activity, LayoutDashboard, Users, LogOut } from "lucide-react";
import { cn } from "../lib/utils";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userData, signOut, loading } = useAuth();
  
  const isCoach = location.pathname.includes("/coach");
  const isClient = location.pathname.includes("/client");

  useEffect(() => {
    if (!loading && !userData && (isCoach || isClient)) {
      navigate('/');
    }
  }, [userData, loading, isCoach, isClient, navigate]);

  if (!isCoach && !isClient) {
    return <Outlet />;
  }

  if (loading || !userData) {
    return <div className="min-h-screen bg-zinc-50 flex items-center justify-center">Učitavanje...</div>;
  }

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-zinc-200 flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
            {userData.displayName ? userData.displayName.charAt(0).toUpperCase() : 'A'}
          </div>
          <span className="text-xl font-bold tracking-tight text-zinc-900">Aura Fit</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {userData.role === 'client' && (
            <>
              <Link
                to="/client"
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  location.pathname === "/client" ? "bg-indigo-50 text-indigo-700" : "text-zinc-600 hover:bg-zinc-100"
                )}
              >
                <LayoutDashboard className="w-5 h-5" />
                Moj Dashboard
              </Link>
              <Link
                to="/client/workouts"
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  location.pathname === "/client/workouts" ? "bg-indigo-50 text-indigo-700" : "text-zinc-600 hover:bg-zinc-100"
                )}
              >
                <Activity className="w-5 h-5" />
                Moji Treninzi
              </Link>
            </>
          )}

          {userData.role === 'coach' && (
            <>
              <Link
                to="/coach"
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  location.pathname === "/coach" ? "bg-indigo-50 text-indigo-700" : "text-zinc-600 hover:bg-zinc-100"
                )}
              >
                <LayoutDashboard className="w-5 h-5" />
                Pregled
              </Link>
              <Link
                to="/coach/clients"
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  location.pathname === "/coach/clients" ? "bg-indigo-50 text-indigo-700" : "text-zinc-600 hover:bg-zinc-100"
                )}
              >
                <Users className="w-5 h-5" />
                Moji Klijenti
              </Link>
            </>
          )}
        </nav>

        <div className="p-4 border-t border-zinc-200">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-zinc-600 hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            Odjavi se
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
