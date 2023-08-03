import clsx from 'clsx';

interface MenuButtonProps {
    children: React.ReactNode;
    tipTitle?: string;
    active?: boolean;
    disabled?: boolean;
    onClick?: () => void;
}

export function MenuButton(props: MenuButtonProps) {
    const { active, disabled } = props;

    return (
        <button
            className={clsx(
                'text-xs p-2 outline-none focus:outline-none',
                'first:border-l last:border-r border-y last:rounded-r-md first:rounded-l-md',
                active
                    ? disabled
                        ? 'active-no-hover'
                        : 'active'
                    : disabled
                    ? 'base-no-hover'
                    : 'base'
            )}
            onClick={props.onClick}
            title={props.tipTitle}
            disabled={props.disabled || false}
        >
            {props.children}
        </button>
    );
}

export function MenuGroup(props: { children: React.ReactNode }) {
    return <div className="flex flex-row rounded-md">{props.children}</div>;
}
