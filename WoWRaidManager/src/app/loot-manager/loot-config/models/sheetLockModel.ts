export class sheetLockModel{
    char_name:string;
    phase:number;
    locked:string;
    mainspec:number;
    offspec:number;

    constructor(char_name:string,phase:number, locked:string, mainspec: number,offspec:number ){
        this.char_name = char_name;
        this.phase = phase;
        this.locked = locked;    
        this.mainspec = mainspec;    
        this.offspec = offspec;          
    }
}