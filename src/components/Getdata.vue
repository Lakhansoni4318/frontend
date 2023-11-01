<template>
  <div class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-20">
    <h2 class="text-3xl font-semibold mb-4">Upload PDF</h2>
    <input type="file" accept=".pdf" @change="onFileChange" class="mb-4" />

    <!-- Add input field for custom file name -->
    <div class="mb-4">
      <h3 class="text-lg font-semibold">Custom File Name:</h3>
      <input
        v-model="customFileName"
        type="text"
        class="w-full border rounded-lg p-2"
      />
    </div>

    <div class="mb-4">
      <h3 class="text-lg font-semibold">Select Semester:</h3>
      <select
        v-model="selectedSemester"
        @change="fetchSubjects"
        class="w-full border rounded-lg p-2"
      >
        <option v-for="semester in semesters" :value="semester.id">
          {{ semester.name }}
        </option>
      </select>
    </div>

    <div class="mb-4">
      <h3 class="text-lg font-semibold">Select Subject:</h3>
      <select v-model="selectedSubject" class="w-full border rounded-lg p-2">
        <option v-for="subject in subjects" :value="subject.id">
          {{ subject.name }}
        </option>
      </select>
    </div>

    <button
      @click="uploadPdf"
      class="bg-blue-500 text-white rounded-lg py-2 px-4 hover:bg-blue-600 focus:outline-none"
    >
      Upload PDF
    </button>

    <p v-if="uploadProgress !== null" class="mt-4">
      Uploading: {{ uploadProgress }}%
    </p>
    <p v-if="pdfUrl" class="mt-4">
      PDF URL:
      <a :href="pdfUrl" target="_blank" class="text-blue-500">Check Pdf Url</a>
    </p>
  </div>
</template>

<script>
import { ref } from "vue";
import {
  getStorage,
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

import { addDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default {
  data() {
    return {
      selectedFile: null,
      selectedSemester: null,
      selectedSubject: null,
      customFileName: "",
      semesters: [],
      subjects: [],
      uploadProgress: null,
      pdfUrl: null,
    };
  },
  methods: {
    async fetchSubjects() {
      if (this.selectedSemester) {
        const subjectsQuery = query(
          collection(db, "Semester", this.selectedSemester, "Subject")
        );
        try {
          const subjectsSnapshot = await getDocs(subjectsQuery);

          this.subjects = subjectsSnapshot.docs.map((subjectDoc) => {
            return {
              id: subjectDoc.id,
              name: subjectDoc.data().name,
            };
          });
        } catch (error) {
          console.error("Error fetching subjects:", error);
        }
      }
    },
    onFileChange(event) {
      this.selectedFile = event.target.files[0];
    },
    async uploadPdf() {
      if (
        !this.selectedFile ||
        !this.selectedSemester ||
        !this.selectedSubject
      ) {
        alert("Please select both a semester and a subject before uploading.");
        return;
      }

      if (this.customFileName.trim() === "") {
        alert("Please provide a custom file name.");
        return;
      }

      const storage = getStorage();
      const semesterName = this.semesters.find(
        (semester) => semester.id === this.selectedSemester
      ).name;
      const subjectName = this.subjects.find(
        (subject) => subject.id === this.selectedSubject
      ).name;

      const filePath = `pdfs/${semesterName}/${subjectName}/${this.customFileName}.pdf`;

      const fileRef = storageRef(storage, filePath);

      try {
        const uploadTask = uploadBytesResumable(fileRef, this.selectedFile);

        uploadTask.on("state_changed", (uploadSnapshot) => {
          const progress =
            (uploadSnapshot.bytesTransferred / uploadSnapshot.totalBytes) * 100;
          this.uploadProgress = Math.round(progress);
        });

        uploadTask.then(async (snapshot) => {
          this.pdfUrl = await getDownloadURL(snapshot.ref);

          const pdfCollection = collection(
            db,
            "Semester",
            this.selectedSemester,
            "Subject",
            this.selectedSubject,
            "Pdf"
          );

          const docRef = await addDoc(pdfCollection, {
            name: this.customFileName,
            pdfUrl: this.pdfUrl,
          });

          console.log("PDF uploaded and metadata stored with ID: ", docRef.id);

          // Reset the form fields after successful upload
          this.selectedFile = null;
          this.customFileName = "";
          this.uploadProgress = null;
        });
      } catch (error) {
        console.error("Error uploading PDF: ", error);
        // Show an error alert
        alert("Error uploading the PDF. Please try again.");
        this.uploadProgress = null;
      }
    },
  },
  async created() {
    const semestersQuery = query(collection(db, "Semester"));
    try {
      const semestersSnapshot = await getDocs(semestersQuery);

      this.semesters = semestersSnapshot.docs.map((semesterDoc) => {
        return {
          id: semesterDoc.id,
          name: semesterDoc.data().name,
        };
      });
    } catch (error) {
      console.error("Error fetching semesters:", error);
    }
  },
};
</script>
