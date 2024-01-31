<template>
  <div class="bg-gray-50 dark:bg-gray-900 md:pt-10">
    <div
      class="flex flex-col items-center justify-center px-4 py-6 mx-auto md:h-screen lg:py-0 max-w-screen-md"
    >
      <div
        class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700"
      >
        <div class="p-4 space-y-4 md:space-y-6 sm:p-6">
          <h2
            class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
          >
            Chat Room
          </h2>
          <div class="flex flex-col space-y-4 h-60 md:h-96 overflow-y-auto">
            <!-- Display chat messages -->
            <div
              v-for="message in chatMessages"
              :key="message.id"
              class="flex items-start space-x-2 shadow p-2 md:p-4 rounded-md dark:border bg-gray-100 dark:bg-gray-700 dark:border-gray-700 transition-all transform relative"
              :class="{
                'bg-blue-100 dark:bg-blue-700':
                  isAdmin && message.sender === 'Admin',
              }"
              style="transition-duration: 0.5s"
            >
              <div class="flex flex-col flex-grow">
                <div class="flex items-start space-x-2">
                  <div class="flex flex-col">
                    <span class="font-bold">{{
                      getSenderName(message.sender)
                    }}</span>
                    <span class="ml-2">{{ message.text }}</span>
                  </div>
                  <span
                    class="ml-auto text-xs text-gray-500 dark:text-gray-400"
                  >
                    {{ formatTimestamp(message.timestamp) }}
                  </span>
                </div>
              </div>
              <!-- Delete button (displayed only for admin) -->
              <button
                v-if="isAdmin"
                @click="deleteMessage(message.id)"
                class="absolute top-2 right-2 text-red-500 hover:text-red-700 focus:outline-none transition-all transform"
                style="transition-duration: 0.3s"
              >
                Delete
              </button>
            </div>
          </div>
          <div class="flex flex-col space-y-4">
            <input
              v-model="newMessage"
              type="text"
              placeholder="Type your message..."
              class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-all transform"
              style="transition-duration: 0.3s"
            />
            <button
              @click="sendMessage"
              class="bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:outline-none focus:ring-purple-300 text-white font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-purple-600 dark:hover-bg-purple-700 dark:focus:ring-purple-800 transition-all transform"
              style="transition-duration: 0.3s"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default {
  data() {
    return {
      newMessage: "",
      chatMessages: [],
    };
  },
  computed: {
    isAdmin() {
      return (
        this.$store.getters.userRole === "admin" ||
        this.$store.getters.userRole === "subadmin"
      );
    },
  },
  methods: {
    async sendMessage() {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        alert("Please sign in to send messages.");
        return;
      }

      const senderName = this.isAdmin ? "Admin" : "Subadmin";

      const db = getFirestore();
      const chatRef = collection(db, "chat");

      await addDoc(chatRef, {
        sender: senderName,
        text: this.newMessage,
        timestamp: new Date(),
      });

      this.newMessage = ""; // Clear the input field after sending a message
    },
    formatTimestamp(timestamp) {
      const date = new Date(timestamp.toDate());
      const options = {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true, // Display time in 24-hour format
        timeZone: "Asia/Kolkata", // Set to India Standard Time (IST)
      };
      return date.toLocaleTimeString(undefined, options);
    },

    async deleteOldMessages() {
      const db = getFirestore();
      const chatRef = collection(db, "chat");
      const cutoffTime = new Date();
      cutoffTime.setHours(cutoffTime.getHours() - 24);

      const q = query(chatRef, where("timestamp", "<", cutoffTime));

      const querySnapshot = await getDocs(q);
      const batch = getFirestore(db).batch();

      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
    },
    async deleteMessage(messageId) {
      if (!this.isAdmin) {
        // Only allow deletion for admin users
        return;
      }

      const db = getFirestore();
      const chatRef = doc(db, "chat", messageId);

      try {
        await deleteDoc(chatRef);
      } catch (error) {
        console.error("Error deleting message:", error);
      }
    },
    getSenderName(sender) {
      return this.isAdmin ? "Admin" : "Admin";
    },
  },
  mounted() {
    const db = getFirestore();
    const chatRef = collection(db, "chat");

    // Listen for new messages in real-time
    onSnapshot(chatRef, (querySnapshot) => {
      this.chatMessages = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    });

    // Check if the user is authenticated
    onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        // Do something when the user is authenticated
      } else {
        // Do something when the user is not authenticated
      }
    });

    // Schedule the deletion of old messages every 24 hours
    setInterval(() => {
      this.deleteOldMessages();
    }, 24 * 60 * 60 * 1000); // 24 hours in milliseconds
  },
};
</script>

<style scoped>
/* Add your Tailwind CSS styles here */
</style>
