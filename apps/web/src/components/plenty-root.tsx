import { useSync } from "sync";
import { AccountNameForm } from "./account-name-form";
import { PostForm } from "./post-form";
import { PostList } from "./post-list";

export const PlentyRoot = () => {
  const { data } = useSync();
  return (
    <>
      <h1>{"PlentyRoot"}</h1>
      <p>{data?.account.name}</p>
      <p>{data?.account.owner?.name}</p>
      <AccountNameForm />
      <PostForm />
      <PostList />
    </>
  );
};
