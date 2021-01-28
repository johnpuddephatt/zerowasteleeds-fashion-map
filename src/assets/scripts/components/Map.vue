<template>
  <l-map
    id="map"
    ref="map"
    :zoom="zoom"
    :minZoom="12"
    :center="center"
    :scrollWheelZoom="scrollWheelZoom"
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
      <l-marker :ref="entry.id" v-for="entry in entriesWithLatLng" :key="entry.id" :lat-lng="getLatLng(entry)" @keyup.enter="markerClicked(entry.id)" @click="markerClicked(entry.id)">
        <l-popup :options="{offset: [0, -34], closeButton: false}">
          <div class="popup-header">
            <p>{{ entry.category}}</p>
            <h3 class="entry-title" v-html="entry.name"></h3>
            <p class="entry-address" v-if="entry.address">
              {{ entry.address.replace(entry.postcode,'').toLowerCase() }}
              <span v-if="entry.postcode">{{entry.postcode}}</span>
              </p>
            <p v-if="entry.description">{{entry.description}}</p>
            <ul class="entry-links">
              <li class="entry-link" v-if="entry.website"><a :href="entry.website" target="_blank">Website</a></li>
              <li class="entry-link" v-if="entry.shop"><a :href="entry.shop" target="_blank">Shop</a></li>
              <li class="entry-link" v-if="entry.shop2"><a :href="entry.shop2" target="_blank">Shop 2</a></li>
              <li v-if="entry.facebook"><a class="entry-social" :href="entry.facebook" title="Facebook" aria-label="Facebook" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg></a></li>
              <li v-if="entry.twitter"><a class="entry-social" :href="entry.twitter" title="Twitter" aria-label="Twitter" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 248 204"><path d="M221.95 51.29c.15 2.17.15 4.34.15 6.53 0 66.73-50.8 143.69-143.69 143.69v-.04c-27.44.04-54.31-7.82-77.41-22.64 3.99.48 8 .72 12.02.73 22.74.02 44.83-7.61 62.72-21.66-21.61-.41-40.56-14.5-47.18-35.07a50.338 50.338 0 0022.8-.87C27.8 117.2 10.85 96.5 10.85 72.46v-.64a50.18 50.18 0 0022.92 6.32C11.58 63.31 4.74 33.79 18.14 10.71a143.333 143.333 0 00104.08 52.76 50.532 50.532 0 0114.61-48.25c20.34-19.12 52.33-18.14 71.45 2.19 11.31-2.23 22.15-6.38 32.07-12.26a50.69 50.69 0 01-22.2 27.93c10.01-1.18 19.79-3.86 29-7.95a102.594 102.594 0 01-25.2 26.16z"/></svg></a></li>
              <li v-if="entry.instagram"><a class="entry-social" :href="entry.instagram" title="Instagram" aria-label="Instagram" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg></a></li>
              <li v-if="entry.depop"><a class="entry-social" :href="entry.depop" title="Depop" aria-label="Depop" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 113.9 116.3" width="113.9" height="116.3"><path d="M0 77.8C0 52.5 18 37 46.8 37h29.8V0h37.3v116.3H46.7C18 116.4 0 101.4 0 77.8zm39.4-1.2c0 9.7 5.9 14.7 17.1 14.7h19.9V61.7H56.7c-11.3 0-17.3 5.1-17.3 14.9z" fill="#fff"/></svg></a></li>
              <li v-if="entry.ebay"><a class="entry-social entry-social__ebay" :href="entry.ebay" title="eBay" aria-label="eBay" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 120.324" width="300" height="120.324"><path d="M38.866 26.308C17.721 26.308.1 35.28.1 62.345c0 21.442 11.849 34.944 39.312 34.944 32.327 0 34.399-21.294 34.399-21.294H58.147s-3.358 11.466-19.69 11.466c-13.302 0-22.87-8.986-22.87-21.58H75.45v-7.904c0-12.46-7.91-31.669-36.583-31.669zM38.32 36.41c12.663 0 21.295 7.758 21.295 19.384h-43.68c0-12.343 11.266-19.384 22.385-19.384z" fill="#e53238"/><path d="M75.438.1v83.597c0 4.745-.339 11.408-.339 11.408h14.94s.536-4.785.536-9.159c0 0 7.381 11.548 27.451 11.548 21.135 0 35.49-14.673 35.49-35.695 0-19.557-13.186-35.286-35.456-35.286-20.854 0-27.334 11.262-27.334 11.262V.1zm38.766 36.753c14.352 0 23.478 10.652 23.478 24.946 0 15.328-10.54 25.355-23.375 25.355-15.318 0-23.581-11.96-23.581-25.219 0-12.354 7.414-25.082 23.478-25.082z" fill="#0064d2"/><path d="M190.645 26.308c-31.812 0-33.852 17.42-33.852 20.203h15.834s.83-10.17 16.926-10.17c10.46 0 18.564 4.788 18.564 13.992v3.276h-18.564c-24.645 0-37.674 7.21-37.674 21.84 0 14.398 12.038 22.233 28.307 22.233 22.171 0 29.313-12.251 29.313-12.251 0 4.872.376 9.674.376 9.674h14.076s-.546-5.952-.546-9.76V52.431c0-21.58-17.407-26.123-32.76-26.123zm17.472 37.129v4.368c0 5.697-3.515 19.86-24.212 19.86-11.333 0-16.192-5.655-16.192-12.216 0-11.935 16.364-12.012 40.404-12.012z" fill="#f5af02"/><path d="M214.879 29.041h17.813l25.565 51.218 25.507-51.218H299.9l-46.46 91.183h-16.925l13.406-25.418z" fill="#86b817"/></svg></a></li>
            </ul>
          </div>
          <button id="popup-close" aria-label="Close popup" class="popup--close" @click="closePopup(entry.id)">×</button>
        </l-popup>
        <l-icon
          :iconSize="selectedEntryID == entry.id ? [50,82] : [25,41]"
          :icon-anchor="selectedEntryID == entry.id ? [25,82] : [12.5,41]"
          :popupAnchor="[0,-37]"
          :className="selectedEntryID == entry.id ? 'large' : ''"
          :icon-url="selectedEntryID == entry.id ? '/assets/images/marker-icon-red.svg' : '/assets/images/marker-icon.svg'"
          :iconRetinaUrl="selectedEntryID == entry.id ? '/assets/images/marker-icon-red.svg' : '/assets/images/marker-icon.svg'"
           />
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
import * as focusTrap from 'focus-trap'; // ESM

export default {
  name: 'Map',
  props: ['entries','selectedEntryID', 'userLatLng', 'isLandscape'],
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
      // url: 'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png',
      url: 'https://stamen-tiles.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.png',
    	maxZoom: 24,
    	attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
      scrollWheelZoom: window.self == window.top,
      mapOptions: {
        zoomSnap: 0.5,
        zoomControl: false,
        zoomAnimationThreshold: 8,
      },
      showMap: true,
      mapActive: false,
      currentPopup: null,
      popupFocusTrap: null,
      clusterOptions: {
        disableClusteringAtZoom: 17,
        maxClusterRadius: 50,
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
        this.$refs.map.mapObject.zoomOut(6);
      }
    },
    selectedEntryID: function (selectedEntryID) {
      console.log(selectedEntryID);

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

            if(this.popupFocusTrap) {
              this.popupFocusTrap.deactivate();
            }
            else {
              this.popupFocusTrap = focusTrap.createFocusTrap(marker.getPopup()._container);
              this.popupFocusTrap.activate();
            }
          });

          this.currentPopup = marker;
        }
      }
      else {
        this.$refs.map.mapObject.zoomOut(3);
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
      console.log('marker clicked');
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

  .leaflet-container :focus {
    outline: -webkit-focus-ring-color auto thin !important; /* Fallback for some browsers that don't support `revert`. */
    outline: revert !important;
  }


  .leaflet-marker-icon {
    &:focus {
      outline: 3px solid blue !important;
    }
  }

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
      border: 1px solid $medium-gray;
      border-bottom: none;
      position: relative;
      width: 100vw;
      font-size: 1rem !important;
      padding: ms(0) ms(-2);
      // border-radius: 0 !important;
      box-shadow: 13px 19px 12px -7px rgba(0,0,0,0.2) !important;

      .popup--close {
        position: absolute;
        top: ms(0);
        line-height: 1;
        right: ms(0);
        font-size: ms(4);
        color: $gray;
      }

      .entry-title {
        text-transform: capitalize;
        font-size: ms(2);
        font-weight: 400;
        margin-bottom: ms(-1);
      }

      .entry-address {
        font-size: ms(-1);
        color: $gray;
        text-transform: capitalize;

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
        margin: 0 0 ms(0);
      }

      .entry-links {
        display: flex;
        flex-direction: row;

        > * + * {
          margin-left: ms(-6);
        }
      }

      .entry-link {
        margin-bottom: ms(0);

        a {
          display: inline-block;
          color: $dark-gray;
          background-color: $medium-gray;
          border-radius: 99999px;
          line-height: ms(4);
          padding: 0 ms(-2);
        }

      }

      .entry-social {
        margin-bottom: ms(0);
        display: inline-block;
        padding: ms(-4);
        background-color: $dark-gray;
        border-radius: 99999px;

        svg {
          display: block;
          width: ms(0);
          height: ms(0);

          path {
            fill: #fff
          }
        }

        &__ebay {
          padding: ms(-8);
          svg {
            width: ms(2);
            height: ms(2);
          }
        }
      }

      .popup-footer {
        border-top: 1px solid $light-gray;
        padding-top: ms(0);
      }
  }

  @media screen and (orientation: portrait) {
    .leaflet-popup {
      // display: none;
    }
  }

  .leaflet-overlay-pane svg path {
    stroke: $red !important;
    fill: transparentize($red, 0.5) !important;
  }

</style>