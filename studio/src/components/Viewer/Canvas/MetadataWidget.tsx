import { useStyle } from '@viewer/ViewerContext';

export function MetadataWidget() {
    const [style, keychain] = useStyle();

    if (!style) {
        return null;
    }

    return (
        <div className="absolute bottom-0 left-0 z-10 m-4">
            <div className="bg-white px-4 py-2 rounded border">{keychain}</div>
        </div>
    );
}
