import { deleteModel } from "@features/models/mutations/deleteModel";

export async function DELETE(
  req: Request,
  { params }: { params: { model: string } }
) {
  await deleteModel(Number(params.model));
  return Response.json(true, { status: 201 });
}
