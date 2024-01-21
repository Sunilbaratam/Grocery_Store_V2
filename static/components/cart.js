export default {
  template: `
        <div class="container mt-5">
            <table class="table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Category</th>
                        <th>Cost</th>
                        <th>Quantity</th>  
                        <th>Total Cost</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in items">
                        <td>{{user.name}}</td>
                        <td>{{user.category}}</td>
                        <td>{{user.cost}}</td>
                        <td>{{user.quantity}}</td>
                        <td>{{user.total_cost}}</td>
                        <td><a class="btn btn-light"   @click="delete_item(user.id)" >Delete</a></td>
                        
                    </tr>
                </tbody>
            </table>
            <div>
                <button class = "btn btn-dark" @click = "redirect()">Place the order : Rs. {{this.sum.total_sum}}</button>
            </div>
        </div>
    `,
  data() {
    return {
      items: [],
      token: localStorage.getItem("auth-token"),
      sum: 0,
    };
  },
  async mounted() {
    const res = await fetch("/view_cart", {
      method: "GET",
      headers: {
        "Authentication-Token": this.token,
      },
    });
    const data = await res.json().catch((e) => {});
    if (res.ok) {
      console.log(data);
      this.items = data;
    }
    this.sum_total();
  },
  methods: {
    async delete_item(product_id) {
      const res = await fetch(`/delete_cart/${product_id}`, {
        method: "DELETE",
        headers: {
          "Authentication-Token": this.token,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      console.log(data);

      alert(data.message);
    },
    async sum_total() {
      const res = await fetch("/sum", {
        method: "GET",
        headers: {
          "Authentication-Token": this.token,
        },
      });
      const data = await res.json().catch((e) => {});
      if (res.ok) {
        console.log(data);
        this.sum = data;
      } else {
      }
    }, 
    async redirect(){
      const res = await fetch("/receipt", {
        method: "GET",
        headers :{
          "Authentication-Token" : this.token,
        },
      });
      this.$router.push({ path: '/succes' })
    }
  },
};
