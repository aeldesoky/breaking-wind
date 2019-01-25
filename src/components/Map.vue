<template>
	<google-heatmap :points="points"
						:height="350"
						map-type='satellite'
						:initial-zoom=7
						:lat="42.7"
						:lng="-66.6">
	</google-heatmap>
</template>

<script>
    import GoogleHeatmap from './GoogleHeatmap.vue'

    export default {
        components: {
            GoogleHeatmap
        },
        data() {
            return {
                points: [
                    {lat: 42.7, lng:-66.6, weight: 342},
                    {lat: 42.882, lng:-66.504, weight: 2},
                    {lat: 37.786905, lng:-122.440270, weight: 7},
                    {lat: 37.786956, lng:-122.440279, weight: 22},
                    {lat: 37.800224, lng:-122.433520, weight: 3},
                    {lat: 37.800155, lng:-122.434101, weight: 12},
                    {lat: 37.800160, lng:-122.434430, weight: 52},
                    {lat: 37.800378, lng:-122.434527, weight: 12},
                    {lat: 37.800738, lng:-122.434598, weight: 13},
                    {lat: 37.800938, lng:-122.434650, weight: 10},
                    {lat: 37.801024, lng:-122.434889, weight: 14},
                    {lat: 37.800955, lng:-122.435392, weight: 35},
                    {lat: 37.800886, lng:-122.435959, weight: 26}
                ]
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
