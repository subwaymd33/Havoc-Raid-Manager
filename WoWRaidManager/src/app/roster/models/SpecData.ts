import { Buffs } from './Buffs';
export class SpecData {
    specName: string;
    role: string;
    buffs: Buffs[];

    constructor(specName: string, role: string, buffs: Buffs[]) {
        this.specName = specName;
        this.role = role;
        this.buffs = buffs;
    }

}