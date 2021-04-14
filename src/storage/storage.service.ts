import { environments } from './../environment';
import { Injectable } from '@nestjs/common';
const fs = require('fs');

@Injectable()
export class StorageService {

    private storages: StorageCabinets = {};

    public init(storageKey: string): void {
        this.storages[storageKey] = new StorageCabinet(storageKey);
    }

    public get(storageKey: string): StorageCabinet {
        return this.storages[storageKey];
    }

}

export class StorageCabinets {
    [key: string]: StorageCabinet;
}

export class StorageCabinet {
    private key: string;
    public values: any = {};

    constructor(storageKey: string) {
        this.key = storageKey;
        this.load();
    }

    load() {
        if(!fs.existsSync(environments.storageLocation + '/' + this.key + '.json')) {
            try {
                fs.mkdirSync(environments.storageLocation);
            } catch(e){}
            fs.writeFileSync(environments.storageLocation + '/' +  this.key + '.json', '{}');
            this.values = {};
        } else {
            this.values = JSON.parse(fs.readFileSync(environments.storageLocation + '/' + this.key + '.json'));
        }
    }

    save() {
        fs.writeFileSync(environments.storageLocation + '/' +  this.key + '.json', JSON.stringify(this.values));
    }

    getKey(): string {
        return this.key;
    }
}