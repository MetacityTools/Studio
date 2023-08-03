import { context } from '@context/ViewContext';
import React from 'react';

export function useModels() {
    const ctx = React.useContext(context);
    return ctx.models;
}
