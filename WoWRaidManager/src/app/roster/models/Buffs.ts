export class Buffs{
    buff_code:string;
    buff_text:string;
    buff_name: string;
    buff_weight: number;

    constructor(buff_code:string,buff_text:string, buff_name:string,buff_weight:number){
        this.buff_code = buff_code;
        this.buff_text = buff_text;
        this.buff_name=buff_name;
        this.buff_weight = buff_weight;
    }
}