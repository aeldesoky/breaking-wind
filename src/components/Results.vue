<template>
  <v-card class="results">
    <div>
      <h3 class="headline mb-0">Results</h3>
    </div>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class Results extends Vue {
}
</script>

<style lang="sass" scoped>
.results
  margin: 0 20px
  padding: 15px
</style>