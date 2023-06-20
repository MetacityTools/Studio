import { MetadataNode, MetadataType } from '@utils/types';

import { MetadataCategoryButton } from './MenuButton';
import { MetadataValueMixed, MetadataValueNumbers, MetadataValueStrings } from './Values';

export function MetadataMenu(props: {
    node: MetadataNode;
    onSelect: (node: MetadataNode) => void;
    keyChain: string[];
}) {
    const { node, onSelect, keyChain } = props;
    return (
        <div className="flex flex-col ml-4 bg-neutral-50 rounded-b-md border">
            {props.node.children &&
                Object.entries(props.node.children).map(([key, value]) => {
                    return (
                        <MetadataCategoryButton
                            key={key}
                            title={key}
                            node={value}
                            onSelect={onSelect}
                        />
                    );
                })}
            {props.node.values && (
                <>
                    {props.node.values.type === MetadataType.STRING && (
                        <MetadataValueStrings values={props.node.values} keyChain={keyChain} />
                    )}
                    {props.node.values.type === MetadataType.NUMBER && (
                        <MetadataValueNumbers node={props.node} keyChain={keyChain} />
                    )}
                    {props.node.values.type === MetadataType.MIXED && (
                        <MetadataValueMixed values={props.node.values} keyChain={keyChain} />
                    )}
                </>
            )}
        </div>
    );
}
