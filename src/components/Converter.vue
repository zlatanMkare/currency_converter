<template>
     <div>
          <b-container>
               <div class="text-center" v-if="currencies.length < 1">
                    <b-spinner variant="primary"></b-spinner>
               </div>

               <b-row id="converter" v-else>
                    <currency-one></currency-one>
                    
                    <divider></divider>

                    <currency-two :converted-currency="this.convertedCurrency"></currency-two>
               </b-row>
          </b-container>
          <b-container>
               <b-row>
                    <foot-note></foot-note>
               </b-row>
          </b-container>
     </div>
</template>

<script>
     import {mapGetters} from 'vuex'
     import CurrencyOne from './CurrencyOne.vue'
     import CurrencyTwo from './CurrencyTwo.vue'
     import Divider from './Divider.vue'
     import FootNote from './FootNote.vue'

     export default {
          components: {
               CurrencyOne,
               CurrencyTwo,
               Divider,
               FootNote
          },

          data () {
               return {
                    convertedCurrency: '',
                    rate: '',
                    originalCryptoToBtc: '',
                    secondCryptoToBtc: '',
                    tetherRate: ''
               }
          },

          computed: {
               ...mapGetters([
                    'currencies',
                    'allCurrencies',
                    'cryptoPrices'
               ]),

               originalCurrency() {
                    return parseInt(this.$store.state.originalCurrency)
               },

               currencyOne() {
                    return this.$store.state.currencyOne
               },

               currencyTwo() {
                    return this.$store.state.currencyTwo
               },

               cryptoToCrypto() {
                    if (this.currencies.includes(this.currencyOne) || this.currencies.includes(this.currencyTwo)) {
                         return false
                    } else {
                         return true
                    }
               },
          },

          watch: {
               originalCurrency: function() {
                    if (!this.isAFiat(this.currencyTwo)) {
                         this.convertSecondSelect()
                    } else {
                         this.convert()
                    }
               },

               currencyOne: function() {
                    this.commitBase()
                    if (this.isAFiat(this.currencyOne)) {
                         this.$store.dispatch('fetchNewRates').then(() => {
                              this.$store.dispatch('fetchSpecificRate', this.currencyOne).then(() => {
                                   this.getRate()
                                   this.convert()
                              })
                         })
                    } else if (this.cryptoToCrypto) {
                         this.convertCryptoToCrypto()
                    } else {
                         const symbol = this.currencyOne + 'USDT'
                         if (this.cryptoPrices.find(element => element.symbol === symbol)) {
                              this.convert()
                         } else {
                              this.$store.dispatch('fetchSecondCryptoRate', this.currencyOne).then(() => {
                                   this.convertFiatToCrypto()
                              })
                         }
                    }
                    
               },

               currencyTwo: function() {
                    if (this.isAFiat(this.currencyTwo)) {
                         this.$store.dispatch('fetchSpecificRate', this.currencyTwo).then(() => {
                              this.getRate()
                              this.convert()
                         })
                    } else if (this.cryptoToCrypto) {
                         this.convertCryptoToCrypto()
                    } else {
                         const symbol = this.currencyTwo + 'USDT'
                         if (this.cryptoPrices.find(element => element.symbol === symbol)) {
                              this.convertSecondSelect()
                         } else {
                              this.$store.dispatch('fetchSecondCryptoRate', this.currencyTwo).then(() => {
                                   this.convertFiatToCrypto()
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
                    if (this.isAFiat(this.currencyOne)) {
                         if(!this.isAFiat(this.currencyTwo)) {
                              this.convertSecondSelect()
                         } else {
                              this.convertedCurrency = ((this.originalCurrency * this.rate)).toLocaleString('da-DK')
                         }
                    } else if (this.cryptoToCrypto) {
                         this.convertedCurrency = this.originalCurrency * (this.originalCryptoToBtc.price / this.secondCryptoToBtc.price)
                    } else {
                         const symbol = this.currencyOne + 'USDT'
                         if (this.cryptoPrices.find(element => element.symbol === symbol)) {
                              this.tetherRate = this.cryptoPrices.find(element => element.symbol === symbol)

                              let dollar_rate = ''
                              if (Object.keys(this.$store.state.dollar_to_currency_rate).length) {
                                   dollar_rate = Object.values(this.$store.state.dollar_to_currency_rate)
                              } else {
                                   dollar_rate = this.$store.state.dollar_to_currency_rate
                              }

                              const cryptoRate = this.tetherRate.price * dollar_rate
                              this.convertedCurrency = ((this.originalCurrency * cryptoRate)).toLocaleString('da-DK')
                         } else {
                              this.convertFiatToCrypto()
                         }
                    }
               },

               convertSecondSelect() {
                    if (this.isAFiat(this.currencyTwo)) {
                         this.convertedCurrency = ((this.originalCurrency * this.rate)).toLocaleString('da-DK')
                    } else if (this.cryptoToCrypto) {
                         this.convertedCurrency = this.originalCurrency * (this.originalCryptoToBtc.price / this.secondCryptoToBtc.price)
                    } else {
                         const symbol = this.currencyTwo + 'USDT'
                         if (this.cryptoPrices.find(element => element.symbol === symbol)) {
                              this.tetherRate = this.cryptoPrices.find(element => element.symbol === symbol)

                              let dollar_to_fiat_rate = ''
                              if (Object.keys(this.$store.state.dollar_to_currency_rate).length) {
                                   dollar_to_fiat_rate = Object.values(this.$store.state.dollar_to_currency_rate)
                              } else {
                                   dollar_to_fiat_rate = this.$store.state.dollar_to_currency_rate
                              }

                              this.convertedCurrency = this.originalCurrency * ((1/dollar_to_fiat_rate) / this.tetherRate.price) 
                         } else {
                              this.convertFiatToCrypto()
                         }
                    }
               },

               // get fiat rate
               getRate() {
                    const rates = this.$store.state.rates
                    if (this.isAFiat(this.currencyOne)) {
                         Object.entries(rates).map(([key,value]) => {
                              if (key == this.currencyTwo) {
                                   this.rate = value
                              } 
                         })
                    } 
               },

               // convert crypto to crypto
               convertCryptoToCrypto() {
                    const symbol_one = this.currencyOne + 'BTC'
                    const symbol_two = this.currencyTwo + 'BTC'
                    
                    // get both cryptos -> base btc
                    if (this.currencyOne == 'BTC') {
                         this.originalCryptoToBtc = {price:"1", symbol:"BTC"}
                    } else {
                         this.originalCryptoToBtc = this.cryptoPrices.find(element => element.symbol === symbol_one);
                    }
                    
                    if (this.currencyTwo == 'BTC') {
                         this.secondCryptoToBtc = {price:"1", symbol:"BTC"}
                    } else {
                         this.secondCryptoToBtc = this.cryptoPrices.find(element => element.symbol === symbol_two);
                    }

                    this.convertedCurrency = this.originalCryptoToBtc.price / this.secondCryptoToBtc.price
               },

               convertFiatToCrypto() {
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
                    if (this.isAFiat(this.currencyOne)) {
                         exchange_to = this.originalCurrency * (fiat_to_btc / crypto_to_btc)
                    } else {
                         exchange_to = this.originalCurrency * (crypto_to_btc / fiat_to_btc)
                    }
                    this.convertedCurrency = exchange_to
               },

               // change the base currency
               commitBase() {
                    this.$store.commit('SET_BASE', this.currencyOne)
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