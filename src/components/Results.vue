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
          v-model="selectedAnalyses"
      ></v-select>
    </div>

    <div class="items">
      <div
          v-for="(item, i) in results"
          :key="i"
      >
        <div>{{ item.turbine.name }}</div>
        <div>{{ item.lceo }}</div>
      </div>
    </div>
    <div class="analysis-value-container">
      <v-card 
        class="results-card"
        v-for="(item, i) in results"
        :key="i"
      >
        <span class="headline">Turbine Type: {{ item.turbine.type }}</span>
        <span class="headline">Projected Cost ($ NPV): {{ item.cost }}</span>
        <span class="headline">Energy Output (kWh NPV): {{ item.energy }}</span>
        <span class="headline">LCEO Value: {{ item.lceo }}</span>
        <span class="headline">Latitude: {{ item.lceo }}</span>
      </v-card>
    <div class="analysis-value-container">
      <v-card class="results-card">
        <v-container fluid>
          <v-layout>
            <v-flex xs12 align-end flexbox>
              <span class="headline">Latitude:</span>
            </v-flex>
          </v-layout>
        </v-container>
        <v-card-title>
          <div>
            <span class="value">45.345</span>
          </div>
        </v-card-title>
      </v-card>
      <v-card class="results-card">
        <v-container fluid>
          <v-layout>
            <v-flex xs12 align-end flexbox>
              <span class="headline">Longitude:</span>
            </v-flex>
          </v-layout>
        </v-container>
        <v-card-title>
          <div>
            <span class="value">-66.4346</span>
          </div>
        </v-card-title>
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
  public selectedAnalyses: Analyses | null = null;
  public numberOfResults = 5;
  public dateOptions = {
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  };

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

  get selected() {
    return '';
  }

  get results() {
    if (!this.selectedAnalyses) {
      return [];
    }

    interface Best {
      indices: [number, number, number];
      lceo: number;
    }

    // Best -> worst
    const best: Array<null | Best> = Array(this.numberOfResults).fill(null);

    this.selectedAnalyses.results.forEach((result, resultIndex) => {
      const turbine = result.turbine;
      result.lcoes.forEach((row, rowIndex) => {
        row.forEach((lceo, colIndex) => {
          const insert = (insertIndex: number) => {
            best[insertIndex + 1] = {
              indices: [resultIndex, rowIndex, colIndex],
              lceo,
            };
          };

          for (const [i, item] of best.slice(0).reverse().entries()) {
            if (item !== null && item.lceo <= lceo) {
              // Make sure it isn't the last element in the array
              if (i < this.numberOfResults - 1) {
                insert(i + 1);
              }
            }

            if (i === 0) {
              insert(0);
            }
          }
        });
      });
    });
    // Filter out the null values...
    const filtered: Best[] = best.filter((item) => item) as Best[];
    return filtered.map(({ lceo, indices }) => {
      const result = this.selectedAnalyses!.results[indices[0]];
      return {
        lceo,
        turbine: result.turbine,
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
  width: 100%

.analysis-value-container
  display: inline-flex
  width: 100%

.value
  color: green
  font-size: 40px
  font-weight: bold
</style>