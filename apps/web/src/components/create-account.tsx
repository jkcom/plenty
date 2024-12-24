import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../stores/auth";
import { Input } from "./ui/input";
import {
  createAccount,
  slugAvailable,
  suggestedAccountSlug,
} from "api/src/client";
import { useState } from "react";

export const CreateAccount = () => {
  const authStore = useAuthStore();
  const [slug, setSlug] = useState("");
  const [name, setName] = useState("");

  const checkSlugQuery = useQuery({
    queryKey: ["slug-available", slug],
    queryFn: async () => slugAvailable(authStore.accessToken!, { slug }),
    placeholderData: (data) => data,
  });

  const suggestedAccountSlugQuery = useQuery({
    queryKey: ["suggested-account-slug", name],
    queryFn: async () =>
      suggestedAccountSlug(authStore.accessToken!, { accountName: name }),
    placeholderData: (data) => data,
  });

  return (
    <div>
      <h2 className="text-lg">Create Account</h2>
      <Input value={name} onChange={(e) => setName(e.target.value)} />
      <Input
        placeholder={suggestedAccountSlugQuery.data?.slug}
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
      />
      {checkSlugQuery.data?.data?.available ? (
        <div>Slug is available</div>
      ) : (
        <div>Slug is not available</div>
      )}
      <button
        onClick={() => {
          void createAccount(authStore.accessToken!, {
            name: "Test",
            slug: "test",
          });
        }}
      >
        New Account
      </button>
    </div>
  );
};
