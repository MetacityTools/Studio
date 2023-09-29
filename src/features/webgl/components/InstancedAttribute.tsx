import { useEffect } from 'react';

import { useAttributes } from '@gl/hooks/useAttributes';
import { useGL } from '@gl/hooks/useGL';
import { Buffer } from '@gl/runtime/buffer';
import { InstancedAttribute as InstancedAttributeClass } from '@gl/runtime/instancedAttribute';

type InstancedAttributeProps = {
    name: string;
    buffer: Buffer;
    size: number;
    divisor: number;
    normalized?: boolean;
    stride?: number;
    offset?: number;
};

export const InstancedAttribute = (props: InstancedAttributeProps) => {
    const { name, buffer, size, divisor, normalized, stride, offset } = props;
    const [attributes, setAttributes] = useAttributes();
    const [gl] = useGL();

    useEffect(() => {
        const attr = new InstancedAttributeClass(buffer, size, divisor, normalized, stride, offset);
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
