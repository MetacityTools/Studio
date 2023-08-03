import { hexToHsva, hsvaToHex } from '@uiw/color-convert';
import { Wheel } from '@uiw/react-color';
import clsx from 'clsx';
import React from 'react';

import { Input } from '@elements/Input';

export interface ColorPickerProps {
    color: string;
    onChange: (color: string) => void;
}

export function ColorPicker(props: ColorPickerProps) {
    const { color, onChange } = props;

    const [hsva, setHsva] = React.useState(hexToHsva(color));
    const [hex, setHex] = React.useState<string>(color);
    const [isValid, setIsValid] = React.useState<boolean>(true);

    React.useEffect(() => {
        onChange(hsvaToHex(hsva));
        if (hex !== hsvaToHex(hsva)) setHex(hsvaToHex(hsva));
    }, [hsva]);

    React.useEffect(() => {
        if (validateHexColor(hex)) {
            if (hex !== hsvaToHex(hsva)) setHsva(hexToHsva(hex));
            setIsValid(true);
        } else {
            setIsValid(false);
        }
    }, [hex]);

    const reset = () => {
        setHsva(hexToHsva('#eeeeee'));
    };

    const validateHexColor = (color: string) => {
        const regex = /^#([A-Fa-f0-9]{6})$/;
        return regex.test(color);
    };

    return (
        <div className="flex flex-col items-center">
            <Wheel color={hsva} onChange={(color) => setHsva(color.hsva)} onDoubleClick={reset} />
            <div className="px-8 w-full">
                <Input
                    type="range"
                    className=""
                    min={0}
                    max={100}
                    value={hsva.v}
                    onChange={(e) => setHsva((hsva) => ({ ...hsva, v: Number(e.target.value) }))}
                    onDoubleClick={reset}
                />
            </div>
            <div className="w-full">
                <Input
                    type="text"
                    className={clsx(
                        'w-full text-center',
                        isValid
                            ? 'bg-neutral-50 hover:bg-neutral-200 focus:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700'
                            : 'bg-red-50 hover:bg-red-200 focus:bg-red-200 dark:bg-red-900/50 dark:hover:bg-red-800/50 dark:focus:bg-red-800/50'
                    )}
                    min={0}
                    max={100}
                    value={hex}
                    onChange={(e) => {
                        setHex(e.target.value);
                    }}
                />
            </div>
        </div>
    );
}
