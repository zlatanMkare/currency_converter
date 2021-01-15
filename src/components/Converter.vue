<template>
     <div>
          <b-container>
               <div class="text-center mt-5" v-if="currencies.length < 1">
                    <b-spinner variant="primary"></b-spinner>
               </div>

               <b-row id="converter" v-else>
                    <currency-one></currency-one>
                    
                    <div class="row col-md-3">
                         <b-col>
                              <b-icon icon="arrow-counterclockwise" :animation="animation" font-scale="3"></b-icon>
                         </b-col>
                    </div>

                    <currency-two :converted-currency="this.convertedCurrency"></currency-two>

                    <b-col cols="12" class="text-left mt-3">
                         <small>Updated on: {{date | date}}</small>
                    </b-col>
               </b-row>
          </b-container>
     </div>
</template>

<script>
     import {mapGetters} from 'vuex'
     import CurrencyOne from './CurrencyOne.vue'
     import CurrencyTwo from './CurrencyTwo.vue'

     export default {
          components: {
               CurrencyOne,
               CurrencyTwo
          },

          data () {
               return {
                    convertedCurrency: '',
                    rate: '',
                    originalCryptoToBTC: '',
                    secondCryptoToBTC: '',
                    tetherRate: '',
                    animation: 'none'
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

               date() {
                    return this.$store.state.date
               },
          },

          watch: {
               originalCurrency: function() {
                    if (!this.isAFiatCurrency(this.currencyTwo)) {
                         this.convertSecondSelect()
                    } else {
                         this.convert()
                    }
               },

               currencyOne: function() {
                    this.commitBase()
                    if (this.isAFiatCurrency(this.currencyOne)) {
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
                    if (this.isAFiatCurrency(this.currencyTwo)) {
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
                    if (this.isAFiatCurrency(this.currencyOne)) {
                         if(!this.isAFiatCurrency(this.currencyTwo)) {
                              this.convertSecondSelect()
                         } else {
                              this.convertedCurrency = ((this.originalCurrency * this.rate)).toLocaleString('da-DK')
                         }
                    } else if (this.cryptoToCrypto) {
                         this.convertedCurrency = this.originalCurrency * (this.originalCryptoToBTC.price / this.secondCryptoToBTC.price)
                    } else {
                         const symbol = this.currencyOne + 'USDT'
                         if (this.cryptoPrices.find(element => element.symbol === symbol)) {
                              this.tetherRate = this.cryptoPrices.find(element => element.symbol === symbol)

                              let dollarRate = this.isDollarRate(dollarRate)

                              const cryptoRate = this.tetherRate.price * dollarRate
                              this.convertedCurrency = ((this.originalCurrency * cryptoRate)).toLocaleString('da-DK')
                         } else {
                              this.convertFiatToCrypto()
                         }
                    }
               },

               convertSecondSelect() {
                    if (this.isAFiatCurrency(this.currencyTwo)) {
                         this.convertedCurrency = ((this.originalCurrency * this.rate)).toLocaleString('da-DK')
                    } else if (this.cryptoToCrypto) {
                         this.convertedCurrency = this.originalCurrency * (this.originalCryptoToBTC.price / this.secondCryptoToBTC.price)
                    } else {
                         const symbol = this.currencyTwo + 'USDT'
                         if (this.cryptoPrices.find(element => element.symbol === symbol)) {
                              this.tetherRate = this.cryptoPrices.find(element => element.symbol === symbol)

                              let dollarFiatRate = this.isDollarRate(dollarFiatRate)

                              this.convertedCurrency = this.originalCurrency * ((1/dollarFiatRate) / this.tetherRate.price) 
                         } else {
                              this.convertFiatToCrypto()
                         }
                    }
               },

               // get fiat rate
               getRate() {
                    const rates = this.$store.state.rates
                    if (this.isAFiatCurrency(this.currencyOne)) {
                         Object.entries(rates).map(([key,value]) => {
                              if (key == this.currencyTwo) {
                                   this.rate = value
                              } 
                         })
                    } 
               },

               // convert crypto to crypto
               convertCryptoToCrypto() {
                    const symbolOne = this.currencyOne + 'BTC'
                    const symbolTwo = this.currencyTwo + 'BTC'
                    
                    // get both cryptos -> base btc
                    if (this.currencyOne == 'BTC') {
                         this.originalCryptoToBTC = {price:"1", symbol:"BTC"}
                    } else if (this.currencyTwo == 'BTC') {
                         this.secondCryptoToBTC = {price:"1", symbol:"BTC"}
                    } else {
                         this.originalCryptoToBTC = this.cryptoPrices.find(element => element.symbol === symbolOne);
                         this.secondCryptoToBTC = this.cryptoPrices.find(element => element.symbol === symbolTwo);
                    }

                    this.convertedCurrency = this.originalCryptoToBTC.price / this.secondCryptoToBTC.price
               },

               convertFiatToCrypto() {
                    // get currency to dollar rate
                    let dollarFiatRate = this.isDollarRate(dollarFiatRate)

                    // get fiat -> btc
                    const USDTBTC = this.cryptoPrices.find(element => element.symbol === 'BTCUSDT');
                    const usdToBTC = 1/USDTBTC.price;
                    const fiatToBTC = usdToBTC/dollarFiatRate

                    // get selected crypto coin -> btc
                    const cryptoToBTC = this.$store.state.rateBaseBitcoin

                    // convert to currency
                    let convertToFiat = ''
                    if (this.isAFiatCurrency(this.currencyOne)) {
                         convertToFiat = this.originalCurrency * (fiatToBTC / cryptoToBTC)
                    } else {
                         convertToFiat = this.originalCurrency * (cryptoToBTC / fiatToBTC)
                    }
                    this.convertedCurrency = convertToFiat
               },

               // change the base currency
               commitBase() {
                    this.$store.commit('SET_BASE', this.currencyOne)
               },

               // check if selected is a Fiat
               isAFiatCurrency(value) {
                    return this.currencies.includes(value)
               },

               // check if we have dollar rate in the store
               // eslint-disable-next-line no-unused-vars
               isDollarRate(val) {
                    if (Object.keys(this.$store.state.dollarToCurrencyRate).length) {
                         val = Object.values(this.$store.state.dollarToCurrencyRate)
                    } else {
                         val = this.$store.state.dollarToCurrencyRate
                    }
                    return val
               }
          },

          filters: {
               date(date) {
                    let formatDate = new Date(date);
                    return formatDate.toDateString()
               }
          }
     }
</script>

<style scoped>
     #converter {
          background: #2ea2b8;
          align-items: center;
          padding: 25px;
          margin: 3em 10px;
          color: #ffffff;
          border-radius: 5px;
     }
</style>