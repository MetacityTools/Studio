import { BiCategoryAlt } from 'react-icons/bi';
import { BsChevronRight } from 'react-icons/bs';

import { NodePath } from './utils';

export function MetadataBreadcrumbs(props: { path: NodePath; setPath: (path: NodePath) => void }) {
    const { path, setPath } = props;

    return (
        <div className="flex flex-row bg-neutral-50 ml-4 rounded-t-md border-t border-x">
            {path.map((node, i) => {
                return (
                    <button
                        className="pl-4  last:pr-4 py-2 flex flex-row items-center overflow-hidden overflow-ellipsis hover:text-amber-900 cursor-pointer first:rounded-t-md last:rounded-b-md first-letter:capitalize text-xs transition-colors"
                        onClick={() => setPath(path.slice(0, i + 1))}
                        key={node.key}
                    >
                        {i > 0 && <BsChevronRight className="mr-4" />}
                        <BiCategoryAlt className="mr-2" /> {node.key}
                    </button>
                );
            })}
        </div>
    );
}
