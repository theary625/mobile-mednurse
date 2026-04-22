import { useState } from 'react';
import { Building2, User, Plus, Check, Trash2, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
} from '@/components/ui/alert-dialog';
import { useAccountProfiles, AccountProfile } from '@/hooks/useAccountProfiles';
import { useToast } from '@/hooks/use-toast';

interface ConnectedAccountsSectionProps {
  isDemo?: boolean;
}

const ConnectedAccountsSection = ({ isDemo = false }: ConnectedAccountsSectionProps) => {
  const { accounts, activeAccount, switchAccount, createWorkAccount, deleteWorkAccount, hasWorkAccount, loading } = useAccountProfiles();
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newAccountName, setNewAccountName] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [deletingAccountId, setDeletingAccountId] = useState<string | null>(null);

  const handleSwitchAccount = async (account: AccountProfile) => {
    if (account.is_active || isDemo) {
      if (isDemo) {
        toast({ title: 'Demo mode', description: 'Sign in to switch accounts.' });
      }
      return;
    }
    
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

  const handleCreateWorkAccount = async () => {
    if (!newAccountName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter an account name',
        variant: 'destructive',
      });
      return;
    }

    if (isDemo) {
      setIsCreateDialogOpen(false);
      toast({ title: 'Demo mode', description: 'Sign in to create a work account.' });
      return;
    }

    setIsCreating(true);
    const result = await createWorkAccount(newAccountName.trim(), organizationName.trim() || undefined);
    setIsCreating(false);

    if (result.success) {
      toast({
        title: 'Work Account Created',
        description: `${newAccountName} has been created successfully`,
      });
      setIsCreateDialogOpen(false);
      setNewAccountName('');
      setOrganizationName('');
    } else {
      toast({
        title: 'Error',
        description: 'Failed to create work account',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteAccount = async (accountId: string, accountName: string) => {
    if (isDemo) {
      toast({ title: 'Demo mode', description: 'Sign in to delete accounts.' });
      return;
    }

    setDeletingAccountId(accountId);
    const result = await deleteWorkAccount(accountId);
    setDeletingAccountId(null);

    if (result.success) {
      toast({
        title: 'Account Deleted',
        description: `${accountName} has been removed`,
      });
    } else {
      toast({
        title: 'Error',
        description: 'Failed to delete account',
        variant: 'destructive',
      });
    }
  };

  const getAccountIcon = (type: string) => {
    return type === 'work' ? (
      <Building2 className="h-4 w-4" />
    ) : (
      <User className="h-4 w-4" />
    );
  };

  if (loading) {
    return (
      <Card className="border-border/50 shadow-soft rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-brand-accent/10 to-transparent">
          <div className="flex items-center gap-3">
            <Building2 className="w-5 h-5 text-brand-accent" />
            <div>
              <CardTitle>Connected Accounts</CardTitle>
              <CardDescription>Loading accounts...</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-border/50 shadow-soft rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-brand-accent/10 to-transparent">
          <div className="flex items-center gap-3">
            <Building2 className="w-5 h-5 text-brand-accent" />
            <div>
              <CardTitle>Connected Accounts</CardTitle>
              <CardDescription>Manage personal and work accounts to keep your clinical data organized</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          {/* Existing Accounts */}
          {accounts.length > 0 ? (
            <div className="space-y-3">
              {accounts.map((account) => (
                <div
                  key={account.id}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
                    account.is_active 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border/50 hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${
                      account.account_type === 'work' 
                        ? 'bg-brand-accent/10 text-brand-accent' 
                        : 'bg-primary/10 text-primary'
                    }`}>
                      {getAccountIcon(account.account_type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{account.profile_name}</span>
                        {account.is_active && (
                          <Badge variant="secondary" className="text-xs">Active</Badge>
                        )}
                      </div>
                      {account.organization_name && (
                        <span className="text-sm text-muted-foreground">{account.organization_name}</span>
                      )}
                      <span className="text-xs text-muted-foreground capitalize block">
                        {account.account_type} account
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {!account.is_active && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-lg"
                        onClick={() => handleSwitchAccount(account)}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Switch
                      </Button>
                    )}
                    
                    {account.account_type === 'work' && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-2xl">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Work Account</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{account.profile_name}"? This will remove all data associated with this work account.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteAccount(account.id, account.profile_name)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl"
                              disabled={deletingAccountId === account.id}
                            >
                              {deletingAccountId === account.id ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Deleting...
                                </>
                              ) : (
                                <>
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </>
                              )}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <p className="text-sm">No accounts configured yet.</p>
              <p className="text-xs mt-1">Create a work account to separate your professional data.</p>
            </div>
          )}

          {/* Add Work Account Button */}
          {!hasWorkAccount && (
            <Button
              variant="outline"
              className="w-full rounded-xl gap-2"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <Plus className="w-4 h-4" />
              Add Work Account
            </Button>
          )}

          <p className="text-xs text-muted-foreground text-center pt-2">
            Work accounts help you keep personal and professional clinical data separate.
          </p>
        </CardContent>
      </Card>

      {/* Create Work Account Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-brand-accent" />
              Create Work Account
            </DialogTitle>
            <DialogDescription>
              Set up a separate work account to keep your professional and personal clinical data organized.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="account-name">Account Name</Label>
              <Input
                id="account-name"
                placeholder="e.g., Hospital Work"
                value={newAccountName}
                onChange={(e) => setNewAccountName(e.target.value)}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="organization">Organization (Optional)</Label>
              <Input
                id="organization"
                placeholder="e.g., City General Hospital"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                className="rounded-xl"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button 
              onClick={handleCreateWorkAccount} 
              disabled={isCreating}
              className="rounded-xl"
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ConnectedAccountsSection;
