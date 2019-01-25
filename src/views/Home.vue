<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <Map></Map>
  </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import Map from '@/components/Map.vue'; // @ is an alias to /src

    @Component({
        components: {
            Map
        },
    })
    export default class Home extends Vue {}
</script>
