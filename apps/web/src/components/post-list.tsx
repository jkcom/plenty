import { useSync } from "sync";

export const PostList = () => {
  const { data } = useSync();
  return (
    <>
      <h3>Posts</h3>
      {data.account.col.posts.map((post) => (
        <div key={post.id}>
          <small className="text-xs flex flex-row items-center gap-2">
            <div
              className="w-5 h-5 rounded-full bg-contain"
              style={{
                backgroundImage: `url(${post.ref.owner.picture}`,
              }}
            ></div>
            {post.ref.owner.name}
          </small>
          <div>{post.title}</div>
        </div>
      ))}
    </>
  );
};
