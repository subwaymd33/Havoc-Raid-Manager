import { SpecData } from './SpecData';
export class Characters {
    charName: string;
    main: boolean;
    mainsCharacterName: string;
    primarySpec: SpecData;
    offSpec: SpecData;
    

    constructor(charName: string, main: boolean, mainsCharacterName:string, primarySpec: SpecData, offSpec: SpecData) {
        this.charName = charName;
        this.main = main;
        this.mainsCharacterName = mainsCharacterName
        this.primarySpec = primarySpec;
        this.offSpec = offSpec;
    }

}