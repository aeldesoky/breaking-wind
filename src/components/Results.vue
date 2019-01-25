<!--
Results panel.

Used to provide results of the analysis.
-->

<template>
  <v-card class="results">
    <div style="display: flex">
      <h3 class="headline mb-0">Analysis Results</h3>
      <v-spacer></v-spacer>
      <v-select
          :items="options"
          label="Analyses"
          :value="selectedAnalyses"
          @input="data.selectAnalyses"
      ></v-select>
    </div>

    <div class="analysis-value-container">
      <v-card 
        class="results-card"
        v-for="(item, i) in results"
        :key="i"
      >
        <div class="card-row">
          <span class="card-item">Turbine Type: </span>
          <span> {{ item.turbine.name }}</span>
        </div>        
        <div class="card-row">
          <span class="card-item">Projected Cost (NPV): </span>
          <span>${{ item.cost }}</span>
        </div>        
        <div class="card-row">
          <span class="card-item">Energy Output (NPV): </span>
          <span> {{ item.energy }} kWh</span>
        </div>        
        <div class="card-row">
          <span class="card-item">LCEO Value: </span>
          <span> {{ item.lceo }} $/kWh</span>
        </div>        
        <div class="card-row">
          <span class="card-item">Latitude: </span>
          <span> {{ item.latitude }}</span>
        </div>        
        <div class="card-row">
          <span class="card-item">Longitude: </span>
          <span> {{ item.longitude }}</span>
        </div>      
      </v-card>
    </div>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Turbine, data, Analyses } from '@/store';
import latlon from '@/resources/latlon';

@Component
export default class Results extends Vue {
  public data = data;
  
  // The amount of results to display.
  public numberOfResults = 5;

  // Options to display date properly
  public dateOptions = {
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  };

  get selectedAnalyses() {
    return data.selectedAnalyses;
  }

  // Options for dropdown
  get options(): Array<{ text: string, value: Analyses }> {
    return data.analyses.map((result) => {
      if (result.name) {
        return {
          text: result.name,
          value: result,
        };
      } else {
        return {
          text: result.date.toLocaleString('en-US', this.dateOptions),
          value: result,
        };
      }
    });
  }

  /**
   * This returns the n best results from ALL points and ALL turbines.
   */
  get results() {
    if (!this.selectedAnalyses) {
      return [];
    }

    interface Best {
      indices: [number, number, number];
      lceo: number;
    }

    // Best (lowest LCEO value) -> worst
    const best: Best[] = [];

    this.selectedAnalyses.results.forEach((result, resultIndex) => {
      const turbine = result.turbine;
      result.lcoes.forEach((row, rowIndex) => {
        row.forEach((lceo, colIndex) => {
          lceo = lceo || Infinity;
          const push = () => {
            best.push({
              indices: [resultIndex, rowIndex, colIndex],
              lceo: lceo || Infinity,
            });

            best.sort(function(a, b) {
              return a.lceo - b.lceo;
            });

            if (best.length > this.numberOfResults) {
              best.splice(this.numberOfResults, best.length - this.numberOfResults + 1);
            }
            
          };

          const doInsert = best.length < this.numberOfResults || best.some((item) => lceo < item.lceo)
          if (doInsert) {
            push();
          }
        });
      });
    });
    // Filter out the null values...
    const filtered: Best[] = best.filter((item) => item && item.lceo !== Infinity) as Best[];
    return filtered.map(({ lceo, indices }) => {
      const result = this.selectedAnalyses!.results[indices[0]];
      return {
        lceo,
        turbine: result.turbine,
        cost: result.cost[indices[1]][indices[2]],
        energy: result.energy,
        latitude: latlon.latitude[indices[1]],
        longitude: latlon.latitude[indices[2]],
      };
    });
  }
}
</script>

<style lang="sass" scoped>
.results
  margin: 0 15px 0 5px
  padding: 15px

.results-card
  margin: 15px
  padding: 15px
  width: 100%

.analysis-value-container
  flex-direction: column
  display: inline-flex
  width: 100%

.value
  color: green
  font-size: 40px
  font-weight: bold

.card-item
  font-weight: 500

.card-row
  display: flex
  margin: 2px

span
  white-space: pre
</style>