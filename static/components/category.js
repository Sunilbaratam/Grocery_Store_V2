export default {
  template: `
  <div class='d-flex justify-content-center' style="margin-top: 30vh">
  <div class="mb-3">
      <label for="user name" class="form-label">Category name</label>
      <input type="text" class="form-control" id="user-name" placeholder="Category name" v-model="cred.category_name">
      <button class="btn btn-dark mt-2" @click='addcategory' > Add </button>
  </div>
  </div>
    `,
  data() {
    return {
      cred: { category_name: null },
      token: localStorage.getItem("auth-token"),
    };
  },
  methods: {
    async addcategory() {
      const res = await fetch("/api/category", {
        method: "POST",
        headers: {
          "Authentication-Token": this.token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.cred),
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        this.$router.push({ path: '/home' })
      } else {
        this.error = data.message;
      }
    },
  },
};
