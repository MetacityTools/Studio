import { TableMenu } from './TableMenu';
import { Tables } from './Tables/Tables';

export function TableSidePanel() {
    return (
        <div className="flex flex-col h-full">
            <TableMenu />
            <Tables />
        </div>
    );
}
