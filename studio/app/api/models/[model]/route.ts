import { deleteOwnModel } from "@features/models/mutations/deleteOwnModel";

export async function DELETE(req: Request,{ params }: { params: { model: string} }) {  
    const model = await deleteOwnModel(Number(params.model));
    return Response.json(model, { status: 201 });  
}
