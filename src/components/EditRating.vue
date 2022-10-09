<script setup lang="ts">
import { ref } from "vue";
import { useMutation } from "@vue/apollo-composable";
import UPDATE_BOOK_MUTATION from "../graphql/updateBook.mutation.gql";

type Props = {
  initialRating: number;
  bookId: string;
};

const emit = defineEmits(["closeForm"]);

const props = defineProps<Props>();

const rating = ref(props.initialRating);

const {
  mutate: updateRating,
  onDone,
  loading,
  error,
} = useMutation(UPDATE_BOOK_MUTATION, () => ({
  variables: {
    id: props.bookId,
    rating: rating.value,
  },
}));

onDone(() => {
  emit("closeForm");
});
</script>

<template>
  <input
    type="number"
    step="0.1"
    :disabled="loading"
    v-model="rating"
    @keyup.esc="$emit('closeForm')"
    @keyup.enter="updateRating()"
  />
  <p v-if="loading">Updating...</p>
  <p v-if="error">{{ error }}</p>
</template>
