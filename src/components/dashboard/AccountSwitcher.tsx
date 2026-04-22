import { Building2, User, ChevronDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAccountProfiles, AccountProfile } from '@/hooks/useAccountProfiles';
import { useToast } from '@/hooks/use-toast';

const AccountSwitcher = () => {
  const { accounts, activeAccount, switchAccount, loading } = useAccountProfiles();
  const { toast } = useToast();

  const handleSwitchAccount = async (account: AccountProfile) => {
    if (account.is_active) return;
    
    const result = await switchAccount(account.id);
    if (result.success) {
      toast({
        title: 'Account Switched',
        description: `Now using ${account.profile_name}`,
      });
    } else {
      toast({
        title: 'Error',
        description: 'Failed to switch account',
        variant: 'destructive',
      });
    }
  };

  // Only show if user has accounts to switch between
  if (loading || !activeAccount || accounts.length < 2) {
    return null;
  }

  const getAccountIcon = (type: string) => {
    return type === 'work' ? (
      <Building2 className="h-4 w-4" />
    ) : (
      <User className="h-4 w-4" />
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="flex items-center gap-2 px-3 py-2 h-auto hover:bg-muted rounded-xl"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand/10 text-brand">
            {getAccountIcon(activeAccount.account_type)}
          </div>
          <div className="flex flex-col items-start text-left">
            <span className="text-sm font-medium text-foreground">
              {activeAccount.profile_name}
            </span>
            {activeAccount.organization_name && (
              <span className="text-xs text-muted-foreground">
                {activeAccount.organization_name}
              </span>
            )}
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64 bg-card border border-border shadow-soft">
        <DropdownMenuLabel className="text-muted-foreground text-xs uppercase tracking-wider">
          Switch Account
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {accounts.map((account) => (
          <DropdownMenuItem
            key={account.id}
            className="flex items-center gap-3 cursor-pointer py-3 px-3"
            onClick={() => handleSwitchAccount(account)}
          >
            <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${
              account.account_type === 'work' 
                ? 'bg-brand-accent/10 text-brand-accent' 
                : 'bg-brand/10 text-brand'
            }`}>
              {getAccountIcon(account.account_type)}
            </div>
            <div className="flex flex-col flex-1">
              <span className="text-sm font-medium">{account.profile_name}</span>
              {account.organization_name && (
                <span className="text-xs text-muted-foreground">
                  {account.organization_name}
                </span>
              )}
            </div>
            {account.is_active && (
              <Check className="h-4 w-4 text-brand" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AccountSwitcher;
