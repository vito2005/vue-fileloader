<template>
<div class="progress-bar">
  <div
  v-if="percent"
  :class="{ 'progress-bar__percent': 1,
  'progress-bar__percent_text-blink': percent === 100 }"
  >{{percent}} %</div>
  <div class="progress-bar__progress-wrapper">
    <div class="progress-bar__completed-text">
      {{percent !== 100 ? '': 'Выполнено'}}
    </div>
    <div class="progress-bar__progress" :style="{ 'width': this.percent + '%' }" ></div>
  </div>
</div>
</template>

<script>
export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      loading: null,
      progress: 0
    }
  }
}
</script>

<style lang="scss" scoped>
.progress-bar {
  &__percent {
    color:#999;
    font-size: 2rem;
    font-weight: 400;
    text-align: center;
    margin-bottom: 0.5rem;
    &_text-blink {
      animation: blink .7s ease-in-out .1s;
    }
    @keyframes blink {
      0% {
        opacity: 1;
      }
      50% {
        opacity: 0.2;
      }
      100% {
        opacity: 1;
      }
    }
  }
  &__completed-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #fdb5ca;
    font-size: 0.9rem;
  }
  &__progress-wrapper {
    margin: 0 auto;
    width: 406px;
    height: 21px;
    border-radius: 13px;
    padding: 3px;
    box-sizing: border-box;
    position: relative;
  }
   &__progress {
    width: 0;
    height: 18px;
    background: #f60d54;
    border-radius: 13px;
    }
}
</style>
