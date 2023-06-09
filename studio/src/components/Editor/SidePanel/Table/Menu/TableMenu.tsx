import { useSheets } from '@editor/Context/TableContext';

import { Button, ButtonFileInput } from '@elements/Button';

export function TableMenu() {
    const [addSheet] = useSheets();

    const handleTableSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;
        const file = files[0];
        addSheet(await file.text());
        event.target.value = '';
        event.preventDefault();
    };

    return (
        <div className="flex flex-row p-4 w-full space-x-2 border-b items-center">
            <ButtonFileInput id="table" onChange={handleTableSelected}>
                Import CSV Table
            </ButtonFileInput>
        </div>
    );
}
