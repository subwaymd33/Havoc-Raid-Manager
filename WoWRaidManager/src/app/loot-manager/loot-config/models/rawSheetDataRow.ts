export class rawSheetDataRow{
    charUID:number;
    phase:number;
    item_id:number;
    slot:string;
    aquired:string;


    constructor(charUID:number, phase:number, item_id:number, slot:string, aquired:string){
        this.charUID = charUID;
        this.phase = phase;
        this.item_id=item_id;
        this.slot = slot;
        this.aquired = aquired;
    }
}