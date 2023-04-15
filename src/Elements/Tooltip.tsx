import React from 'react';

//displays a tooltip when the mouse hovers over the original element
//the position of the tooltip is top, left, right, or bottom of the element
//the tooltip is displayed on mouse in of the original element
//the tooltip is hidden on mouse out of the original element
//the original element is not modified in any way, it can be part of a list, etc.

export interface TooltipProps {
    content: React.ReactNode;
    children: React.ReactNode;
    position: 'top' | 'left' | 'right' | 'bottom';
}

export function Tooltip(props: TooltipProps) {
    const { content, position } = props;

    const [show, setShow] = React.useState(false);

    return (
        <div
            className="relative"
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
        >
            {props.children}
            {show && (
                <div
                    className={`absolute ${
                        position === 'top'
                            ? 'top-full left-[-4px] text-left'
                            : position === 'left'
                            ? 'left-full top-0'
                            : position === 'right'
                            ? 'right-[calc(100%+8px)] top-0 text-right'
                            : 'bottom-full left-2'
                    } p-2 text-neutral-600 rounded-md`}
                >
                    {content}
                </div>
            )}
        </div>
    );
}
