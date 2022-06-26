export class Items{
    item_id:number;
    item_name:string;
    item_phase: number;
    item_slot: string;
    item_ranking: number;
    wowhead_link: string;
    item_source: string;
    raid: string;
    sheet_limit:number;
    is_offspec:boolean;

    constructor(item_id:number, item_name:string, item_phase:number, item_slot:string, item_ranking:number, wowhead_link: string, item_source:string, raid:string,sheet_limit:number){
        this.item_id = item_id;
        this.item_name = item_name;
        this.item_phase=item_phase;
        this.item_slot = item_slot;
        this.item_ranking = item_ranking;
        this.wowhead_link = wowhead_link;
        this.item_source = item_source;
        this.raid = raid;
        this.sheet_limit=sheet_limit;
        this.is_offspec=false;
    }
}