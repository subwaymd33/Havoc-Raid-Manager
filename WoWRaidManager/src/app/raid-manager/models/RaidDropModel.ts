export class RaidDropModel{
    raid_id:string;
    item_id:number;
    char_name: string;

    constructor(raid_id:string,item_id:number,char_name:string){
        this.raid_id = raid_id;
        this.item_id = item_id;
        this.char_name = char_name;
    }
}