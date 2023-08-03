import { Categories } from 'data/types';

import { ColorPicker } from '@elements/ColorPicker';

import { useStyle, useStyleKeychain } from '@hooks/hooks';

interface CategoryStyleEditorProps {
    category: string;
    color: string;
    categories: Categories;
}

export function CategoryStyleEditor(props: CategoryStyleEditorProps) {
    const { categories, category, color } = props;
    const keychain = useStyleKeychain();
    const [style, setStyle] = useStyle();

    const handleChange = (color: string) => {
        if (!style || !keychain) return;
        categories[category] = color;
        setStyle({ ...style });
    };

    return (
        <div className="bg-neutral-50 dark:bg-neutral-900 py-4">
            <ColorPicker color={color} onChange={handleChange} />
        </div>
    );
}
