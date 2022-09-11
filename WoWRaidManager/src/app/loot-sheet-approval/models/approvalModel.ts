export class approvalModel{
    char_name:string;
    phase: number;
    status:string;
    constructor(char_name:string,phase:number, status:string){
        this.char_name = char_name;
        this.phase = phase;
        this.status = status;
    }
}