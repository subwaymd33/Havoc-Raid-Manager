import { SpecData } from './SpecData';
export class Characters {
    charName: string;
    rank: string;
    mainsCharacterName: string;
    primarySpec: SpecData;
    offSpec: SpecData;
    userOwner:string;
    

    constructor(charName: string, rank: string, mainsCharacterName:string, primarySpec: SpecData, offSpec: SpecData) {
        this.charName = charName;
        this.rank = rank;
        this.mainsCharacterName = mainsCharacterName
        this.primarySpec = primarySpec;
        this.offSpec = offSpec;
    }

}