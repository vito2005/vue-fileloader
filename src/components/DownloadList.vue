<template>
  <div class="download-list">
    <h1>Список загрузочных сессий</h1>
    <div class="download-list__common-stats">
      Количество сессий: общее - <span>{{commonStats.common}}</span>
      <span>, успешно - {{commonStats.success}}</span>
      <span>, отменено - {{commonStats.canceled}}</span>
      <span>, ошибка - {{commonStats.error}}</span>.
    </div>
    <div class="download-list__grid grid">
        <div class="grid__header">Состояние сессии</div>
        <div class="grid__header">Номер сессии</div>
        <div class="grid__header">Имя файла</div>
        <div class="grid__header">Размер</div>
        <div class="grid__header">Полный размер файла в байтах</div>
        <div class="grid__header">Количество загруженных чанков</div>
        <div class="grid__header">Количество чанков</div>
        <div class="grid__header"></div>
        <template v-for="(r,i) in Object.values(uploadRecords)">
          <div :key="i+'status'" class="grid__row">{{status(r.status)}}</div>
          <div :key="i+'id'" class="grid__row">{{r.id}}</div>
          <div :key="i+'fileName'" class="grid__row"><div class="file-name">{{r.fileName}}</div><span v-if="r.fileName.length > 15" class="file-name-tooltip">{{r.fileName}}</span></div>
          <div :key="i+'size'" class="grid__row">{{r.size}}</div>
          <div :key="i+'byteSize'" class="grid__row">{{r.byteSize}}</div>
          <div :key="i+'uploadedChunks'" class="grid__row">{{r.uploadedChunks}}</div>
          <div :key="i+'chunks'" class="grid__row">{{r.chunks}}</div>
          <div :key="i+'removeRow'" class="grid__row"><button class="button button_danger" @click="REMOVE_RECORD(r.id)">Удалить</button></div>
        </template>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'DownloadList',
  computed: {
    ...mapGetters('statistics', ['uploadRecords', 'commonStats']),
    status () {
      return (s) => {
        switch (s) {
          case 'success':
            return 'Успешно'
          case 'canceled':
            return 'Отменено'
          case 'abort':
            return 'Ошибка'
          default:
            return 'Успех'
        }
      }
    }
  },
  methods: {
    ...mapMutations('statistics', ['REMOVE_RECORD'])
  }

}
</script>

<style scoped lang="scss">
.download-list {
  margin: 0 auto;
  &__common-stats {
    font-size: 1.3rem;
    margin-bottom: 20px;
  }
  &__grid {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    .grid__header {
      padding: 15px 5px;
      margin: 10px 0;
      border-bottom: 2px solid black;
      border-top: 2px solid black;

    }
    .grid__row {
      padding: 10px 0;
      border-bottom: 1px solid black;
      align-self: center;
      min-height: 30px;
      position: relative;
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
