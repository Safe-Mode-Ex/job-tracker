import { SubmitEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiRoute } from "@/lib/enums";

export function useAuthForm<T>(
  action: (values: T) => Promise<{ error?: { message?: string } | null }>,
  errorMessage: string,
) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleFormSubmit = async (
    evt: SubmitEvent<HTMLFormElement>,
    values: T,
  ) => {
    evt.preventDefault();

    setError('');
    setLoading(true);

    try {
      const result = await action(values);

      if (result.error) {
        setError(result.error.message ?? errorMessage);
      } else {
        router.push(ApiRoute.Dashboard);
      }
    } catch (error: unknown) {
      setError(`An error occured: ${error}`);
    } finally {
      setLoading(false);
    }
  }

  return { error, loading, handleFormSubmit };
}
