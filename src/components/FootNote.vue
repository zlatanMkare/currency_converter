<template>
     <div class="row col-md-12">
          <b-col class="text-left mt-5">
               <p>Updated on: {{date}}</p>
               <p>Currency Api: <a href="https://exchangeratesapi.io/" target="_blank">exchangeratesapi.io</a></p>
               <p>Crypto Api: <a href="https://github.com/binance/binance-spot-api-docs/blob/master/rest-api.md#public-api-endpoints" target="_blank">binance api</a></p>
               <p>Built with love by <a target="_blank" href="https://job-portfolio.netlify.app/">Job Njoroge</a></p>
          </b-col>
     </div>
</template>

<script>
export default {
     computed: {
          date() {
               return this.$store.state.date
          },
     }
}
</script>