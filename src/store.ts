import Vue from 'vue';
import Vuex from 'vuex';
import { VuexModule, Mutation, Module, getModule } from 'vuex-module-decorators';

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

    public turbines = [
        {
            nominalPowerAt: 12.5,
            nominalPower: 8000,
            unitCost: 38_000_000,
            maintenance: 1_000_000,
            timeToConstruct: 1.33,
        },
    ];

    @Mutation
    public addResult(result: any) {
        this.results.push(result);
    }
}


export default store;
export const data = getModule(DataModule);
