
import { data, Turbine, Result } from '@/store';
import { Finance } from 'financejs';
import { copy } from '@/utils';

// valid option
class Option {
    public longitude: number = 0;
    public latitude: number =  0;
    public numberTurbines: number = 0;

    public lcoe: number = 0;

    constructor(longitude: number, latitude: number, lcoe: number, numberTurbines: number) {
        this.longitude = longitude;
        this.latitude = latitude;
        this.lcoe = lcoe;
        this.numberTurbines = numberTurbines;
    }
}

// tslint:disable-next-line:max-classes-per-file
export default class Finances {
    public evaluate() {
        const finance = new Finance();

        const timespan = data.general.lifeSpan;
        const outputDRate = data.general.outputDecreasePerYear;
        const discountRate = data.general.discountRate;

        const results = data.turbines.map((turbine: Turbine) => {
            const lcoeMap: Result = { turbine: copy(turbine), lcoes: [] };
            if (turbine.disabled) {
                return;
            }

            let initialCost = this.calculateOptionalCosts(turbine);
            initialCost += turbine.unitCost;

            const cashFlow = Array(turbine.timeToConstruct).fill(0);
            for (let i = 0; i < timespan; i++) {
              cashFlow.push(-turbine.maintenance);
            }

            const energyFlow = Array(turbine.timeToConstruct).fill(0);
            for (let i = 0; i < timespan; i++) {
              energyFlow.push(turbine.nominalPower * (1 - outputDRate / 100) ** i * 365 * 24);
            }

            const presentEnergy = finance.NPV(discountRate, 0, ...energyFlow);

            for (let i = 0; i < data.wind.length; i++) {
                lcoeMap.lcoes[i] = [];
                for (let j = 0; j < data.wind[0].length; j++) {
                    if (data.depth[i][j] > 60 ||
                        data.wind[i][j] < turbine.nominalPowerAt ||
                        data.wind[i][j] >= turbine.cutOutWindSpeed) {

                        lcoeMap.lcoes[i][j] = Infinity;
                        continue;
                    }

                    // Initial investment is supposed to be negative
                    const pointInitialCost = -initialCost - data.depth[i][j] * turbine.costPerMeterDepth;
                    const presentValue = finance.NPV(discountRate, pointInitialCost, ...cashFlow);
                    if (data.general.budget < Math.abs(presentValue)) {
                        lcoeMap.lcoes[i][j] = Infinity;
                        continue;
                    }

                    lcoeMap.lcoes[i][j] = Math.abs(presentValue / presentEnergy);
                }
            }

            return lcoeMap;
        });

        const filtered = results.filter((result) => result) as Result[];
        data.addResult({
            date: new Date(),
            options: copy(data.general),
            results: filtered,
        });
    }

    private calculateOptionalCosts(turbine: Turbine) {
        turbine = copy(turbine);

        let yearlyHelicopterCost = 0;
        let MaintenanceVesselsCost = 0;
        const optionalCost = new Array(data.general.lifeSpan);
        const finance = new Finance();

        if (data.optionalCosts.HeliCost !== 0) {
            yearlyHelicopterCost = - (data.optionalCosts.HeliWeeksPerYear * data.optionalCosts.HeliCost);
            turbine.maintenance = turbine.maintenance * (1 - (data.optionalCosts.HeliWeeksPerYear * 0.05));
        }

        if (data.optionalCosts.MaintenanceVesselsCost !== 0) {
            MaintenanceVesselsCost = - (data.optionalCosts.MaintenanceVesselsNum * data.optionalCosts.MaintenanceVesselsCost);

            if (data.optionalCosts.MaintenanceVesselsNum === 1) {
                turbine.maintenance = turbine.maintenance * (1 - 0.06);
            }

            if (data.optionalCosts.MaintenanceVesselsNum === 2) {
                turbine.maintenance = turbine.maintenance * (1 - 0.09);
            }
        }

        for (let i = 0; i < optionalCost.length; i++) {
            optionalCost[i] = (yearlyHelicopterCost -
                               data.optionalCosts.OffshoreLogisticCost -
                               data.optionalCosts.upgradeTeamCost);
        }

        return finance.NPV(data.general.discountRate, -MaintenanceVesselsCost, ...optionalCost);
    }
}

