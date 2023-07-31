import 'allotment/dist/style.css';
import React from 'react';

import { autoUpdateStyle } from '@utils/utils';

import { BottomRowContainer, ColumnContainer, StretchContainer } from '@elements/Containers';
import { PanelTitle } from '@elements/PanelTitle';

import {
    useApplyStyle,
    useGrayscale,
    useLastStyle,
    useMetadata,
    useStyle,
} from '@shared/Context/hooks';

import { StyleEditor } from '../../../Shared/Style/StyleEditor';

export function StyleSidePanel() {
    const [style, setStyle] = useStyle();
    const [_, __, clearStyle] = useApplyStyle();
    const [___, applyLastStyle] = useLastStyle();
    const [, setGrayscale] = useGrayscale();
    const [metadata] = useMetadata();

    React.useEffect(() => {
        applyLastStyle();
        setGrayscale(true);
        return () => {
            clearStyle();
            setGrayscale(false);
        };
    }, []);

    const handleAutoStyle = () => {
        const updated = autoUpdateStyle(metadata, style);
        setStyle(updated);
    };

    return (
        <ColumnContainer>
            <StretchContainer>
                <ColumnContainer>
                    <PanelTitle title="Style" />
                    <StyleEditor />
                    <BottomRowContainer>
                        <button
                            onClick={handleAutoStyle}
                            className="text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
                        >
                            Add missing styles
                        </button>
                    </BottomRowContainer>
                </ColumnContainer>
            </StretchContainer>
        </ColumnContainer>
    );
}
