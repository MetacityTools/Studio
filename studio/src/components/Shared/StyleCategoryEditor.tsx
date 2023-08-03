import { ColorPicker } from '@elements/ColorPicker';

import { Categories } from '@data/types';

import { useApplyStyle } from '@hooks/useApplyStyle';
import { useStyleKeychain } from '@hooks/useStyleKeychain';
import { useUpdateStyles } from '@hooks/useStyleUpdate';
import { useStyles } from '@hooks/useStyles';

interface CategoryStyleEditorProps {
    category: string;
    color: string;
    categories: Categories;
}

export function CategoryStyleEditor(props: CategoryStyleEditorProps) {
    const { categories, category, color } = props;
    const keychain = useStyleKeychain();
    const styles = useStyles();
    const updateStyles = useUpdateStyles();
    const [, applyStyle] = useApplyStyle();

    const handleChange = (color: string) => {
        if (!styles || !keychain) return;
        categories[category] = color;
        updateStyles({ ...styles });
        applyStyle(keychain);
    };

    return (
        <div className="bg-neutral-50 dark:bg-neutral-900 py-4">
            <ColorPicker color={color} onChange={handleChange} />
        </div>
    );
}
