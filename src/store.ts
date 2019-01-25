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
  lcoes: number[][];
  cost: number[][];
  energy: number;
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
      HeliCost: 1000,
      HeliWeeksPerYear: 2,
      MaintenanceVesselsCost: 1000,
      MaintenanceVesselsNum: 1,
      DiagnosticTeamCost: 420,
      OffshoreLogisticCost: 69,
      upgradeTeamCost: 8,
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

  get turbineLookup() {
    const lookup: { [k: string]: number } = {};
    this.turbines.forEach((turbine, i) => {
      lookup[turbine.name] = i;
    });

    return lookup;
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
  public setTurbineOptions(payload: { turbine: Turbine, key: string, value: any }) {
    // @ts-ignore
    payload.turbine[payload.key] = payload.value;
  }

  @Mutation
  public selectTurbine(turbine: Turbine) {
    this.turbine = turbine;
  }
}


export default store;
export const data = getModule(DataModule);
