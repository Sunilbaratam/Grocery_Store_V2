export default {
  template: `<nav class="navbar navbar-expand-lg bg-body-tertiary">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">Grocery Store</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse " id="navbarSupportedContent">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item"  v-if="role=='user'">
          <router-link class="nav-link" to="/userhome">Home</router-link>
        </li>
        <li class="nav-item"  v-if="role=='admin'">
          <router-link class="nav-link" to="/home">Home</router-link>
        </li>
        <li class="nav-item"  v-if="role=='manager'">
          <router-link class="nav-link" to="/allprodcate">Home</router-link>
        </li>
        <li class="nav-item" v-if="role=='admin'">
          <router-link class="nav-link" to="/allusers">Users</router-link>
        </li>
       
        <li class="nav-item" v-if="role=='user'">
          <router-link class="nav-link" to="/cart">My Cart</router-link>
        </li>
        <li class="nav-item ml-auto" v-if='is_login'>
        <button class="nav-link" @click='logout' > Logout </button>
      </li>
      </ul>
    </div>
  </div>
</nav>
  `,

  data() {
    return {
      role: localStorage.getItem("role"),
      is_login: localStorage.getItem("auth-token"),
    };
  },
  methods: {
    logout() {
      localStorage.removeItem("auth-token");
      localStorage.removeItem("role");
      this.$router.push("/");
    },
  },
};
