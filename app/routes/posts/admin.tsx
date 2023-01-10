import { Link, Outlet, useLoaderData, Form } from "@remix-run/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getPostsListings } from "~/models/post.server";
import { requireAdminUser } from "~/session.server";
import { redirect } from "@remix-run/node";
import { deletePost } from "~/models/post.server";
import invariant from "tiny-invariant";

type LoaderData = {
  posts: Awaited<ReturnType<typeof getPostsListings>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  await requireAdminUser(request);
  return json<LoaderData>({ posts: await getPostsListings() });
};

export const action: ActionFunction = async ({ request }) => {
  await requireAdminUser(request);
  const formData = await request.formData();

  const intentPostSlug = formData.get("intent");

  invariant(typeof intentPostSlug === "string", "slug must be a string!");

  await deletePost(intentPostSlug);
  return redirect("/posts/admin");
};

export default function AdminRoute() {
  const { posts } = useLoaderData() as LoaderData;

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="my-6 mb-2 border-b-2 text-center text-3xl">Blog Admin</h1>
      <div className="grid grid-cols-4 gap-6">
        <nav className="col-span-4 md:col-span-1">
          <ul>
            {posts.map((post) => (
              <li key={post.slug}>
                <Link to={post.slug} className="text-blue-600 underline">
                  {post.title}
                </Link>
                <Form method="post" key={post?.slug ?? "new"}>
                  <button
                    type="submit"
                    name="intent"
                    value={post.slug}
                    className="rounded bg-red-500 py-2 px-4 text-white hover:bg-red-600 focus:bg-red-400 disabled:bg-red-300"
                  >
                    Delete
                  </button>
                </Form>
              </li>
            ))}
          </ul>
        </nav>
        <main className="col-span-4 md:col-span-3">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
