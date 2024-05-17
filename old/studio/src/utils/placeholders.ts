import { isEmpty } from './predicates';

export function getValueOrDefault(value: any) {
    return isEmpty(value) ? 'No data' : value;
}
