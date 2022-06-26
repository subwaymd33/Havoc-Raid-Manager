import { Items } from "./items";

export class unassignedItemsBucket{
    slot:string;
    items: Items[];


    constructor(slot:string,item:Items[] ){
        this.slot = slot;
        this.items = item;
    }
}