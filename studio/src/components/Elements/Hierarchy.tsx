import clsx from 'clsx';
import { FiChevronRight } from 'react-icons/fi';

export function colorNodeBackground(selected: boolean, moving: boolean) {
    if (selected) return 'text-amber-800 bg-amber-300 hover:bg-amber-400 outline-none';
    if (moving) return 'text-blue-800 bg-blue-300 hover:bg-blue-200 outline-none';
    return 'text-neutral-800 bg-neutral-100 hover:bg-neutral-200 outline-none';
}

export type ButtonHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;

interface HierarchyButtonProps {
    onClick?: ButtonHandler;
    children: React.ReactNode;
    bg: string;
}

export function HierarchyButton(props: HierarchyButtonProps) {
    return (
        <button className={clsx(props.bg, 'px-4 py-2 last:rounded-r')} onClick={props.onClick}>
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
        <button className={clsx('px-2 py-2 rounded-l', props.bg)} onClick={props.onClick}>
            <FiChevronRight
                className={clsx('w-4 h-4 transition-all', props.open && 'transform rotate-90')}
            />
        </button>
    );
}
