<template>
  <v-app>
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
  </v-app>
</template>

<script>
import Parameters from '@/components/Parameters.vue';
import Results from '@/components/Results.vue';
import Map from "./components/Map";

export default {
  name: 'App',
  components: {
    Parameters,
    Map,
    Results,
  },
  data () {
    return {
      //
    }
  }
}
</script>

<style lang="sass" scoped>
.spacer
  margin: 15px

.row
  display: flex

.parameters, .results
  flex: 1
</style>
