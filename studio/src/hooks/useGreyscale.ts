import React from 'react';

import { context } from '@context/ViewContext';

export function useGreyscale(): [boolean, React.Dispatch<React.SetStateAction<boolean>>] {
    const ctx = React.useContext(context);
    return [ctx.greyscale, ctx.setGreyscale];
}
