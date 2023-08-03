import React from 'react';

import { context } from '@context/ViewContext';

export function useDarkmode(): [boolean, React.Dispatch<React.SetStateAction<boolean>>] {
    const ctx = React.useContext(context);
    return [ctx.darkmode, ctx.setDarkmode];
}
