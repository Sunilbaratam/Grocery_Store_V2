export default {
  template: `
        <h6> Users waiting for ur approval </h6>
        <table>
            <thead>
                <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Status</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in users" :key="user.id">
                <td>{{ user.id }}</td>
                <td>{{ user.email }}</td>
                </tr>
            </tbody>
        </table>
    `,
  data() {
    return {
      users: [],
    };
  },
  mounted() {
    this.get_user();
  },
  methods: {
    async get_user() {
      const res = await fetch("/users", {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },

        body: JSON.stringify(this.cred),
      });
      const data = await res.json();
    },
  },
};
