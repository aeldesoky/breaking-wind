import Vue from 'vue';
import Vuex from 'vuex';
import wind from '@/resources/wind';
import depth from '@/resources/depth';
import { VuexModule, Mutation, Module, getModule } from 'vuex-module-decorators';

export interface Turbine {
  name: string;
  nominalPowerAt: number;
  nominalPower: number;
  unitCost: number;
  maintenance: number;
  timeToConstruct: number;
  disabled: boolean;
  cutOutWindSpeed: number;
  costPerMeterDepth: number;
}

export interface Result {
  turbine: Turbine;
  lcoes: number[][];
}

export interface Options {
  budget: 200000;
  outputDecreasePerYear: 1;
  discountRate: 10;
  lifeSpan: 25;
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
      budget: 200000,
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

    public turbines: Turbine[] = [
      {
        name: 'Type 1',
        nominalPowerAt: 12,
        nominalPower: 8000,
        unitCost: 38_000_000,
        maintenance: 1_000_000,
        timeToConstruct: 1,
        disabled: false,
        cutOutWindSpeed: 25,
        costPerMeterDepth: 1505,
      },
    ];

    get turbineLookup() {
      const lookup: { [k: string]: Turbine } = {};
      this.turbines.forEach((turbine) => {
        lookup[turbine.name] = turbine;
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
  public setTurbineOptions<T extends Turbine>(payload: { turbine: T, key: string, value: any }) {
    if (!(payload.key in payload.turbine)) {
      throw Error(`Unknown key: #${payload.key}`);
    }

    // @ts-ignore
    payload.turbine[payload.key] = payload.value;
  }
}


export default store;
export const data = getModule(DataModule);
