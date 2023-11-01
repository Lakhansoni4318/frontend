<template>
  <div class="flex flex-col mt-10">
    <!-- Your main content goes here -->

    <footer class="w-full mt-auto bg-gray-900 shadow dark:bg-gray-800">
      <div
        class="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between flex-col md:flex-row"
      >
        <div class="text-center md:text-left md:w-1/2">
          <span class="text-sm text-gray-500 sm:text-center dark:text-gray-400">
            © {{ new Date().getFullYear() }}
            <a href="/" class="hover:underline">FriendNotesHub</a>
          </span>
          <span
            class="text-center text-gray-500 dark:text-gray-400 mt-2 md:mt-0"
          >
            All Rights Reserved.</span
          >
        </div>
        <ul
          class="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0 md:w-1/2 md:justify-end"
        >
          <li class="md:ml-4 mb-2 md:mb-0">
            <router-link to="/feedback" class="hover:underline"
              >Contact</router-link
            >
          </li>
        </ul>
      </div>
    </footer>
  </div>
</template>
