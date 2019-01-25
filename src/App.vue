<template>
  <v-app dark>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>TEAM 2 </span>
        <span class="font-weight-light">Breaking Wind</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        flat
        href="https://github.com/AECcompdirector/teamUNB2"
        target="_blank"
      >
        <span class="mr-2"> GitHub</span>
        <v-icon>launch</v-icon>
      </v-btn>
    </v-toolbar>

    <v-content>
      <Map class="map"/>
      <div class="spacer"></div>
      <div class="row">
        <parameters class="parameters"></parameters>
        <results class="results"></results>
      </div>
      <div class="spacer"></div>
    </v-content>

    <v-snackbar
      :value="data.finishedAnalyses"
      @input="data.setFinishedAnalyses"
      top
      right
    >
      Analyses finished. See Analyses dropdown.
      <v-btn
        color="primary"
        flat
        @click="data.finishedAnalyses(false)"
      >
        Close
      </v-btn>
    </v-snackbar>
  </v-app>
</template>

<script lang="ts">
import Parameters from '@/components/Parameters.vue';
import Results from '@/components/Results.vue';
import Map from '@/components/Map.vue';
import { mapState } from 'vuex';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { data } from '@/store';


@Component({
  components: {
    Parameters,
    Map,
    Results,
  }
})
export default class App extends Vue {
  public data = data;

  public mounted() {
    data.load();
  }
}
</script>

<style lang="sass" scoped>
.spacer
  margin: 15px

.row
  display: flex

.parameters, .results
  flex-grow: 1
  flex-basis: 0
</style>
