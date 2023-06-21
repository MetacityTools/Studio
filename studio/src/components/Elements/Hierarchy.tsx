import clsx from 'clsx';
import { FiChevronRight } from 'react-icons/fi';

function getNodeBackground(active: boolean, light?: boolean) {
    if (active)
        return 'text-amber-800 bg-amber-300 enabled:hover:bg-amber-400 outline-none transition-colors';
    if (light)
        return 'text-amber-800 bg-amber-100 enabled:hover:bg-amber-400 outline-none transition-colors';
    return 'text-neutral-800 bg-neutral-200 enabled:hover:bg-neutral-300 outline-none transition-colors';
}

export type ButtonHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;

interface HierarchyButtonBase {
    onClick?: ButtonHandler;
    title?: string;
    active?: boolean;
    light?: boolean;
}

interface HierarchyButtonProps extends HierarchyButtonBase {
    children: React.ReactNode;
    disabled?: boolean;
}

export function HierarchyButton(props: HierarchyButtonProps) {
    const disabled = props.disabled ?? false;
    const bg = getNodeBackground(props.active ?? false, props.light ?? false);

    return (
        <button
            className={clsx(bg, 'px-4 py-2 last:rounded-r')}
            onClick={props.onClick}
            title={props.title}
            disabled={disabled}
        >
            {props.children}
        </button>
    );
}

interface HierarchyChevronButtonProps extends HierarchyButtonBase {
    open: boolean;
}

export function HierarchyChevronButton(props: HierarchyChevronButtonProps) {
    const bg = getNodeBackground(props.active ?? false, props.light ?? false);

    return (
        <button
            className={clsx('px-2 py-2 rounded-l', bg)}
            onClick={props.onClick}
            title={props.title}
        >
            <FiChevronRight
                className={clsx('w-4 h-4 transition-all', props.open && 'transform rotate-90')}
            />
        </button>
    );
}

interface HierarchyMainButtonProps extends HierarchyButtonProps {
    padded?: boolean;
}

export function HierarchyMainButton(props: HierarchyMainButtonProps) {
    const bg = getNodeBackground(props.active ?? false, props.light ?? false);

    return (
        <button
            className={clsx(
                props.padded ? 'px-4' : 'px-2',
                'flex-1 text-left first:rounded-l text-ellipsis overflow-hidden whitespace-nowrap last:rounded-r',
                bg
            )}
            onClick={props.onClick}
        >
            {props.children}
        </button>
    );
}

interface HierarchyNodeRowProps {
    children: React.ReactNode;
}

export function HierarchyNode(props: HierarchyNodeRowProps) {
    return <div className="flex flex-row justify-between items-center">{props.children}</div>;
}

interface HierarchyNodeGroupProps {
    children: React.ReactNode;
}

export function HierarchyNodeGroup(props: HierarchyNodeGroupProps) {
    return <div className="flex flex-col rounded-md">{props.children}</div>;
}

export function HierarchyNodeGroupChildren(props: HierarchyNodeGroupProps) {
    return <div className="mt-1 pl-8 space-y-1">{props.children}</div>;
}
