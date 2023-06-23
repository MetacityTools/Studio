import React from 'react';

import { useMetadata } from '@utils/utils';

import { findKeychain } from '@viewer/Context/Utils';
import { useStyle } from '@viewer/Context/ViewerContext';

import { MetadataTitle } from '@shared/Metadata/MetadataTitle';

export function InfoPanel() {
    const [style] = useStyle();
    const metadata = useMetadata();
    const values = style?.values;
    if (!style || !values) return null;

    const keychain = findKeychain(metadata, style);
    if (!keychain) return null;

    //TODO setup styling

    return (
        <div className="absolute bottom-0 left-0 z-10 m-4 px-4 py-2 bg-white rounded-md">
            <div className="flex flex-row intex-center text-xs">
                <MetadataTitle categories={keychain} />
            </div>
            <div>
                {values.values.map((value: any) => {
                    return <div className="flex flex-row intex-center text-xs">{value}</div>;
                })}
            </div>
        </div>
    );
}
