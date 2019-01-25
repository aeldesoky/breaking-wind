
import { data, Turbine } from '@/store';
import {Finance } from 'financejs';
import wind from './resources/wind';

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

export default class Finances {
    public options: Array<Option> = [];
    public marr: number;
    public discountRate: number; 
    public outputDRate: number;
    public timespan: number;
    public lcoeMap: Array<LcoeMap> = [];
    public cashFlow: Array<number>;

    constructor(marr: number, discountRate: number, outputDRate: number){
        this.marr = marr;
        this.discountRate = discountRate;
        this.outputDRate = outputDRate;
        this.timespan = data.general.lifeSpan;

        this.cashFlow = new Array(data.general.lifeSpan);
    }

    public evaluate() {
        let finance = new Finance();

        data.turbines.forEach((turbine: Turbine) => {
            let lcoeMap: LcoeMap = <LcoeMap> {turbine: turbine};
            
             if (!turbine.disabled) {
                let initialCost = this.calculateOptionalCosts(turbine);
                initialCost += turbine.unitCost;
    
                for (let i = 0; i < data.wind.length; i++) {
                    for(let j = 0; j < data.wind[0].length; j++) {
                        if (data.depth[i][j] > 60 || 
                            wind[i][j] < turbine.nominalPowerAt ||
                            wind[i][j] >= turbine.cutOutWindSpeed) {
                            
                            lcoeMap.map[i][j] = Infinity;
                            continue;
                        }
                        else {
                            initialCost += data.depth[i][j] * turbine.costPerMeterDepth
                        }

                        this.cashFlow = new Array(this.timespan);

                        for (let i = 0; i < this.timespan - 1; i++) {
                            this.cashFlow[0] -= turbine.maintenance
                        }

                        let presentValue = finance.NPV(this.marr, initialCost, ...this.cashFlow);

                        if (data.general.budget < presentValue) {
                            lcoeMap.map[i][j] = Infinity;
                            continue;
                        }
                        else {
                            let totalPower = 0;
                            let leftOverPercentage = 1;
                            for (let k = 0; k < this.timespan; k++) {
                                totalPower += turbine.nominalPower * leftOverPercentage;
                                leftOverPercentage *= (1 - data.general.outputDecreasePerYear/100)
                            }

                            lcoeMap.map[i][j] = presentValue/totalPower
                        }
                    }
                }   
            }
            
            // lcoeMap:
        });
    }

    private calculateOptionalCosts(turbine: Turbine) {
        let yearlyHelicopterCost = 0;
        let MaintenanceVesselsCost = 0;
        let optionalCost = new Array(this.timespan);
        let finance = new Finance();

        if (data.optionalCosts.HeliCost != 0) {
            yearlyHelicopterCost = - (data.optionalCosts.HeliWeeksPerYear * data.optionalCosts.HeliCost);
            turbine.maintenance = turbine.maintenance * (1 - (data.optionalCosts.HeliWeeksPerYear * 0.05));
        }

        if (data.optionalCosts.MaintenanceVesselsCost != 0) {
            MaintenanceVesselsCost = - (data.optionalCosts.MaintenanceVesselsNum * data.optionalCosts.MaintenanceVesselsCost);

            if (data.optionalCosts.MaintenanceVesselsNum == 1) {
                turbine.maintenance = turbine.maintenance * (1 - 0.06);
            }

            if (data.optionalCosts.MaintenanceVesselsNum == 2) {
                turbine.maintenance = turbine.maintenance * (1 - 0.09)
            }
        }

        for (let i = 0; i < optionalCost.length; i++) {
            optionalCost[i] = (yearlyHelicopterCost -
                               data.optionalCosts.OffshoreLogisticCost -
                               data.optionalCosts.upgradeTeamCost);
        }

        return finance.NPV(this.marr, -MaintenanceVesselsCost, ...optionalCost);
    }
}

