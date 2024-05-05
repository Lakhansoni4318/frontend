<template>
    <div class="max-w-4xl mx-auto mt-10">
      <h1 class="text-3xl font-semibold mb-6 text-center">All Profiles</h1>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
        <div v-for="(profile, index) in profiles" :key="index" class="flex justify-center items-center">
          <div class="border border-gray-300 rounded-xl overflow-hidden shadow-md">
            <img v-if="profile.profilePhoto" :src="profile.profilePhoto" alt="Profile Photo" class="w-full h-40 object-cover">
            <div class="p-4 text-center">
              <h2 class="text-lg font-semibold mb-2">{{ profile.name }}</h2>
              <p v-if="profile.professional" class="mb-2">{{ profile.professional }}</p>
              <p v-if="profile.email" class="mb-2">{{ profile.email }}</p>
              <button @click="openProfileModal(profile)" class="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">View Details</button>
            </div>
          </div>
        </div>
      </div>
      <div v-if="selectedProfile">
        <!-- Modal for detailed profile information -->
        <div class="fixed inset-0 z-50 overflow-auto bg-gray-800 bg-opacity-75 flex items-center justify-center">
          <div class="bg-white rounded-xl p-6 max-w-3xl w-full relative">
            <button class="absolute top-0 right-0 mr-6 mt-6 text-gray-600 text-2xl" @click="closeProfileModal">&times;</button>
            <h2 class="text-2xl font-semibold mb-4 text-center">{{ selectedProfile.name }}</h2>
            <div v-if="selectedProfile.profilePhoto" class="mb-4 flex justify-center">
              <img :src="selectedProfile.profilePhoto" alt="Profile Photo" class="w-full h-64 object-cover rounded-md">
            </div>
            <div class="flex flex-col items-center">
              <p v-if="selectedProfile.professional" class="mb-2"><span class="font-bold">Professional:</span> {{ selectedProfile.professional }}</p>
              <p v-if="selectedProfile.email" class="mb-2"><span class="font-bold">Email:</span> {{ selectedProfile.email }}</p>
              <p v-if="selectedProfile.lookingForJob" class="mb-2"><span class="font-bold">Looking for job:</span> {{ selectedProfile.jobType }}</p>
              <p v-if="selectedProfile.aboutMe" class="mb-4"><span class="font-bold">About Me:</span> {{ selectedProfile.aboutMe }}</p>
              <div class="flex justify-center space-x-4">
                <button v-if="selectedProfile.linkedinURL" @click="openURL(selectedProfile.linkedinURL)" class="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 1a9 9 0 110 18 9 9 0 010-18zm0 3a1 1 0 100 2 1 1 0 000-2zM7.37 14.82h1.92v-6.3H7.37v6.3zm.96-6.76a.97.97 0 00-.98.96c0 .53.43.97.98.97s.98-.44.98-.97a.97.97 0 00-.98-.96zm4.5 6.76h1.91v-2.67c0-1.26.68-1.97 1.65-1.97.82 0 1.45.59 1.45 1.84v2.8h-1.91v-2.49c0-.66-.25-.87-.69-.87-.37 0-.6.25-.69.49-.04.12-.05.29-.05.46v2.41h-1.91v-6.3z" clip-rule="evenodd"/>
                  </svg>
                  LinkedIn
                </button>
                <button v-if="selectedProfile.githubURL" @click="openURL(selectedProfile.githubURL)" class="bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-900 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 1a9 9 0 110 18 9 9 0 010-18zm0 3a1 1 0 100 2 1 1 0 000-2zM7.37 14.82h1.92v-6.3H7.37v6.3zm.96-6.76a.97.97 0 00-.98.96c0 .53.43.97.98.97s.98-.44.98-.97a.97.97 0 00-.98-.96zm4.5 6.76h1.91v-2.67c0-1.26.68-1.97 1.65-1.97.82 0 1.45.59 1.45 1.84v2.8h-1.91v-2.49c0-.66-.25-.87-.69-.87-.37 0-.6.25-.69.49-.04.12-.05.29-.05.46v2.41h-1.91v-6.3z" clip-rule="evenodd"/>
                  </svg>
                  GitHub
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from "vue";
  import { getFirestore, collection, getDocs } from "firebase/firestore";
  
  export default {
    name: "ProfileList",
    data() {
      return {
        profiles: [],
        selectedProfile: null
      };
    },
    methods: {
      async fetchProfiles() {
        const db = getFirestore();
        const profilesRef = collection(db, "profiles");
        const querySnapshot = await getDocs(profilesRef);
        this.profiles = querySnapshot.docs.map(doc => doc.data());
      },
      openProfileModal(profile) {
        this.selectedProfile = profile;
      },
      closeProfileModal() {
        this.selectedProfile = null;
      },
      openURL(url) {
        window.open(url, "_blank");
      }
    },
    mounted() {
      this.fetchProfiles();
    }
  };
  </script>
  
  <style scoped>
  /* Adjustments for label alignment and profile photo */
  .modal-content {
    max-width: 600px;
  }
  
  /* Increase close button size */
  .close-button {
    font-size: 24px;
  }
  </style>
  