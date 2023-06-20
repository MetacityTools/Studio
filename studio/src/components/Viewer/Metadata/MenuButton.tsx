import { BiCategoryAlt } from 'react-icons/bi';

import { MetadataNode } from '@utils/types';

export function MetadataCategoryButton(props: {
    title: string;
    node: MetadataNode;
    onSelect: (node: MetadataNode) => void;
}) {
    const { title, node, onSelect } = props;
    return (
        <button
            className="px-4 py-2 flex flex-row items-center overflow-hidden overflow-ellipsis hover:bg-amber-200 hover:text-amber-900 cursor-pointer last:rounded-b-md first-letter:capitalize text-left max-w-[35rem] transition-colors"
            onClick={() => onSelect?.(node)}
        >
            <div>
                <BiCategoryAlt className="mr-2" />
            </div>
            <div>{title}</div>
        </button>
    );
}
