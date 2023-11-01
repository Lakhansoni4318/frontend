import { createRouter, createWebHistory } from "vue-router";
import DefaultComponent from "../components/DefaultComponent.vue";
import Home from "../views/Home.vue";
import Pdf from "../components/Pdf.vue";
import Semester from "../views/Semester.vue";
import Login from "../components/Login.vue";
import SignUp from "../components/SignUp.vue";
import Upload from "../components/Upload.vue";
import GetData from "../components/GetData.vue";
import Subject from "../components/Subject.vue";
import store from "../store";
import FeedBack from "../components/FeedBack.vue";

const routes = [
  {
    path: "/",
    component: DefaultComponent,
    children: [
      {
        path: "/",
        name: "home",
        component: Home,
      },
      {
        path: "/semester/:name",
        name: "Subject",
        component: Subject,
        props: true,
      },
      {
        path: "/semester/:semName/pdf/:name",
        name: "pdf",
        component: Pdf,
      },
    ],
  },
  {
    path: "/signUp",
    name: "signUp",
    component: SignUp,
    meta: { requiresAuth: false }, // Ensure that Login does not require authentication
    beforeEnter(to, from, next) {
      // Additional logout logic if needed
      localStorage.removeItem("userRole");
      localStorage.removeItem("isLoggedIn");
      store.state.isLoggedIn = false;
      next();
    },
  },
  {
    path: "/feedback",
    component: FeedBack,
  },
  {
    path: "/upload",
    name: "upload",
    component: Upload,
  },
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: { requiresAuth: false }, // Ensure that Login does not require authentication
    beforeEnter(to, from, next) {
      // Additional logout logic if needed
      localStorage.removeItem("userRole");
      localStorage.removeItem("isLoggedIn");
      store.state.isLoggedIn = false;
      next();
    },
  },
  {
    path: "/admin",
    name: "admin",
    component: GetData,
    meta: { requiresAuth: true, role: "admin" },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  try {
    await store.dispatch("checkLoggedIn");

    if (!store.getters.isLoggedIn) {
      if (to.name !== "login" && to.name !== "signUp") {
        next({ name: "login" });
      } else {
        next();
      }
    } else {
      const userRole = store.getters.userRole;

      if (requiresAuth) {
        if (to.meta.role === "admin" && userRole !== "admin") {
          next({ name: "home" });
        } else {
          next();
        }
      } else {
        next();
      }
    }
  } catch (error) {
    console.error(error);
    next({ name: "login" });
  }
});

export default router;
