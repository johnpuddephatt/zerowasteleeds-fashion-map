<template>
    <div class="category-panel" @mouseleave="currentlyHovered = null">
      <button class="category-panel--entry" :class="{selected: (entry.id == selectedEntryID)}" v-for="entry in entriesSortedByDistance" :key="entry.id" :ref="entry.id" @keyup.enter="$emit('menu-entry-selected',entry.id)" @click="$emit('menu-entry-selected',entry.id)">
        <h3 class="category-panel--entry--title" >{{ entry.name }}</h3>
        <span class="category-panel--entry--location" v-if="entry.distance">{{ entry.distance }} miles</span>
        <span class="category-panel--entry--location" v-else-if="entry.postcode">{{ entry.postcode }}</span>
      </button>
    </div>
</template>

<script>


export default {
  name: 'Category',
  props: ['slug','selectedEntryID', 'userLatLng', 'menuOpen', 'isLandscape'],
  components: {

  },
  data() {
    return {
      entries: [],
      currentlyHovered: null,
      categoryLoaded: false
    }
  },
  watch: {
    userLatLng: function(userLatLng) {
      if(!userLatLng.length) {
        this.getCategory(this.slug);

      }
    },
    entries: function(entries) {
      this.$emit('filtered-entries', entries)
    },
    selectedEntryID: function (selectedEntryID) {
      this.scrollToSidebarEntry(selectedEntryID);
    },
  },
  computed: {
    entriesSortedByDistance() {
      if(this.userLatLng.length) {
        return this.entries.map( (entry) => {
          if(entry.latitude && entry.longitude) {
            entry.distance = this.distanceFromUserLatLng(entry);
          }
          else {
            entry.distance == null;
          }
          return entry;
        }).sort( (a,b) => {
          if(!b.distance) {
            return -1;
          }
          else {
            return a.distance - b.distance;
          }
        });
      }
      else {
        return this.entries
      }
    }
  },
  methods: {
    distanceFromUserLatLng: function(entry) {
      let distance = this.distance(entry.latitude,entry.longitude, this.userLatLng[0], this.userLatLng[1]);
      return Math.round(distance * 10) / 10;
    },
    getCategory(slug) {
      axios
        .get(`/api/category/${ slug }.json`)
        .then(response => {
          this.entries = response.data;
        })
        .catch(error => {
          console.log(error)
          this.errored = true
        })
        .finally(() => {
          this.categoryLoaded = true;
        })
    },
    distance(lat1, lon1, lat2, lon2) {
    	if ((lat1 == lat2) && (lon1 == lon2)) {
    		return 0;
    	}
    	else {
    		var radlat1 = Math.PI * lat1/180;
    		var radlat2 = Math.PI * lat2/180;
    		var theta = lon1-lon2;
    		var radtheta = Math.PI * theta/180;
    		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    		if (dist > 1) {
    			dist = 1;
    		}
    		dist = Math.acos(dist);
    		dist = dist * 180/Math.PI;
    		dist = dist * 60 * 1.1515;
        // dist = dist * 1.609344;
    		return dist;
    	}
    },
    scrollToSidebarEntry(selectedEntryID) {
      if(selectedEntryID && this.$refs[selectedEntryID]) {
        let clickedMenuElement = this.$refs[selectedEntryID][0];
        if(clickedMenuElement) {
          if(!this.currentlyHovered && (this.isLandscape || this.menuOpen)) {
            clickedMenuElement.scrollIntoView({behavior: "smooth", block: "center", inline: "center"});
          }
        }
      }
    }
  },
  mounted () {
    this.getCategory(this.slug);
    if(this.selectedEntryID) {
      this.scrollToSidebarEntry(this.selectedEntryID);
    }
  }
}
</script>

<style lang="scss">
@import '../../styles/base.scss';

.category-panel {
  flex: 1 1 60vh;
  overflow-y: auto;

  &--entry {
    width: 100%;
    display: flex;
    flex-direction: row;
    text-align: left;
    padding: ms(2) ms(2) ms(2) ms(2)/2;
    cursor: pointer;
    border-left: ms(2)/2 solid transparent;

    + .category-panel--entry {
      border-top: 1px solid $light-gray;
    }

    &:hover {
      background-color: $light-gray;

      .category-panel--entry--location {
        background-color: $medium-gray;
      }
    }

    &--title {
      text-transform: capitalize;
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-right: auto;
    }

    &--location {
      font-size: ms(-1);
      margin-left: ms(-1);
      background-color: $light-gray;
      border-radius: 1em;
      padding: 0 ms(-2);
      color: $gray;
    }

    &.selected {
      border-top: none;
      border-bottom: none;
      border-left-color: $brand-green;
      background-color: transparentize($brand-green, 0.85);

      .category-panel--entry--location {
        background-color: $brand-green;
        color: white;
      }


    }
  }
}

</style>