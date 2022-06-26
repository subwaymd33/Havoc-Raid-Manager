export class DiscordGuildData {
    id: string;
    name: string;
    verified: string;
    permissions: number;

    constructor(id: string, name: string, verified: string, permissions: number) {
        this.id = id;
        this.name = name;
        this.verified = verified;
        this.permissions = permissions
    }
}