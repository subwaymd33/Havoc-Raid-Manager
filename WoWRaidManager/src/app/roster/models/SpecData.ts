import { Buffs } from './Buffs';
export class SpecData {
    spec_name: string;
    role: string;
    buffs: Buffs[];

    constructor(spec_name: string, role: string, buffs: Buffs[]) {
        this.spec_name = spec_name;
        this.role = role;
        this.buffs = buffs;
    }

}