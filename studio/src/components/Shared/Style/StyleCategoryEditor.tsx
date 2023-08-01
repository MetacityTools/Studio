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

function removeColor(style: StyleNode, keychain: string[], category: string) {
    let current = style;
    for (const key of keychain) {
        if (!current.children) return;
        current = current.children[key];
    }
    if (!current.style?.categories) return;
    delete current.style.categories[category];
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

    const handleRemove = () => {
        if (!style || !keychain) return;
        removeColor(style, keychain, category);
        setStyle({ ...style });
    };

    return (
        <div className="bg-neutral-50 dark:bg-neutral-900 pt-4">
            <ColorPicker color={color} onChange={handleChange} />
            <button className="button-list w-full" onClick={handleRemove}>
                Remove style
            </button>
        </div>
    );
}
