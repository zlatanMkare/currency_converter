<template>
     <div>
          <b-navbar toggleable="lg" type="dark" variant="dark">
               <b-container>
                    <b-navbar-brand href="#">Currency Converter</b-navbar-brand>

                    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

                    <b-collapse id="nav-collapse" is-nav>
                         <b-navbar-nav>
                         <b-nav-item href="/">Home</b-nav-item>
                         <b-nav-item href="/about">About</b-nav-item>
                         </b-navbar-nav>
                    </b-collapse>
               </b-container>
          </b-navbar>
     </div>
</template>

<script>
export default {
     name: 'Header'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
     h3 {
          margin: 40px 0 0;
     }
     ul {
          list-style-type: none;
          padding: 0;
     }
     li {
          display: inline-block;
          margin: 0 10px;
     }
     a {
          color: #42b983;
     }    
</style>
