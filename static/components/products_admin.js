export default {
    template : `
        <div class="container mt-5">
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
    `,
    data() {
        return {
            token: localStorage.getItem("auth-token"),
            products: [],
        }
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
    }
}