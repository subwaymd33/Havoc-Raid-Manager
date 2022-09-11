import { SpecData } from './SpecData';
export class Characters {
    char_name: string;
    rank: string;
    mains_name: string;
    primarySpec: SpecData;
    offSpec: SpecData;
    user_id:string;
    

    constructor(char_name: string, rank: string, mains_name:string, primarySpec: SpecData, offSpec: SpecData) {
        this.char_name = char_name;
        this.rank = rank;
        this.mains_name = mains_name
        this.primarySpec = primarySpec;
        this.offSpec = offSpec;
    }

}