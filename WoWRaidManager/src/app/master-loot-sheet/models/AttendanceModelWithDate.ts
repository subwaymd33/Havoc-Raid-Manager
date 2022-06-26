export class AttendanceModelWithDate {
    raid_id: string;
    raid_date: Date;
    char_name: string;
    present: boolean;
    used_time_off: boolean;

    constructor(raid_id: string, raid_date:Date, char_name: string, present: boolean, used_time_off: boolean) {
        this.raid_id = raid_id;
        this.raid_date = raid_date;
        this.char_name = char_name;
        this.present = present;
        this.used_time_off = used_time_off;
    }
}