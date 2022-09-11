export class sheetLockModel{
    char_name:string;
    phase:number;
    status:string;
    mainspec:number;
    offspec:number;

    constructor(char_name:string,phase:number, status:string, mainspec: number,offspec:number ){
        this.char_name = char_name;
        this.phase = phase;
        this.status = status;    
        this.mainspec = mainspec;    
        this.offspec = offspec;          
    }
}