<template>
     <div id="app">
          <Header/>
           <transition name="page-transition">
               <router-view>
               </router-view>
          </transition>
     </div>
</template>

<script>
import Header from './components/Header.vue'

export default {
     name: 'App',
     components: {
          Header
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
          background: #ffffff;
     }
     .page-transition-enter-active {
          animation: enter 1s;
          animation-delay: .5s;
          opacity: 0;
     }
     .page-transition-leave-active {
          animation: leave .5s;
     }
     @keyframes enter {
          from {
               transform: translateY(-30px);
               opacity: 0;
          }
          to {
               transform: translateY(0px);
               opacity: 1;
          }
     }
     @keyframes leave {
          from {
               transform: translateY(0px);
          }
          to {
               transform: translateY(30px);
               opacity: 0;
          }
     }
</style>
