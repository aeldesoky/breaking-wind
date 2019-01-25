<script>
    import VueGoogleHeatmap from 'vue-google-heatmap/src/VueGoogleHeatmap.vue';

    export default {
        extends: VueGoogleHeatmap,
        computed: {
            mapWidth() {
                if (typeof this.width === 'string') {
                    return this.width;
                } else {
                    return `${this.width}px`;
                }
            },
            mapHeight() {
                if (typeof this.height === 'string') {
                    return this.height;
                } else {
                    return `${this.height}px`;
                }
            },
            heatmapPoints() {
                return this.points.map(
                    point => {
						return {
						    location: new google.maps.LatLng(point.lat, point.lng),
							weight: point.weight
						}
                    }
                );
            }
        }
    };
</script>