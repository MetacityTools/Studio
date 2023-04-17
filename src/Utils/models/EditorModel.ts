import { ModelMetadata } from 'types';

import * as GL from '@bananagl/bananagl';

export class EditorModel extends GL.Model {
    protected data_: ModelMetadata = {
        name: 'Default Model Name',
        data: {},
    };

    set data(data: { [name: number]: any }) {
        for (const name in data) {
            const value = data[name];
            if (value === this.data_.data[name]) continue;
            this.data_.data[name] = value;
        }
    }

    set name(name: string) {
        this.data_.name = name;
    }

    get name() {
        return this.data_.name;
    }

    get data() {
        return this.data_.data;
    }

    get imported() {
        return true;
    }
}
