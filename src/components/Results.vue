<template>
  <v-card class="results">
    <div style="display: flex">
      <h3 class="headline mb-0">Results</h3>
      <v-spacer></v-spacer>
      <v-select
        :items="options"
        label="Analyses"
        v-model="selectedAnalyses"
      ></v-select>
    </div>

    <div
      class="items"
    >
      <div 
        v-for="(item, i) in results"
        :key="i"
      >
        <div>{{ item.turbine.name }}</div>
        <div>{{ item.lceo }}</div>
      </div>
    </div>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Turbine, data, Analyses } from '@/store';

@Component
export default class Results extends Vue {
  public selectedAnalyses: Analyses | null = null;
  public numberOfResults = 5;
  public dateOptions = {
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  }

  get options(): Array<{ text: string, value: Analyses }> {
    return data.results.map(result => {
      if (result.name) {
        return {
          text: result.name,
          value: result,
        }
      } else {
        return {
          text: result.date.toLocaleString('en-US', this.dateOptions),
          value: result,
        }
      }
    })
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
    const best: Array<null | Best> = Array(this.numberOfResults).map(_ => null);

    this.selectedAnalyses.results.forEach((result, resultIndex) => {
      const turbine = result.turbine;
      result.lcoes.forEach((row, rowIndex) => {
        row.forEach((lceo, colIndex) => {
          const insert = (insertIndex: number) => {
            best.splice(insertIndex + 1, 0, {
              indices: [resultIndex, rowIndex, colIndex],
              lceo,
            })
          }

          for(const [i, item] of best.slice(0).reverse().entries()) {
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
        })
      })
    })
    // Filter out the null values...
    const filtered: Best[] = best.filter((item) => item) as Best[];
    return filtered.map(({ lceo, indices }) => {
      return {
        lceo,
        turbine: this.selectedAnalyses!.results[indices[0]].turbine,
      }
    });
  }
}
</script>

<style lang="sass" scoped>
.results
  margin: 0 20px
  padding: 15px
</style>