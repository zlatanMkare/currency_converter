<template>
     <div class="row col-md-5">
          <b-col md="6" class="text-left">
               <b-form-group label="Convert" label-for="convert">
                    <b-form-input 
                         v-model="originalCurrency" 
                         id="convert" 
                         type="text">
                    </b-form-input>
               </b-form-group>
          </b-col>
          <b-col md="6" class="text-left">
               <b-form-group label="Currency">
                    <v-select id="firstSelect" v-model="currencyOne" :options="allCurrencies"></v-select>
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

     data () {
          return {
               currencyOne: 'USD',
               originalCurrency: 1
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
          this.commitCurrencyOne(),
          this.commitOriginalCurrency()
     },

     watch: {
          currencyOne: function() {
               this.commitCurrencyOne()
          },
          originalCurrency: function() {
               this.commitOriginalCurrency()
          }
     },

     methods: {
          commitCurrencyOne() {
               this.$store.commit('SET_CURRENCY_ONE', this.currencyOne)
          },
          commitOriginalCurrency() {
               this.$store.commit('SET_ORIGINAL_CURRENCY', this.originalCurrency)
          }
     }
}
</script>