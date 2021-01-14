<template>
     <div>
          <b-container>
               <b-row>
                    <b-col class="text-left">
                         <h3>Latest News</h3>
                    </b-col>
               </b-row>

               <div class="text-left" v-if="news.length < 1">
                    <p>Fetching latest news articles</p>
               </div>

               <b-row v-else>
                    <b-col md="12" class="article row text-left my-5" v-for="article in news" :key="article.url">
                         <b-col md="4">
                              <b-img :src="article.image" fluid alt="Responsive image"></b-img>
                         </b-col>
                         <b-col md="8">
                              <h4 class="mb-1" v-html="article.title"></h4>
                              <small class="mb-2">Published on: <strong>{{ article.publishedAt | date }}</strong> | Souce: <strong>{{ article.source.name }}</strong></small>
                              <p class="mt-1" v-html="article.description"></p>
                              <b-button target="_blank" :href="article.url" variant="info" size="sm">Read more</b-button>
                         </b-col>
                    </b-col>
               </b-row>
          </b-container>
     </div>
</template>

<script>
     export default {
          computed: {
               news() {
                    return this.$store.state.news
               },   
          },

          created () {
               this.$store.cache.dispatch('fetchNews')
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
     .article {
          align-items: center; 
     }
     .article img {
          border-radius: 10px;
     }
     .article:hover {
          cursor: pointer;
     }
</style>