import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import config from './config'

Vue.use(Vuex)


const store = new Vuex.Store({
     state: {
          rates: [],
          base: 'USD',
          date: '',
          crypto: [],
          crypto_prices: [],
          rate_base_usdt: null,
          rate_base_btc: null,
          dollar_to_currency_rate: 6.24,
          symbol_not_found: ''
     },

     getters: {
          currencies(state) {
               return Object.keys(state.rates)
          },

          cryptoSymbols(state) {
               const arr = state.crypto.symbols
               const newArr = []
               
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

          allCurrencies(state,getters) {
               const currencies = getters.currencies.concat(getters.cryptoSymbols)
               const currenciesSet = new Set(currencies)
               const allCurrencies = [...currenciesSet]
               return allCurrencies
          },

          cryptoPrices(state) {
               return state.crypto_prices
          }

     },

     mutations: {
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

          SET_CRYPTO_PRICES(state,data) {
               state.crypto_prices = data
          },

          SET_RATE_BASE_USDT(state,data) {
               state.rate_base_usdt = data
          },

          SET_RATE_BASE_BTC(state,data) {
               state.rate_base_btc = data
          },

          SET_DOLLAR_RATE(state,data) {
               state.dollar_to_currency_rate = data
          },

          SET_SYMBOL_NOT_FOUND(state,data) {
               state.symbol_not_found = data
          }
     },

     actions: {
          fetchRates({commit,state}) {
               return new Promise((resolve,reject) => {
                    axios.get(config.currencyApi + '?base=' + state.base).then(response => {
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

          fetchNewRates({commit, state, dispatch}) {
               return new Promise((resolve,reject) => {
                    axios.get(config.currencyApi + '?base=' + state.base).then(response => {
                         const rates = response.data.rates
                         commit('SET_RATES',rates)
                         resolve()
                    }).catch(e => {
                         dispatch('fetchCryptoRate')
                         console.log(e)
                         reject()
                    })
               })
          },

          fetchSpecificRate({commit}, payload) {
               return new Promise((resolve,reject) => {
                    axios.get(config.currencyApi + '?symbols=' + payload + '&base=USD').then(response => {
                         const rates = response.data.rates
                         commit('SET_DOLLAR_RATE',rates)
                         resolve()
                    }).catch(e => {
                         console.log(e)
                         reject()
                    })
               })
          },

          fetchCryptoRate({commit, state}) {
               return new Promise((resolve,reject) => {
                    const symbols = state.base + 'USDT';
                    axios.get(config.cryptoRatesApi + '?symbol=' + symbols).then(response => {
                         const rate = response.data.price
                         commit('SET_RATE_BASE_USDT',rate)
                         resolve()
                    }).catch(e => {
                         commit('SET_SYMBOL_NOT_FOUND', true)
                         reject(e)
                    })
               })
          },

          fetchSecondCryptoRate({commit}, payload) {
               return new Promise((resolve,reject) => {
                    const symbols = payload + 'BTC';
                    axios.get(config.cryptoRatesApi + '?symbol=' + symbols).then(response => {
                         const rate = response.data.price
                         commit('SET_RATE_BASE_BTC',rate)
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
                         commit('SET_CRYPTO_PRICES', data)
                         resolve()
                    }).catch(e => {
                         console.log(e)
                         reject()
                    })
               })
          }
     }
})

export default store;
