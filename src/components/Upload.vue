<template>
  <div>
    <button @click="uploadDataToFirestore">Upload Data to Firestore</button>
    <Spinner />
  </div>
</template>

<script>
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";
import semesterData from "../data/semesterData.json";
import Spinner from "./Spinner.vue";

export default {
  methods: {
    async uploadDataToFirestore() {
      try {
        for (const semester of semesterData) {
          const semesterRef = await addDoc(collection(db, "Semester"), {
            name: semester.name,
            imageUrl: semester.imageUrl,
          });
          if (semesterRef) {
            for (const subject of semester.subjects) {
              if (subject.name) {
                const subjectRef = await addDoc(
                  collection(semesterRef, "Subject"),
                  {
                    name: subject.name,
                    image: subject.image,
                  }
                );
                if (subjectRef) {
                  for (const pdf of subject.pdfs) {
                    if (pdf.pdfUrl) {
                      // Upload the PDF to Firebase Storage
                      const storageRef = ref(storage, `pdfs/${pdf.filename}`);
                      await uploadBytes(storageRef, pdf.pdfBlob);
                      // Get the download URL of the uploaded PDF
                      const downloadURL = await getDownloadURL(storageRef);
                      // Add the PDF download URL to Firestore
                      await addDoc(collection(subjectRef, "Pdf"), {
                        pdfUrl: downloadURL,
                      });
                    }
                  }
                } else {
                  console.error("Error creating Subject document");
                }
              }
            }
          } else {
            console.error("Error creating Semester document");
          }
        }
        alert(
          "Data uploaded to Firestore and PDFs uploaded to Storage successfully."
        );
      } catch (error) {
        console.error("Error uploading data to Firestore:", error);
      }
    },
  },
  components: { Spinner },
};
</script>
