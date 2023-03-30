import { IFCManager } from './IFC/components/IFCManager';

export function parse(ifcManager: IFCManager, buffer: ArrayBuffer) {
    return ifcManager.parse(buffer);
}
