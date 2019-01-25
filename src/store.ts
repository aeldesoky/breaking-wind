import Vue from 'vue';
import Vuex from 'vuex';
import { VuexModule, Mutation, Module, getModule } from 'vuex-module-decorators';

export interface Turbine {
  name: string;
  nominalPowerAt: number;
  nominalPower: number;
  unitCost: number;
  maintenance: number;
  timeToConstruct: number;
}

Vue.use(Vuex);
interface StoreType {
    data: DataModule;
  }
  // Declare empty store first
const store = new Vuex.Store<StoreType>({});

@Module({ dynamic: true, store, name: 'data' })
class DataModule extends VuexModule {
    public depth: number[][] = [];
    public wind: number[][] = [];

    public general = {
      budget: 200000,
      outputDecreasePerYear: 1, // %
      discountRate: 10, // %
      lifeSpan: 25, // years
    };

    public results: any[] = [];

    public turbines: Turbine[] = [
      {
        name: 'Type 1',
        nominalPowerAt: 12,
        nominalPower: 8000,
        unitCost: 38_000_000,
        maintenance: 1_000_000,
        timeToConstruct: 1,
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
  public addResult(result: any) {
    this.results.push(result);
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
