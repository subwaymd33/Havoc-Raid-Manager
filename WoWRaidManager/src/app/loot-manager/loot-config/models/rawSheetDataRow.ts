export class rawSheetDataRow{
    char_name:string;
    phase:number;
    item_id:number;
    slot:string;
    aquired:string;


    constructor(char_name:string, phase:number, item_id:number, slot:string, aquired:string){
        this.char_name = char_name;
        this.phase = phase;
        this.item_id=item_id;
        this.slot = slot;
        this.aquired = aquired;
    }
}