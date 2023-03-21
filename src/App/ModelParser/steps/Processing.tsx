import { useAppSelector } from '@redux/hooks';

export function Processing() {
    const models = useAppSelector((state) => state.models.raw);
    console.log(models);

    //TODO processing

    return <div>Processing</div>;
}
