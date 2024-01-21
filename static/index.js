import router from "./router.js";
import navbar from "./components/navbar.js";

// const isAuthenticated = localStorage.getItem("auth-token") ? true : false;

// router.beforeEach((to, from, next) => {
//   if (to.name !== "Login" && !localStorage.getItem("auth-token") ? true : false)
//     next({ name: "Login" });
//   else next();
// });

new Vue({
  el: "#app",
  template: `<div>
  <navbar :key='has_changed'/>
  <router-view /></div>`,
  router,
  components: {
    navbar,
  },
  data: {
    has_changed: true,
  },
  watch: {
    $route(to, from) {
      this.has_changed = !this.has_changed
    },}
});
