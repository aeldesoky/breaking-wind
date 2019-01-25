<!--
Parameters panel.

Used to provide various options to the user, allowing them to customize their
analysis.
-->

<template>
  <v-card class="parameters">
    <v-card class="card" style="margin-top: 0">
      <div>
        <span class="headline mb-0">General Parameters</span>
        <button type="button" class="btn" @click="showModal(optionInformation)">
          <v-icon right>help</v-icon>
        </button>
      </div>

      <v-form>
        <v-slider
          :value="general.budget / 1000000"
          @input="setOption('budget', $event * 1000000)"
          max="100"
          label="Budget (Million $)"
          thumb-label
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
    </v-card>

    <v-card class="card">
      <div style="display: flex">
        <h3 class="headline mb-0 turbine-title">
          Turbine
        </h3>
        <button type="button" class="btn" @click="showModal(turbineInformation)">
          <v-icon right>help</v-icon>
        </button>
        <v-spacer></v-spacer>
        <v-select
          class="turbine-select"
          :items="turbineOptions"
          label="Turbine"
          :value="data.turbine"
          @input="data.selectTurbine"
        ></v-select>
        <!-- <div>Located two hours south of Sydney in the <br>Southern Highlands of New South Wales, ...</div> -->
      </div>

      <v-form
        v-if="turbine"
      >
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
    </v-card>

    <v-expansion-panel
      expand class="optional-costs-card"
    >
      <v-expansion-panel-content class="optional-costs">
        <div class = "optional-title" slot="header">
          <span class="headline mb-0">Optional Parameters</span>
          <button type="button" class="btn" @click="showModal(optionalInformation)">
            <v-icon right>help</v-icon>
          </button>
        </div>
        <v-card>
          <v-form>
            <v-slider
              :value="optional.HeliCost"
              @input="setOptionalCost('HeliCost', $event)"
              max="20000"
              thumb-size="35"
              label="Helicopter Cost ($ / Week)"
              thumb-label
            ></v-slider>

            <v-slider
              :value="optional.HeliWeeksPerYear"
              @input="setOptionalCost('HeliWeeksPerYear', $event)"
              max="6"
              ticks
              label="Helicopter Trips (Times / Year)"
              thumb-label
            ></v-slider>

            <v-slider
              :value="optional.MaintenanceVesselsCost / 1000000"
              @input="setOptionalCost('MaintenanceVesselsCost', $event * 1000000)"
              max="100"
              label="Maintenance Vessel Cost (Million $)"
              thumb-size="35"
              thumb-label
            ></v-slider>

            <v-slider
              :value="optional.MaintenanceVesselsNum"
              @input="setOptionalCost('MaintenanceVesselsNum', $event)"
              max="2"
              ticks
              label="Number of Maintenance Vessels"
              thumb-label
            ></v-slider>

            <v-slider
              :value="optional.DiagnosticTeamCost"
              @input="setOptionalCost('DiagnosticTeamCost', $event)"
              max="50000"
              label="Diagnostic Team Cost ($ / year)"
              thumb-size="35"
              thumb-label
            ></v-slider>

            <v-slider
              :value="optional.OffshoreLogisticCost"
              @input="setOptionalCost('OffshoreLogisticCost', $event)"
              max="50000"
              label="Offshore Logistics Cost"
              thumb-size="35"
              thumb-label
            ></v-slider>

            <v-slider
              :value="optional.upgradeTeamCost"
              @input="setOptionalCost('upgradeTeamCost', $event)"
              max="50000"
              label="Upgrade Team Cost"
              thumb-size="35"
              thumb-label
            ></v-slider>

          </v-form>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click="analyze" color="primary">Analyze</v-btn>
    </v-card-actions>

    <help-modal
      v-if="isModalVisible && parameters"
      :parameters="parameters"
      @close="closeModal"
    ></help-modal>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { data, Turbine, optionInformation, turbineInformation, optionalInformation } from '@/store';
import HelpModal from '@/components/HelpModal.vue';
import { evaluate } from '@/finance';

@Component({
  components: {
    HelpModal,
  },
})
export default class Parameters extends Vue {
  public general = data.general;
  public data = data;
  public optional = data.optionalCosts;
  public isModalVisible = false;
  public parameters: any[] | null = null;
  public optionInformation = optionInformation;
  public optionalInformation = optionalInformation;
  public turbineInformation = turbineInformation;

  get turbine() {
    return data.turbine;
  }

  get turbineOptions() {
    return data.turbines.map((turbine) => ({
      text: turbine.name,
      value: turbine,
    }));
  }

  public mounted() {
    if (!this.turbine) {
      data.selectTurbine(data.turbines[0]);
    }
  }

  public changeTurbine(key: string, value: number) {
    if (!this.turbine) {
      return;
    }

    data.setTurbineOptions({
      turbine: this.turbine,
      key,
      value,
    });
  }

  public setOption(key: string, value: any) {
    data.setOption({
      key,
      value,
    });
  }

  public setOptionalCost(key: string, value: any) {
    data.setOptionalCost({
      key,
      value,
    });
  }

  public showModal(parameters: any[]) {
    this.isModalVisible = true;
    this.parameters = parameters;
  }

  public closeModal() {
    this.isModalVisible = false;
  }

  public analyze() {
    evaluate();
    data.setFinishedAnalyses(true);
    data.save();
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

.optional-title
  padding-left: 0px
  margin-top: 15px
  margin-bottom: 15px

.card
  padding: 15px
  margin-top: 15px
  margin-bottom: 15px

.optional-costs
  padding-left: 15px
  padding-right: 15px

.optional-costs-card
  margin-bottom: 15px
</style>