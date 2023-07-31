import { hexToHsva, hsvaToHex } from '@uiw/color-convert';
import { Wheel } from '@uiw/react-color';
import React from 'react';

import { Input } from '@elements/Input';

export interface ColorPickerProps {
    color: string;
    onChange: (color: string) => void;
}

export function ColorPicker(props: ColorPickerProps) {
    const { color, onChange } = props;

    const [hsva, setHsva] = React.useState(hexToHsva(color));

    React.useEffect(() => {
        onChange(hsvaToHex(hsva));
    }, [hsva]);

    return (
        <div className="flex flex-col items-center">
            <Wheel color={hsva} onChange={(color) => setHsva(color.hsva)} />
            <div className="px-8 w-full">
                <Input
                    type="range"
                    className=""
                    min={0}
                    max={100}
                    value={hsva.v}
                    onChange={(e) => setHsva((hsva) => ({ ...hsva, v: Number(e.target.value) }))}
                />
            </div>
            <div>{hsvaToHex(hsva)}</div>
        </div>
    );
}
