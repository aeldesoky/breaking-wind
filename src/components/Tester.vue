<template>
  <div></div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { data } from '@/store';

@Component
export default class NAME extends Vue {
  @Prop(String) public PROP!: string;

  public mounted() {
      console.log(data.depth, data.mutations);
      data.addResult({});
  }
}
</script>

<style lang="sass" scoped>

</style>