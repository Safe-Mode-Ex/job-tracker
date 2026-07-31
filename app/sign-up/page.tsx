"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { SubmitEvent, useState } from "react";
import { signUp } from '@/lib/auth/auth-client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function handleSubmit(evt: SubmitEvent) {
    evt.preventDefault();

    setError('');
    setLoading(true);

    try {
      const result = await signUp.email({
        name,
        email,
        password,
      });

      if (result.error) {
        setError(result.error.message ?? 'Failed to sign up');
      } else {
        router.push('/dashboard');
      }
    } catch (error: unknown) {
      setError(`An error occured: ${error}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-white p-4">
      <Card className="w-full max-w-md border-gray-200 shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-black">Sign Up</CardTitle>
          <CardDescription className="text-gray-600">
            Create an account to start tracking your job applications
          </CardDescription>
        </CardHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700">Name</Label>
              <Input
                id="name"
                className="border-gray-300 focus:border-primary focus:ring-primary"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={({target}) => setName(target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">Email</Label>
              <Input
                id="email"
                className="border-gray-300 focus:border-primary focus:ring-primary"
                type="email"
                placeholder="john@example.com"
                onChange={({target}) => setEmail(target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">Password</Label>
              <Input
                id="password"
                className="border-gray-300 focus:border-primary focus:ring-primary"
                type="password"
                placeholder="123456Ab"
                minLength={8}
                onChange={({target}) => setPassword(target.value)}
                required
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={loading}
            >
              {loading ? 'Creating the account...' : 'Sign Up'}
            </Button>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="font-medium text-primary hover:underline"
              >
                Sign In
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
