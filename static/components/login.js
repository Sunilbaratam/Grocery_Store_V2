export default {
  template: `
    <div class='d-flex justify-content-center' style="margin-top: 30vh">
        
        <div class="mb-3">
            <h1>GROCERY STORE</h1>
            <br>
            <div class="text-danger"> {{error}} </div>
            <label for="user email" class="form-label">Email address</label>
            <input type="email" class="form-control" id="user-email" placeholder="name@example.com" v-model="cred.email">
            <label for="user password" class="form-label">Password</label>
            <input type="password" class="form-control" id="user-password" placeholder="type password" v-model="cred.password">
            <button class="btn btn-dark mt-2" @click='login'> Login </button>
            <a href="http://127.0.0.1:5000/#/user-register">Sign Up</a>
        </div>
    </div>
    `,
  data() {
    return {
      cred: {
        email: null,
        password: null,
      },
      error: null,
    };
  },
  methods: {
    async login() {
      const res = await fetch("/user-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.cred),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("auth-token", data.token);
        localStorage.setItem("role", data.role);
        this.$router.push({ path: "/home" });
      } else {
        this.error = data.message;
      }
    },
  },
};
