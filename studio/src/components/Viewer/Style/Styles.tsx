import 'allotment/dist/style.css';
import React from 'react';

import { ColumnContainer, StretchContainer } from '@elements/Containers';
import { PanelTitle } from '@elements/PanelTitle';

import { useApplyStyle, useGrayscale, useLastStyle } from '@shared/Context/hooks';
import { StyleEditor } from '@shared/Style/StyleEditor';

export function StyleSidePanel() {
    const [, applyStyle, clearStyle] = useApplyStyle();
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
