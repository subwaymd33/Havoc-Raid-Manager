export class MasterLootSheetModel{
    char_name:string;
    char_rank:string;
    phase: number;
    item_id: number;
    slot:string;
    aquired: string;
    spec_uid: number;
    displayValue: number;


    constructor(char_name:string, phase:number, item_id:number, slot:string, aquired:string, spec_uid:number, displayValue:number, char_rank:string){
        this.char_name = char_name;
        this.phase = phase;
        this.item_id=item_id;
        this.slot=slot;
        this.aquired = aquired;
        this.spec_uid = spec_uid;
        this.displayValue = displayValue;
        this.char_rank=char_rank;
    }
}