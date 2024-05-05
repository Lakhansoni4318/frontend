<template>
  <div class="max-w-2xl mx-auto mt-20">
    <div class="border border-gray-800 p-8 rounded-xl md:max-w-3xl shadow-lg">
      <!-- Profile Photo Section -->
      <div class="flex justify-center mb-6">
        <div
          class="relative w-40 h-40 rounded-full overflow-hidden flex items-center justify-center border-4 border-white"
        >
          <label for="profile-photo" class="cursor-pointer">
            <div
              class="absolute inset-0 bg-gray-300 flex items-center justify-center"
            >
              <span class="text-gray-600 text-2xl">+</span>
              <div
                v-if="isUploadingProfilePhoto"
                class="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-white opacity-75"
              >
                <!-- Add your loader component or Tailwind CSS loader styles here -->
                <div
                  class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-6 w-6"
                ></div>
              </div>
            </div>
            <img
              v-if="profilePhoto && !isUploadingProfilePhoto"
              :src="profilePhoto"
              alt="Profile Photo"
              class="absolute inset-0 w-full h-full object-cover"
            />
          </label>
          <input
            type="file"
            id="profile-photo"
            accept="image/*"
            class="hidden"
            @change="handleProfilePhotoUpload"
          />
        </div>
      </div>

      <h1 class="text-3xl font-semibold mb-6">My Profile</h1>

      <!-- Name & Email Section -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <!-- Name Section -->
        <div class="mb-6">
          <label class="block text-lg font-semibold mb-2">Name</label>
          <input
            type="text"
            v-model="name"
            placeholder="Enter your name"
            class="w-full p-3 border rounded font-bold focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        <!-- Email Section -->
        <div class="mb-6">
          <label class="block text-lg font-semibold mb-2">Email</label>
          <input
            type="text"
            :value="userDisplayName"
            disabled
            class="w-full p-3 border rounded cursor-not-allowed bg-gray-100"
          />
        </div>
      </div>

      <!-- LinkedIn & GitHub Section -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <!-- LinkedIn Section -->
        <div class="mb-6">
          <label class="block text-lg font-semibold mb-2">LinkedIn URL</label>
          <input
            type="text"
            v-model="linkedinURL"
            placeholder="Enter your LinkedIn URL"
            class="w-full p-3 border rounded font-bold focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        <!-- GitHub Section -->
        <div class="mb-6">
          <label class="block text-lg font-semibold mb-2">GitHub URL</label>
          <input
            type="text"
            v-model="githubURL"
            placeholder="Enter your GitHub URL"
            class="w-full p-3 border rounded font-bold focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
      </div>

      <!-- Professional & Looking for Job Section -->
      <div class="mb-6">
        <label class="block text-lg font-semibold mb-2">Professional</label>
        <textarea
          v-model="professional"
          placeholder="Enter your professional information"
          class="w-full p-3 border rounded font-bold focus:outline-none focus:ring focus:border-blue-300"
          rows="4"
        ></textarea>
      </div>

      <div class="mb-6 flex items-center">
        <input
          type="checkbox"
          v-model="lookingForJob"
          class="mr-2 h-5 w-5 text-blue-500"
        />
        <label class="block text-lg font-semibold mb-2">Looking for Job?</label>
      </div>

      <div v-if="lookingForJob">
        <div class="mb-6">
          <input
            type="text"
            v-model="jobType"
            placeholder="Type of job you are looking for"
            class="w-full p-3 border rounded font-bold focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
      </div>

      <!-- About Me Section -->
      <div class="mb-6">
        <label class="block text-lg font-semibold mb-2">About Me</label>
        <textarea
          v-model="aboutMe"
          placeholder="Tell us about yourself (max 200 characters)"
          class="w-full p-3 border rounded font-bold focus:outline-none focus:ring focus:border-blue-300"
          maxlength="200"
        ></textarea>
        <p class="text-gray-500 text-sm">
          Characters left: {{ 200 - aboutMe.length }}
        </p>
      </div>

      <!-- Save Button -->
      <button
        @click="saveProfile"
        class="bg-blue-500 text-white py-3 px-6 rounded-md hover:bg-blue-600"
      >
        Save
      </button>
    </div>
  </div>
</template>
<script>
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
// Import Firebase Firestore functions
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  addDoc,
} from "firebase/firestore";
import { onAuthStateChanged, getAuth } from "firebase/auth";

export default {
  data() {
    return {
      profilePhoto: "",
      isUploadingProfilePhoto: false,
      name: "",
      userDisplayName: "",
      linkedinURL: "",
      githubURL: "",
      professional: "",
      lookingForJob: false,
      jobType: "",
      aboutMe: "",
    };
  },
  created() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.userDisplayName = user.providerData[0].email || "User";
        this.fetchUserData(this.userDisplayName);
      } else {
        this.userDisplayName = "";
      }
    });
  },
  methods: {
    async fetchUserData(email) {
      const db = getFirestore();
      const profilesRef = collection(db, "profiles");
      const q = query(profilesRef, where("email", "==", email));

      try {
        const querySnapshot = await getDocs(q);
        if (querySnapshot.size > 0) {
          // Profile data exists for the email
          const profileData = querySnapshot.docs[0].data();
          this.name = profileData.name || "";
          this.profilePhoto = profileData.profilePhoto || "";
          this.linkedinURL = profileData.linkedinURL || "";
          this.githubURL = profileData.githubURL || "";
          this.professional = profileData.professional || "";
          this.lookingForJob = profileData.lookingForJob || false;
          this.jobType = profileData.jobType || "";
          this.aboutMe = profileData.aboutMe || "";
        } else {
          // No profile data found for the email
          console.warn("Profile document not found for email:", email);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    },
    async handleProfilePhotoUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      try {
        this.isUploadingProfilePhoto = true;

        const storage = getStorage();
        const storageRef = ref(storage, `myProfile/${this.userDisplayName}`);
        await uploadBytes(storageRef, file);

        const downloadURL = await getDownloadURL(storageRef);
        this.profilePhoto = downloadURL;

        alert("Profile photo uploaded successfully!");
      } catch (error) {
        console.error("Error uploading profile photo:", error);
        alert(
          "An error occurred while uploading the profile photo. Please try again."
        );
      } finally {
        this.isUploadingProfilePhoto = false;
      }
    },
    async saveProfile() {
      try {
        const db = getFirestore();
        const profilesRef = collection(db, "profiles");
        const q = query(
          profilesRef,
          where("email", "==", this.userDisplayName)
        );
        const querySnapshot = await getDocs(q);

        if (querySnapshot.size > 0) {
          // Profile already exists, update it
          querySnapshot.forEach(async (doc) => {
            await updateDoc(doc.ref, {
              name: this.name,
              profilePhoto: this.profilePhoto,
              linkedinURL: this.linkedinURL,
              githubURL: this.githubURL,
              professional: this.professional,
              lookingForJob: this.lookingForJob,
              jobType: this.jobType,
              aboutMe: this.aboutMe,
            });
          });
          alert("Profile updated successfully!");
        } else {
          // Profile does not exist, create a new one
          await addDoc(profilesRef, {
            name: this.name,
            email: this.userDisplayName,
            profilePhoto: this.profilePhoto,
            linkedinURL: this.linkedinURL,
            githubURL: this.githubURL,
            professional: this.professional,
            lookingForJob: this.lookingForJob,
            jobType: this.jobType,
            aboutMe: this.aboutMe,
          });
          alert("Profile created successfully!");
        }
      } catch (error) {
        console.error("Error saving profile:", error);
        alert("An error occurred while saving the profile. Please try again.");
      }
    },
  },
};
</script>

<style scoped>
/* Add scoped styles if needed */
</style>
