<template>
  <div class="bg-gray-100 min-h-screen flex items-center justify-center">
    <div class="bg-white p-8 rounded-lg shadow-md w-96">
      <h1 class="text-2xl font-semibold mb-4">Provide Feedback</h1>
      <form @submit.prevent="submitFeedback" class="space-y-4">
        <div class="space-y-2">
          <label for="name" class="block text-sm font-medium text-gray-700"
            >Your Name</label
          >
          <input
            v-model="formData.name"
            type="text"
            id="name"
            name="name"
            class="w-full border border-gray-300 rounded-lg p-2"
          />
        </div>
        <div class="space-y-2">
          <label for="email" class="block text-sm font-medium text-gray-700"
            >Email Address</label
          >
          <input
            v-model="formData.email"
            type="email"
            id="email"
            name="email"
            class="w-full border border-gray-300 rounded-lg p-2"
          />
        </div>

        <div class="space-y-2">
          <label for="feedback" class="block text-sm font-medium text-gray-700"
            >Feedback</label
          >
          <textarea
            v-model="formData.feedback"
            id="feedback"
            name="feedback"
            class="w-full border border-gray-300 rounded-lg p-2 h-32"
          ></textarea>
        </div>
        <button
          type="submit"
          class="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
        >
          Submit Feedback
        </button>
      </form>
    </div>
  </div>
</template>

<script>
// Import Axios if you haven't already
import axios from "axios";

export default {
  data() {
    return {
      formData: {
        name: "",
        email: "",
        feedback: "",
      },
    };
  },
  methods: {
    submitFeedback() {
      axios
        .post("https://formspree.io/f/mdorbrzw", this.formData)
        .then(() => {
          alert("Thank you for giving me valuable feedback.");
        })
        .catch((error) => {
          console.error(error);
        });

      this.formData.name = "";
      this.formData.email = "";
      this.formData.feedback = "";
    },
  },
};
</script>
