<template>
  <v-card class="parameters">
    <div>
      <span class="headline mb-0">General Options</span>
      <button
          type="button"
          class="btn"
          @click="showModal"
      >
        <v-icon right>help</v-icon>
      </button>
    </div>

    <v-form v-model="valid">
      <v-slider
        :value="general.budget"
        @update="setOption('budget', $event)"
        max="50000000"
        label="Budget ($)"
        thumb-label
        :thumb-size="60"
      ></v-slider>

      <v-slider
        :value="general.discountRate"
        @update="setOption('discountRate', $event)"
        max="20"
        ticks
        label="Dicount Rate (%)"
        thumb-label
      ></v-slider>

      <v-slider
        :value="general.outputDecreasePerYear"
        @update="setOption('outputDecreasePerYear', $event)"
        max="20"
        ticks
        label="Output Decrease (%)"
        thumb-label
      ></v-slider>

      <v-slider
        :value="general.lifeSpan"
        @update="setOption('lifeSpan', $event)"
        max="40"
        min="10"
        ticks
        label="Lifespan (Years)"
        thumb-label
      ></v-slider>
    </v-form>

    <v-divider></v-divider>

    <div style="display: flex">
      <h3 class="headline mb-0 turbine-title">
        Turbine
      </h3>
      <v-spacer></v-spacer>
      <v-select
        class="turbine-select"
        :items="turbineNames"
        label="Turbine"
        v-model="selectedTurbine"
      ></v-select>
      <!-- <div>Located two hours south of Sydney in the <br>Southern Highlands of New South Wales, ...</div> -->
    </div>

    <v-form 
      v-model="valid"
      v-if="turbine"
    >
      <v-text-field
        :value="turbine.name"
        label="Name"
        @update="changeTurbine('name', $event)"
      ></v-text-field>

      <v-slider
        :value="turbine.nominalPowerAt"
        @update="changeTurbine('nominalPowerAt', $event)"
        max="30"
        label="Nominal Power At (m/s)"
        thumb-label
      ></v-slider>

      <v-slider
        :value="turbine.nominalPower / 10"
        @update="changeTurbine('nominalPower', $event * 10)"
        max="10"
        label="Nominal Power (MW)"
        thumb-label
      ></v-slider>

      <v-slider
        :value="turbine.unitCost / 1000000"
        @update="changeTurbine('unitCost', $event * 1000000)"
        max="50"
        ticks
        label="Unit Cost (Million)"
        thumb-label
      ></v-slider>

      <v-slider
        :value="turbine.maintenance / 1000000"
        @update="changeTurbine('maintenance', $event * 1000000)"
        max="2"
        ticks
        step="0.1"
        label="Maintenance (Million/year)"
        thumb-label
      ></v-slider>

      <v-slider
        :value="turbine.timeToConstruct"
        @update="changeTurbine('timeToConstruct', $event)"
        max="5"
        ticks
        label="Time To Construct (Years)"
        thumb-label
      ></v-slider>
    </v-form>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click="analyze" color="primary">Analyze</v-btn>
    </v-card-actions>

    <help-modal
        v-show="isModalVisible"
        @close="closeModal"
    />
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { data } from '@/store';
import HelpModal from './HelpModal.vue';
import Finances from '@/finance';

@Component({
    components: {
        HelpModal,
    },
})
export default class Parameters extends Vue {
  public general = data.general;
  public valid = false;
  public setOption = data.setOption;
  public selectedTurbine: string = '';
  public isModalVisible = false;
  public finaces = new Finances();

  get turbine() {
    return data.turbineLookup[this.selectedTurbine];
  }

  get turbineNames() {
    return data.turbines.map((turbine) => turbine.name);
  }

  public mounted() {
    if (!this.selectedTurbine) {
      this.selectedTurbine = this.turbineNames[0];
    }
  }

  public changeTurbine(key: string, value: number) {
    data.setTurbineOptions({
      turbine: this.turbine,
      key,
      value,
    });
  }

  public showModal() {
      this.isModalVisible = true;
  }

  public closeModal() {
      this.isModalVisible = false;
  }

  public analyze() {
    this.finaces.evaluate();
  }
}
</script>

<style lang="sass" scoped>
.parameters
  margin: 0 20px
  padding: 15px

.turbine-title
  margin-top: 15px

.turbine-select
  margin-top: 11px
</style>