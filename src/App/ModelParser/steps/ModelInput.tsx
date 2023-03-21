import { useAppDispatch, useAppSelector } from '@redux/hooks';
import { addModels } from '@redux/models';

export function ModelInput() {
    const dispatch = useAppDispatch();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const files = formData.getAll('model') as File[];
        const contents = [] as any[];
        for (const file of files) {
            contents.push(await file.text());
        }
        dispatch(addModels(contents));
    };

    return (
        <div>
            <h1>Input your models</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="model">Model</label>
                <input type="file" id="model" name="model" multiple={true} />
                <input type="submit" value="Submit" />
            </form>
        </div>
    );
}
