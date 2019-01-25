<!--
Component used to display a map, with points used to render a heatmap.

Utilizes the Google Maps API.
-->

<template>
	<google-heatmap :points="points"
					:height="500"
					:initial-zoom=11
					:lat="43.677407"
					:lng="-66.426111">
	</google-heatmap>
</template>

<script>
    import GoogleHeatmap from './GoogleHeatmap.vue';
    import wind from '@/resources/wind';
    import depth from '@/resources/depth';
    import latlon from '@/resources/latlon';

    export default {
        components: {
            GoogleHeatmap
        },
        data() {
            let points = [];
            for(let latIndex = 0; latIndex < latlon.latitude.length; latIndex++) {
                let latitude = latlon.latitude[latIndex];

                for(let lngIndex = 0; lngIndex < latlon.longitude.length; lngIndex++) {
                    let longitude = latlon.longitude[lngIndex];
                    let value = wind[latIndex][lngIndex];

                    points.push({lat: latitude, lng: longitude, weight: Math.pow(value, 2)});
                }
			}

            return {
                points: points
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
