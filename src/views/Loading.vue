<template>
  <div class="loading">
    <div class="loading__header">
      <h1>Страница загрузки файла</h1>
    </div>
    <div class="loading__body">
      <FileLoader/>
    </div>
  </div>
</template>
<script>
import FileLoader from '@/components/FileLoader.vue'

export default {
  name: 'Loading',
  components: {
    FileLoader
  }
}
</script>
