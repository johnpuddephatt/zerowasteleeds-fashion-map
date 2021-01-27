<template>
  <l-map
    id="map"
    ref="map"
    :zoom="zoom"
    :minZoom="12"
    :center="center"
    :options="mapOptions"
    :inertia="true"
    :zoomAnimation="true"
    :noBlockingAnimations="true"
    @mouseenter="mapActive = true"
    @mouseleave="mapActive = false">
    <l-control-zoom :position="'bottomright'" />
    <l-tile-layer :url="url" :attribution="attribution" />
    <v-icondefault :image-path="'/assets/images/'"></v-icondefault>
    <v-marker-cluster ref="cluster" :options="clusterOptions">
      <l-marker :ref="entry.id" v-for="entry in entriesWithLatLng" :key="entry.id" :lat-lng="getLatLng(entry)" @click="markerClicked(entry.id)">
        <l-popup :options="{offset: [0, -34], closeButton: false}">
          <div class="popup-header">
            <h3 class="entry-title" v-html="entry.name"></h3>
            <p class="entry-address" v-if="entry.address">{{ entry.address }}</p>
            <ul>
              <li v-if="entry.facebook"><a :href="entry.facebook">Facebook</a></li>
              <li v-if="entry.twitter"><a :href="entry.twitter">Twitter</a></li>
              <li v-if="entry.website"><a :href="entry.website">Website</a></li>
            </ul>
          </div>
          <div class="popup-footer">
            <button class="button" @click="closePopup(entry.id)">Close</button>
            <!-- <router-link class="button is-primary" :to="{ name: 'entry', params: { slug: entry.slug } }">View</router-link> -->
          </div>
        </l-popup>
        <l-icon
          :iconSize="selectedEntryID == entry.id ? [50,82] : [25,41]"
          :icon-anchor="selectedEntryID == entry.id ? [25,82] : [12.5,41]"
          :popupAnchor="[0,-37]"
          :className="selectedEntryID == entry.id ? 'large' : ''"
          :icon-url="selectedEntryID == entry.id ? '/assets/images/marker-icon-red.svg' : '/assets/images/marker-icon.svg'" />
      </l-marker>
    </v-marker-cluster>
  </l-map>

</template>

<script>
import L from 'leaflet';
import { divIcon as DivIcon, point as Point } from "leaflet";
import { latLng } from "leaflet";
import { LIconDefault,LPopup, LIcon, LMap, LTileLayer, LMarker, LControlZoom } from 'vue2-leaflet';
import Vue2LeafletMarkerCluster from 'vue2-leaflet-markercluster'

export default {
  name: 'Map',
  props: ['entries','selectedEntryID', 'userLatLng'],
  components: {
    'v-icondefault': LIconDefault,
    LPopup,
    LMap,
    LTileLayer,
    LMarker,
    LIcon,
    LControlZoom,
    'v-marker-cluster': Vue2LeafletMarkerCluster
  },
  data () {
    return {
      zoom: 12,
      center: latLng(53.7928737,-1.546013),
      url: 'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png',
    	maxZoom: 24,
    	attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
      mapOptions: {
        zoomSnap: 0.5,
        zoomControl: false,
        zoomAnimationThreshold: 8,
      },
      showMap: true,
      mapActive: false,
      currentPopup: null,
      clusterOptions: {
        disableClusteringAtZoom: 17,
        maxClusterRadius: 30,
        spiderLegPolylineOptions: { weight: 6, color: '#aecdeb', opacity: 0.75 },
        // Create our custom cluster icon replacement with the `iconCreateFunction` api
        // See: https://github.com/Leaflet/Leaflet.markercluster#customising-the-clustered-markers
        iconCreateFunction: cluster => {
          var childCount = cluster.getChildCount();

          return new DivIcon({
            html: "<div><span>" + childCount + "</span></div>",
            className: "marker-cluster my-marker-cluster-" + ((childCount < 4) ? 'small' : ((childCount < 8) ? 'medium' : 'large')),
            iconSize: new Point(40, 40)
          });
        }
      }
    }
  },
  computed: {
    entriesWithLatLng: function() {
      return this.entries.filter(entry => this.hasLatLng(entry));
    },
  },
  watch: {
    userLatLng: function() {
      if(this.userLatLng && this.userLatLng.length) {
        this.$refs.map.mapObject.flyTo(latLng(this.userLatLng[0],this.userLatLng[1]), 14);
      } else {
        this.$refs.map.mapObject.flyTo(this.center, 12);
      }
    },
    $route (to, from) {
      if(to.name == 'app') {
        this.$refs.map.mapObject.zoomOut(12);
      }
    },
    selectedEntryID: function (selectedEntryID) {
      if(selectedEntryID) {
        let target = this.$refs[ selectedEntryID ][ 0 ];
        let marker = target.mapObject;
        marker.closePopup(selectedEntryID);

        if(target) {

          if(!this.$route.params.slug) {
            let categorySlug = this.entries.filter(item => item.id == selectedEntryID)[0].category;
            this.$router.push({ name: 'category', params: { slug: categorySlug } })
          }

          this.$refs.map.mapObject.flyTo(target.latLng, 18);
          this.$refs.map.mapObject.on('zoomend', function () {
            marker.openPopup();
          });

          this.currentPopup = marker;
        }
      }
    }
  },
  methods: {
    getLatLng(entry) {
      let latLngArray = [parseFloat(entry.latitude),parseFloat(entry.longitude)];
      return latLngArray;
    },

    hasLatLng(entry) {
      if( entry.longitude == '' || entry.latitude == '' ) {
        return false;
      }
      if(typeof(parseInt(entry.longitude)) != 'number') {
        return false;
      }
      if(typeof(parseInt(entry.latitude)) != 'number') {
        return false;
      }
      return true;
    },

    markerClicked(selectedEntryID) {
      this.$emit('marker-clicked', selectedEntryID);
    },

    closePopup(id) {
      let currentPopup = this.currentPopup;
      this.$refs.map.mapObject.zoomOut(16);
      this.$refs.map.mapObject.on('zoomend', ()=> {
        currentPopup.closePopup();
        this.$emit('marker-clicked', null);
        this.$refs.map.mapObject.off('zoomend');
      });
    }
  },
}
</script>

<style lang="scss">
  @import '../../styles/base.scss';

  .leaflet-container {
    width: 100%;
    height: auto !important;
    flex: 1;

    @media screen and (orientation: landscape) and (min-width: 800px) {
      width: calc(100vw - #{$sidebar-width}) !important;
      // height: 100% !important;
    }
  }


  .leaflet-marker-icon {
    // margin-top: -41px !important;
    // margin-left: -12.5px !important;
    // width: 25px !important;
    // height: 41px !important;
    //
    // &.large {
    //   width: 50px !important;
    //   height: 82px !important;
    //   margin-top: -82px !important;
    //   margin-left: -25px !important;
    // }
  }

  .marker-cluster,
  .marker-cluster div {
    border-radius: 500px;
  }

  .marker-cluster.active {
    outline: 2px solid yellow;
  }

  .marker-cluster div {
    height: 30px;
    width: 30px;
    margin: 5px;
    text-align: center;
    line-height: 30px;
  }

  .my-marker-cluster-small div,
  .my-marker-cluster-medium div,
  .my-marker-cluster-large div {
    background-color: white;
  }

  .my-marker-cluster-small {
    background-color: lighten($brand-blue,10%);
    box-shadow: 9px 9px 12px -7px rgba(0,0,0,0.25) !important;
  }

  .my-marker-cluster-medium {
    background-color: $brand-blue;
    box-shadow: 9px 9px 12px -7px rgba(0,0,0,0.25) !important;
  }

  .my-marker-cluster-large {
    background-color: darken($brand-blue,25%);
    box-shadow: 9px 9px 12px -7px rgba(0,0,0,0.25) !important;
  }



  // Popup
  .leaflet-container a.leaflet-popup-close-button {
    width: 30px;
    height: 24px;
    font: 30px/17px Tahoma, Verdana, sans-serif;
  }

  .leaflet-popup-content-wrapper {
      max-width: $sidebar-width;
      width: 100vw;
      font-size: 1rem !important;
      padding: ms(0) ms(-2);
      // border-radius: 0 !important;
      box-shadow: 13px 19px 12px -7px rgba(0,0,0,0.2) !important;

      .entry-title {
        text-transform: capitalize;
        font-size: ms(2);
        font-weight: 400;
        margin-bottom: ms(-1);
      }

      .entry-address {
        font-size: ms(-1);
        color: $gray;

        &::before {
          content: '';
          display: inline-block;
          background-image: url(/assets/images/marker-icon-red.svg);
          width: 0.75em;
          height: 1em;
          margin-right: .25em;
          background-size: contain;
          background-repeat: no-repeat;
          background-position: left;
        }
      }

      p {
        margin: 0 0 ms(1);
      }
  }

  @media screen and (orientation: portrait) {
    .leaflet-popup {
      display: none;
    }
  }

  .leaflet-overlay-pane svg path {
    stroke: $red !important;
    fill: transparentize($red, 0.5) !important;
  }

</style>