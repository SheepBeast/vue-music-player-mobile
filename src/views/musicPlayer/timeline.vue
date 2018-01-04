<template>
  <div class="timeline">
    <div class="thumb shadow-3d" :style="{ left: currentPostion + 'px' }" @touchstart="touchstart" @touchmove="touchmove" @touchend="touchend">
      <span>{{currentTimeString}}</span> /
      <span>{{durationString}}</span>
      <div class="expect-time" :class="{left: direction == 'left', right: direction == 'right'}" v-show="direction">
        <span>{{slid > 0 ? expectCurrentTimeString : currentTimeString }}</span> /
        <span>{{durationString}}</span>
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
      touchstart(e) {
        this.slid = this.currentPostion;
        this.seekingPos = e.changedTouches[0].pageX;
        this.seeking = true;
        this.direction = "right";
      },
      touchmove(e) {
        if (!this.sliding) {
          let lastPos = e.changedTouches[0].pageX,
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
      touchend(e) {
        let self = this
        this.direction = "";

        pipe.$emit("seeked", {
          currentTime: this.slid / this.max * this.duration
        });
        this.$nextTick(() => {
          setTimeout(
            () => {
              self.seeking = false;
            },
            1000
          );
        });
      },
      init() {
        let timer, self = this, el = this.$el
        function checkMax() {
          clearTimeout(timer)
          timer = setTimeout(function () {
            let width = el.offsetWidth
            if (width > 0) {
              self.max = width
              clearTimeout(timer)
            } else {
              checkMax()
            }
          }, 20)
        }

        checkMax()

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