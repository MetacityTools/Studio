export function DetailWidget(props: { children?: React.ReactNode }) {
    return <div className="flex flex-col bg-neutral-200 rounded-md">{props.children}</div>;
}

export function WidgetLine(props: { children?: React.ReactNode }) {
    return <div className="flex flex-row items-center w-full text-base">{props.children}</div>;
}

export function WidgetTitle(props: { children?: React.ReactNode }) {
    return (
        <div className="py-2 px-4 w-full text-neutral-500 flex flex-row items-center">
            {props.children}
        </div>
    );
}

export function WidgetDescription(props: { children?: React.ReactNode }) {
    return <div className="py-2 px-4 w-full text-neutral-500 text-xs">{props.children}</div>;
}

export function WidgetApplyButton(props: { onApply: () => void; text?: string }) {
    const { onApply } = props;
    return (
        <button
            className="py-2 px-4 hover:bg-neutral-300 rounded-tr-md transition-colors cursor-pointer font-heavy"
            onClick={onApply}
        >
            {props.text || 'Apply'}
        </button>
    );
}
