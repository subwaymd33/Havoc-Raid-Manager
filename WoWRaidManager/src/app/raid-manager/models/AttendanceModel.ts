export class AttendanceModel {
    raid_id: string;
    char_name: string;
    present: boolean;
    used_time_off: boolean;

    constructor(raid_id: string, char_name: string, present: boolean, used_time_off: boolean) {
        this.raid_id = raid_id;
        this.char_name = char_name;
        this.present = present;
        this.used_time_off = used_time_off;
    }
}