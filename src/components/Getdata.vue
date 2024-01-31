<template>
  <div
    class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl mt-20"
  >
    <h2 class="text-3xl font-semibold mb-4 text-center text-gray-800">
      Upload PDF
    </h2>
    <input
      type="file"
      accept=".pdf"
      @change="onFileChange"
      class="mb-4 p-2 border rounded-lg w-full"
    />

    <div class="mb-4">
      <label for="customFileName" class="text-lg font-semibold block"
        >Custom File Name:</label
      >
      <input
        v-model="customFileName"
        type="text"
        id="customFileName"
        class="w-full border rounded-lg p-2"
      />
    </div>

    <div class="mb-4">
      <label for="selectedSemester" class="text-lg font-semibold block"
        >Select Semester:</label
      >
      <select
        v-model="selectedSemester"
        @change="fetchSubjects"
        class="w-full border rounded-lg p-2"
      >
        <option
          v-for="semester in semesters"
          :value="semester.id"
          :key="semester.id"
        >
          {{ semester.name }}
        </option>
      </select>
    </div>

    <div class="mb-4">
      <label for="selectedSubject" class="text-lg font-semibold block"
        >Select Subject:</label
      >
      <select v-model="selectedSubject" class="w-full border rounded-lg p-2">
        <option
          v-for="subject in subjects"
          :value="subject.id"
          :key="subject.id"
        >
          {{ subject.name }}
        </option>
      </select>
    </div>

    <div class="mb-4">
      <label class="text-lg font-semibold block">Select PDF Type:</label>
      <div class="flex">
        <label class="inline-flex items-center mr-4">
          <input
            type="radio"
            v-model="pdfType"
            value="notes"
            class="form-radio text-blue-500"
          />
          <span class="ml-2">Notes</span>
        </label>
        <label class="inline-flex items-center">
          <input
            type="radio"
            v-model="pdfType"
            value="assignment"
            class="form-radio text-blue-500"
          />
          <span class="ml-2">Assignment</span>
        </label>
      </div>
    </div>

    <button
      @click="uploadPdf"
      class="bg-blue-500 text-white rounded-lg py-2 px-4 hover:bg-blue-600 focus:outline-none w-full"
    >
      Upload PDF
    </button>

    <div v-if="uploadProgress !== null" class="mt-4">
      <div class="relative pt-1">
        <div class="flex mb-2 items-center justify-between">
          <div>
            <span
              class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-teal-600 bg-teal-200"
            >
              {{ uploadProgress }}%
            </span>
          </div>
        </div>
        <div class="flex mb-2 items-center justify-start">
          <div class="w-full bg-gray-200 rounded-full">
            <div
              :style="{ width: `${uploadProgress}%` }"
              class="text-center text-white bg-teal-500 rounded-full py-1"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { auth } from "../firebase";
import {
  getStorage,
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

import {
  addDoc,
  collection,
  query,
  getDocs,
  doc,
  where,
} from "firebase/firestore";

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
      pdfType: null, // Added pdfType property
    };
  },

  methods: {
    async fetchSubjects() {
      if (this.selectedSemester) {
        const user = auth.currentUser;

        if (!user) {
          console.error("No logged-in user.");
          return;
        }

        const userQuery = query(
          collection(db, "users"),
          where("email", "==", user.email)
        );

        try {
          const userSnapshot = await getDocs(userQuery);

          if (!userSnapshot.empty) {
            const userData = userSnapshot.docs[0].data();
            const userSpecialization = userData.specialization;

            this.selectedSpecialization = userSpecialization;

            const specializationRef = doc(
              db,
              "Semester",
              this.selectedSemester,
              "Specialization",
              userSpecialization
            );

            const subjectsQuery = query(
              collection(specializationRef, "Subject")
            );
            const subjectsSnapshot = await getDocs(subjectsQuery);

            this.subjects = subjectsSnapshot.docs.map((subjectDoc) => ({
              id: subjectDoc.id,
              name: subjectDoc.data().name,
            }));
          } else {
            console.error("User data not found.");
          }
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
        !this.selectedSubject ||
        !this.pdfType
      ) {
        alert(
          "Please select both a semester, a subject, and PDF type before uploading."
        );
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

      const specializationList = [
        "Artificial Intelligence",
        "Cloud Computing",
        "Data Science",
        "Full Stack",
      ];

      for (const specialization of specializationList) {
        const filePath = `pdfs/${semesterName}/${specialization}/${this.customFileName}.pdf`;
        const fileRef = storageRef(storage, filePath);

        try {
          const uploadTask = uploadBytesResumable(fileRef, this.selectedFile);

          uploadTask.on("state_changed", (uploadSnapshot) => {
            const progress =
              (uploadSnapshot.bytesTransferred / uploadSnapshot.totalBytes) *
              100;
            this.uploadProgress = Math.round(progress);
          });

          await uploadTask;

          const pdfUrl = await getDownloadURL(fileRef);
          this.pdfUrl = pdfUrl;

          const pdfCollectionPath = [
            "Semester",
            this.selectedSemester,
            "Specialization",
            specialization,
            "Subject",
          ]
            .filter((segment) => segment !== null)
            .join("/");

          const subjectQuery = query(
            collection(db, pdfCollectionPath),
            where("name", "==", this.selectedSubject)
          );

          const subjectDocs = await getDocs(subjectQuery);

          if (subjectDocs.docs.length > 0) {
            const subjectDocRef = subjectDocs.docs[0].ref;
            const pdfDocData = {
              name: this.customFileName,
              pdfUrl: pdfUrl,
              type: this.pdfType, // Added pdfType
            };

            try {
              await addDoc(collection(subjectDocRef, "Pdf"), pdfDocData);
            } catch (error) {
              console.error("Error adding PDF metadata to Firestore:", error);
              alert(
                "Error adding PDF metadata to Firestore. Please try again."
              );
              return;
            }
          } else {
            console.error("Subject document not found.");
            alert(
              "Subject document not found. Please make sure the subject exists."
            );
            return;
          }
        } catch (error) {
          console.error("Error uploading PDF: ", error);
          alert("Error uploading the PDF. Please try again.");
          this.uploadProgress = null;
          return;
        }
      }

      this.selectedFile = null;
      this.customFileName = "";
      this.uploadProgress = null;
      this.pdfType = null; // Reset pdfType after upload
    },
  },

  async created() {
    const semestersQuery = query(collection(db, "Semester"));
    try {
      const semestersSnapshot = await getDocs(semestersQuery);

      this.semesters = semestersSnapshot.docs.map((semesterDoc) => ({
        id: semesterDoc.id,
        name: semesterDoc.data().name,
      }));
    } catch (error) {
      console.error("Error fetching semesters:", error);
    }
  },
};
</script>

<style>
/* Add your component-specific styles here */
</style>
