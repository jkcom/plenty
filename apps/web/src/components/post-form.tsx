import { useSync } from "sync";
import { Input } from "./ui/input";
import { useState } from "react";
import { Button } from "./ui/button";

export const PostForm = () => {
  const [title, setTitle] = useState("");
  const { data, create } = useSync();

  return (
    <div>
      <h3>New post</h3>
      <Input value={title} onChange={(e) => setTitle(e.target.value)} />
      <Button
        onMouseDown={() => {
          setTitle("");
          create({
            model: "post",
            values: {
              title,
            },
          });
        }}
      >
        {"Create"}
      </Button>
    </div>
  );
};
