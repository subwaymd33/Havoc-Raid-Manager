import { AttendanceModel } from "./AttendanceModel";
import { RaidDropModel } from "./RaidDropModel";

export class RaidModel{
    raid_id:string;
    raid_date:Date;
    raid_name: string;
    drops:RaidDropModel[] = [];
    attendance:AttendanceModel[] = [];
    constructor(raid_id:string,raid_date:Date, raid_name:string){
        this.raid_id = raid_id;
        this.raid_date = raid_date;
        this.raid_name = raid_name;
    }
}