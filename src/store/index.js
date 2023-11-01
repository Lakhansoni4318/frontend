import { getAuth, onAuthStateChanged } from "firebase/auth";
import { createStore } from "vuex";

const auth = getAuth();

const localUserRole = localStorage.getItem("userRole");
const localLoggedIn = localStorage.getItem("isLoggedIn");

export default createStore({
  state: {
    userRole: localUserRole || "user",
    isLoggedIn: localLoggedIn === "true",
  },
  mutations: {
    setUserRole(state, role) {
      state.userRole = role;
    },
    setLoggedIn(state, loggedIn) {
      state.isLoggedIn = loggedIn;
    },
  },
  actions: {
    setUserRole({ commit }, role) {
      commit("setUserRole", role);
      localStorage.setItem("userRole", role);
    },
    setLoggedIn({ commit }, loggedIn) {
      commit("setLoggedIn", loggedIn);
      localStorage.setItem("isLoggedIn", loggedIn.toString());
    },
    checkLoggedIn({ commit }) {
      onAuthStateChanged(auth, (user) => {
        const loggedIn = user !== null;
        commit("setLoggedIn", loggedIn);
        localStorage.setItem("isLoggedIn", loggedIn.toString());
      });
    },
  },
  getters: {
    userRole: (state) => state.userRole,
    isLoggedIn: (state) => state.isLoggedIn,
  },
});
