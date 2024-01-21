export default {
  template: `<div>
    
    <div class="container mt-5">
        <table class="table">
            <thead>
                <tr>
                    <th>User email</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in allUsers">
                    <td>{{user.email}}</td>
                    <td><button class="btn btn-dark" v-if='!user.active' @click="approve(user.id)"> Approve </button>
                        <button class="btn btn-dark" v-else-if='user.active'> Active </button></td>
                </tr>
            </tbody>
        </table>
    <div>
  </div>`,
  data() {
    return {
      allUsers: [],
      token: localStorage.getItem("auth-token"),
      error: null,
    };
  },
  methods: {
    async approve(manager_id) {
      const res = await fetch(`/activate//${manager_id}`, {
        headers: {
          "Authentication-Token": this.token,
        },
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
      } 
    },
  },
  async mounted() {
    const res = await fetch("/getusers", {
      headers: {
        "Authentication-Token": this.token,
      },
    });
    const data = await res.json().catch((e) => {});
    if (res.ok) {
      console.log(data);
      this.allUsers = data;
    } else {
    }
  },
};
