<!--
Extension to the VueGoogleHeatmap component to enable weighted heatmaps using the Google Maps API.

Also defines customizations that are not possible through the default component.
-->

<script>
	import VueGoogleHeatmap from 'vue-google-heatmap/src/VueGoogleHeatmap.vue';
    import { loaded } from 'vue-google-heatmap/src/loader';

    export default {
        extends: VueGoogleHeatmap,
		methods: {
            render() {
                return loaded.then(() => {
                    const mapElement = this.$refs.map;
                    this.$mapObject = new google.maps.Map(mapElement, {
                        zoom: 10,
                        center: { lat: this.lat, lng: this.lng },
                        mapTypeId: 'hybrid',
                        streetViewControl: false,
                        mapTypeControl: false
                    });
                    this.$heatmap = new google.maps.visualization.HeatmapLayer({
                        data: this.heatmapPoints,
                        map: this.$mapObject,
                        radius: 50
                    });

                    this.$heatmap.setMap(this.$mapObject);
                });
            }
		},
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
        },
		watch: {
            points: 'render'
		},
        created() {
            this.render();
        }
    };
</script>