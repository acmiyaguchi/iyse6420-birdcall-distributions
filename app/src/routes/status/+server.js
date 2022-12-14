import { json } from "@sveltejs/kit";
export async function GET({ params }) {
  const { prefix } = params;
  return json({
    status: "ok",
    mode: import.meta.env.MODE,
    version: "__VERSION__",
    git_sha: "__GIT_COMMIT__",
    build_time: "__BUILD_TIME__"
  });
}
