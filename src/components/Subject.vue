<template>
  <div>
    <Spinner v-if="isLoading" />

    <ComingSoon
      v-if="selectedSubjects.length === 0 && !isLoading"
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
import { db } from "../firebase";
import { collection, getDocs, where, query } from "firebase/firestore";
import ComingSoon from "../components/ComingSoon.vue";
import Spinner from "./Spinner.vue";
import Footer from "./Footer.vue";

export default {
  name: "Subject",
  data() {
    return {
      selectedSubjects: [],
      isLoading: true,
    };
  },
  components: {
    ComingSoon,
    Spinner,
    Footer,
  },
  async created() {
    const semesterQuery = query(
      collection(db, "Semester"),
      where("name", "==", this.$route.params.name)
    );

    const semesterSnapshot = await getDocs(semesterQuery);

    const semesterDoc = semesterSnapshot.docs[0];
    if (semesterDoc) {
      const subjectsQuery = query(collection(semesterDoc.ref, "Subject"));
      const subjectSnapshot = await getDocs(subjectsQuery);

      this.selectedSubjects = subjectSnapshot.docs.map((subjectDoc) => {
        const subjectData = subjectDoc.data();
        return {
          name: subjectData.name,
          imageUrl: subjectData.image,
        };
      });
    }
    this.isLoading = false;
  },
};
</script>
