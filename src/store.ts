import Vue from 'vue';
import Vuex from 'vuex';
import wind from '@/resources/wind';
import depth from '@/resources/depth';
import { VuexModule, Mutation, Module, getModule } from 'vuex-module-decorators';

export interface Turbine {
  name: string;
  nominalPowerAt: number;
  cutOutWindSpeed: number;
  nominalPower: number;
  costPerMeterDepth: number;
  unitCost: number;
  maintenance: number;
  timeToConstruct: number;
  disabled: boolean;
}

export interface Result {
  turbine: Turbine;
  lcoes: Array<Array<number | null>>;
  cost: number[][];
  energy: number; // Energy (kWh) per year
}

export interface Options {
  budget: number;
  outputDecreasePerYear: number;
  discountRate: number;
  lifeSpan: number;
}

export interface Analyses {
  date: Date;
  name?: string;
  options: Options;
  results: Result[];
}

export const optionInformation = [
  {
    title: 'Budget',
    description: 'Specify the budget in CAD projected for the development project.',
  },
  {
    title: 'Output Decrease Per Year',
    description: 'The percentage decrease of the energy output each year. This value compounds.',
  },
  {
    title: 'Discount Rate',
    description: 'Percentage that a future value is discounted against the same value today. This value compounds.',
  },
  {
    title: 'Lifespan',
    description: 'Lifespan of the turbines in years.',
  },
];

export const optionalInformation = [
  {
    title: 'Helicopter Cost',
    description: 'Cost of helicopter maintenance.',
  },
  {
    title: 'Helicopter Trips',
    description: 'Weeks of helicopter maintenance per year. 0.5% decrease in maintenance cost per year per week in use (up to 6 weeks).',
  },
  {
    title: 'Maintenance Vessel Cost',
    description: 'Cost of a perminant maintenance vessel.',
  },
  {
    title: 'Number of Maintenance Vessels',
    description: 'Amount of maintenance vessels. 6% decrease in maintenance cost for the first vessel, 3% additional if two are in use per year (maximum 2).',
  },
  {
    title: 'Diagnostic Team Cost',
    description: 'Cost of a diagnostic team. 1% decrease in maintenance cost, 1% increase in power output',
  },
  {
    title: 'Offshore Logistics Cost',
    description: 'Cost of offshore logistics. %.5 percent increase in power output per year in use',
  },
  {
    title: 'Upgrade Team Cost',
    description: 'Cost of an upgrade team. Fixed 5% increase in power output (available after 5 years from construction) per year in use',
  },
];

export const turbineInformation = [
  {
    title: 'Nominal Power At',
    description: 'The windspeed at which the turbine can produce the nominal power.',
  },
  {
    title: 'Cut Out Wind Speed',
    description: 'The wind speed at which the turbine will stop working to avoid damage.',
  },
  {
    title: 'Nominal Power',
    description: 'The nominal steady power produced by the turbine.',
  },
  {
    title: 'Unit Cost',
    description: 'The unit installation cost for the turbine.',
  },
  {
    title: 'Maintenance',
    description: 'The yearly maintenance cost for the turbine.',
  },
  {
    title: 'Time to Construct',
    description: 'The expected time to finish constructing the turbine.',
  },
  {
    title: 'Disabled',
    description: 'If checked, the turbined will not be used in the analysis.',
  },
];

Vue.use(Vuex);
interface StoreType {
    data: DataModule;
  }
  // Declare empty store first
const store = new Vuex.Store<StoreType>({});

@Module({ dynamic: true, store, name: 'data' })
class DataModule extends VuexModule {
    public depth: number[][] = depth;
    public wind: number[][] = wind;

    public general: Options = {
      budget: 50_000_000,
      outputDecreasePerYear: 1, // %
      discountRate: 10, // %
      lifeSpan: 25, // years
    };

    public optionalCosts = {
      HeliCost: 0,
      HeliWeeksPerYear: 0,
      MaintenanceVesselsCost: 0,
      MaintenanceVesselsNum: 0,
      DiagnosticTeamCost: 0,
      OffshoreLogisticCost: 0,
      upgradeTeamCost: 0,
    };

    public analyses: Analyses[] = [];

    public turbines: Turbine[] = [{
      name: 'Type 1',
      nominalPowerAt: 12,
      cutOutWindSpeed: 25,
      nominalPower: 8000,
      costPerMeterDepth: 1505,
      unitCost: 38_000_000,
      maintenance: 1_000_000,
      timeToConstruct: 1,
      disabled: false,
    },
    {
      name: 'Type 2',
      nominalPowerAt: 13,
      cutOutWindSpeed: 25,
      nominalPower: 7000,
      costPerMeterDepth: 1360,
      unitCost: 34_000_000,
      maintenance: 800_000,
      timeToConstruct: 1,
      disabled: false,
    },
    {
      name: 'Type 3',
      nominalPowerAt: 11,
      cutOutWindSpeed: 25,
      nominalPower: 8000,
      costPerMeterDepth: 1650,
      unitCost: 35_000_000,
      maintenance: 1_100_000,
      timeToConstruct: 2,
      disabled: false,
    },
    {
      name: 'Type 4',
      nominalPowerAt: 12,
      cutOutWindSpeed: 30,
      nominalPower: 6000,
      costPerMeterDepth: 1273,
      unitCost: 29_000_000,
      maintenance: 790_000,
      timeToConstruct: 1,
      disabled: false,
    },
  ];

  public selectedAnalyses: null | Analyses = null;
  public turbine: Turbine | null = null;
  public finishedAnalyses = false;

  @Mutation
  public setFinishedAnalyses(value: boolean) {
    this.finishedAnalyses = value;
  }

  @Mutation
  public addResult(analyses: Analyses) {
    this.analyses.push(analyses);
  }

  @Mutation
  public setOption(payload: { key: string, value: any }) {
    if (!(payload.key in this.general)) {
      throw Error(`Unknown key: #${payload.key}`);
    }

    // @ts-ignore
    this.general[payload.key] = payload.value;
  }

  @Mutation
  public setOptionalCost(payload: { key: string, value: any }) {
    if (!(payload.key in this.optionalCosts)) {
      throw Error(`Unknown key: #${payload.key}`);

    }

    // @ts-ignore
    this.optionalCosts[payload.key] = payload.value;
  }

  @Mutation
  public setTurbineOptions(payload: { turbine: Turbine, key: string, value: any }) {
    // @ts-ignore
    payload.turbine[payload.key] = payload.value;
  }

  @Mutation
  public selectAnalyses(analyses: Analyses) {
    this.selectedAnalyses = analyses;
  }

  @Mutation
  public selectTurbine(turbine: Turbine) {
    this.turbine = turbine;
  }

  @Mutation
  public save() {
    localStorage.setItem('analyses', JSON.stringify(this.analyses));
  }

  @Mutation
  public load() {
    const saved = localStorage.getItem('analyses' || '[]');
    if (!saved) {
      return;
    }

    this.analyses = JSON.parse(saved);
    this.analyses.forEach((analyses) => {
      // Date are serialized as strings :(
      const date = analyses.date as any as string;
      analyses.date = new Date(date);
    });
  }
}


export default store;
export const data = getModule(DataModule);
