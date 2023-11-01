<template>
  <div>
    <span
      class="absolute text-white text-4xl top-5 left-4 cursor-pointer"
      @click="openSidebar"
    >
      <i class="bi bi-filter-left mx-2 bg-gray-900 rounded-md"></i>
    </span>

    <div
      class="sidebar fixed top-0 bottom-0 lg:left-0 p-2 w-[300px] overflow-y-auto text-center bg-gray-900"
      :class="{ hidden: isSidebarHidden }"
    >
      <div class="text-gray-100 text-xl">
        <div class="p-2.5 mt-1 flex items-center">
          <i class="bi bi-app-indicator px-2 py-1 rounded-md bg-blue-600"></i>
          <h1 class="font-bold text-gray-200 text-[15px] ml-3">
            FriendNotesHub
          </h1>
          <i class="bi bi-x cursor-pointer ml-20" @click="openSidebar"></i>
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
      <div
        class="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover-bg-blue-600 text-white"
        @click="dropdown"
      >
        <i class="bi bi-chat-left-text-fill"></i>
        <div class="flex justify-between w-full items-center">
          <span class="text-[15px] ml-4 text-gray-200 font-bold">Semester</span>
          <span class="text-sm rotate-180" id="arrow" ref="arrow">
            <i class="bi bi-chevron-down"></i>
          </span>
        </div>
      </div>
      <div
        class="text-left text-sm mt-2 w-4/5 mx-auto text-gray-200 font-bold"
        id="submenu"
        ref="submenu"
      >
        <router-link :to="{ name: 'Subject', params: { name: 'Semester 1' } }">
          <h1 class="cursor-pointer p-2 hover:bg-blue-600 rounded-md mt-1">
            Semester 1
          </h1>
        </router-link>

        <!-- Add more Semester links here as needed -->
      </div>
      <router-link
        :to="{ name: 'login' }"
        class="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white"
      >
        <i class="bi bi-box-arrow-in-right"></i>
        <span class="text-[15px] ml-4 text-gray-200 font-bold"> Logout </span>
      </router-link>
      <router-link
        :to="{ path: '/admin' }"
        v-show="this.$store.getters.userRole === 'admin'"
        class="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white"
      >
        <i class="bi bi-box-arrow-in-right"></i>
        <span class="text-[15px] ml-4 text-gray-200 font-bold"> Admin </span>
      </router-link>

      <router-link
        :to="{ path: '/feedback' }"
        class="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white"
      >
        <i class="bi bi-box-arrow-in-right"></i>
        <span class="text-[15px] ml-4 text-gray-200 font-bold"> Feedback </span>
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
