import { checkIsAuthed } from "~/server/auth";
import { object, string } from "yup";

export default eventHandler(async (evt) => {
  await checkIsAuthed(evt);

  const { title, content } = await readValidatedBody(evt, validatePost);
});

async function validatePost(reqBody: unknown) {
  const schema = object({
    title: string().required().max(500),
    content: string().required().max(5000),
  });
  try {
    await schema.validate(reqBody);
  } catch (e: any) {
    throw createError({ statusCode: 400, message: `Invalid Data:\n${e}` });
  }

  return reqBody as { title: string; content: string };
}
