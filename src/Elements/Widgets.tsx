import clsx from 'clsx';

export function DetailWidget(props: { children?: React.ReactNode, onClick?: () => void }) {
    return <div className={clsx("flex flex-col border rounded-md text-neutral-500", props.onClick && "cursor-pointer hover:bg-amber-300 hover:text-amber-900 hover:border-white transition-colors")}
        onClick={props.onClick}
    >{props.children}</div>;
}

export function WidgetLine(props: { children?: React.ReactNode; className?: string }) {
    return (
        <div className={clsx('flex flex-row items-center w-full text-base', props.className)}>
            {props.children}
        </div>
    );
}

export function WidgetTitle(props: { children?: React.ReactNode }) {
    return (
        <div className="py-2 px-4 w-full flex flex-row items-center">
            {props.children}
        </div>
    );
}

export function WidgetDescription(props: { children?: React.ReactNode }) {
    return <div className="py-2 px-4 w-full text-xs">{props.children}</div>;
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
