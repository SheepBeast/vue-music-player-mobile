<template>
  <div class="timeline">
    <div class="thumb shadow-3d"
      :style="{ left: currentPostion + 'px' }"
      @mousedown="mousedown"
      @mousemove="mousemove"
      @mouseup="mouseup"
    >
      <span>{{currentTimeString}}</span> / <span>{{durationString}}</span>
      <div class="expect-time"
        :class="{left: direction == 'left', right: direction == 'right'}"
        v-show="direction"
      >
        <span>{{slid > 0 ? expectCurrentTimeString : currentTimeString }}</span> / <span>{{durationString}}</span>
      </div>
      <div class="trajectory" :style="{ 'border-left-width': currentPostion +'px' }"></div>
    </div>
  </div>
</template>

<script>
import pipe from "./pipe";
import { timeTransform } from "../../assets/js/util";
export default {
  props: {
    defaultValue: Number,
    minValue: Number,
    maxValue: Number
  },
  data() {
    return {
      slid: 0,
      grabbing: false,
      seeking: false,
      sliding: false,
      min: 0,
      max: null,
      direction: "", // left, right
      seekingPos: null
    };
  },
  computed: {
    ...Vuex.mapGetters("musicPlayer", [
      "currentTime",
      "duration",
      "currentTimeString",
      "durationString"
    ]),
    currentPostion() {
      return this.seeking
        ? this.slid
        : /* this.duration == 0 ? 0 : */ this.currentTime /
            this.duration *
            this.max;
    },
    expectCurrentTimeString() {
      return timeTransform(this.slid / this.max * this.duration);
    }
  },
  methods: {
    mousedown(e) {
      this.slid = this.currentPostion;
      this.seekingPos = e.pageX;
      this.grabbing = this.seeking = true;
      this.direction = "right";
    },
    mousemove(e) {
      if (this.grabbing && !this.sliding) {
        let lastPos = e.pageX,
          offset = lastPos - this.seekingPos,
          pos = this.slid + offset;

        if (offset != 0) {
          this.direction = offset > 0 ? "right" : "left";
        }
        this.seekingPos = lastPos;
        if (pos < 0) {
          pos = 0;
        } else if (pos > this.max) {
          pos = this.max;
        }
        this.slid = pos;
        this.sliding = false;
      }
    },
    mouseup(e) {
      this.grabbing = false;
      this.direction = "";

      pipe.$emit("seeked", {
        currentTime: this.slid / this.max * this.duration
      });
      this.$nextTick(() => {
        setTimeout(
          self => {
            self.seeking = false;
          },
          1000,
          this
        );
      });
    },
    init() {
      this.max = this.$el.offsetWidth
      if (
        this.defaultValue &&
        this.defaultValue >= this.minValue &&
        this.defaultValue <= this.maxValue
      ) {
        this.slid = this.defaultValue / this.maxValue * this.max;
      }
    }
  },
  mounted() {
    this.init();
  }
};
</script>