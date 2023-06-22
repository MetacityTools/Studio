import { TableMenu } from './TableMenu';
import { Tables } from './Tables/Tables';

export function TableSidePanel() {
    return (
        <div className="w-full h-full flex flex-col">
            <TableMenu />
            <Tables />
        </div>
    );
}
