<template>
  <div class="h-screen flex flex-col justify-center items-center text-black">
    <h1 class="text-4xl font-bold mb-4">{{ title }}</h1>
    <p class="text-lg mb-8">{{ message }}</p>
  </div>
</template>

<script>
export default {
  name: "ComingSoon",
  props: {
    title: String,
    message: String,
  },
};
</script>
