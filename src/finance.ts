
import { data, Turbine, Result } from '@/store';
import { Finance } from 'financejs';
import { copy } from '@/utils';

export function evaluate() {
  const finance = new Finance();

  const timespan = data.general.lifeSpan;
  const outputDRate = data.general.outputDecreasePerYear;
  const discountRate = data.general.discountRate;

  const results = data.turbines.map((turbine: Turbine) => {
    const lcoeMap: Result = { turbine: copy(turbine), lcoes: [], cost: [], energy: 0 };
    if (turbine.disabled) {
      return;
    }

    // Compute optional costs and add unit cost to initialize our present costs
    let initialCost = calculateOptionalCosts(turbine);
    initialCost += turbine.unitCost;

    // Add turbine maintenance to the cash flow
    const cashFlow = Array(turbine.timeToConstruct).fill(0);
    for (let i = 0; i < timespan; i++) {
      cashFlow.push(-turbine.maintenance);
    }

    // Compute energy flow. This is constant for a given turbine given normal operation.
    const energyFlow = Array(turbine.timeToConstruct).fill(0);
    for (let i = 0; i < timespan; i++) {
      energyFlow.push(turbine.nominalPower * (1 - outputDRate / 100) ** i * 365 * 24);
    }

    // Convert energy flow from annuities to present.
    const presentEnergy = finance.NPV(discountRate, 0, ...energyFlow);

    // Record the present energy as part of our result
    lcoeMap.energy = presentEnergy;

    // For all of the available data
    for (let i = 0; i < data.wind.length; i++) {
      lcoeMap.lcoes[i] = [];
      lcoeMap.lcoes[i] = [];
      lcoeMap.cost[i] = [];

      for (let j = 0; j < data.wind[0].length; j++) {

        // Reject any turbine placement where the water is too deep or it falls outside nominal windspeed.
        if (data.depth[i][j] > 60 ||
          data.wind[i][j] < turbine.nominalPowerAt ||
          data.wind[i][j] >= turbine.cutOutWindSpeed) {
          lcoeMap.cost[i][j] = 0;
          lcoeMap.lcoes[i][j] = Infinity;
          continue;
        }

        // Initial investment is supposed to be negative
        const pointInitialCost = -initialCost - data.depth[i][j] * turbine.costPerMeterDepth;
        const presentValue = finance.NPV(discountRate, pointInitialCost, ...cashFlow);
        if (data.general.budget < Math.abs(presentValue)) {
          lcoeMap.cost[i][j] = 0;
          lcoeMap.lcoes[i][j] = Infinity;
          continue;
        }

        // Record the cost and LCOE as part of out result
        lcoeMap.cost[i][j] = Math.abs(presentValue);
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

function calculateOptionalCosts(turbine: Turbine) {  
  // Storing the original turbine information to be displayed
  turbine = copy(turbine);

  let yearlyHelicopterCost = 0;
  let MaintenanceVesselsCost = 0;
  const optionalCost = new Array(data.general.lifeSpan);
  const finance = new Finance();

  // Finding the yearly helicopter cost and updating the turbine maintenance cost accordingly
  if (data.optionalCosts.HeliCost !== 0) {
      yearlyHelicopterCost = - (data.optionalCosts.HeliWeeksPerYear * data.optionalCosts.HeliCost);
      turbine.maintenance = turbine.maintenance * (1 - (data.optionalCosts.HeliWeeksPerYear * 0.05));
  }

  // Finding the total maintenance vessels costs and updating the turbine maintenance cost accordingly
  if (data.optionalCosts.MaintenanceVesselsCost !== 0) {
    MaintenanceVesselsCost = - (data.optionalCosts.MaintenanceVesselsNum * data.optionalCosts.MaintenanceVesselsCost);

    if (data.optionalCosts.MaintenanceVesselsNum === 1) {
      turbine.maintenance = turbine.maintenance * (1 - 0.06); // Decrease maintenance cost by 6% for 1 vessel
    }


    if (data.optionalCosts.MaintenanceVesselsNum === 2) {
      turbine.maintenance = turbine.maintenance * (1 - 0.09); // Decrease maintenance cost by 9% for 2 vessels
    }
  }

  // Creating the cash flow array for all the yearly costs
  for (let i = 0; i < optionalCost.length; i++) {
    optionalCost[i] = (
      yearlyHelicopterCost -
      data.optionalCosts.OffshoreLogisticCost -
      data.optionalCosts.upgradeTeamCost
    );
  }

  return finance.NPV(data.general.discountRate, -MaintenanceVesselsCost, ...optionalCost); // Calculate the Present worth of the costs
}

