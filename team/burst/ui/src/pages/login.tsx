import { useEffect } from "react";
import { Spinner } from "../components/ui/spinner";

// SymNexus Team: sign-in is handled by the server-rendered /login page in
// team/web, which sets the session cookie. This route only hands over to it.
export function LoginPage() {
  useEffect(() => {
    window.location.replace("/login");
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
      <Spinner className="h-6 w-6" />
    </div>
  );
}
