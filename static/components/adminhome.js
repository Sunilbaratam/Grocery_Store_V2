export default {
  template: `
        <div> 
          <button @click='downloadUsers'>Users</button>
          <button @click='downloadProducts'>Products</button>
          <button @click='downloadCategories'>Categories</button>
          <div class="container mt-5">
            <br>
            <div class="container mt-4">
                <div class="row">
                    <div class="col-md-6">
                    <h1>Categories</h1>
                    </div>
                    <div class="col-md-6 text-right">
                    <a href="http://127.0.0.1:5000/#/category" class="btn btn-dark mt-2">Add any category</a>
                    </div>
                </div>
            </div>
            <br>
            <table class="table">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Category Name</th>
                        <th>Status</th>
                        <th>Update</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in categories">
                        <td>{{user.category_id}}</td>
                        <td>{{user.category_name}}</td>
                        <td>
                            <button class="btn btn-dark" v-if='!user.is_approved' @click="approve(user.category_id)"> Approve </button>
                            <button class="btn btn-dark" v-else-if='user.is_approved'> Active </button>
                        </td>
                        <td>
                        <button @click="toggleInputOptions" class="btn btn-light">Update</button>
                                    <br>
                                    <div v-if="userIsInterested">
                                        <div class="form-group">
                                            <label for="updatedCategory">New Category:</label>
                                            <input v-model="cred.updatedCategory" id="updatedCategory" type="text" class="form-control" placeholder="Enter new category">
                                        </div>
                                    
                                        <br>
                                        <button @click="update_category(user.category_id)" class="btn btn-dark">Update Category</button>
                                    </div>
                        </td>
                        <td><button @click="delete_category(user.category_id)" class="btn btn-dark">Delete</button></td>
                    </tr>
                </tbody>
            </table>
          </div>
          <div class="container mt-5">
            <h1>Products</h1>
            <table class="table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Category</th>
                        <th>Cost</th>
                        <th>Stock</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in products">
                        <td>{{user.product_name}}</td>
                        <td>{{user.category}}</td>
                        <td>{{user.product_cost}}</td>
                        <td>{{user.product_stock}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        </div>
    `,
  data() {
    return {
      token: localStorage.getItem("auth-token"),
      categories: [],
      products: [],
      userIsInterested: false,
      kill: true,
      cred: {
        updatedCategory: null,
      },
    };
  },
  async mounted() {
    const res = await fetch("/api/category", {
      method: "GET",
      headers: {
        "Authentication-Token": this.token,
      },
    });
    const data_1 = await res.json().catch((e) => {});
    if (res.ok) {
      console.log(data_1);
      this.categories = data_1;
    } else {
    }
    this.abc()
  },
  methods: {
    toggleInputOptions() {
      this.userIsInterested = !this.userIsInterested;
    },

    async update_category(category_id) {
      const res = await fetch(`/api/category/${category_id}`, {
        method: "PUT",
        headers: {
          "Authentication-Token": this.token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.cred),
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
      }
    },
    async delete_category(category_id) {
      const res = await fetch(`/api/category/${category_id}`, {
        method: "DELETE",
        headers: {
          "Authentication-Token": this.token,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
      }
    },
    async approve(category_id) {
      const res = await fetch(`/activate/category/${category_id}`, {
        headers: {
          "Authentication-Token": this.token,
        },
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
      } 
    },
    async abc() {
      const res = await fetch("/api/product", {
        method: "GET",
        headers: {
          "Authentication-Token": this.token,
        },
      });
      const data_1 = await res.json().catch((e) => {});
      if (res.ok) {
        console.log(data_1);
        this.products = data_1;
      } else {
      }
    }, 
    async downloadProducts(){
      const res = await fetch('/download-csv')
      const data = await res.json()
      if(res.ok){
        const taskid = data['task-id']
        const intv = setInterval(async () => {
          const csv_res = await fetch(`/get-csv/${taskid}`)
          if(csv_res.ok){
            clearInterval(intv)
            window.location.href = `/get-csv/${taskid}`
          }
        }, 1000);
      }
    },
    async downloadUsers(){
      const res = await fetch('/download-users')
      const data = await res.json()
      if(res.ok){
        const taskid = data['task-id']
        const intv = setInterval(async () => {
          const csv_res = await fetch(`/get-csv/${taskid}`)
          if(csv_res.ok){
            clearInterval(intv)
            window.location.href = `/get-csv/${taskid}`
          }
        }, 1000);
      }
    },
    async downloadCategories(){
      const res = await fetch('/download-categories')
      const data = await res.json()
      if(res.ok){
        const taskid = data['task-id']
        const intv = setInterval(async () => {
          const csv_res = await fetch(`/get-csv/${taskid}`)
          if(csv_res.ok){
            clearInterval(intv)
            window.location.href = `/get-csv/${taskid}`
          }
        }, 1000);
      }
    }

  },
};
