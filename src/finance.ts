
import { data } from '@/store';

class Option {
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
    public budget: number;


    constructor(marr: number, discountRate: number, outputDRate: number, budget: number){
        this.marr = marr;
        this.discountRate = discountRate;
        this.outputDRate = outputDRate;
        this.budget = budget;
    }

    public evaluate() {

    }

    public calculateOptionalCosts() {
        if (data.optionalCosts.HeliCost != 0) {

        }

        if (data.optionalCosts.MaintenanceVesselsCost != 0) {

        }

        if (data.optionalCosts.OffshoreLogisticCost != 0) {

        }

        if (data.optionalCosts.DiagnosticTeamCost != 0) {
            
        }
    }
}

