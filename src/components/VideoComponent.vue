<template>
  <div>
    <div
      class="relative w-4/5 md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto my-8"
    >
      <video autoplay loop muted class="w-full rounded-md">
        <!-- Replace 'your-video-url.mp4' with the actual video URL -->
        <source :src="videoUrl" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <button
        @click="redirectToAnotherSite"
        class="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 text-white bg-blue-500 rounded-md cursor-pointer"
      >
        Go to Another Site
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      videoUrl: "your-video-url.mp4", // Replace with the actual video URL
      otherSiteUrl: "https://www.your-other-site.com", // Replace with the actual URL
    };
  },
  methods: {
    redirectToAnotherSite() {
      window.location.href = this.otherSiteUrl;
    },
  },
};
</script>
