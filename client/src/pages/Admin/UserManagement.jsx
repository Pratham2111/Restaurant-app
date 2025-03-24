import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { useToast } from "../../hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Badge } from "../../components/ui/badge";
import { Edit, Key, User, AlertTriangle, CheckCircle, X, LoaderCircle } from "lucide-react";

/**
 * User Management Component for Admin Dashboard
 */
function UserManagement() {
  const { user: currentUser, isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const { toast } = useToast();
  
  // Password reset dialog
  const [isPasswordResetOpen, setIsPasswordResetOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [passwordResetError, setPasswordResetError] = useState("");
  
  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('la_mason_auth_token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        
        const response = await fetch('/api/auth/users', {
          headers,
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch users: ${response.status}`);
        }
        
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast({
          title: "Error",
          description: "Failed to load users. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, [toast]);
  
  // Handle password reset
  const handleResetPassword = async () => {
    if (!selectedUser || !newPassword) {
      setPasswordResetError("Please enter a new password");
      return;
    }
    
    if (newPassword.length < 6) {
      setPasswordResetError("Password must be at least 6 characters long");
      return;
    }
    
    setIsResettingPassword(true);
    setPasswordResetError("");
    
    try {
      const userId = selectedUser.id || selectedUser._id;
      const token = localStorage.getItem('la_mason_auth_token');
      const headers = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` })
      };
      
      const response = await fetch(`/api/auth/reset-password/${userId}`, {
        method: "POST",
        headers,
        credentials: 'include',
        body: JSON.stringify({ newPassword })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to reset password");
      }
      
      const data = await response.json();
      
      toast({
        title: "Password Reset",
        description: `Password for ${selectedUser.name || selectedUser.email} has been reset successfully.`,
        variant: "default",
      });
      
      // Close the dialog
      setIsPasswordResetOpen(false);
      setNewPassword("");
    } catch (error) {
      console.error('Error resetting password:', error);
      setPasswordResetError(error.message || "Failed to reset password");
      
      toast({
        title: "Error",
        description: error.message || "Failed to reset password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsResettingPassword(false);
    }
  };
  
  // Reset dialog state when closed
  const handleDialogChange = (open) => {
    if (!open) {
      setIsPasswordResetOpen(false);
      setNewPassword("");
      setPasswordResetError("");
      setSelectedUser(null);
    }
  };
  
  // Open password reset dialog for a user
  const openPasswordResetDialog = (user) => {
    setSelectedUser(user);
    setIsPasswordResetOpen(true);
  };
  
  if (!isAdmin()) {
    return (
      <div className="flex flex-col items-center justify-center p-6">
        <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
        <h2 className="text-xl font-bold">Access Denied</h2>
        <p className="text-muted-foreground mt-2">
          You don't have permission to access user management.
        </p>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-10">
        <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading users...</span>
      </div>
    );
  }

  return (
    <div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                users.map(user => (
                  <TableRow key={user.id || user._id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{user.name || "N/A"}</span>
                        {(user.id || user._id) === (currentUser.id || currentUser._id) && (
                          <Badge variant="outline" className="ml-2">You</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={
                        user.role === "admin" ? "destructive" : 
                        user.role === "subadmin" ? "default" : 
                        "secondary"
                      }>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          disabled={(user.id || user._id) === (currentUser.id || currentUser._id)}
                          onClick={() => openPasswordResetDialog(user)}
                        >
                          <Key className="h-4 w-4 mr-1" />
                          <span className="hidden sm:inline">Reset Password</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Password Reset Dialog */}
      <Dialog open={isPasswordResetOpen} onOpenChange={handleDialogChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset User Password</DialogTitle>
            <DialogDescription>
              Set a new password for user: {selectedUser?.name || selectedUser?.email}
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4 space-y-4">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium mb-1">
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className={`w-full px-3 py-2 border rounded-md ${
                  passwordResetError ? "border-red-500" : "border-input"
                } bg-background`}
                autoComplete="new-password"
              />
              {passwordResetError && (
                <p className="text-red-500 text-xs mt-1">{passwordResetError}</p>
              )}
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p>
                <AlertTriangle className="h-4 w-4 inline mr-1 text-yellow-500" />
                This will reset the user's password immediately.
              </p>
            </div>
          </div>
          
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsPasswordResetOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleResetPassword}
              disabled={isResettingPassword}
              className="ml-2"
            >
              {isResettingPassword ? (
                <>
                  <LoaderCircle className="h-4 w-4 mr-2 animate-spin" />
                  Resetting...
                </>
              ) : (
                <>
                  <Key className="h-4 w-4 mr-2" />
                  Reset Password
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default UserManagement;