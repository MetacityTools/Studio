import { useEffect } from 'react';

import { useAttributes } from '@gl/hooks/useAttributes';
import { useGL } from '@gl/hooks/useGL';
import { Attribute as AttributeClass } from '@gl/runtime/attribute';
import { Buffer } from '@gl/runtime/buffer';

type AttributeProps = {
    name: string;
    buffer: Buffer;
    size: number;
    normalized?: boolean;
    stride?: number;
    offset?: number;
};

export const Attribute = (props: AttributeProps) => {
    const { name, buffer, size, normalized, stride, offset } = props;
    const [attributes, setAttributes] = useAttributes();
    const [gl] = useGL();

    useEffect(() => {
        const attr = new AttributeClass(buffer, size, normalized, stride, offset);
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
    }, [name, buffer, normalized, stride, offset]);

    return null;
};
