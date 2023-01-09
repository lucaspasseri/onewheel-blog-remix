import {
  Form,
  useActionData,
  useLoaderData,
  useTransition,
} from "@remix-run/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import { createPost, getPost } from "~/models/post.server";
import invariant from "tiny-invariant";
import { requireAdminUser } from "~/session.server";

export const loader: LoaderFunction = async ({ request, params }) => {
  await requireAdminUser(request);
  if (params.slug === "new") return json({});

  const post = await getPost(params.slug);

  return json({ post: post });
};

const inputClassName =
  "w-full rounded border border-gray-500 px-2 py-1 text-lg";

type ActionData =
  | {
      title: null | string;
      slug: null | string;
      markdown: null | string;
    }
  | undefined;

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();

  // console.log(formData);

  // for (var pair of formData.entries()) {
  //   console.log(pair[0] + ", " + pair[1]);
  // }

  const title = formData.get("title");
  const slug = formData.get("slug");
  const markdown = formData.get("markdown");

  const errors: ActionData = {
    title: title ? null : "Title is required",
    slug: slug ? null : "Slug is required",
    markdown: markdown ? null : "Markdown is required",
  };

  const hasErrors = Object.values(errors).some((error) => error);

  if (hasErrors) {
    return json<ActionData>(errors);
  }

  console.log({ title, slug, markdown });

  invariant(typeof title === "string", "title must be a string!");
  invariant(typeof slug === "string", "slug must be a string!");
  invariant(typeof markdown === "string", "markdown must be a string!");

  if (params.slug === "new") {
    await createPost({ title, slug, markdown });
  } else {
    // TODO update post
  }

  return redirect("/posts/admin");
};

export default function NewPostRoute() {
  const data = useLoaderData();
  const errors = useActionData() as ActionData;

  const transition = useTransition();

  const loading = Boolean(transition.submission);

  return (
    <>
      <h1>New Post</h1>
      <Form method="post" key={data.post?.slug ?? "new"}>
        <p>
          <label>
            Post Title:
            {errors?.title ? (
              <em className="text-red-600">{errors.title}</em>
            ) : null}
            <input
              type="text"
              name="title"
              className={inputClassName}
              defaultValue={data.post?.title}
            />
          </label>
        </p>
        <p>
          <label>
            Post Slug:
            {errors?.slug ? (
              <em className="text-red-600">{errors.slug}</em>
            ) : null}
            <input
              type="text"
              name="slug"
              className={inputClassName}
              defaultValue={data.post?.slug}
            />
          </label>
        </p>
        <p>
          <label htmlFor="markdown"> Markdown:</label>
          {errors?.markdown ? (
            <em className="text-red-600">{errors.markdown}</em>
          ) : null}
          <textarea
            id="markdown"
            rows={20}
            name="markdown"
            className={`${inputClassName} font-mono`}
            defaultValue={data.post?.markdown}
          />
        </p>
        <p className="text-right">
          <button
            type="submit"
            className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Post"}
          </button>
        </p>
      </Form>
    </>
  );
}