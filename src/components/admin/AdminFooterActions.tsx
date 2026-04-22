import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AdminFooterActionsProps {
  onNavigate?: () => void;
}

const AdminFooterActions = ({ onNavigate }: AdminFooterActionsProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
    navigate('/');
  };

  const handleBackToSite = () => {
    onNavigate?.();
  };

  return (
    <div className="p-3 border-t border-[#f0f0f0] space-y-0.5">
      <Link to="/" onClick={handleBackToSite}>
        <Button variant="ghost" className="w-full justify-start gap-3 h-11 rounded-xl text-[#6e6e73] hover:bg-white hover:text-[#1d1d1f] text-[15px] font-normal">
          <Home className="h-[18px] w-[18px]" />
          Back to Site
        </Button>
      </Link>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogTrigger asChild>
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 h-11 rounded-xl text-[#ff3b30] hover:bg-[#ff3b30]/5 text-[15px] font-normal"
          >
            <LogOut className="h-[18px] w-[18px]" />
            Sign Out
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign out of admin?</AlertDialogTitle>
            <AlertDialogDescription>
              You will be signed out of your admin session and redirected to the home page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleLogout}
              className="bg-[#ff3b30] hover:bg-[#ff3b30]/90"
            >
              Sign Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminFooterActions;
