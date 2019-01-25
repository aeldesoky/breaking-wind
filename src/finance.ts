

class Option{
    public longitude: number = 0;
    public latitude: number =  0;
    public numberTurbines: number = 0;

    public lcoe: number = 0;

    constructor(longitude: number, latitude: number, lcoe: number, numberTurbines: number){
        this.longitude = longitude;
        this.latitude = latitude;
        this.lcoe = lcoe;
        this.numberTurbines = numberTurbines;
    }
}

export default class Finance {
    public options: Array<Option> = [];
    public marr: number;
    public discountRate: number; 
    public outputDRate: number;


    constructor(marr: number, discountRate: number, outputDRate: number){
        this.marr = marr;
        this.discountRate = discountRate;
        this.outputDRate = outputDRate;
    }
}

