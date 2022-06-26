export class sheetLockModel{
    charUID:number;
    phase:number;
    locked:string;
    mainspec:number;
    offspec:number;

    constructor(charUID:number,phase:number, locked:string, mainspec: number,offspec:number ){
        this.charUID = charUID;
        this.phase = phase;
        this.locked = locked;    
        this.mainspec = mainspec;    
        this.offspec = offspec;          
    }
}