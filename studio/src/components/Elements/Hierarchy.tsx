import clsx from 'clsx';
import { FiChevronRight } from 'react-icons/fi';

export function colorNodeBackground(active: boolean, light?: boolean) {
    if (active)
        return 'text-amber-800 bg-amber-300 enabled:hover:bg-amber-400 outline-none transition-colors';
    if (light)
        return 'text-amber-800 bg-amber-200 enabled:hover:bg-amber-400 outline-none transition-colors';
    return 'text-neutral-800 bg-neutral-200 enabled:hover:bg-neutral-300 outline-none transition-colors';
}

export type ButtonHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;

interface HierarchyButtonProps {
    onClick?: ButtonHandler;
    title?: string;
    children: React.ReactNode;
    disabled?: boolean;
    bg: string;
}

export function HierarchyButton(props: HierarchyButtonProps) {
    const disabled = props.disabled ?? false;

    return (
        <button
            className={clsx(props.bg, 'px-4 py-2 last:rounded-r')}
            onClick={props.onClick}
            title={props.title}
            disabled={disabled}
        >
            {props.children}
        </button>
    );
}

interface HierarchyMainButtonProps extends HierarchyButtonProps {
    padded?: boolean;
}

export function HierarchyMainButton(props: HierarchyMainButtonProps) {
    return (
        <button
            className={clsx(
                props.padded ? 'px-4' : 'px-2',
                'flex-1 text-left first:rounded-l text-ellipsis overflow-hidden whitespace-nowrap last:rounded-r',
                props.bg
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

export function HierarchyNodeRow(props: HierarchyNodeRowProps) {
    return <div className="flex flex-row justify-between items-center">{props.children}</div>;
}

interface HierarchyChevronButtonProps {
    bg: string;
    open: boolean;
    onClick?: ButtonHandler;
}

export function HierarchyChevronButton(props: HierarchyChevronButtonProps) {
    return (
        <button
            className={clsx('px-2 py-2 rounded-l', props.bg)}
            onClick={props.onClick}
            title="Show children parts"
        >
            <FiChevronRight
                className={clsx('w-4 h-4 transition-all', props.open && 'transform rotate-90')}
            />
        </button>
    );
}
