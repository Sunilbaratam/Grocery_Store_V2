export default {
  template: `
          <div class="container mt-3"> 
            <h1>Products</h1>
            <br>
            <div class="row">
            
            <div  class="col-md-3" v-for='user in products' >
                    
                
                <div class="card" >
                        <div class="card-body">
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item"><span style="margin-right: 25px"><Strong>Product:</Strong></span> {{user.product_name}}</li>
                                <li class="list-group-item"><span style="margin-right: 25px"><Strong>Category:</Strong> </span> {{user.category}}</li>
                                <li class="list-group-item"><span style="margin-right: 25px"><Strong>Cost:</Strong></span> {{user.product_cost}}</li>
                                <button @click="toggleInputOptions" class="btn btn-dark">Buy</button>
                                <br>
                                <div v-if="userIsInterested">
                                        <div class="form-group">
                                            <label for="updatedCost">Quantity:</label>
                                            <input v-model="cred.quantity" id="quantity" type="text" class="form-control" placeholder="Enter Quantity">
                                            <p v-if="user.product_stock > 0 && cred.quantity < user.product_stock">In Stock</p>
                                            <p v-else class="text-danger"> Out of Stock </p> 

                                      
                                        </div>
                                        
                                        <button @click="add_to_cart(user.product_id)" class="btn btn-dark" v-if="user.product_stock > 0 && cred.quantity < user.product_stock" >Add to cart</button>
                                </div>

                            </ul>
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
      userIsInterested: false,
      allcategories: [],
      selected_category: '',
      uni_categories: [],

      cred: {
        quantity: null,
      },
    };
  },
  async mounted() {
    this.abc();
    this.xyz();
    this.uni_categories = [...new Set(this.products.map(product => product.category))];
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
    async add_to_cart(product_id) {
      const res = await fetch(`/add_cart/${product_id}`, {
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
    async xyz() {
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
  },
};
