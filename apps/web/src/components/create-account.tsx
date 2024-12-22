import { useAuthStore } from "../stores/auth";

export const CreateAccount = () => {
  const authStore = useAuthStore();
  const createAccount = async () => {
    const response = await fetch("http://localhost:3001/rest/accounts", {
      method: "POST",
      body: JSON.stringify({
        accountName: "New Account " + Math.round(Math.random() * 99999),
      }),
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
      },
    });
  };
  return (
    <div>
      <button
        onClick={() => {
          createAccount();
        }}
      >
        New Account
      </button>
    </div>
  );
};
