<template>
  <div class="bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto py-10">
      <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        Admin Panel
      </h2>

      <!-- Search Bar -->
      <div
        class="mb-4 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4"
      >
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by Name, Email, Number, or Specialization"
          class="py-2 px-4 border dark:border-gray-600 rounded-lg focus:ring-purple-600 focus:border-purple-600 bg-gray-50 dark:bg-gray-700 dark:text-white"
        />
        <button
          @click="searchUsers"
          class="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring focus:border-purple-300"
        >
          Search
        </button>
      </div>

      <div class="overflow-x-auto">
        <table
          class="min-w-full bg-white border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
        >
          <!-- Table Header -->
          <thead>
            <tr>
              <th class="py-2 px-4 border-b dark:border-gray-600">Number</th>
              <th class="py-2 px-4 border-b dark:border-gray-600">Name</th>
              <th class="py-2 px-4 border-b dark:border-gray-600">Email</th>
              <th class="py-2 px-4 border-b dark:border-gray-600">
                Specialization
              </th>
              <th class="py-2 px-4 border-b dark:border-gray-600">Role</th>
              <th class="py-2 px-4 border-b dark:border-gray-600">Image</th>
              <th class="py-2 px-4 border-b dark:border-gray-600">Actions</th>
            </tr>
          </thead>
          <!-- Table Body -->
          <tbody>
            <tr v-for="user in sortedUsers" :key="user.id">
              <td class="py-2 px-4 border-b dark:border-gray-600 text-center">
                {{ user.number || "None" }}
              </td>
              <td class="py-2 px-4 border-b dark:border-gray-600 text-center">
                {{ user.name || "None" }}
              </td>
              <td class="py-2 px-4 border-b dark:border-gray-600 text-center">
                {{ user.email || "None" }}
              </td>
              <td class="py-2 px-4 border-b dark:border-gray-600 text-center">
                <select
                  v-model="user.specialization"
                  :disabled="user.email === 'callmemanan@gmail.com'"
                  class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option value="" disabled>Select Specialization</option>
                  <option
                    v-for="option in specializationOptions"
                    :key="option"
                    :value="option"
                  >
                    {{ option }}
                  </option>
                </select>
              </td>
              <td class="py-2 px-4 border-b dark:border-gray-600 text-center">
                <select
                  v-model="user.role"
                  :disabled="user.email === 'callmemanan@gmail.com'"
                  class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option value="user">User</option>
                  <option value="subadmin">Sub Admin</option>
                  <option value="admin">Admin</option>
                  <!-- Add Admin as an option -->
                </select>
              </td>
              <td class="py-2 px-4 border-b dark:border-gray-600 text-center">
                <!-- Display the user's image -->
                <img
                  v-if="user.imageUrl"
                  :src="user.imageUrl"
                  alt="User Image"
                  class="w-10 h-10 rounded-full object-cover"
                />
              </td>
              <td class="py-2 px-4 border-b dark:border-gray-600 text-center">
                <button
                  @click="saveUser(user)"
                  :disabled="user.email === 'callmemanan@gmail.com'"
                  class="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
                >
                  Save
                </button>
                <button
                  @click="deleteUser(user)"
                  :disabled="user.email === 'callmemanan@gmail.com'"
                  class="bg-red-500 text-white py-2 px-4 rounded-lg mt-3 hover:bg-red-600 focus:outline-none focus:ring focus:border-red-300 ml-2"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import {
  getAuth,
  onAuthStateChanged,
  deleteUser as deleteAuthUser,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  getDoc,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import {
  getStorage,
  ref as storageRef,
  getDownloadURL,
} from "firebase/storage";

const storage = getStorage();

export default {
  data() {
    return {
      users: [],
      searchQuery: "",
      specialization: "",
      specializationOptions: [
        "Full Stack",
        "Cloud Computing",
        "Artificial Intelligence",
        "Data Science",
      ],
    };
  },
  computed: {
    sortedUsers() {
      const query = this.searchQuery.toLowerCase();
      const filteredUsers = this.users.filter((user) => {
        const name = user.name ? user.name.toLowerCase() : "";
        const email = user.email ? user.email.toLowerCase() : "";
        const number = user.number ? user.number.toString() : "";
        const specialization = user.specialization
          ? user.specialization.toLowerCase()
          : "";

        return (
          name.includes(query) ||
          email.includes(query) ||
          number.includes(query) ||
          specialization.includes(query)
        );
      });

      // Custom sorting function for roles: Admin > Sub Admin > User
      const customSortOrder = {
        admin: 0,
        subadmin: 1,
        user: 2,
      };

      const sortedUsers = [...filteredUsers].sort((a, b) => {
        const roleA = a.role ? a.role.toLowerCase() : "";
        const roleB = b.role ? b.role.toLowerCase() : "";

        // Check if 'name' is not undefined or null before using localeCompare
        const nameA = a.name ? a.name.toLowerCase() : "";
        const nameB = b.name ? b.name.toLowerCase() : "";

        return (
          customSortOrder[roleA] - customSortOrder[roleB] ||
          nameA.localeCompare(nameB)
        );
      });

      const index = sortedUsers.findIndex(
        (user) => user.email === "callmemanan@gmail.com"
      );

      if (index !== -1) {
        const callmemananUser = sortedUsers.splice(index, 1)[0];
        sortedUsers.unshift(callmemananUser);
      }

      return sortedUsers;
    },
  },
  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.fetchUsers();
        this.fetchCurrentUserEmail();
        this.fetchCurrentUserSpecialization();
      } else {
        this.$router.push("/login");
      }
    });
  },
  methods: {
    async fetchUsers() {
      try {
        const db = getFirestore();
        const usersRef = collection(db, "users");
        const querySnapshot = await getDocs(usersRef);

        this.users = querySnapshot.docs.map((doc) => {
          const userData = {
            id: doc.id,
            role: doc.data().role ?? "user",
            imageUrl: doc.data().profilePhoto || "", // Change to profilePhoto
            ...doc.data(),
          };
          return userData;
        });

        // Fetch image URLs for each user
        await this.fetchUserImages();
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },

    fetchCurrentUserEmail() {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          console.log("Current user email:", user.email);
          // Now you can use the user.email to filter or display specific user data
        }
      });
    },
    async fetchCurrentUserSpecialization() {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
          const db = getFirestore();
          const userDoc = await getDoc(doc(db, "users", user.uid));

          if (userDoc.exists()) {
            this.specialization = userDoc.data().specialization || "";
          }
        }
      } catch (error) {
        console.error("Error fetching specialization:", error);
      }
    },
    async updateUserRole(user) {
      try {
        const db = getFirestore();
        const userRef = doc(db, "users", user.id);

        // Update the role in Firestore
        await updateDoc(userRef, {
          role: user.role,
        });

        alert("User role updated successfully");
      } catch (error) {
        console.error("Error updating user role:", error);
      }
    },
    async saveUser(user) {
      try {
        if (user.email === "callmemanan@gmail.com") {
          // Handle disabled state or show a message
          return;
        }

        const db = getFirestore();
        const userRef = doc(db, "users", user.id);

        const specializationValue = user.specialization || "";
        await updateDoc(userRef, {
          specialization: specializationValue,
          role: user.role,
        });

        alert("User data saved successfully");
      } catch (error) {
        console.error("Error saving user data:", error);
      }
    },
    async deleteUser(user) {
      try {
        if (user.email === "callmemanan@gmail.com") {
          // Handle disabled state or show a message
          return;
        }

        const auth = getAuth();
        const db = getFirestore();
        const userRef = doc(db, "users", user.id);

        // Prompt the user for their current password
        const userPassword = prompt("Enter your current password:");

        if (userPassword === null) {
          // User canceled the prompt
          return;
        }

        // Sign in the user with their email and password
        const userCredential = await signInWithEmailAndPassword(
          auth,
          user.email,
          userPassword
        );

        // Delete user from authentication
        await deleteAuthUser(userCredential.user);

        // Delete user from Firestore
        await deleteDoc(userRef);

        // Remove the user from the local users array
        this.users = this.users.filter((u) => u.id !== user.id);

        alert("User deleted successfully");
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    },

    async searchUsers() {
      try {
        const db = getFirestore();
        const usersRef = collection(db, "users");
        const querySnapshot = await getDocs(usersRef);

        const searchData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          role: doc.data().role ?? "user",
          imageUrl: doc.data().profilePhoto || "", // Change to profilePhoto
          ...doc.data(),
        }));

        this.users = searchData.filter((user) => {
          const query = this.searchQuery.toLowerCase();
          const name = user.name ? user.name.toLowerCase() : "";
          const email = user.email ? user.email.toLowerCase() : "";
          const number = user.number ? user.number.toString() : "";
          const specialization = user.specialization
            ? user.specialization.toLowerCase()
            : "";

          return (
            name.includes(query) ||
            email.includes(query) ||
            number.includes(query) ||
            specialization.includes(query)
          );
        });

        // Fetch image URLs for each user
        await this.fetchUserImages();
      } catch (error) {
        console.error("Error searching users:", error);
      }
    },

    async fetchUserImages() {
      try {
        const storageRef = storage.ref().child("userImages");

        // Fetch image URLs for each user
        for (const user of this.users) {
          if (user.imageUrl) {
            const imageRef = storageRef.child(user.imageUrl);
            const imageUrl = await getDownloadURL(imageRef);
            user.imageUrl = imageUrl;
          } else {
            user.imageUrl = "";
          }
        }
      } catch (error) {
        console.error("Error fetching user images:", error);
      }
    },
  },
};
</script>
