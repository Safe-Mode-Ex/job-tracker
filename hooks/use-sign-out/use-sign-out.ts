import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth/auth-client";

export function UseSignOut() {
  const router = useRouter();

  const handleSignOutClick = async () => {
    const { data } = await signOut();
    if (!data) {
      alert('Error signing out');
      return;
    }
    router.push('/sign-in');
  }

  return handleSignOutClick;
}
