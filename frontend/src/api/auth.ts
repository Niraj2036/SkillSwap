import { useMutation } from "@tanstack/react-query";
const BACKEND_URL = import.meta.env.VITE_API_URL!;

interface ApiResponse {
  ok: boolean;
  id: string;
}

const postProfile = async (form: FormData): Promise<ApiResponse> =>{
  const res = await fetch(`${BACKEND_URL}/auth/register`, {
    method: "POST",
    body: form,                // <-- FormData automatically sets boundary
  });
  if (!res.ok) throw new Error("Failed to save profile");
  return res.json();
}

export function useRegisterUser() {
  return useMutation({ mutationFn: postProfile });
}
