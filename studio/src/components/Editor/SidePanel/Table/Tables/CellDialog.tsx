import React from 'react';

import { OverlayDialog } from '@elements/Dialog';

interface CellDialogProps {
    isOpen: boolean;
    content: string;
    onClose: (content: string) => void;
}

export function CellDialog(props: CellDialogProps) {
    const { isOpen, content, onClose } = props;
    const textRef = React.useRef<HTMLTextAreaElement>(null);

    const handleClose = () => {
        if (textRef.current) {
            onClose(textRef.current.value);
        }
    };

    return (
        <OverlayDialog isOpen={isOpen} onClose={handleClose}>
            <textarea
                ref={textRef}
                defaultValue={content}
                className=" h-64 m-4 p-2 text-sm bg-gray-100 resize-none"
            />
        </OverlayDialog>
    );
}
