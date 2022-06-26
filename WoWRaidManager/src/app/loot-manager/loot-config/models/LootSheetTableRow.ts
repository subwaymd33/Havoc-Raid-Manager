import { Items } from "./items";

export class LootSheetTableRow{
    slot:string;
    column_one_id: string;
    column_two_id: string;
    column_one_item_list: Items[];
    column_two_item_list: Items[];
    hideError:boolean = true;
    errors: string[];

    constructor(slot:string,column_one_id:string, column_two_id:string, column_one_item_list: Items[],column_two_item_list: Items[], hideError:boolean,errors:string[] ){
        this.slot = slot;
        this.column_one_id = column_one_id;
        this.column_two_id=column_two_id;
        this.column_one_item_list=column_one_item_list;
        this.column_two_item_list = column_two_item_list;
        this.hideError = hideError;
        this.errors = errors;
    }
}