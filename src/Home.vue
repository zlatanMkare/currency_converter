<template>
     <div>
          <converter></converter>
          <news></news>
     </div>
</template>

<script>
     import Converter from './components/Converter.vue'
     import News from './components/News.vue'

     export default {
          components: {
               Converter,
               News
          }
     }
</script>