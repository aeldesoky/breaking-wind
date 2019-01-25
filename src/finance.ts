
import { data, Turbine } from '@/store';


// valid option
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

interface LcoeMap {
    turbine: Turbine;
    map: number[][];
}

export default class Finance {
    public options: Array<Option> = [];
    public marr: number;
    public discountRate: number; 
    public outputDRate: number;
    public timespan: number;
    public lcoeMap: Array<LcoeMap> = [];
    public cashFlow: Array<number>;

    constructor(marr: number, discountRate: number, outputDRate: number, timespan: number){
        this.marr = marr;
        this.discountRate = discountRate;
        this.outputDRate = outputDRate;
        this.timespan = timespan;

        this.cashFlow = new Array(timespan);
    }

    public evaluate() {
        data.turbines.forEach((turbine: Turbine) => {
            // lcoeMap: 
        });
    }

    private calculateOptionalCosts(turbine: Turbine) {
        let yearlyHelicopterCost = 0;
        let MaintenanceVesselsCost = 0;

        if (data.optionalCosts.HeliCost != 0) {
            yearlyHelicopterCost = data.optionalCosts.HeliWeeksPerYear * data.optionalCosts.HeliCost;
            turbine.maintenance = turbine.maintenance * (1 - (data.optionalCosts.HeliWeeksPerYear * 0.05));
        }

        if (data.optionalCosts.MaintenanceVesselsCost != 0) {
            MaintenanceVesselsCost = data.optionalCosts.MaintenanceVesselsNum * data.optionalCosts.MaintenanceVesselsCost;

            if (data.optionalCosts.MaintenanceVesselsNum == 1) {
                turbine.maintenance = turbine.maintenance * (1 - 0.06);
            }

            if (data.optionalCosts.MaintenanceVesselsNum == 2) {
                turbine.maintenance = turbine.maintenance * (1 - 0.09)
            }
        }

        for (let i = 0; i < this.cashFlow.length; i++) {
            if (i == 0) {
                this.cashFlow[i] += MaintenanceVesselsCost;
            }
            else {
                this.cashFlow[i] = this.cashFlow[i] + 
                                   yearlyHelicopterCost + 
                                   data.optionalCosts.OffshoreLogisticCost +
                                   data.optionalCosts.upgradeTeamCost;
            }
        }
    }
}

