<template>
  <div class="my-10">
    <Spinner v-if="isLoading" />
    <ComingSoon
      v-if="semesters.length === 0 && !isLoading"
      title="Semester Not Available"
      message="We'll be updating the Semester soon."
    />
    <div
      class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl mt-20"
      v-for="(card, index) in sortedSemesters"
      :key="index"
    >
      <router-link
        :to="{ name: 'Subject', params: { name: card.name } }"
        class="md:flex sm:flex sm:justify-center"
      >
        <div class="md:flex-shrink-0">
          <img
            class="h-48 object-cover w-48 mx-auto"
            :src="card.imageUrl"
            :alt="card.name"
          />
        </div>
        <div class="p-8">
          <a
            href="#"
            class="block mt-1 text-lg leading-tight text-center font-medium text-black hover:underline"
            >{{ card.name }}</a
          >
        </div>
      </router-link>
    </div>
  </div>
  <Footer v-if="!isLoading" />
</template>

<script>
import ComingSoon from "../components/ComingSoon.vue";
import Footer from "../components/Footer.vue";
import Spinner from "../components/Spinner.vue";
import { db } from "../firebase";
import { collection, query, getDocs } from "firebase/firestore";

export default {
  name: "Home",
  data() {
    return {
      semesters: [],
      isLoading: true,
    };
  },
  async mounted() {
    const semestersQuery = query(collection(db, "Semester"));
    const semestersSnapshot = await getDocs(semestersQuery);
    this.semesters = semestersSnapshot.docs.map((semesterDoc) => {
      const semesterData = semesterDoc.data();
      return {
        name: semesterData.name,
        imageUrl: semesterData.imageUrl,
      };
    });

    this.semesters.sort((a, b) => a.name.localeCompare(b.name));

    this.isLoading = false;
  },
  computed: {
    sortedSemesters() {
      return [...this.semesters];
    },
  },
  components: { Spinner, ComingSoon, Footer },
};
</script>
