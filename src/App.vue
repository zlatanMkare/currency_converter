<template>
     <div id="app">
          <Header msg="Currency Converter"/>
          <converter></converter>
     </div>
</template>

<script>
import Header from './components/Header.vue'
import Converter from './components/Converter.vue'

export default {
     name: 'App',
     components: {
          Header,
          Converter
     }
}
</script>

<style>
     #app {
          font-family: Avenir, Helvetica, Arial, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-align: center;
          color: #2c3e50;
          margin-top: 60px;
          background: #eeeeee;
     }
</style>
