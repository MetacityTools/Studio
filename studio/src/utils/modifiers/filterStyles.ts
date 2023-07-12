import { StyleNode } from '@utils/types';

export function filterStyles(style: StyleNode, nodeKey: string, query: string) {
    if (!query) return style;
    if (nodeKey.toLowerCase().includes(query.toLowerCase())) return style;

    const copy: StyleNode = {};
    const children: { [key: string]: StyleNode } = {};

    if (style.children) {
        Object.entries(style.children).forEach(([key, child]) => {
            const filteredChild = filterStyles(child, key, query);
            if (filteredChild.children || filteredChild.style) children[key] = filteredChild;
        });
    }
    if (Object.keys(children).length > 0) copy.children = children;

    if (style.style) {
        if (style.style.categories) {
            const categories = Object.keys(style.style.categories).filter((category) =>
                category.toLowerCase().includes(query.toLowerCase())
            );
            if (categories.length > 0) copy.style = style.style;
        }
    }

    return copy;
}
