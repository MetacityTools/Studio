import { useEffect } from 'react';

import { useAttributes } from '@gl/hooks/useAttributes';
import { useGL } from '@gl/hooks/useGL';
import { ElementAttribute as ElementAttributeClass } from '@gl/runtime/elementAttribute';
import { ElementBuffer } from '@gl/runtime/elementBuffer';

type ElementAttributeProps = {
    name: string;
    buffer: ElementBuffer;
    size: number;
};

export const ElementAttribute = (props: ElementAttributeProps) => {
    const { name, buffer, size } = props;
    const [attributes, setAttributes] = useAttributes();
    const [gl] = useGL();

    useEffect(() => {
        const attr = new ElementAttributeClass(buffer, size);
        setAttributes((prev) => {
            const attributes = new Map(prev);
            attributes.set(name, attr);
            return attributes;
        });

        return () => {
            attr.dispose(gl);
            setAttributes((prev) => {
                const attributes = new Map(prev);
                attributes.delete(name);
                return attributes;
            });
        };
    }, [name, buffer]);

    return null;
};
