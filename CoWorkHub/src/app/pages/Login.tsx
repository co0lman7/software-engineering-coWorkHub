import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Navbar } from "../components/Navbar";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Building2 } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "sonner";

export function Login() {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [loginEmail, setLoginEmail]       = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [regName, setRegName]             = useState("");
  const [regEmail, setRegEmail]           = useState("");
  const [regPassword, setRegPassword]     = useState("");
  const [busy, setBusy]                   = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true);
    const { error } = await signIn(loginEmail, loginPassword);
    setBusy(false);
    if (error) toast.error("Login failed", { description: error });
    else { toast.success("Welcome back!"); navigate("/dashboard"); }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true);
    const { error } = await signUp(regEmail, regPassword, regName);
    setBusy(false);
    if (error) toast.error("Registration failed", { description: error });
    else toast.success("Account created! Check your email to confirm.");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="bg-primary text-primary-foreground p-3 rounded-lg"><Building2 className="h-8 w-8" /></div>
            </Link>
            <h2 className="mb-2">Welcome to CoWorkHub</h2>
            <p className="text-muted-foreground">Sign in to manage your workspace bookings</p>
          </div>
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="register">Create Account</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <Card>
                <CardHeader><CardTitle>Sign In</CardTitle><CardDescription>Enter your credentials</CardDescription></CardHeader>
                <form onSubmit={handleLogin}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2"><Label>Email</Label><Input type="email" required value={loginEmail} onChange={e => setLoginEmail(e.target.value)} /></div>
                    <div className="space-y-2"><Label>Password</Label><Input type="password" required value={loginPassword} onChange={e => setLoginPassword(e.target.value)} /></div>
                  </CardContent>
                  <CardFooter><Button type="submit" className="w-full" disabled={busy}>{busy ? "Signing in…" : "Sign In"}</Button></CardFooter>
                </form>
              </Card>
            </TabsContent>
            <TabsContent value="register">
              <Card>
                <CardHeader><CardTitle>Create Account</CardTitle><CardDescription>Join CoWorkHub</CardDescription></CardHeader>
                <form onSubmit={handleRegister}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2"><Label>Full Name</Label><Input required value={regName} onChange={e => setRegName(e.target.value)} /></div>
                    <div className="space-y-2"><Label>Email</Label><Input type="email" required value={regEmail} onChange={e => setRegEmail(e.target.value)} /></div>
                    <div className="space-y-2"><Label>Password</Label><Input type="password" required minLength={6} value={regPassword} onChange={e => setRegPassword(e.target.value)} /></div>
                  </CardContent>
                  <CardFooter><Button type="submit" className="w-full" disabled={busy}>{busy ? "Creating…" : "Create Account"}</Button></CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
