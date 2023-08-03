import 'allotment/dist/style.css';
import React from 'react';

import { ColumnContainer, StretchContainer } from '@elements/Containers';
import { PanelTitle } from '@elements/PanelTitle';

import { StylePanel } from '@shared/StylePanel';

import { useClearStyle } from '@hooks/useClearStyle';
import { useGreyscale } from '@hooks/useGreyscale';
import { useLastStyle } from '@hooks/useLastStyle';

export function StyleSidePanel() {
    const clearStyle = useClearStyle();
    const [, applyLastStyle] = useLastStyle();
    const [, setGreyscale] = useGreyscale();

    React.useEffect(() => {
        applyLastStyle();
        setGreyscale(true);
        return () => {
            clearStyle();
            setGreyscale(false);
        };
    }, []);

    return (
        <ColumnContainer>
            <StretchContainer>
                <ColumnContainer>
                    <PanelTitle title="Style" />
                    <StylePanel />
                </ColumnContainer>
            </StretchContainer>
        </ColumnContainer>
    );
}
