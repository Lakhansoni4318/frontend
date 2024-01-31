<template>
  <div class="max-w-2xl mx-auto mt-20">
    <div class="bg-white p-8 rounded-xl md:max-w-3xl shadow-lg">
      <!-- Profile Photo Section -->
      <div class="flex flex-col items-center mb-6 relative ml-2 sm:ml-0">
        <label for="profile-photo" class="cursor-pointer">
          <div class="relative">
            <img
              v-if="profilePhoto && !isUploadingProfilePhoto"
              :src="profilePhoto"
              alt="Profile Photo"
              class="w-24 h-24 rounded-full object-cover mb-2 border-4 border-white"
            />
            <div
              v-if="!profilePhoto || isUploadingProfilePhoto"
              class="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center absolute top-0 left-0 right-0 bottom-0"
            >
              <span class="text-gray-600 text-2xl">+</span>
              <div
                v-if="isUploadingProfilePhoto"
                class="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-white opacity-75 rounded-full"
              >
                <!-- Add your loader component or Tailwind CSS loader styles here -->
                <div
                  class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-6 w-6"
                ></div>
              </div>
            </div>
          </div>
        </label>
        <input
          type="file"
          id="profile-photo"
          accept="image/*"
          class="hidden"
          @change="handleProfilePhotoUpload"
        />
        <!-- Remove Profile Photo Button -->
        <button
          v-if="profilePhoto && !isUploadingProfilePhoto"
          @click="removeProfilePhoto"
          class="mt-2 bg-red-500 text-white p-2 rounded cursor-pointer"
        >
          Remove
        </button>
      </div>

      <h1 class="text-3xl font-semibold mb-6">Settings</h1>

      <!-- Name Section -->
      <div class="mb-6">
        <label class="block text-lg font-semibold mb-2">Name</label>
        <input
          type="text"
          v-model="name"
          class="w-full p-3 border rounded focus:outline-none focus:ring focus:border-blue-300"
        />
        <button
          @click="saveName"
          class="mt-2 bg-blue-500 text-white p-2 rounded cursor-pointer"
        >
          Save Name
        </button>
      </div>

      <!-- Number Section -->
      <div class="mb-6">
        <label class="block text-lg font-semibold mb-2">Number</label>
        <input
          type="text"
          v-model="number"
          class="w-full p-3 border rounded cursor-not-allowed bg-gray-100"
          disabled
        />
      </div>

      <!-- Gmail Section -->
      <div class="mb-6">
        <label class="block text-lg font-semibold mb-2">Gmail</label>
        <input
          type="text"
          :value="userDisplayName"
          disabled
          class="w-full p-3 border rounded cursor-not-allowed bg-gray-100"
        />
      </div>

      <!-- Specialization Section -->
      <div class="mb-6">
        <label class="block text-lg font-semibold mb-2">Specialization</label>
        <select
          v-model="specialization"
          class="w-full p-3 border rounded focus:outline-none focus:ring focus:border-blue-300"
        >
          <option value="">Select Specialization</option>
          <option value="Full Stack">Full Stack</option>
          <option value="Cloud Computing">Cloud Computing</option>
          <option value="Artificial Intelligence">
            Artificial Intelligence
          </option>
          <option value="Data Science">Data Science</option>
        </select>
        <button
          @click="saveSpecialization"
          v-if="!isSaveButtonHidden"
          class="mt-2 bg-green-500 text-white p-2 rounded cursor-pointer"
        >
          Save Specialization
        </button>
        <!-- Conditional message -->
        <p
          v-if="!isSpecializationDisabled && !specialization"
          class="text-red-500 mt-2"
        >
          Please choose a specialization. You can only choose a specialization
          once.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
// Import Firebase Storage functions for profile photo upload and removal
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
} from "firebase/firestore";
import { onAuthStateChanged, getAuth } from "firebase/auth";

export default {
  data() {
    return {
      name: "",
      number: "",
      userDisplayName: "",
      specialization: "",
      isSpecializationDisabled: false,
      isSaveButtonHidden: false,
      profilePhoto: null,
      isUploadingProfilePhoto: false,
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
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));

      try {
        const querySnapshot = await getDocs(q);
        if (querySnapshot.size > 0) {
          const userDoc = querySnapshot.docs[0].data();
          this.number = userDoc.number || "";
          this.name = userDoc.name || "";
          this.specialization = userDoc.specialization || "";
          this.profilePhoto = userDoc.profilePhoto || null;
          if (
            this.$store.getters.userRole !== "admin" &&
            userDoc.specialization
          ) {
            this.isSpecializationDisabled = true;
            this.isSaveButtonHidden = true;
          }
        } else {
          console.warn("User document not found for email:", email);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    },
    async saveName() {
      try {
        const db = getFirestore();
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", this.userDisplayName));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.size === 0) {
          alert("User not found. Please check the email address.");
          return;
        }

        querySnapshot.forEach(async (doc) => {
          if (this.name.trim() !== "") {
            await updateDoc(doc.ref, {
              name: this.name,
            });
          }
        });

        alert("Name saved!");
      } catch (error) {
        console.error("Error updating name:", error);
        alert("An error occurred while saving name. Please try again.");
      }
    },
    async saveSpecialization() {
      try {
        const db = getFirestore();
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", this.userDisplayName));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.size === 0) {
          alert("User not found. Please check the email address.");
          return;
        }

        querySnapshot.forEach(async (doc) => {
          await updateDoc(doc.ref, {
            specialization: this.specialization,
          });

          if (this.$store.getters.userRole !== "admin") {
            this.isSpecializationDisabled = true;
            this.isSaveButtonHidden = true;
          }
        });

        alert("Specialization saved!");
      } catch (error) {
        console.error("Error updating specialization:", error);
        alert(
          "An error occurred while saving specialization. Please try again."
        );
      }
    },
    async handleProfilePhotoUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      try {
        this.isUploadingProfilePhoto = true;

        const storage = getStorage();
        const storageRef = ref(
          storage,
          `profile_photos/${this.userDisplayName}`
        );
        await uploadBytes(storageRef, file);

        const downloadURL = await getDownloadURL(storageRef);
        this.profilePhoto = downloadURL;

        await this.updateProfilePhoto(downloadURL);

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
    async removeProfilePhoto() {
      try {
        const storage = getStorage();
        const storageRef = ref(
          storage,
          `profile_photos/${this.userDisplayName}`
        );

        // Delete the profile photo from Firebase Storage
        await deleteObject(storageRef);

        // Update the profile photo URL in Firestore to null or an empty string
        await this.updateProfilePhoto("");

        // Clear the profile photo in the component
        this.profilePhoto = null;

        alert("Profile photo removed successfully!");
      } catch (error) {
        console.error("Error removing profile photo:", error);
        alert(
          "An error occurred while removing the profile photo. Please try again."
        );
      }
    },
    async updateProfilePhoto(profilePhotoURL) {
      try {
        const db = getFirestore();
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", this.userDisplayName));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.size === 0) {
          console.warn(
            "User document not found for email:",
            this.userDisplayName
          );
          return;
        }

        querySnapshot.forEach(async (doc) => {
          await updateDoc(doc.ref, {
            profilePhoto: profilePhotoURL,
          });
        });
      } catch (error) {
        console.error("Error updating profile photo URL:", error);
        alert(
          "An error occurred while updating the profile photo URL. Please try again."
        );
      }
    },
  },
};
</script>
