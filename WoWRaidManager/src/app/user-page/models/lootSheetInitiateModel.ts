export class lootSheetInitiateModel{

    className:string;
    primarySpecName:string;
    offSpecName: string;
    charName:string;
    rank:string;

    constructor(className:string,primarySpecName:string, offSpecName:string, charName:string, rank:string){
        this.className = className;
        this.primarySpecName = primarySpecName;
        this.offSpecName=offSpecName;
        this.charName=charName;
        this.rank=rank;
    }
}