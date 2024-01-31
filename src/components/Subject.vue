<template>
  <div class="my-10 min-h-screen">
    <Spinner v-if="isLoading" />
    <InstructionSpecialisation
      v-if="
        !isLoading &&
        (userSpecialization == undefined || userSpecialization == null)
      "
    />
    <ComingSoon
      v-else-if="
        selectedSubjects.length === 0 &&
        !isLoading &&
        userSpecialization !== undefined
      "
      title="Subject Not Available"
      message="We'll be updating the subject soon."
    />
    <div
      class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl mt-20"
      v-for="(card, index) in selectedSubjects"
      :key="index"
    >
      <router-link
        :to="{
          name: 'pdf',
          params: { semName: this.$route.params.name, name: card.name },
        }"
        class="md:flex flex-col sm:flex-row items-center"
      >
        <div class="md:flex-shrink-0 sm:w-1/2 md:w-auto md:mr-4">
          <!-- Adjust width for small screens -->
          <img
            class="h-48 md:w-48 sm:w-36 object-cover mx-auto md:mx-0"
            :src="card.imageUrl"
            :alt="card.name"
          />
        </div>
        <div class="p-8 sm:w-1/2 md:w-auto md:ml-4">
          <!-- Adjust width for small screens and margins for medium screens -->
          <a
            href="#"
            class="block mt-1 text-lg leading-tight font-medium text-black hover:underline text-center md:text-left"
            >{{ card.name }}</a
          >
        </div>
      </router-link>
    </div>
  </div>
  <Footer v-if="!isLoading" />
</template>

<script>
import { db, auth } from "../firebase";
import { collection, getDocs, where, query, doc } from "firebase/firestore";
import ComingSoon from "../components/ComingSoon.vue";
import Spinner from "./Spinner.vue";
import Footer from "./Footer.vue";
import InstructionSpecialisation from "./InstructionSpecialisation.vue";

export default {
  name: "Subject",
  data() {
    return {
      selectedSubjects: [],
      isLoading: true,
      userSpecialization: localStorage.getItem("userSpecialization") || null,
    };
  },
  components: {
    ComingSoon,
    Spinner,
    Footer,
    InstructionSpecialisation,
  },
  created() {
    this.fetchData(); // Fetch data when the component is created
  },
  watch: {
    "$route.params.name": "fetchData", // Watch for changes in the route parameter and call fetchData
  },
  methods: {
    async fetchData() {
      this.isLoading = true;

      // Check if there is data in local storage
      const storedData = localStorage.getItem("selectedSubjects");

      if (storedData) {
        this.selectedSubjects = JSON.parse(storedData);
        this.isLoading = false;
        return;
      }

      // Fetch the currently logged-in user
      const user = auth.currentUser;

      if (user) {
        // Use the user's email to fetch the specialization from the "users" collection
        const userQuery = query(
          collection(db, "users"),
          where("email", "==", user.email)
        );

        const userSnapshot = await getDocs(userQuery);

        if (!userSnapshot.empty) {
          const userData = userSnapshot.docs[0].data();
          this.userSpecialization = userData.specialization;

          // Store userSpecialization in local storage
          localStorage.setItem("userSpecialization", this.userSpecialization);
        }
      }

      if (!this.userSpecialization) {
        // Handle the case where user specialization is not found.
        this.isLoading = false;
        return;
      }

      // Now use the user's specialization to query the subjects
      const semesterQuery = query(
        collection(db, "Semester"),
        where("name", "==", this.$route.params.name)
      );

      const semesterSnapshot = await getDocs(semesterQuery);

      if (semesterSnapshot.empty) {
        this.isLoading = false;
        return;
      }

      const semesterDoc = semesterSnapshot.docs[0];
      const specializationRef = doc(
        semesterDoc.ref,
        `Specialization/${this.userSpecialization}`
      );
      const subjectsQuery = query(collection(specializationRef, "Subject"));

      const subjectSnapshot = await getDocs(subjectsQuery);

      this.selectedSubjects = subjectSnapshot.docs.map((subjectDoc) => {
        const subjectData = subjectDoc.data();
        return {
          name: subjectData.name,
          imageUrl: subjectData.image,
        };
      });

      // Save data to local storage
      localStorage.setItem(
        "selectedSubjects",
        JSON.stringify(this.selectedSubjects)
      );

      this.isLoading = false;
    },
  },
  beforeRouteLeave(to, from, next) {
    // Clear data from local storage when leaving the component
    localStorage.removeItem("selectedSubjects");
    localStorage.removeItem("userSpecialization");
    next();
  },
};
</script>
