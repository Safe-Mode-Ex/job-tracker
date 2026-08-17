"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "@/lib/auth/auth-client";
import { ApiRoute, ErrorMessage } from "@/lib/enums";
import { SignInPayload } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthForm } from "@/hooks/use-auth-form/use-auth-form";

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { error, loading, handleFormSubmit } = useAuthForm<SignInPayload>(
    (values) => signIn.email(values),
    ErrorMessage.SignIn,
  );

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-white p-4">
      <Card className="w-full max-w-md border-gray-200 shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-black">Sign In</CardTitle>
          <CardDescription className="text-gray-600">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>

        <form
          className="space-y-4"
          onSubmit={(evt) => handleFormSubmit(evt, { email, password })}
        >
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">Email</Label>
              <Input
                id="email"
                className="border-gray-300 focus:border-primary focus:ring-primary"
                type="email"
                placeholder="john@example.com"
                value={email}
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
                value={password}
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
              {loading ? 'Creating the account...' : 'Sign In'}
            </Button>

            <p className="text-center text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                href={ApiRoute.SignUp}
                className="font-medium text-primary hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
