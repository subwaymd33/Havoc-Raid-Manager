export class lootSheetInitiateModel{

    className:string;
    primarySpecName:string;
    offSpecName: string;
    charName:string;

    constructor(className:string,primarySpecName:string, offSpecName:string, charName:string){
        this.className = className;
        this.primarySpecName = primarySpecName;
        this.offSpecName=offSpecName;
        this.charName=charName;
    }
}