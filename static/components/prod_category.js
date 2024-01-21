export default {
  template: `
        <div>
            <div class="container mt-5">
                <h1 class="text-center"> Hii Manager</h1>
                <button @click='downloadProducts'>Products</button>
                <button @click='downloadCategories'>Categories</button>
                <br>
                <div class="container mt-4">
                    <div class="row">
                        <div class="col-md-6">
                        <h1>Categories</h1>
                        </div>
                        <div class="col-md-6 text-right">
                        <a href="http://127.0.0.1:5000/#/category_manager" class="btn btn-dark mt-2">Add any category</a>
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
                            <th>Action</th>
                            
                            
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="user in categories">
                            <td>{{user.category_id}}</td>
                            <td>{{user.category_name}}</td>
                            <td>
                              <button class="btn btn-dark" v-if='!user.is_approved'> In Active </button>
                              <button class="btn btn-dark" v-else-if='user.is_approved'> Active </button>
                            </td>
                            <td>
                              <button class="btn btn-dark mt-2" @click='update_category(user.category_id)' > Update </button>
                            </td>
                            
                            
                        </tr>
                    </tbody>
                </table>
                
                <br>
                <div class="container mt-4">
                    <div class="row">
                        <div class="col-md-6">
                        <h1>Products</h1>
                        </div>
                        <div class="col-md-6 text-right">
                        <a href="http://127.0.0.1:5000/#/product" class="btn btn-dark mt-2">Add any Product</a>
                        </div>
                    </div>
                </div>
                <br>
                <div class="row" >
                    <div class="col-md-4" v-for="user in products">
                        <div class="card">
                            <div class="card-body">
                                <ul class="list-group list-group-flush">
                                    <li class="list-group-item"><span style="margin-right: 25px"><Strong>Name:</Strong></span>  <span style="margin-left:5px;">{{user.product_name}}</span></li>
                                    <li class="list-group-item"><span style="margin-right: 25px"><Strong>Cost:</Strong> </span> {{user.product_cost}}</li>
                                    <li class="list-group-item"><span style="margin-right: 25px"><Strong>Stock:</Strong></span> {{user.product_stock}}</li>
                                    <li class="list-group-item"><span style="margin-right: 25px"><Strong>Category :</Strong></span>{{user.category}}</li>
                                    
                                    <br>
                                    <button @click="toggleInputOptions" class="btn btn-dark">Update</button>
                                    <br>
                                    <div v-if="userIsInterested">
                                        <div class="form-group">
                                            <label for="updatedCost">New Cost:</label>
                                            <input v-model="cred.updatedCost" id="updatedCost" type="text" class="form-control" placeholder="Enter new cost">
                                        </div>
                                        <div class="form-group">
                                            <label for="updatedStock">New Stock:</label>
                                            <input v-model="cred.updatedStock" id="updatedStock" type="text" class="form-control" placeholder="Enter new stock">
                                        </div>
                                        <div class="form-group">
                                            <label for="updatedCategory">New Category:</label>
                            
                                            <select class="form-control" id="exampleFormControlSelect1"  v-model="cred.updatedCategory">
                                                <option v-for="user in categories" v-if="user.is_approved">{{user.category_name}}</option>
                                            </select>
                                        </div>
                                        <br>
                                        <button @click="update_product(user.product_id)" class="btn btn-dark">Update Product</button>
                                    </div>

                                    <br>
                                    <button  class="btn btn-dark" @click="delete_product(user.product_id)">Remove</button>
                                </ul>
                            </div>
                        </div> 
                    </div>
                    
                </div>
            </div>
        </div>
    `,
  data() {
    return {
      token: localStorage.getItem("auth-token"),
      products: [],
      categories: [],
      userIsInterested: false,
      cred: {
        updatedCost: null,
        updatedStock: null,
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
    this.abc();
  },
  methods: {
    async abc() {
      const res = await fetch("/api/product", {
        method: "GET",
        headers: {
          "Authentication-Token": this.token,
        },
      });
      const data = await res.json().catch((e) => {});
      if (res.ok) {
        //   console.log(data);
        this.products = data;
      } else {
      }
    },
    toggleInputOptions() {
      // Toggle the flag when the user clicks the button
      this.userIsInterested = !this.userIsInterested;
    },

    async update_product(product_id) {
      const res = await fetch(`/api/product/${product_id}`, {
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
    async delete_product(product_id) {
      const res = await fetch(`/api/product/${product_id}`, {
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
    async update_category(category_id) {
      const res = await fetch(`/api/manager/${category_id}`, {
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
  },
};
