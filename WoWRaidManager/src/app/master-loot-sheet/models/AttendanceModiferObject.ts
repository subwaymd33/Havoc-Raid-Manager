export class AttendanceModiferObject {
    char_name: string;
    weeks_to_check_against: number;
    weeks_present_for_raids: number;

    constructor(char_name: string, weeks_to_check_against:number, weeks_present_for_raids: number) {
        this.char_name = char_name;
        this.weeks_to_check_against = weeks_to_check_against;
        this.weeks_present_for_raids = weeks_present_for_raids;
    }
}