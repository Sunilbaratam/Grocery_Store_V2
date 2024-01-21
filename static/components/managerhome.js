
export default {
  template: `
          <div>
          <div> Welcome manager </div>
          </div>
      `,
  data() {
    return {
      userRole: localStorage.getItem("role"),
    };
  },

  
};
