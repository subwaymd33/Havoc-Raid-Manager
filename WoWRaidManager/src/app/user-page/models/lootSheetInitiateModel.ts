export class lootSheetInitiateModel{

    className:string;
    primarySpecName:string;
    offSpecName: string;
    char_name:string;
    rank:string;

    constructor(className:string,primarySpecName:string, offSpecName:string, char_name:string, rank:string){
        this.className = className;
        this.primarySpecName = primarySpecName;
        this.offSpecName=offSpecName;
        this.char_name=char_name;
        this.rank=rank;
    }
}