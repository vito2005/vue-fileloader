<template>
  <div class="file-loader">
    <form class="file-loader__form" action="/" @submit.prevent="submit">
      <label class="file-loader__label" for="file">
        <input ref="file" class="file-loader__input" type="file" id="file" @change="handleFileUpload">
      </label>
      <div class="file-loader__content">
        <button type="button" class="file-loader__button" @click="addFile">Добавить файл</button>
        {{file && file.name}}
      </div>
      <button class="file-loader__button" type="submit">Отправить</button>
      <ProgressBar :percent="uploadPercentage"/>
    </form>
  </div>
</template>

<script>

import { mapMutations, mapGetters, mapActions } from 'vuex'
import ProgressBar from '@/components/ProgressBar'
export default {
  components: {
    ProgressBar
  },
  computed: {
    ...mapGetters('fileLoader', ['file', 'uploadPercentage'])
  },
  methods: {
    ...mapMutations('fileLoader', ['SET_FILE']),
    ...mapActions('fileLoader', { submit: 'sendFile' }),
    addFile () {
      this.$refs.file.click()
    },
    handleFileUpload (e) {
      const file = e.target.files[0]
      file.id = +new Date()
      this.SET_FILE(file)
    }
  }
}
</script>

<style lang="scss" scoped>
.file-loader {
  &__input {
    position: absolute;
    top: -500px;
  }
  &__button {
    margin: 10px;
  }
}

</style>
