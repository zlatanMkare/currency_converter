import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import config from './config'
import createCache from 'vuex-cache'
import commonCurrencies from './common-currencies.json'
import cryptoCurrencies from './cypto-currencies.json'

Vue.use(Vuex)

const store = new Vuex.Store({
     state: {
          currencyOne: '',
          currencyTwo: '',
          originalCurrency: '',
          rates: [],
          base: 'USD',
          date: '',
          crypto: [],
          cryptoPrices: [],
          rateBaseBitcoin: null,
          dollarToCurrencyRate: '',
          news: []
     },

     getters: {
          currencies(state) {
               return Object.keys(state.rates)
          },

          

          cryptoSymbols(state) {
               const arr = state.crypto.symbols
               const newArr = []
               
               // get crypto symbols
               if (Object.keys(state.crypto).length) {
                    for (var i=0; i < arr.length; i++) {
                         if(arr[i].baseAsset){
                              newArr.push(arr[i].baseAsset)
                         }
                    }
               }
               
               const uniqueSet = new Set(newArr)
               const uniqueValues = [...uniqueSet]
               return uniqueValues
          },

          // includes crupto and fiat
          allCurrencies(state,getters) {
               const currencySymbols = []; 
               Object.entries(commonCurrencies).forEach((currency) => {
                    getters.currencies.forEach((rate) => {
                         if (rate === currency[1].code) {
                              currencySymbols.push({
                                   code: currency[1].code,
                                   name: currency[1].name,
                                   symbol: currency[1].symbol
                              })
                         }
                    })
               })

               const cryptos = []; 
               Object.entries(cryptoCurrencies).forEach((crypto) => {
                    getters.cryptoSymbols.forEach((cryptoSymbol) => {
                         if (cryptoSymbol === crypto[0]) {
                              cryptos.push({
                                   code: cryptoSymbol,
                                   name: crypto[1],
                                   symbol: null
                              })
                         }
                    })
               })

               const currencies = currencySymbols.concat(cryptos)
               const currenciesSet = new Set(currencies)
               const allCurrencies = [...currenciesSet]
               return allCurrencies
          },

          cryptoPrices(state) {
               return state.cryptoPrices
          }

     },

     mutations: {
          SET_CURRENCY_ONE(state,data) {
               state.currencyOne = data
          },
          SET_CURRENCY_TWO(state,data) {
               state.currencyTwo = data
          },
          SET_ORIGINAL_CURRENCY(state,data) {
               state.originalCurrency = data
          },
          SET_RATES(state,data) {
               state.rates = data
          },

          SET_BASE(state,data) {
               state.base = data
          },

          SET_DATE(state,data) {
               state.date = data
          },

          SET_CRYPTO(state,data) {
               state.crypto = data
          },

          SET_CRYPTOPRICES(state,data) {
               state.cryptoPrices = data
          },

          SET_RATE_BASE_BITCOIN(state,data) {
               state.rateBaseBitcoin = data
          },

          SET_DOLLAR_RATE(state,data) {
               state.dollarToCurrencyRate = data
          },

          SET_NEWS(state,data) {
               state.news = data
          }
     },

     actions: {
          fetchRates({commit,state}) {
               return new Promise((resolve,reject) => {
                    axios.get(config.fiatApi + '?base=' + state.base).then(response => {
                         const rates = response.data.rates
                         const date = response.data.date
                         commit('SET_RATES',rates)
                         commit('SET_DATE', date)
                         resolve()
                    }).catch(e => {
                         console.log(e)
                         reject()
                    })
               })
          },

          fetchNewRates({commit, state}) {
               return new Promise((resolve,reject) => {
                    axios.get(config.fiatApi + '?base=' + state.base).then(response => {
                         const rates = response.data.rates
                         commit('SET_RATES',rates)
                         resolve()
                    }).catch(e => {
                         console.log(e)
                         reject()
                    })
               })
          },

          fetchSpecificRate({commit}, payload) {
               return new Promise((resolve,reject) => {
                    axios.get(config.fiatApi + '?symbols=' + payload + '&base=USD').then(response => {
                         const rates = response.data.rates
                         commit('SET_DOLLAR_RATE',rates)
                         resolve()
                    }).catch(e => {
                         console.log(e)
                         reject()
                    })
               })
          },

          fetchSecondCryptoRate({commit}, payload) {
               return new Promise((resolve,reject) => {
                    const symbols = payload + 'BTC';
                    axios.get(config.cryptoRatesApi + '?symbol=' + symbols).then(response => {
                         const rate = response.data.price
                         commit('SET_RATE_BASE_BITCOIN',rate)
                         resolve()
                    }).catch(e => {
                         console.log(e)
                         reject()
                    })
               })
          },

          fetchExchangeInfo({commit}) {
               axios.get(config.cryptoApi).then(response => {
                    const data = response.data
                    commit('SET_CRYPTO', data)
               }).catch(e => {
                    console.log(e)
               })
          },

          fetchCryptoPrice({commit}) {
               return new Promise((resolve,reject) => {
                    axios.get(config.cryptoRatesApi).then(response => {
                         const data = response.data
                         commit('SET_CRYPTOPRICES', data)
                         resolve()
                    }).catch(e => {
                         console.log(e)
                         reject()
                    })
               })
          },

          fetchNews({commit}) {
               axios.get('https://gnews.io/api/v4/search?q=crypto&token=' + process.env.VUE_APP_NEWS_API_TOKEN + '&lang=en&countries=us').then(response => {    
                    const data = response.data.articles
                    commit('SET_NEWS', data)
               }).catch(e => {
                    console.log(e)
               })
          }
     },

     plugins: [createCache()]
})

export default store;
