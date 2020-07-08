<template>
  <div class="file-loader">
    <div class="file-loader_status" v-if="!uploading && lastSessionStatus">{{lastSessionStatusText(lastSessionStatus)}} <button @click="SET_LAST_SESSION_STATUS(null)" class="button button_close">&#10060;</button></div>
    <form v-if="!uploading" class="file-loader__form" action="/" @submit.prevent="submit">
      <label class="file-loader__label" for="file">
        <input ref="file" class="file-loader__input" type="file" id="file" @change="handleFileUpload">
      </label>
      <div class="file-loader__content">
        <button type="button" class="button file-loader__button" @click="addFile">Добавить файл</button>
        {{file && file.name}}
      </div>
      <button :disabled="!file" class="button file-loader__button" type="submit">Отправить</button>
    </form>
    <div v-if="uploading" class="loading-session">
      <div class="loading-session__grid grid">
        <div class="grid__header">Номер сессии</div>
        <div class="grid__header">Имя файла</div>
        <div class="grid__header">Размер</div>
        <div class="grid__header">Размер файла в байтах</div>
        <div class="grid__header">Загруженно чанков</div>
        <div class="grid__header">Количество чанков</div>
        <div class="grid__row">{{session.id}}</div>
        <div class="grid__row"><div class="file-name">{{session.fileName}}</div><span v-if="session.fileName && session.fileName.length > 15" class="file-name-tooltip">{{session.fileName}}</span></div>
        <div class="grid__row">{{session.size | dataSize}}</div>
        <div class="grid__row">{{session.byteSize}}</div>
        <div class="grid__row">{{session.uploadedChunks}}</div>
        <div class="grid__row">{{session.chunks}}</div>
    </div>
    <button class="button button_danger" @click="CANCEL_SESSION(r.id)">Отмена</button>
    <ProgressBar :percent="uploadPercentage"/>
    </div>
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
    ...mapGetters('fileLoader', ['file', 'uploadPercentage', 'session', 'uploading', 'lastSessionStatus']),
    lastSessionStatusText () {
      return (s) => {
        switch (s) {
          case 'success':
            return 'Загрузка произошла успешно'
          case 'canceled':
            return ' Загрузка отменена'
          case 'abort':
            return 'Загрузка завершилась с ошибкой'
          default:
            return 'Загрузка произошла успешно'
        }
      }
    }
  },
  methods: {
    ...mapMutations('fileLoader', ['SET_FILE', 'SET_LAST_SESSION_STATUS']),
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
  &_status {
    font-size: 18px;
    margin-bottom: 10px;
    .button_close {
        padding-left: 0;
        font-size: 14px;
        outline: none;
        background: none;
        border: none;
        &:hover {
          transform: scale(1.1) translateY(-3px);
        }
      }
  }

  .button_danger {
    width: 150px;
    margin-bottom: 20px;
  }
  .loading-session__grid {
      grid-template-columns: repeat(6, 1fr);
      margin-bottom: 20px;
      .grid__row {
        .file-name {
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          padding-left: 15px;
          width: 150px;
          position: relative;
          ~ span.file-name-tooltip {
            display: none;
          }
          &:hover {
            ~ span.file-name-tooltip {
              display: block;
              position: absolute;
              padding: 5px;
              right: -30px;
              background: rgb(248, 243, 243);
              border-radius: 5px;
              z-index: 1;
              opacity: 0.9;
            }
          }
        }
      }
  }
}

</style>
