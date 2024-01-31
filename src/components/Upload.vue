<template>
  <div class="flex flex-col items-center space-y-4">
    <button
      @click="uploadDataToFirestore"
      :disabled="uploading"
      class="bg-blue-500 text-white px-4 py-2 rounded-md"
    >
      Upload Data to Firestore
    </button>
    <div v-if="uploading" class="mt-4">
      <Spinner />
    </div>
  </div>
</template>

<script>
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";
import semesterData from "../data/semesterData.json";
import Spinner from "./Spinner.vue";

export default {
  data() {
    return {
      uploading: false,
    };
  },
  methods: {
    async uploadDataToFirestore() {
      try {
        this.uploading = true; // Set uploading to true when starting the upload

        for (const semester of semesterData) {
          const semesterRef = await addDoc(collection(db, "Semester"), {
            name: semester.name,
            imageUrl: semester.imageUrl,
          });

          if (semesterRef) {
            for (const specialization of semester.specializations) {
              for (const subject of specialization.subjects) {
                if (subject.name) {
                  const subjectRef = doc(
                    collection(
                      semesterRef,
                      "Specialization",
                      specialization.name,
                      "Subject"
                    ),
                    subject.name
                  );

                  await setDoc(subjectRef, {
                    name: subject.name,
                    image: subject.image,
                  });

                  if (subjectRef) {
                    for (const pdf of subject.pdfs) {
                      if (pdf.pdfUrl) {
                        const storageRef = ref(storage, `pdfs/${pdf.filename}`);
                        await uploadBytes(storageRef, pdf.pdfBlob);
                        const downloadURL = await getDownloadURL(storageRef);
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
            }
          } else {
            console.error("Error creating Semester document");
          }
        }

        this.uploading = false; // Set uploading to false after the upload is complete

        alert(
          "Data uploaded to Firestore and PDFs uploaded to Storage successfully."
        );
      } catch (error) {
        console.error("Error uploading data to Firestore:", error);
        this.uploading = false; // Set uploading to false in case of an error
      }
    },
  },
  components: { Spinner },
};
</script>
