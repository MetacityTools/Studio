import React from 'react';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import sanitizeHtml from 'sanitize-html';

export const cellCls = 'border-r border-b whitespace-pre px-2 h-full';

export function Cell(props: { value: string; onChange: (value: string) => void }) {
    const handleChange = (e: React.FocusEvent<HTMLDivElement> | ContentEditableEvent) => {
        if (props.onChange) props.onChange(sanitizeHtml(e.currentTarget.innerHTML || ''));
    };

    const handleKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
        e.stopPropagation();
    };

    return (
        <ContentEditable
            className={cellCls}
            onBlur={handleChange}
            onKeyDown={handleKey}
            onKeyUp={handleKey}
            tagName="td"
            onChange={() => {}}
            html={props.value}
        />
    );
}
