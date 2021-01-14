<template>
     <div class="row col-md-5">
          <b-col md="6" class="text-left">
               <b-form-group label="You get" label-for="converted">
                    <b-form-input :value="convertedCurrency" id="converted" type="text" disabled></b-form-input>
               </b-form-group>
          </b-col>

          <b-col md="6" class="text-left">
               <b-form-group label="Currency">
                    <v-select id="secondSelect" v-model="currencyTwo" :options="allCurrencies"></v-select>
               </b-form-group>
          </b-col>
     </div>
</template>

<script>
import {mapGetters} from 'vuex'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';

export default {
     components: {
          vSelect     
     },

     props: {
          convertedCurrency: [ String, Number ]
     },

     data () {
          return {
               currencyTwo: 'DKK',
          }
     },

     computed: {
          ...mapGetters([
               'currencies',
               'allCurrencies',
               'cryptoPrices'
          ]),
     },

     created () {
          this.commitCurrencyTwo()
     },

     watch: {
          currencyTwo: function() {
               this.commitCurrencyTwo()
          }
     },

     methods: {
          commitCurrencyTwo() {
               this.$store.commit('SET_CURRENCY_TWO', this.currencyTwo)
          }
     }
}
</script>

<style lang="css" scoped>
     #converted {
          font-weight: 900;
          color: #243333;
     }
</style>