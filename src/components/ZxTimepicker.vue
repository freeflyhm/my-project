<template>
  <div>
    <div v-if="showTimepicker" class="zxtimepicker" :style="{ top: top + 'px', left: left + 'px' }">
      <div class="arrow"></div>
      <div class="timepicker-inner" v-show="displayMainView">
        <div class="timepicker-body">
          <div class="timepicker-range">
            <span class="hover"><i class="glyphicon glyphicon-chevron-up"></i></span>
            <span>&nbsp;</span>
            <span class="hover"><i class="glyphicon glyphicon-chevron-up"></i></span>
            <span class="hover" @click="hourSelect">{{hour}}</span>
            <span>:</span>
            <span class="hover" @click="minuteSelect">{{minute}}</span>
            <span class="hover"><i class="glyphicon glyphicon-chevron-down"></i></span>
            <span>&nbsp;</span>
            <span class="hover"><i class="glyphicon glyphicon-chevron-down"></i></span>
          </div>
        </div>
      </div>
      <div class="timepicker-inner" v-show="displayHourView">
        <div class="timepicker-body">
          <div class="timepicker-range">
            <template v-for="h in hourNames">
              <span class="hour" @click="hourToMain(h)">{{h}}</span>
            </template>
          </div>
        </div>
      </div>
      <div class="timepicker-inner" v-show="displayMinuteView">
        <div class="timepicker-body">
          <div class="timepicker-range">
            <template v-for="m in minuteNames">
              <span class="minute" @click="minuteToMain(m)">{{m}}</span>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EventListener from '../util/eventListener.js'

export default {
  // props: [
  //   'top',
  //   'left'
  // ],
  data: function () {
    return {
      fromTime: '',
      hour: '00',
      minute: '00',
      top: 0,
      left: 0,
      showTimepicker: false,
      displayMainView: false,
      displayHourView: false,
      displayMinuteView: false,
      hourNames: [
        '00', '01', '02', '03',
        '04', '05', '06', '07',
        '08', '09', '10', '11',
        '12', '13', '14', '15',
        '16', '17', '18', '19',
        '20', '21', '22', '23'
      ],
      minuteNames: [
        '00', '05', '10', '15',
        '20', '25', '30', '35',
        '40', '45', '50', '55'
      ]
    }
  },
  computed: {
    computeTime () {
      return this.hour + ':' + this.minute
    }
  },
  ready () {
    this._closeEvent = EventListener.listen(window, 'click', (e) => {
      var target = e.target
      if (this.showTimepicker === true &&
        !(target.nodeName === 'INPUT' && target.className === 'time') &&
        !this.$el.contains(target)) {
        this.close()
      }
    })
  },
  attached: function () {},
  methods: {
    show (fromTime, top, left) {
      this.fromTime = fromTime
      this.hour = '00'
      this.minute = '00'
      this.top = top
      this.left = left
      this.showTimepicker = true
      this.displayMainView = true
      this.displayHourView = false
      this.displayMinuteView = false
    },
    hourSelect () {
      // this.showTimepicker = true
      this.displayMainView = false
      this.displayHourView = true
      // this.displayMinuteView = false
    },
    hourToMain (h) {
      this.hour = h
      this.displayMainView = true
      this.displayHourView = false

      this.$dispatch('change-time', this.fromTime, this.computeTime)
    },
    minuteSelect () {
      this.displayMainView = false
      this.displayMinuteView = true
    },
    minuteToMain (m) {
      this.minute = m
      this.displayMainView = true
      this.displayMinuteView = false

      this.$dispatch('change-time', this.fromTime, this.computeTime)
    },
    close () {
      this.fromTime = ''
      this.top = 0
      this.left = 0
      this.showTimepicker = false
      this.displayMainView = false
      this.displayHourView = false
      this.displayMinuteView = false
    }
  },
  components: {}
}
</script>

<style scoped>
  .zxtimepicker {
    position: absolute;
    border: 1px solid #ddd;
    border-radius: 5px;
    background: #fff;
    margin-top: 8px;
    z-index: 1000;
    box-shadow: 0 6px 12px rgba(0,0,0,0.175);
  }

  .arrow {
    position: absolute;
    top: -8px;
    left: 8px;
    width: 0;
    height: 0;
    border-width: 0 8px 8px;
    border-style: dashed dashed solid dashed;
    border-color: transparent transparent #ddd transparent;
  }

  .timepicker-inner{
      width: 200px;
  }

  .timepicker-body{
      padding: 8px;
  }

  .timepicker-range span {
    display: inline-block;
    width: 58px;
    height: 50px;
    line-height: 48px;
    border-radius: 4px;
    text-align: center;
  }

  .timepicker-range span.hover {
    cursor: pointer;
  }

  .timepicker-range span.hour {
    width: 45px;
    height: 30px;
    line-height: 28px;
    cursor: pointer;
  }

  .timepicker-range span.minute {
    width: 45px;
    height: 50px;
    line-height: 48px;
    cursor: pointer;
  }

  .timepicker-range span.hover:hover,
  .timepicker-range span.hour:hover,
  .timepicker-range span.minute:hover {
    background-color : #eee;
  }
</style>
