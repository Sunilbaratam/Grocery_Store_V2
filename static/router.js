import admindashboard from "./components/admindashboard.js";
import home from "./components/home.js";
import login from "./components/login.js";
import user_registration from "./components/user_registration.js";
import allusers from "./components/allusers.js";
import category from "./components/category.js";
import products from "./components/products.js";
import prod_category from "./components/prod_category.js";
import userhome from "./components/userhome.js";
import cart from "./components/cart.js";
import products_admin from "./components/products_admin.js";
import category_manager from "./components/category_manager.js";
import succes from "./components/succes.js";

const routes = [
  { path: "/home", component: home },
  { path: "/", component: login },
  { path: "/user-register", component: user_registration },
  { path: "/admin-dashboard", component: admindashboard },
  { path: "/allusers", component: allusers },
  { path: "/category", component: category },
  { path: "/product", component: products },
  { path: "/allprodcate", component: prod_category },
  { path: "/userhome", component: userhome },
  { path: "/cart", component: cart },
  { path: "/products_admin", component: products_admin},
  { path: "/category_manager", component: category_manager},
  { path: "/succes", component: succes}

];

export default new VueRouter({
  routes,
});
