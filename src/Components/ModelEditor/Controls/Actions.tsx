interface ActionMenuProps {
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ActionMenu(props: ActionMenuProps) {
    return (
        <div className="flex flex-row p-4 border-b w-full border-b border-white">
            <label
                htmlFor="modelInputFiles"
                className="py-2 px-4 bg-neutral-200 hover:bg-neutral-300 rounded-md transition-colors cursor-pointer"
            >
                Load Models
            </label>
            <input
                className="hidden"
                type="file"
                onChange={props.onChange}
                id="modelInputFiles"
                multiple
            />
        </div>
    );
}
