<!--
Component used to display a map, with points used to render a heatmap.

Utilizes the Google Maps API.
-->

<template>
	<google-heatmap 
    :points="points"
    :height="500"
    :initial-zoom=11
    :lat="43.677407"
    :lng="-66.426111"
  ></google-heatmap>
</template>

<script>
    import GoogleHeatmap from './GoogleHeatmap.vue';
    import Coordinates from '@/resources/latlon';
    import { data } from '@/store';

    export default {
        components: {
            GoogleHeatmap
        },
        computed: {
            points() {
                let analysis = data.selectedAnalyses;
                let turbine = data.turbine;

                if(!analysis || !analysis.results) {
                    return [];
				}

                if(analysis.results.length === 0) {
                    return [];
                }

				let turbineIndex = data.turbines.indexOf(data.turbine);
                let values = analysis.results[turbineIndex].lcoes;
                if(values.length === 0) {
                    return [];
				}

                let points = [];
                for(let latIndex = 0; latIndex < Coordinates.latitude.length; latIndex++) {
                    const latitude = Coordinates.latitude[latIndex];

                    for(let lngIndex = 0; lngIndex < Coordinates.longitude.length; lngIndex++) {
                        const longitude = Coordinates.longitude[lngIndex];
                        const value = values[latIndex][lngIndex];

                        if(1 / value) {
                            points.push({lat: latitude, lng: longitude, weight: 1 / value});
                        }
                    }
                }

                return points;
			}
        }
    }
</script>

<style scoped lang="scss">
	/* Always set the map height explicitly to define the size of the div
       * element that contains the map. */
	#map {
		height: 100%;
	}
	/* Optional: Makes the sample page fill the window. */
	html, body {
		height: 100%;
		margin: 0;
		padding: 0;
	}
	#floating-panel {
		position: absolute;
		top: 10px;
		left: 25%;
		z-index: 5;
		background-color: #fff;
		padding: 5px;
		border: 1px solid #999;
		text-align: center;
		font-family: 'Roboto','sans-serif';
		line-height: 30px;
		padding-left: 10px;
	}
	#floating-panel {
		background-color: #fff;
		border: 1px solid #999;
		left: 25%;
		padding: 5px;
		position: absolute;
		top: 10px;
		z-index: 5;
	}
</style>
