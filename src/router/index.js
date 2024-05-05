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
import Setting from "../components/Setting.vue";
import AdminPanel from "../components/AdminPanel.vue";
import Chat from "../components/Chat.vue";
import YourProfile from "../components/yourProfile.vue";
import AllProfile from "../components/AllProfile.vue";

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
        meta: { requiresAuth: true },
      },
      {
        path: "/semester/:semName/pdf/:name",
        name: "pdf",
        component: Pdf,
        meta: { requiresAuth: true },
      },

      {
        path: "/admin",
        name: "admin",
        component: GetData,
        meta: { requiresAuth: true, role: ["admin", "subadmin"] },
      },
    ],
  },
  {
    path: "/setting",
    name: "setting",
    component: Setting,
    meta: { requiresAuth: true },
  },
  {
    path: "/chat",
    name: "chat",
    component: Chat,
    meta: { requiresAuth: true },
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
    meta: { requiresAuth: true },
  },
  {
    path: "/profile",
    component: YourProfile,
    meta: { requiresAuth: true },
    name: "profile"
  },
  {
    path: "/allprofile",
    component: AllProfile,
    meta: { requiresAuth: true },
    name: "Allprofile"
  },
  {
    path: "/upload",
    name: "upload",
    component: Upload,
  },
  {
    path: "/adminpanel",
    name: "adminPanel",
    component: AdminPanel,
    meta: { requiresAuth: true, role: "admin" },
  },
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: { requiresAuth: false },
    beforeEnter(to, from, next) {
      localStorage.clear();
      store.state.isLoggedIn = false;
      next();
    },
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
        if (to.meta.role && !to.meta.role.includes(userRole)) {
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
