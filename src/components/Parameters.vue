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
        @input="setOption('budget', $event)"
        max="50000000"
        label="Budget ($)"
        thumb-label
        :thumb-size="60"
      ></v-slider>

      <v-slider
        :value="general.discountRate"
        @input="setOption('discountRate', $event)"
        max="20"
        ticks
        label="Discount Rate (%)"
        thumb-label
      ></v-slider>

      <v-slider
        :value="general.outputDecreasePerYear"
        @input="setOption('outputDecreasePerYear', $event)"
        max="20"
        ticks
        label="Output Decrease (%)"
        thumb-label
      ></v-slider>

      <v-slider
        :value="general.lifeSpan"
        @input="setOption('lifeSpan', $event)"
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
        :items="turbineOptions"
        label="Turbine"
        v-model="turbine"
      ></v-select>
      <!-- <div>Located two hours south of Sydney in the <br>Southern Highlands of New South Wales, ...</div> -->
    </div>

    <v-form 
      v-model="valid"
      v-if="turbine"
    >
      <!-- <v-text-field
        :disabled="turbine.disabled"
        :value="turbine.name"
        label="Name"
        @input="changeTurbine('name', $event)"
      ></v-text-field> -->

      <v-slider
        :disabled="turbine.disabled"
        :value="turbine.nominalPowerAt"
        @input="changeTurbine('nominalPowerAt', $event)"
        max="30"
        label="Nominal Power At (m/s)"
        thumb-label
      ></v-slider>

      <v-slider
        :disabled="turbine.disabled"
        :value="turbine.nominalPower / 1000"
        @input="changeTurbine('nominalPower', $event * 1000)"
        max="10"
        label="Nominal Power (MW)"
        thumb-label
      ></v-slider>

      <v-slider
        :disabled="turbine.disabled"
        :value="turbine.unitCost / 1000000"
        @input="changeTurbine('unitCost', $event * 1000000)"
        max="50"
        ticks
        label="Unit Cost (Million)"
        thumb-label
      ></v-slider>

      <v-slider
        :disabled="turbine.disabled"
        :value="turbine.maintenance / 1000000"
        @input="changeTurbine('maintenance', $event * 1000000)"
        max="2"
        ticks
        step="0.1"
        label="Maintenance (Million/year)"
        thumb-label
      ></v-slider>

      <v-slider
        :disabled="turbine.disabled"
        :value="turbine.timeToConstruct"
        @input="changeTurbine('timeToConstruct', $event)"
        max="5"
        ticks
        label="Time To Construct (Years)"
        thumb-label
      ></v-slider>

      <v-checkbox
        label="Disabled"
        :value="turbine.disabled"
        @change="changeTurbine('disabled', $event)"
      ></v-checkbox>
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
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { data, Turbine } from '@/store';
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
  public turbine: Turbine | null = null;
  public isModalVisible = false;
  public finaces = new Finances();

  get turbineOptions() {
    return data.turbines.map((turbine) => ({
      text: turbine.name,
      value: turbine,
    }));
  }

  public mounted() {
    if (!this.turbine) {
      this.turbine = data.turbines[0];
    }
  }

  public changeTurbine(key: string, value: number) {
    if (!this.turbine) {
      return;
    }

    console.log(key, value)
    
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
  margin: 0 5px 0 15px
  padding: 15px

.turbine-title
  margin-top: 15px

.turbine-select
  margin-top: 11px
</style>