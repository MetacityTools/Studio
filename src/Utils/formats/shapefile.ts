//worker to parse models
import { ShapefileData, UserInputModel } from 'types';

self.onmessage = (e) => {
    process_(e.data);
};

/*async function process_(model: UserInputModel) {
    const data = model.data as ShapefileData;
    const files = [];
    files.push(bufferArrayToFile(data.shp, model.name.replace('.shp', '.shp')));
    //if (data.dbf) files.push(bufferArrayToFile(data.dbf, model.name.replace('.shp', '.dbf')));
    //if (data.shx) files.push(bufferArrayToFile(data.shx, model.name.replace('.shp', '.shx')));
    //if (data.prj) files.push(bufferArrayToFile(data.prj, model.name.replace('.shp', '.prj')));
    //if (data.cpg) files.push(bufferArrayToFile(data.cpg, model.name.replace('.shp', '.cpg')));

    const batchIterators = await load(files[0], ShapefileLoader, {
        worker: false,
    });

    console.log('batchIterators', batchIterators);
}
*/

async function process_(model: UserInputModel) {
    const data = model.data as ShapefileData;

    if (!data.shp || !data.shx || !data.dbf || !data.cpg) throw new Error('Missing required files');

    const shp = bufferArrayToFile(data.shp, model.name.replace('.shp', '.shp'));
    const shx = bufferArrayToFile(data.shx, model.name.replace('.shp', '.shx'));
    const dbf = bufferArrayToFile(data.dbf, model.name.replace('.shp', '.dbf'));
    const cpg = bufferArrayToFile(data.cpg, model.name.replace('.shp', '.cpg'));
}

function bufferArrayToFile(buffer: ArrayBuffer, name: string): File {
    return new File([buffer], name);
}
