import 'allotment/dist/style.css';
import React from 'react';

import { ColumnContainer, StretchContainer } from '@elements/Containers';
import { PanelTitle } from '@elements/PanelTitle';

import { StyleEditor } from '@shared/Style/StyleEditor';

import { useClearStyle, useGrayscale, useLastStyle } from '@hooks/hooks';

export function StyleSidePanel() {
    const clearStyle = useClearStyle();
    const [, applyLastStyle] = useLastStyle();
    const [, setGrayscale] = useGrayscale();

    React.useEffect(() => {
        applyLastStyle();
        setGrayscale(true);
        return () => {
            clearStyle();
            setGrayscale(false);
        };
    }, []);

    return (
        <ColumnContainer>
            <StretchContainer>
                <ColumnContainer>
                    <PanelTitle title="Style" />
                    <StyleEditor />
                </ColumnContainer>
            </StretchContainer>
        </ColumnContainer>
    );
}
