import * as moment from "moment";

export class RaidWeekModel {
    week_id: number;
    start_dt: Date;
    end_dt: Date;
    req_raids_for_attendance: number;
    alt_req_raids_for_attendance: number;
    

    constructor(week_id: number, start_dt: Date, end_dt: Date, req_raids_for_attendance: number, alt_req_raids_for_attendance:number) {
        this.week_id = week_id;
        this.start_dt = moment(start_dt).toDate();
        this.end_dt = moment(end_dt).toDate();
        this.req_raids_for_attendance = req_raids_for_attendance;
        this.alt_req_raids_for_attendance = alt_req_raids_for_attendance;
    }
}