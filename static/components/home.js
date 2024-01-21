import userhome from "./userhome.js";
import managerhome from "./managerhome.js";
import adminhome from "./adminhome.js";
import prod_category from "./prod_category.js";

export default {
  template: `
        <div>  
            <userhome v-if="userRole=='user'"/>
            <prod_category v-if="userRole=='manager'"/>
            <adminhome v-if="userRole=='admin'"/>
        </div>
    `,
  data() {
    return {
      userRole: localStorage.getItem("role"),
    };
  },

  components: {
    userhome,
    adminhome,
    managerhome,
    prod_category
  },
};
