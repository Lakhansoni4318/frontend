<template>
  <div class="my-10 min-h-screen">
    <Spinner v-if="isLoading" />

    <ComingSoon
      v-if="pdfs.length === 0 && !isLoading"
      title="Pdf Not Available"
      message="We'll be updating the Pdf soon."
    />

    <div
      class="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden md:max-w-2xl mt-20"
      v-for="(pdf, index) in pdfs"
      :key="index"
    >
      <div class="flex flex-col md:flex-row items-center justify-between">
        <div class="md:flex-shrink-0">
          <img
            class="h-48 w-48 object-cover"
            src="https://png.pngtree.com/png-vector/20221207/ourmid/pngtree-pdf-download-vector-icon-png-image_6514761.png"
            :alt="pdf.name"
          />
        </div>
        <div class="p-8 flex-grow">
          <div class="flex flex-col md:flex-row justify-between items-center">
            <h2 class="text-2xl font-semibold text-gray-800">{{ pdf.name }}</h2>
            <div
              class="relative inline-block text-gray-600 group"
              v-if="$store.getters.userRole === 'admin'"
            >
              <button
                class="group-hover:text-gray-900"
                @click="pdf.showOptions = !pdf.showOptions"
              >
                <svg
                  class="w-16 h-16 cursor-pointer"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v2m0 2v2m-2-4h4"
                  ></path>
                </svg>
              </button>
              <div
                v-show="pdf.showOptions"
                class="absolute right-0 mt-2 w-48 py-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10"
              >
                <button
                  class="block w-full text-center px-4 py-2 hover:bg-gray-100 text-gray-800"
                  @click="deletePdf(pdf)"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
          <div class="bg-red-500 w-28 text-center p-2 mt-5">
            <a
              :href="pdf.pdfUrl"
              download
              class="text-white hover:text-gray-300"
            >
              Download
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Footer v-if="!isLoading" />
</template>

<script>
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import ComingSoon from "./ComingSoon.vue";
import Spinner from "./Spinner.vue";
import Footer from "./footer.vue";
import InstructionSpecialisation from "./InstructionSpecialisation.vue";

export default {
  data() {
    return {
      pdfs: [],
      isLoading: true,
    };
  },
  components: {
    ComingSoon,
    Spinner,
    Footer,
    InstructionSpecialisation,
  },
  methods: {
    async fetchSemesterData() {
      const user = auth.currentUser;

      if (user) {
        const userQuery = query(
          collection(db, "users"),
          where("email", "==", user.email)
        );

        const userSnapshot = await getDocs(userQuery);

        if (!userSnapshot.empty) {
          const userData = userSnapshot.docs[0].data();
          const userSpecialization = userData.specialization;

          if (
            this.$route.params.semName &&
            this.$route.params.name &&
            userSpecialization
          ) {
            const semesterQuery = query(
              collection(db, "Semester"),
              where("name", "==", this.$route.params.semName)
            );

            const semesterSnapshot = await getDocs(semesterQuery);
            const semesterDoc = semesterSnapshot.docs[0];

            if (semesterDoc) {
              const specializationRef = doc(
                semesterDoc.ref,
                `Specialization/${userSpecialization}`
              );

              const subjectQuery = query(
                collection(specializationRef, "Subject"),
                where("name", "==", this.$route.params.name)
              );

              const subjectSnapshot = await getDocs(subjectQuery);
              const subjectDoc = subjectSnapshot.docs[0];

              if (subjectDoc) {
                const pdfsQuery = query(collection(subjectDoc.ref, "Pdf"));
                const pdfSnapshot = await getDocs(pdfsQuery);

                this.pdfs = pdfSnapshot.docs.map((pdfDoc) => {
                  const pdfData = pdfDoc.data();
                  return {
                    pdfUrl: pdfData.pdfUrl,
                    name: pdfData.name,
                    imageUrl: pdfData.imageUrl,
                    ref: pdfDoc.ref,
                    showOptions: false,
                  };
                });
              }
            }
          }
        }
      }
    },
    async deletePdf(pdf) {
      await deleteDoc(pdf.ref);
      const index = this.pdfs.findIndex((item) => item === pdf);
      if (index !== -1) {
        this.pdfs.splice(index, 1);
        this.storePdfDataInLocalStorage();
      }
    },
    storePdfDataInLocalStorage() {
      localStorage.setItem("pdfs", JSON.stringify(this.pdfs));
    },
    removePdfDataFromLocalStorage() {
      localStorage.removeItem("pdfs");
    },
  },
  created() {
    const storedPdfs = localStorage.getItem("pdfs");

    if (storedPdfs) {
      this.pdfs = JSON.parse(storedPdfs);
      this.isLoading = false;
    } else {
      this.fetchSemesterData().then(() => {
        this.storePdfDataInLocalStorage();
        this.isLoading = false;
      });
    }
  },
  beforeRouteLeave(to, from, next) {
    this.removePdfDataFromLocalStorage();
    next();
  },
};
</script>
