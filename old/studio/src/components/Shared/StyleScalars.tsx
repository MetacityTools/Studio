import { Listbox } from '@headlessui/react';

import { Histogram, Scalars } from '@data/types';

import { useApplyStyle } from '@hooks/useApplyStyle';
import { useLastStyle } from '@hooks/useLastStyle';
import { useUpdateStyles } from '@hooks/useStyleUpdate';

import { StyleHistogram } from './StyleHistogram';

const colormaps = ['plasma', 'magma', 'inferno', 'viridis'];

export function StyleScalars(props: { scalars: Scalars; histogram: Histogram }) {
    const { scalars, histogram } = props;
    const updateStyles = useUpdateStyles();
    const [, applyStyle] = useLastStyle();

    const handleChange = (value: string) => {
        scalars.colormap = value;
        updateStyles();
        applyStyle();
    };

    return (
        <>
            <div className="px-2 py-4">
                <StyleHistogram scalars={scalars} histogram={histogram} />
            </div>
            <Listbox value={scalars.colormap} onChange={handleChange}>
                <Listbox.Button className="w-full button-list">
                    <span className="text-neutral-500 mr-2">Colormap:</span>
                    {scalars.colormap}
                </Listbox.Button>
                <Listbox.Options className="">
                    {colormaps.map((map) => (
                        <Listbox.Option
                            key={map}
                            value={map}
                            className="w-full button-list bg-neutral-100 dark:bg-neutral-900 text-center cursor-pointer"
                        >
                            {map}
                        </Listbox.Option>
                    ))}
                </Listbox.Options>
            </Listbox>
        </>
    );
}
