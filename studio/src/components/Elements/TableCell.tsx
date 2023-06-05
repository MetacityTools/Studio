import React from 'react';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import sanitizeHtml from 'sanitize-html';

export function TableCell(props: {
    value: string;
    onChange: (value: string) => void;
    className?: string;
}) {
    const handleChange = (e: React.FocusEvent<HTMLDivElement> | ContentEditableEvent) => {
        if (props.onChange) props.onChange(sanitizeHtml(e.currentTarget.innerHTML || ''));
    };

    const handleKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
        e.stopPropagation();
    };

    return (
        <ContentEditable
            className={props.className}
            onBlur={handleChange}
            onKeyDown={handleKey}
            onKeyUp={handleKey}
            tagName="td"
            onChange={() => {}}
            html={props.value}
        />
    );
}
