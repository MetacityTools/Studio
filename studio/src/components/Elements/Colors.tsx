import clsx from 'clsx';

export const trans = 'transition-colors';

//Base colors used for buttons and tabs
export const colorActiveBorder = clsx('border-amber-300 hover:border-amber-400', trans);
export const colorActiveText = 'text-amber-600';
export const colorActiveNoHover = clsx(colorActiveText, 'bg-amber-100');
export const colorActive = clsx(colorActiveNoHover, 'hover:bg-amber-200', colorActiveBorder, trans);
export const colorActiveNoBackground = clsx(colorActiveText, colorActiveBorder, trans);

export const colorBaseBorder = clsx('border-neutral-200 hover:border-amber-400', trans);
export const colorBaseText = 'text-neutral-600';
export const colorBaseNoHover = clsx(colorBaseText, 'bg-white');
export const colorBaseNoBackground = clsx(
    colorBaseNoHover,
    colorBaseBorder,
    'hover:text-amber-600',
    trans
);
export const colorBase = clsx(colorBaseNoBackground, 'hover:bg-amber-200', trans);

//Hierarchy colors used for hierarchies and lists
export const colorHierarchy = 'hover:bg-neutral-100';
export const colorHierarchyPart = 'bg-transparent border-inherit text-inherit bg-inherit';
export const colorHierarchyActive = 'bg-amber-100 text-amber-600 hover:bg-amber-200';
