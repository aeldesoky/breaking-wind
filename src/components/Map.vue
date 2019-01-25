<template>
	<google-heatmap :points="points"
					:height="500"
					:initial-zoom=11
					:lat="43.444364"
					:lng="-66.016417">
	</google-heatmap>
</template>

<script>
    import GoogleHeatmap from './GoogleHeatmap.vue';
    import wind from '@/resources/wind';
    import depth from '@/resources/depth';

    export default {
        components: {
            GoogleHeatmap
        },
        data() {
            const latMin = 42.7;
            const lngMin = -66.6;
            const delta = 0.012;

            let points = [];
            let lat = latMin;
            let lng = lngMin;
            wind.forEach((longitudeValues) => {
                lat = latMin;

                longitudeValues.forEach((value) => {
                    points.push({lat: lat, lng: lng, weight: Math.pow(value, 2)});
					lat += delta;
				});

                lng += delta;
			});

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
