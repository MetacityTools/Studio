import React from 'react';
import { setTimeout } from 'timers/promises';

import { Renderer, Scene } from '@3D/3D';

import { Container } from '@components/Elements/Container';
import { Canvas } from '@components/Renderer/Canvas';
import { View } from '@components/Renderer/View';

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
            <Canvas renderer={renderer} debugLayout>
                <View scene={scene} left={0} top={0} width={100} height={100} />
            </Canvas>
        </Container>
    );
}
