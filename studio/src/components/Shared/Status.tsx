export function Status(props: { status: string | undefined }) {
    switch (props.status) {
        case 'editing':
            return <EditingStatus />;
        case 'saved':
            return <SavedStatus />;
        case 'failed':
            return <FailedStatus />;
        default:
            return null;
    }
}

function EditingStatus() {
    return <span className="text-neutral-600 px-2">Editing</span>;
}

function SavedStatus() {
    return <span className="text-green-600 px-2">Edits Saved</span>;
}

function FailedStatus() {
    return <span className="text-red-600 px-2">Editing Failed</span>;
}
