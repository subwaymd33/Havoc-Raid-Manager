export class specData{
    spec_uid:number;
    spec: string;
    base_class: string;

    constructor(spec_uid:number,spec:string, base_class: string){
        this.spec_uid = spec_uid;
        this.spec = spec;
        this.base_class= base_class;
    }
}