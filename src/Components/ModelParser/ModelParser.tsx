import React from 'react';
import { setTimeout } from 'timers/promises';

import { Renderer, Scene } from '@3D/3D';
import { Canvas } from '@3D/components/Canvas';
import { View } from '@3D/components/View';

import { Container } from '@components/Elements/Container';

import { ModelInput } from './Input';

export function ModelParser() {
    const [renderer, setRenderer] = React.useState(new Renderer());
    const [scene, setScene] = React.useState(new Scene());
    const [model, setModel] = React.useState(null);

    const handleModelParsed = (models: any) => {
        console.log(models);
        setModel(models);
    };

    return (
        <Container>
            <ModelInput onModelParsed={handleModelParsed} />
            <Canvas renderer={renderer} debugLayout className="w-full h-[500px]">
                <View scene={scene} left={0} top={0} width={50} height={100} />
            </Canvas>
        </Container>
    );
}
