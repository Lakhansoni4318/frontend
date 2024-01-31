<template>
  <div class="bg-gray-50 dark:bg-gray-900">
    <div
      class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0"
    >
      <a
        href="#"
        class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
      >
        <img
          class="w-8 h-8 mr-2"
          src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
          alt="logo"
        />
        Login Page
      </a>

      <div
        class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700"
      >
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1
            class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
          >
            Sign in to your account
          </h1>
          <form
            @submit.prevent="loginUser"
            class="space-y-4 md:space-y-6"
            action="#"
          >
            <div>
              <label
                for="email"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Your email</label
              >
              <input
                type="email"
                v-model="email"
                name="email"
                id="email"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="name@company.com"
                required
              />
            </div>
            <div>
              <label
                for="password"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Password</label
              >
              <input
                type="password"
                v-model="password"
                name="password"
                id="password"
                placeholder="••••••••"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              class="w-full text-white bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800"
            >
              Sign in
            </button>
            <p class="text-sm font-light text-gray-500 dark:text-gray-400">
              Don’t have an account yet?
              <router-link
                :to="{ name: 'signUp' }"
                class="font-medium text-purple-600 hover:underline dark:text-purple-500"
                >Sign up</router-link
              >
            </p>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import store from "../store";

export default {
  setup() {
    const email = ref("");
    const password = ref("");
    const router = useRouter();
    const alertMessage = ref("");

    // Inside your setup function
    const loginUser = async () => {
      try {
        const auth = getAuth();
        await signOut(auth);

        const userCredential = await signInWithEmailAndPassword(
          auth,
          email.value,
          password.value
        );

        if (userCredential.user) {
          const uid = userCredential.user.uid;
          const userRole = await getUserRoleFromFirestore(email.value);

          if (userRole) {
            store.commit("setUserRole", userRole);
            store.commit("setLoggedIn", true);
            localStorage.setItem("userRole", userRole);
            localStorage.setItem("isLoggedIn", "true");
            router.push({ name: "home" });
          } else {
            alert("User role not found. Please contact support.");
          }
        } else {
          // User not found
          alert("Account not found. Please sign up.");
        }
      } catch (error) {
        console.error(error);

        if (error.code === "auth/user-not-found") {
          // User not found
          alert("Account not found. Please sign up.");
        } else if (error.code === "auth/wrong-password") {
          // Incorrect password
          alert("Incorrect password. Please try again.");
        } else {
          // Other errors
          alert("An error occurred during login. Please try again.");
        }
      }
    };

    const getUserRoleFromFirestore = async (userEmail) => {
      try {
        const firestore = getFirestore();
        const q = query(
          collection(firestore, "users"),
          where("email", "==", userEmail)
        );
        const querySnapshot = await getDocs(q);

        if (querySnapshot.size > 0) {
          const userDoc = querySnapshot.docs[0];
          return userDoc.data().role;
        } else {
          console.warn("User not found in Firestore.");
          return null;
        }
      } catch (error) {
        console.error("Error fetching user role from Firestore:", error);
        return null;
      }
    };

    return {
      email,
      password,
      loginUser,
      alertMessage,
    };
  },
};
</script>
