<script setup lang="ts">
import { reactive } from "vue";
import ADD_BOOK_MUTATION from "../graphql/addBook.mutation.gql";
import ALL_BOOKS_QUERY from "../graphql/allBooks.query.gql";
import { useMutation } from "@vue/apollo-composable";

type Props = {
  search: string;
};

const props = defineProps<Props>();

const emit = defineEmits(["closeForm"]);

const newBook = reactive({
  title: "",
  author: "",
  year: null,
  rating: null,
  description: "",
});

const { mutate: addBook, onDone } = useMutation(ADD_BOOK_MUTATION, () => ({
  variables: {
    input: newBook,
  },
  update(cache, response) {
    const sourceData = cache.readQuery<{
      allBooks: {
        id: string;
        title: string;
        description: string;
        rating: number;
      }[];
    }>({
      query: ALL_BOOKS_QUERY,
      variables: { search: props.search },
    });
    if (!sourceData) return;
    const data = {
      allBooks: [...sourceData.allBooks, response.data.addBook],
    };
    cache.writeQuery({
      data,
      query: ALL_BOOKS_QUERY,
      variables: { search: props.search },
    });
  },
}));

onDone(() => {
  emit("closeForm");
});

const onSubmit = () => {
  if (newBook.rating === "") {
    newBook.rating = null;
  }
  addBook();
};
</script>

<template>
  <form @submit.prevent="onSubmit">
    <label for="title">
      Title
      <input type="text" id="title" required v-model.trim="newBook.title" />
    </label>
    <label for="author">
      Author
      <input type="text" id="author" required v-model.trim="newBook.author" />
    </label>
    <label for="description">
      Description (optional)
      <input type="text" id="description" v-model.trim="newBook.description" />
    </label>
    <label for="year">
      Year
      <input
        type="number"
        min="0"
        max="2099"
        step="1"
        id="year"
        required
        v-model.number="newBook.year"
      />
    </label>
    <label for="rating">
      Rating (optional)
      <input
        type="number"
        min="0"
        step="0.1"
        id="rating"
        v-model.number="newBook.rating"
      />
    </label>
    <button>Submit</button>
    <button type="reset" @click="$emit('closeForm')">Close form</button>
  </form>
</template>
