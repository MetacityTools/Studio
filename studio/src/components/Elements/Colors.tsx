import clsx from 'clsx';

export const trans = 'transition-colors';

//VIVID colors
export const colorVividActiveBorder = clsx('border-amber-300 hover:border-amber-400', trans);
export const colorVividActiveNoHover = 'text-amber-700 bg-amber-200';
export const colorVividActive = clsx(
    colorVividActiveNoHover,
    'hover:text-amber-800 hover:bg-amber-300',
    colorVividActiveBorder,
    trans
);

export const colorVividLightBorder = clsx('border-amber-300 hover:border-amber-400', trans);
export const colorVividLightNoHover = 'text-amber-700 bg-amber-100';
export const colorLightActive = clsx(
    colorVividLightNoHover,
    'hover:text-amber-600 hover:bg-amber-200',
    colorVividLightBorder
);

export const colorVividBaseBorder = clsx('border-neutral-200 hover:border-amber-400', trans);
export const colorVividBaseNoHover = 'text-neutral-800 bg-neutral-100';
export const colorVividBase = clsx(
    colorVividBaseNoHover,
    'hover:text-amber-600 hover:bg-amber-200',
    colorVividBaseBorder,
    trans
);

export const colorActiveBorder = clsx('border-amber-300 hover:border-amber-400', trans);
export const colorActiveNoHover = 'text-amber-600 bg-amber-100';
export const colorActive = clsx(colorActiveNoHover, 'hover:bg-amber-200', colorActiveBorder, trans);

export const colorBaseBorder = clsx('border-neutral-200 hover:border-amber-400', trans);
export const colorBaseNoHover = 'text-neutral-600 bg-white';
export const colorBase = clsx(
    colorBaseNoHover,
    'hover:text-amber-600 hover:bg-amber-200',
    colorBaseBorder,
    trans
);
