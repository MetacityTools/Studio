import { StyleNode } from '@utils/types';

import { useStyle, useStyleKeychain } from '@shared/Context/hooks';

import { ColorPicker } from './ColorPicker';

function updateColor(style: StyleNode, keychain: string[], category: string, color: string) {
    let current = style;
    for (const key of keychain) {
        if (!current.children) return;
        current = current.children[key];
    }
    if (!current.style?.categories) return;
    current.style.categories[category] = color;
}

export function CategoryStyleEditor(props: { category: string; color: string }) {
    const { category, color } = props;
    const keychain = useStyleKeychain();
    const [style, setStyle] = useStyle();

    const handleChange = (color: string) => {
        if (!style || !keychain) return;
        updateColor(style, keychain, category, color);
        setStyle({ ...style });
    };

    return (
        <div className="bg-neutral-50 dark:bg-neutral-900 pt-4">
            <ColorPicker color={color} onChange={handleChange} />
        </div>
    );
}
