export default {
  template: `
    <div class='d-flex justify-content-center' style="margin-top: 30vh">
        
        <div class="mb-3">
        <h1>GROCERY STORE</h1>
            <label for="user name" class="form-label">User name</label>
            <input type="text" class="form-control" id="user-name" placeholder="user name" v-model="cred.username">
            <label for="user email" class="form-label">Email address</label>
            <input type="email" class="form-control" id="user-email" placeholder="name@example.com" v-model="cred.email">
            <label for="user password" class="form-label">Password</label>
            <input type="password" class="form-control" id="user-password" placeholder="type password" v-model="cred.password">
            <label for="exampleFormControlSelect1">Role</label>
            <select class="form-control" id="exampleFormControlSelect1" v-model="cred.role">
            <option>user</option>
            <option>manager</option>
            </select>
            <button class="btn btn-dark mt-2" @click='register' > Register </button>
            <a class="dark" href="http://127.0.0.1:5000">Login</a>
        </div>
    </div>
    `,
  data() {
    return {
      cred: {
        email: null,
        username: null,
        password: null,
        role: null,
      },
      error: "error from sunil",
    };
  },
  methods: {
    async register() {
      const res = await fetch("/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.cred),
      });
      const data = await res.json();
      if (res.ok) {
        this.$router.push({ path: "/" });
      } else {
        this.error = data.message;
      }
    },
  },
};
