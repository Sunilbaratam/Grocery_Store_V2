export default {
  template: `
    <div class='d-flex justify-content-center' style="margin-top: 30vh">
    <div class="mb-3">
        <label for="user name" class="form-label">Product name</label>
        <input type="text" class="form-control" id="name" placeholder="Product name" v-model="cred.product_name">
        <label for="user name" class="form-label">Product cost</label>
        <input type="text" class="form-control" id="cost" placeholder="Product cost" v-model="cred.product_cost">
        <label for="user name" class="form-label">Product Stock</label>
        <input type="text" class="form-control" id="stock" placeholder="Product stock" v-model="cred.product_stock">
        <label for="user name" class="form-label">Category</label>
        <select class="form-control" id="exampleFormControlSelect1"  v-model="cred.category">
            <option v-for="user in allcategories" >{{user.category_name}}</option>
            </select>
        <button class="btn btn-dark mt-2" @click='addproduct' > Add </button>
    </div>
    </div>
      `,
  data() {
    return {
      cred: {
        product_name: null,
        product_cost: null,
        product_stock: null,
        category: null,
      },
      token: localStorage.getItem("auth-token"),
      allcategories: [],
      error: null,
    };
  },
  methods: {
    async addproduct() {
      const res = await fetch("/api/product", {
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
        this.$router.push({ path: '/allprodcate' })
      } else {
        this.error = data.message;
      }
    },
  },
  async mounted() {
    const res = await fetch("/api/category", {
      method: "GET",
      headers: {
        "Authentication-Token": this.token,
      },
    });
    const data = await res.json().catch((e) => {});
    if (res.ok) {
      console.log(data);
      this.allcategories = data;
    } else {
    }
  },
};
