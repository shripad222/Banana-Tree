import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, BarChart3, Settings, TrendingUp } from 'lucide-react';

const ManagerAuth = () => {
  const navigate = useNavigate();
  const { signIn, signUp, user, role, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Sign in form
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Sign up form
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpName, setSignUpName] = useState('');

  useEffect(() => {
    if (user && role === 'manager' && !loading) {
      navigate('/manager');
    } else if (user && role === 'user' && !loading) {
      navigate('/');
    }
  }, [user, role, loading, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signIn(signInEmail, signInPassword);
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signUp(signUpEmail, signUpPassword, signUpName, 'manager');
    } catch (error) {
      console.error('Sign up error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side - Branding */}
      <div className="lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 lg:p-12 flex flex-col justify-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNm0wIDJjMi4yMDkgMCA0IDEuNzkxIDQgNHMtMS43OTEgNC00IDQtNC0xLjc5MS00LTQgMS43OTEtNCA0LTR6IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-10" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <Shield className="w-12 h-12 text-primary" />
            <h1 className="text-5xl font-bold">PARKIT Manager</h1>
          </div>
          
          <h2 className="text-3xl font-bold mb-4">
            Powerful Tools for Parking Operations
          </h2>
          
          <p className="text-xl text-white/90 mb-8">
            Manage your parking operations with real-time analytics, AI predictions, and dynamic pricing controls.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <BarChart3 className="w-6 h-6 mt-1 flex-shrink-0 text-primary" />
              <div>
                <h3 className="font-semibold text-lg">Real-Time Analytics</h3>
                <p className="text-white/80">Monitor occupancy, revenue, and performance metrics</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <TrendingUp className="w-6 h-6 mt-1 flex-shrink-0 text-primary" />
              <div>
                <h3 className="font-semibold text-lg">AI Predictions</h3>
                <p className="text-white/80">Forecast demand and optimize pricing automatically</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Settings className="w-6 h-6 mt-1 flex-shrink-0 text-primary" />
              <div>
                <h3 className="font-semibold text-lg">Advanced Controls</h3>
                <p className="text-white/80">Manage spots, pricing, and EV stations from one dashboard</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Auth forms */}
      <div className="lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <Card className="w-full max-w-md border-2 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Manager Portal</CardTitle>
            <CardDescription>Access your parking management dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="manager-signin-email">Email</Label>
                    <Input
                      id="manager-signin-email"
                      type="email"
                      placeholder="manager@parkit.com"
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="manager-signin-password">Password</Label>
                    <Input
                      id="manager-signin-password"
                      type="password"
                      placeholder="••••••••"
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Signing in...' : 'Sign In as Manager'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="manager-signup-name">Full Name</Label>
                    <Input
                      id="manager-signup-name"
                      type="text"
                      placeholder="John Doe"
                      value={signUpName}
                      onChange={(e) => setSignUpName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="manager-signup-email">Email</Label>
                    <Input
                      id="manager-signup-email"
                      type="email"
                      placeholder="manager@parkit.com"
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="manager-signup-password">Password</Label>
                    <Input
                      id="manager-signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Creating account...' : 'Create Manager Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <Button
                variant="link"
                onClick={() => navigate('/auth')}
                className="text-sm text-muted-foreground hover:text-primary"
              >
                ← Back to user sign in
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManagerAuth;