<template>
  <div class="fixed inset-0 flex items-center justify-center z-50">
    <div class="fixed inset-0 bg-black opacity-50"></div>
    <div
      class="z-50 bg-white rounded-lg shadow-lg p-6 w-full max-w-md transform -translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 max-h-96 overflow-y-auto"
    >
      <h2 class="text-2xl font-semibold mb-4">Terms and Conditions</h2>
      <div class="overflow-y-auto max-h-52">
        <p>
          By using this website, you agree to abide by these Terms and
          Conditions. If you do not agree, please refrain from using the
          website.
        </p>
        <p>
          <strong>Content Usage</strong>
          <br />
          The content on this website is for personal and non-commercial use
          only. Do not reproduce or distribute the content without permission.
        </p>
        <p>
          <strong>User Responsibility</strong>
          <br />
          You are responsible for your account information and activities. Do
          not use the website for unlawful purposes or disrupt its function.
        </p>
        <p>
          <strong>Intellectual Property</strong>
          <br />
          The content on this website is owned by Admin. Do not use, reproduce,
          or distribute without written permission.
        </p>
        <p>
          <strong>Disclaimer</strong>
          <br />
          The website is provided as-is without any warranties. We are not
          liable for any damage or loss resulting from website use.
        </p>
        <p>
          <strong>Changes to Terms and Conditions</strong>
          <br />
          We may modify these terms at any time. Your continued use of the
          website implies acceptance of the updated terms.
        </p>
        <p>
          <strong>Contact</strong>
          <br />
          For questions or concerns, contact us at
          <router-link to="/feedback" class="text-blue-700">Here</router-link>.
        </p>
      </div>
      <button
        @click="closeModal"
        class="mt-4 p-2 bg-red-500 text-white rounded hover-bg-red-600"
      >
        Close
      </button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    closeModal() {
      this.$emit("close");
    },
  },
};
</script>
