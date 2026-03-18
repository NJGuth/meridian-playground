import { redirect } from "next/navigation";

export default async function PlaygroundPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/playground/${id}/chats`);
}
