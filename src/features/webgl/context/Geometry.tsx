import { createContext, useEffect, useState } from 'react';

import { useGL } from '@gl/hooks/useGL';
import { useRenderableGeometry } from '@gl/hooks/useRenderable';
import { Attribute } from '@gl/runtime/attribute';
import { Attributes, Geometry as GeometryClass } from '@gl/runtime/geometry';
import { InstancedAttribute } from '@gl/runtime/instancedAttribute';

interface GeometryProviderProps {
    attributes: Attributes;
    setAttributes: React.Dispatch<React.SetStateAction<Attributes>>;
}

export const context = createContext<GeometryProviderProps>({} as GeometryProviderProps);

type GeometryProps = {
    children: React.ReactNode;
};

export const Geometry = (props: GeometryProps) => {
    const { children } = props;
    const [gl] = useGL();
    const [geometry, setGeometry] = useRenderableGeometry();
    const [attributes, setAttributes] = useState<Attributes>(new Map());

    useEffect(() => {
        const geometry = new GeometryClass(attributes);
        setGeometry(geometry);
        return () => geometry.dispose(gl);
    }, [attributes]);

    return (
        <context.Provider
            value={{
                attributes,
                setAttributes,
            }}
        >
            {children}
        </context.Provider>
    );
};
