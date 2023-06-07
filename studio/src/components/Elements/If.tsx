export interface BooleanNodeProps {
    cond: any;
    children: React.ReactNode;
}

export function If(props: BooleanNodeProps) {
    //if any props are false then return null
    const { cond } = props;
    if (cond) return <>{props.children}</>;
    return null;
}
