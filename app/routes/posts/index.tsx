import { Link, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { getPostsListings } from "~/models/post.server";
import type { LoaderFunction } from "@remix-run/node";
import { useOptionalAdminUser } from "~/utils";

type LoaderData = {
  posts: Awaited<ReturnType<typeof getPostsListings>>;
};

export const loader: LoaderFunction = async () => {
  const posts = await getPostsListings();

  return json<LoaderData>({ posts });
};

export default function PostsRoute() {
  const { posts } = useLoaderData() as LoaderData;
  const adminUser = useOptionalAdminUser();

  return (
    // <main>
    //   <h1>Posts</h1>
    //   {adminUser ? (
    //     <Link to="admin" className="text-red-600 underline">
    //       Admin
    //     </Link>
    //   ) : null}
    // <ul>
    //   {posts.map((post) => (
    //     <li key={post.slug}>
    //       <Link
    //         to={post.slug}
    //         prefetch="intent"
    //         className="text-blue-600 underline"
    //       >
    //         {post.title}
    //       </Link>
    //     </li>
    //   ))}
    // </ul>
    // </main>

    <main className="mx-auto max-w-4xl">
      <h1 className="my-6 mb-2 border-b-2 text-center text-3xl">Posts</h1>
      <div className="grid grid-cols-4 gap-6">
        <nav className="col-span-4 md:col-span-1">
          {adminUser ? (
            <Link to="admin" className="text-red-600 underline">
              Admin
            </Link>
          ) : null}
          <ul>
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  to={post.slug}
                  prefetch="intent"
                  className="text-blue-600 underline"
                >
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </main>
  );
}
