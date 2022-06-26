export class specData{
    specUID:number;
    spec: string;
    base_class: string;

    constructor(specUID:number,spec:string, base_class: string){
        this.specUID = specUID;
        this.spec = spec;
        this.base_class= base_class;
    }
}