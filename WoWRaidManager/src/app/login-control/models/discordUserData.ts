export class discordUserData{
    id: string;
    username:string;
    discriminator:number;
    avatar: string;
    verified: string;
    flags: number;
    banner: string;
    accent_color: number;
    premium_type: number;
    public_flags: number;
    role:string='member';

    constructor(id:string, username:string,discriminator:number,avatar:string, verified:string, flags:number, banner:string, accent_color:number, premium_type:number, public_flags:number, role:string){
        this.id = id;
        this.username = username;
        this.discriminator=discriminator;
        this.avatar = avatar;
        this.verified = verified;
        this.flags = flags;
        this.banner = banner;
        this.accent_color = accent_color;
        this.premium_type = premium_type;
        this.public_flags = public_flags;
        this.role = role;
    }
}