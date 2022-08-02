export class MasterLootSheetModel{
    charName:string;
    char_rank:string;
    phase: number;
    item_id: number;
    slot:string;
    charUID: number;
    aquired: string;
    specUID: number;
    displayValue: number;


    constructor(charName:string, phase:number, item_id:number, slot:string, charUID:number, aquired:string, specUID:number, displayValue:number, char_rank:string){
        this.charName = charName;
        this.phase = phase;
        this.item_id=item_id;
        this.slot=slot;
        this.charUID = charUID;
        this.aquired = aquired;
        this.specUID = specUID;
        this.displayValue = displayValue;
        this.char_rank=char_rank;
    }
}