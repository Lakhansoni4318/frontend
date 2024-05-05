<template>
  <div>
    <span
      class="absolute text-white text-4xl top-5 left-4 cursor-pointer z-50"
      @click="openSidebar"
    >
      <i class="bi bi-filter-left mx-2 bg-gray-900 rounded-md"></i>
    </span>

    <div
      class="sidebar fixed top-0 left-0 p-2 w-full md:w-[300px] overflow-y-auto text-center bg-gray-900 h-screen flex flex-col"
      :class="{ hidden: isSidebarHidden }"
    >
      <div class="text-gray-100 text-xl">
        <div class="p-2.5 mt-1 flex items-center justify-between">
          <i class="bi bi-app-indicator px-2 py-1 rounded-md bg-blue-600"></i>
          <h1 class="font-bold text-gray-200 text-[15px] ml-3">
            FriendNotesHub
          </h1>
          <i class="bi bi-x cursor-pointer" @click="openSidebar"></i>
        </div>
        <div class="my-2 bg-gray-600 h-[1px]"></div>
      </div>

      <router-link
        :to="{ name: 'home' }"
        class="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white"
      >
        <i class="bi bi-house-door-fill"></i>
        <span class="text-[15px] ml-4 text-gray-200 font-bold">Home</span>
      </router-link>

      <div class="my-4 bg-gray-600 h-[1px]"></div>

      <router-link
        :to="{ path: '/admin' }"
        v-show="isAdmin"
        class="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white"
      >
        <i class="bi bi-cloud-arrow-up"></i>
        <span class="text-[15px] ml-4 text-gray-200 font-bold">
          Upload PDF
        </span>
      </router-link>

      <router-link
        :to="{ path: '/chat' }"
        class="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white"
      >
        <i class="bi bi-chat"></i>
        <span class="text-[15px] ml-4 text-gray-200 font-bold"> Chat </span>
      </router-link>

      <router-link
        :to="{ path: '/feedback' }"
        class="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white"
      >
        <i class="bi bi-chat-left-text-fill"></i>
        <span class="text-[15px] ml-4 text-gray-200 font-bold"> Feedback </span>
      </router-link>

      <router-link
        v-show="isSuperAdmin"
        :to="{ name: 'adminPanel' }"
        class="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white"
      >
        <i class="bi bi-person"></i>
        <span class="text-[15px] ml-4 text-gray-200 font-bold">Admin</span>
      </router-link>

      <router-link
        :to="{ name: 'profile' }"
        class="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white"
      >
        <i class="bi bi-person"></i>
        <span class="text-[15px] ml-4 text-gray-200 font-bold">My Profile</span>
      </router-link>

      <router-link
        :to="{ name: 'Allprofile' }"
        class="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white"
      >
        <i class="bi bi-person"></i>
        <span class="text-[15px] ml-4 text-gray-200 font-bold">All Profile</span>
      </router-link>
      
      <router-link
        :to="{ name: 'setting' }"
        class="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white"
      >
        <i class="bi bi-gear-fill"></i>
        <span class="text-[15px] ml-4 text-gray-200 font-bold">Settings</span>
      </router-link>

      <router-link
        :to="{ name: 'setting' }"
        class="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white"
      >
        <i class="bi bi-gear-fill"></i>
        <span class="text-[15px] ml-4 text-gray-200 font-bold">Settings</span>
      </router-link>

      <router-link
        :to="{ name: 'login' }"
        class="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white"
      >
        <i class="bi bi-box-arrow-in-right"></i>
        <span class="text-[15px] ml-4 text-gray-200 font-bold"> Logout </span>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isSidebarHidden: true,
    };
  },
  computed: {
    isAdmin() {
      return (
        this.$store.getters.userRole === "admin" ||
        this.$store.getters.userRole === "subadmin"
      );
    },
    isSuperAdmin() {
      return this.$store.getters.userRole === "admin";
    },
  },
  methods: {
    dropdown() {
      this.$refs.submenu.classList.toggle("hidden");
      this.$refs.arrow.classList.toggle("rotate-0");
    },
    openSidebar() {
      this.isSidebarHidden = !this.isSidebarHidden;
    },
  },
};
</script>
