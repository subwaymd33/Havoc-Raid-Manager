export class CharacterAttendancePercentageModel {
    char_name: string;
    percentage: number;
    bonus:number;
    tiebreaker:boolean;
    rankBonus:number;

    constructor(char_name: string, percentage:number, tiebreaker:boolean,rankBonus:number) {
        this.char_name = char_name;
        this.percentage = percentage;
        if (percentage >=.9){
            this.bonus=10
        }else if(percentage>=.8 && percentage<.9){
            this.bonus=7
        }else if(percentage>=.65 && percentage<.8){
            this.bonus=4
        }else{
            this.bonus=0
        }
        this.tiebreaker=tiebreaker;
        this.rankBonus = rankBonus;
    }
}