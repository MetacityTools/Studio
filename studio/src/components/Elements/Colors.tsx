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

//Plain colors
export const colorPlainActiveBorder = clsx();
export const colorPlainActiveNoHover = 'text-amber-700 bg-amber-200';
export const colorPlainActive = clsx(
    colorPlainActiveNoHover,
    'hover:text-amber-800 hover:bg-amber-300',
    colorPlainActiveBorder,
    trans
);

export const colorPlainLightBorder = clsx();
export const colorPlainLightNoHover = 'text-amber-700 bg-amber-100';
export const colorPlainLightActive = clsx(
    colorPlainLightNoHover,
    'hover:text-amber-600 hover:bg-amber-200',
    colorPlainLightBorder
);

export const colorPlainBaseBorder = clsx();
export const colorPlainBaseNoHover = 'text-neutral-800 bg-white';
export const colorPlainBase = clsx(
    colorPlainBaseNoHover,
    'hover:text-amber-600 hover:bg-amber-200',
    colorPlainBaseBorder,
    trans
);

//base colors
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
