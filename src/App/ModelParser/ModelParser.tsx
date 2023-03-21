import React from 'react';

import { useAppSelector } from '@redux/hooks';

import { ModelInput } from './steps/ModelInput';
import { Processing } from './steps/Processing';

export function ModelParser() {
    const models = useAppSelector((state) => state.models.raw);
    return (
        <>
            {models.length === 0 && <ModelInput />}
            {models.length > 0 && <Processing />}
        </>
    );
}
