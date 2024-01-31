<template>
  <div>
    <div class="bg-gray-900 h-20 text-right pt-7 pr-5">
      <!-- Display Profile Photo -->
      <div class="text-white ml-10">
        <span v-if="profilePhoto">
          <img
            v-if="profilePhoto"
            :src="profilePhoto"
            alt="Profile Photo"
            class="w-10 h-10 rounded-full object-cover inline-block mr-2"
          />
        </span>
        Hello
        <span class="text-yellow-300">{{ userDisplayName || "Guest" }}</span>
      </div>
    </div>
    <SideBar />
    <router-view></router-view>
  </div>
</template>

<script>
import { onAuthStateChanged, getAuth } from "firebase/auth";
import {
  query,
  collection,
  where,
  getFirestore,
  getDocs,
} from "firebase/firestore";
import SideBar from "./SideBar.vue";

export default {
  name: "DefaultComponent",
  components: {
    SideBar,
  },
  data() {
    return {
      userDisplayName: "",
      profilePhoto: null,
    };
  },
  mounted() {
    const auth = getAuth();

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const firestore = getFirestore();
        const usersCollection = collection(firestore, "users");
        const userEmail = user.email;

        try {
          const q = query(usersCollection, where("email", "==", userEmail));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            // If user with matching email exists, use the display name and profile photo
            const userData = querySnapshot.docs[0].data();
            this.userDisplayName = userData.name || userEmail;
            this.profilePhoto = userData.profilePhoto || null;
          } else {
            // If user with matching email does not exist, use the Gmail ID
            this.userDisplayName = userEmail;
            this.profilePhoto = null;
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        // If user is not logged in, set display name to "Guest" and profile photo to null
        this.userDisplayName = "Guest";
        this.profilePhoto = null;
      }
    });
  },
};
</script>
