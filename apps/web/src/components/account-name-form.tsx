import { useSync } from "sync";
import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export const AccountNameForm = () => {
  const { data, update } = useSync();
  const [name, setName] = useState(data?.account.name || "");
  return (
    <div>
      <Input value={name} onChange={(e) => setName(e.target.value)} />
      <Button
        onClick={() =>
          update({
            id: data.account.id,
            model: "account",
            values: {
              name,
            },
          })
        }
      >
        {"Save"}
      </Button>
    </div>
  );
};
