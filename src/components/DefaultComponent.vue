<template>
  <div>
    <div class="bg-gray-900 h-20 text-right pt-7 pr-5">
      <div class="text-white ml-10">
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
import SideBar from "./SideBar.vue";

export default {
  name: "DefaultComponent",
  components: {
    SideBar,
  },
  data() {
    return {
      userDisplayName: "",
    };
  },
  created() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.userDisplayName = user.email || "User";
      } else {
        this.userDisplayName = "";
      }
    });
  },
};
</script>
