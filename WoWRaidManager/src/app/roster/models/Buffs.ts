export class Buffs{
    buffCode:string;
    buffText:string;
    buffName: string;
    buffWeight: number;

    constructor(buffCode:string,buffText:string, buffName:string,buffWeight:number){
        this.buffCode = buffCode;
        this.buffText = buffText;
        this.buffName=buffName;
        this.buffWeight = buffWeight;
    }
}