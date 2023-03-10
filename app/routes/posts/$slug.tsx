import { marked } from "marked";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getPost } from "~/models/post.server";
import type { LoaderFunction } from "@remix-run/node";
import invariant from "tiny-invariant";

type LoaderData = {
  title: string;
  html: string;
};

export const loader: LoaderFunction = async ({ params }) => {
  const { slug } = params;

  invariant(slug, "slug is required!");
  const post = await getPost(slug);

  invariant(post, `post not found: ${slug}`);
  const html = marked(post.markdown);

  return json<LoaderData>({ title: post.title, html });
};

export default function PostRoute() {
  const { title, html } = useLoaderData() as LoaderData;

  return (
    <main className="max-w-4x1 mx-auto">
      <h1 className="text-3x1 my-6 border-b-2 text-center">{title}</h1>
      <div className="text-center" dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  );
}
