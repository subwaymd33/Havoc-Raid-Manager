
export class SessionModel {
    user_id: string;
    access_token: string;
    expiry_time: Date;
    refresh_token: string;

    constructor(user_id: string, access_token: string, expiry_time: Date, refresh_token: string) {
        this.user_id = user_id
        this.access_token = access_token;
        this.expiry_time = expiry_time;
        this.refresh_token = refresh_token;
    }
}