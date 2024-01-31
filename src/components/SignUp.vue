<template>
  <div class="bg-gray-50 dark:bg-gray-900 md:pt-10">
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
        Sign Up
      </a>

      <div class="my-3" v-if="isLoading">
        <Spinner />
      </div>
      <div
        class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700"
      >
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h2
            class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
          >
            Create an account
          </h2>
          <form @submit.prevent="registerUser" class="space-y-4 md:space-y-6">
            <div>
              <label
                for="number"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Your Number
              </label>
              <input
                v-model="formData.number"
                type="number"
                id="number"
                placeholder="Enter Your 10 digit Number"
                required
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
            <div>
              <label
                for="email"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Your email
              </label>
              <input
                v-model="formData.email"
                type="email"
                id="email"
                placeholder="name@company.com"
                required
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
            <div>
              <label
                for="password"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Password
              </label>
              <input
                v-model="formData.password"
                type="password"
                id="password"
                placeholder="••••••••"
                required
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
            <div>
              <label
                for="confirm-password"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Confirm password
              </label>
              <input
                v-model="formData.confirmPassword"
                type="password"
                id="confirm-password"
                placeholder="••••••••"
                required
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
            <div class="flex items-start">
              <div class="flex items-center h-5">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                />
              </div>
              <div class="ml-3 text-sm">
                <label
                  for="terms"
                  class="font-light text-gray-500 dark:text-gray-300"
                >
                  I accept the
                  <a
                    href="#"
                    class="font-medium text-primary-600 hover:underline dark:text-primary-500"
                    @click.prevent="showTermsModal = true"
                  >
                    Terms and Conditions
                  </a>
                </label>
              </div>
            </div>
            <button
              type="submit"
              class="w-full text-white bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-purple-600 dark:hover-bg-purple-700 dark:focus:ring-purple-800"
            >
              Create an account
            </button>
            <p class="text-sm font-light text-gray-500 dark:text-gray-400">
              Already have an account?
              <router-link
                :to="{ name: 'login' }"
                href="#"
                class="font-medium text-purple-600 hover:underline dark:text-purple-500"
              >
                Login here
              </router-link>
            </p>
          </form>
        </div>
      </div>
    </div>

    <!-- The Terms and Conditions Modal -->
    <TermsConditionsModal
      v-if="showTermsModal"
      @close="showTermsModal = false"
    />
  </div>
</template>

<script>
import Spinner from "./Spinner.vue";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";
import { useStore } from "vuex";
import { validNumbers } from "../Number";
import TermsConditionsModal from "./TermsConditionsModal.vue";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

export default {
  components: {
    Spinner,
    TermsConditionsModal,
  },
  data() {
    return {
      formData: {
        number: "",
        email: "",
        password: "",
        confirmPassword: "",
      },
      showTermsModal: false,
      isLoading: false,
    };
  },
  methods: {
    async registerUser() {
      try {
        this.isLoading = true;
        const { number, email, password, confirmPassword } = this.formData;

        const validEmailPattern = /@gmail\.com$/;
        if (!validEmailPattern.test(email)) {
          alert("Only @gmail.com email addresses are allowed");
          return;
        }

        const username = email.split("@")[0];
        const disallowedChars = /[!@#$%^&*()+=]/;
        if (disallowedChars.test(username)) {
          alert("Special characters are not allowed in the email username");
          return;
        }

        // Check if the number exists in the array of valid numbers
        if (!validNumbers.includes(Number(number))) {
          alert("Number is not valid");
          return;
        }

        if (password !== confirmPassword) {
          alert("Password and Confirm Password do not match");
          return;
        }

        if (password.length < 6) {
          alert("Password must be at least 6 characters long");
          return;
        }

        const auth = getAuth();

        // Check if the email is already registered
        try {
          await signInWithEmailAndPassword(auth, email, password);
          alert("Email is already registered");
          return;
        } catch (error) {
          // The error here means email is not registered, which is expected.
        }

        // Now, check if the mobile number is already in Firestore
        const db = getFirestore();
        const usersRef = collection(db, "users");
        const querySnapshot = await getDocs(usersRef);

        let numberExists = false;

        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          if (userData.number === number) {
            numberExists = true;
            return;
          }
        });

        if (numberExists) {
          alert("Mobile number is already registered");
          return;
        }

        // Create the user account in Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        if (user) {
          user.displayName = number.toString();
          alert("Your account has been created.");

          // Now, save user data to Firestore
          const userRef = collection(db, "users");
          const newUser = {
            number: number,
            email: email.toLowerCase(),
            role: "user",
          };

          await addDoc(userRef, newUser);

          this.$router.push({ name: "login" });
        } else {
          alert("User registration failed. Please try again.");
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
