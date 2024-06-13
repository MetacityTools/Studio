import { deleteOwnModel } from "@features/models/mutations/deleteOwnModel";

export async function DELETE(req: Request,{ params }: { params: { model: string} }) {
    await deleteOwnModel(Number(params.model));
    return Response.json(true, { status: 201 });  
}
