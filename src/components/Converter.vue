<template>
     <div>
          <b-container>
               <div class="text-center" v-if="currencies.length < 1">
                    <b-spinner variant="primary"></b-spinner>
               </div>

               <b-row id="converter" v-else>
                    <b-col md="3" class="text-left">
                         <b-form-group label="Convert" label-for="convert">
                              <b-form-input 
                                   v-model="originalCurrency" 
                                   id="convert" 
                                   type="text">
                              </b-form-input>
                         </b-form-group>
                    </b-col>

                    <b-col md="2" class="text-left">
                         <b-form-group label="Currency">
                              <v-select id="firstSelect" v-model="originalCurrencySymbol" :options="allCurrencies"></v-select>
                         </b-form-group>
                    </b-col>
                    
                    <b-col md="2">
                         <svg xmlns="http://www.w3.org/2000/svg" height="50px" viewBox="-32 0 512 512" width="50px"><path d="m369.484375 96.765625-85.019531-85.023437c-7.792969-7.792969-15.859375-11.742188-23.976563-11.742188-12.382812 0-24.882812 9.890625-24.882812 31.980469v23.378906c-120.710938 7.128906-220.640625 99.765625-235.492188 221.050781-.832031 6.773438 3.019531 13.257813 9.367188 15.769532 1.796875.710937 3.667969 1.054687 5.515625 1.054687 4.679687 0 9.21875-2.191406 12.109375-6.140625 39.835937-54.429688 103.796875-86.925781 171.09375-86.925781 12.472656 0 25.007812 1.125 37.40625 3.351562v25.742188c0 8.175781 1.636719 15.035156 4.855469 20.378906 4.445312 7.375 11.742187 11.601563 20.027343 11.601563 8.117188 0 16.183594-3.953126 23.976563-11.742188l85.019531-85.023438c18.667969-18.667968 18.667969-49.046874 0-67.710937zm0 0" fill="#00d8e0"/><path d="m438.257812 219.820312c-6.351562-2.511718-13.59375-.417968-17.625 5.089844-39.835937 54.425782-103.796874 86.921875-171.09375 86.921875-12.46875 0-25.003906-1.125-37.40625-3.351562v-25.742188c0-22.089843-12.496093-31.980469-24.882812-31.980469-8.117188 0-16.183594 3.953126-23.972656 11.746094l-85.023438 85.019532c-18.667968 18.667968-18.667968 49.042968 0 67.714843l85.023438 85.019531c7.789062 7.792969 15.855468 11.742188 23.972656 11.742188 12.386719 0 24.882812-9.890625 24.882812-31.980469v-23.378906c120.714844-7.128906 220.644532-99.765625 235.492188-221.046875.832031-6.777344-3.019531-13.261719-9.367188-15.773438zm0 0" fill="#54e360"/><path d="m235.605469 229.261719c0 8.175781 1.636719 15.035156 4.855469 20.378906 4.445312 7.375 11.742187 11.601563 20.027343 11.601563 8.117188 0 16.183594-3.953126 23.976563-11.742188l85.019531-85.023438c18.667969-18.667968 18.667969-49.042968 0-67.710937l-85.019531-85.023437c-7.792969-7.792969-15.859375-11.742188-23.976563-11.742188-12.382812 0-24.882812 9.890625-24.882812 31.980469v23.378906c-3.933594.234375-7.847657.5625-11.738281.976563v145.421874c3.921874.484376 7.839843 1.0625 11.738281 1.761719zm0 0" fill="#00acb3"/><path d="m438.257812 219.820312c-6.351562-2.511718-13.59375-.417968-17.625 5.089844-39.835937 54.425782-103.796874 86.921875-171.09375 86.921875-8.546874 0-17.125-.542969-25.671874-1.589843v145.421874c115.402343-12.226562 209.390624-102.742187 223.757812-220.070312.832031-6.777344-3.019531-13.261719-9.367188-15.773438zm0 0" fill="#00ab5e"/></svg>
                    </b-col>

                    <b-col md="3" class="text-left">
                         <b-form-group label="You get" label-for="converted">
                              <b-form-input v-model="convertToCurrency" id="converted" type="text" disabled></b-form-input>
                         </b-form-group>
                    </b-col>

                    <b-col md="2" class="text-left">
                         <b-form-group label="Currency">
                              <v-select id="secondSelect" v-model="convertToCurrencySymbol" :options="allCurrencies"></v-select>
                         </b-form-group>
                    </b-col>

                    <b-col md="12" class="text-left mt-3">
                        <small>Updated on: {{date}}</small>
                    </b-col>
               </b-row>
          </b-container>
     </div>
</template>

<script>
     import vSelect from 'vue-select'
     import {mapGetters} from 'vuex'
     import 'vue-select/dist/vue-select.css';

     export default {
          components: {
               vSelect     
          },

          data () {
               return {
                    originalCurrencySymbol: this.$store.state.base,
                    convertToCurrencySymbol: 'DKK',
                    originalCurrency: 1,
                    convertToCurrency: '',
                    rate: '',
                    original_crypto_to_btc: '',
                    second_crypto_to_btc: '',
                    tether_rate: ''
               }
          },

          computed: {
               ...mapGetters([
                    'currencies',
                    'allCurrencies',
                    'cryptoPrices'
               ]),

               date() {
                    return this.$store.state.date
               },

               cryptoToCrypto() {
                    if (this.currencies.includes(this.originalCurrencySymbol) || this.currencies.includes(this.convertToCurrencySymbol)) {
                         return false
                    } else {
                         return true
                    }
               },
          },

          watch: {
               originalCurrency: function() {
                    if (!this.isAFiat(this.convertToCurrencySymbol)) {
                         this.convertSecondSelect()
                    } else {
                         this.convert()
                    }
               },

               originalCurrencySymbol: function() {
                    this.commitBase()
                    if (this.isAFiat(this.originalCurrencySymbol)) {
                         this.$store.dispatch('fetchNewRates').then(() => {
                              this.$store.dispatch('fetchSpecificRate', this.originalCurrencySymbol).then(() => {
                                   this.getRate()
                                   this.convert()
                              })
                         })
                    } else if (this.cryptoToCrypto) {
                         this.convertCrypto()
                    } else {
                         const symbol = this.originalCurrencySymbol + 'USDT'
                         if (this.cryptoPrices.find(element => element.symbol === symbol)) {
                              this.convert()
                         } else {
                              this.$store.dispatch('fetchSecondCryptoRate', this.originalCurrencySymbol).then(() => {
                                   this.convertFiatCrypto_baseBtc()
                              })
                         }
                    }
                    
               },

               convertToCurrencySymbol: function() {
                    if (this.isAFiat(this.convertToCurrencySymbol)) {
                         this.$store.dispatch('fetchSpecificRate', this.convertToCurrencySymbol).then(() => {
                              this.getRate()
                              this.convert()
                         })
                    } else if (this.cryptoToCrypto) {
                         this.convertCrypto()
                    } else {
                         const symbol = this.convertToCurrencySymbol + 'USDT'
                         if (this.cryptoPrices.find(element => element.symbol === symbol)) {
                              this.convertSecondSelect()
                         } else {
                              this.$store.dispatch('fetchSecondCryptoRate', this.convertToCurrencySymbol).then(() => {
                                   this.convertFiatCrypto_baseBtc()
                              })
                         }

                    }
                    
               }
          },

          created () {
               this.$store.cache.dispatch('fetchRates').then(() => {
                    this.getRate()
                    this.convert()
                    this.$store.cache.dispatch('fetchExchangeInfo')
                    this.$store.cache.dispatch('fetchCryptoPrice')
               })
          },

          methods: {
               convert() {
                    if (this.isAFiat(this.originalCurrencySymbol)) {
                         if(!this.isAFiat(this.convertToCurrencySymbol)) {
                              this.convertSecondSelect()
                         } else {
                              this.convertToCurrency = ((this.originalCurrency * this.rate)).toLocaleString('da-DK')
                         }
                    } else if (this.cryptoToCrypto) {
                         this.convertToCurrency = this.originalCurrency * (this.original_crypto_to_btc.price / this.second_crypto_to_btc.price)
                    } else {
                         const symbol = this.originalCurrencySymbol + 'USDT'
                         if (this.cryptoPrices.find(element => element.symbol === symbol)) {
                              this.tether_rate = this.cryptoPrices.find(element => element.symbol === symbol)

                              let dollar_rate = ''
                              if (Object.keys(this.$store.state.dollar_to_currency_rate).length) {
                                   dollar_rate = Object.values(this.$store.state.dollar_to_currency_rate)
                              } else {
                                   dollar_rate = this.$store.state.dollar_to_currency_rate
                              }

                              const cryptoRate = this.tether_rate.price * dollar_rate
                              this.convertToCurrency = ((this.originalCurrency * cryptoRate)).toLocaleString('da-DK')
                         } else {
                              this.convertFiatCrypto_baseBtc()
                         }
                    }
               },

               convertSecondSelect() {
                    if (this.isAFiat(this.convertToCurrencySymbol)) {
                         this.convertToCurrency = ((this.originalCurrency * this.rate)).toLocaleString('da-DK')
                    } else if (this.cryptoToCrypto) {
                         this.convertToCurrency = this.originalCurrency * (this.original_crypto_to_btc.price / this.second_crypto_to_btc.price)
                    } else {
                         const symbol = this.convertToCurrencySymbol + 'USDT'
                         if (this.cryptoPrices.find(element => element.symbol === symbol)) {
                              this.tether_rate = this.cryptoPrices.find(element => element.symbol === symbol)

                              let dollar_to_fiat_rate = ''
                              if (Object.keys(this.$store.state.dollar_to_currency_rate).length) {
                                   dollar_to_fiat_rate = Object.values(this.$store.state.dollar_to_currency_rate)
                              } else {
                                   dollar_to_fiat_rate = this.$store.state.dollar_to_currency_rate
                              }

                              this.convertToCurrency = this.originalCurrency * ((1/dollar_to_fiat_rate) / this.tether_rate.price) 
                         } else {
                              this.convertFiatCrypto_baseBtc()
                         }
                    }
               },

               // get fiat rate
               getRate() {
                    const rates = this.$store.state.rates
                    if (this.isAFiat(this.originalCurrencySymbol)) {
                         Object.entries(rates).map(([key,value]) => {
                              if (key == this.convertToCurrencySymbol) {
                                   this.rate = value
                              } 
                         })
                    } 
               },

               // convert crypto to crypto
               convertCrypto() {
                    const symbol_one = this.originalCurrencySymbol + 'BTC'
                    const symbol_two = this.convertToCurrencySymbol + 'BTC'
                    
                    // get both cryptos -> base btc
                    if (this.originalCurrencySymbol == 'BTC') {
                         this.original_crypto_to_btc = {price:"1", symbol:"BTC"}
                    } else {
                         this.original_crypto_to_btc = this.cryptoPrices.find(element => element.symbol === symbol_one);
                    }
                    
                    if (this.convertToCurrencySymbol == 'BTC') {
                         this.second_crypto_to_btc = {price:"1", symbol:"BTC"}
                    } else {
                         this.second_crypto_to_btc = this.cryptoPrices.find(element => element.symbol === symbol_two);
                    }

                    this.convertToCurrency = this.original_crypto_to_btc.price / this.second_crypto_to_btc.price
               },

               convertFiatCrypto_baseBtc() {
                    // get currency to dollar rate
                    let dollar_to_fiat_rate = ''
                    if (Object.keys(this.$store.state.dollar_to_currency_rate).length) {
                         dollar_to_fiat_rate = Object.values(this.$store.state.dollar_to_currency_rate)
                    } else {
                         dollar_to_fiat_rate = this.$store.state.dollar_to_currency_rate
                    }

                    // get fiat -> btc
                    const usdt_btc = this.cryptoPrices.find(element => element.symbol === 'BTCUSDT');
                    const usd_to_btc = 1/usdt_btc.price;
                    const fiat_to_btc = usd_to_btc/dollar_to_fiat_rate

                    // get selected crypto coin -> btc
                    const crypto_to_btc = this.$store.state.rate_base_btc

                    // convert to currency
                    let exchange_to = ''
                    if (this.isAFiat(this.originalCurrencySymbol)) {
                         exchange_to = this.originalCurrency * (fiat_to_btc / crypto_to_btc)
                    } else {
                         exchange_to = this.originalCurrency * (crypto_to_btc / fiat_to_btc)
                    }
                    this.convertToCurrency = exchange_to
               },

               // change the base currency
               commitBase() {
                    this.$store.commit('SET_BASE', this.originalCurrencySymbol)
               },

               // check if selected is a Fiat
               isAFiat(value) {
                    return this.currencies.includes(value)
               }
          },
     }
</script>

<style scoped>
     #converter {
          background: #243333;
          align-items: center;
          padding: 25px;
          margin: 10px;
          color: #ffffff;
     }
</style>