import type { AccountsPayload } from "../../../../packages/types/src/payloads";
import { useAuthStore } from "../stores/auth";
import { useEffect, useState } from "react";
import { CreateAccount } from "./create-account";

export const AccountList = () => {
  const authStore = useAuthStore();
  const [accounts, setAccounts] = useState<AccountsPayload["accounts"]>([]);

  const getAccounts = async () => {
    const response = await fetch("http://localhost:3001/rest/accounts", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
      },
    });
    const data = (await response.json()) as AccountsPayload;
    setAccounts(data.accounts);
  };

  useEffect(() => {
    if (authStore.accessToken) {
      getAccounts();
    }
  }, []);

  return (
    <div>
      <h2>Account List</h2>
      <ul>
        {accounts.map((account) => (
          <li key={account.id}>{account.accountName}</li>
        ))}
      </ul>
      <CreateAccount />
    </div>
  );
};
