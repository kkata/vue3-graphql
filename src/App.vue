<script setup lang="ts">
import { computed, ref } from "vue";
import { useQuery } from "@vue/apollo-composable";
import ALL_BOOKS_QUERY from "./graphql/allBooks.query.gql";
import EditRating from "./components/EditRating.vue";
import AddBook from "./components/AddBook.vue";

type Book = {
  id: string;
  title: string;
  description: string;
  rating: number;
  author: string;
  year: number;
};

type Books = {
  allBooks: Book[];
};

const searchTerm = ref("");
const activeBook = ref<Book | null>(null);
const showNewBookForm = ref(false);

// ref. https://v4.apollo.vuejs.org/api/use-query.html https://issuecloser.com/blog/getting-started-with-vue-query-and-typescript
//
const { result, loading, error } = useQuery<Books>(
  ALL_BOOKS_QUERY,
  () => ({
    search: searchTerm.value,
  }),
  () => ({
    debounce: 500,
    // enabled: searchTerm.value.length > 2,
  })
);

const books = computed(() => result.value?.allBooks ?? []);
</script>

<template>
  <div>
    <div>
      <button v-if="!showNewBookForm" @click="showNewBookForm = true">
        Add a new book
      </button>
      <AddBook
        v-if="showNewBookForm"
        :search="searchTerm"
        @closeForm="showNewBookForm = false"
      />
    </div>
    <input type="text" v-model="searchTerm" />
    <p v-if="loading">Loading...</p>
    <p v-else-if="error">Error: {{ error }}</p>
    <template v-else>
      <p v-if="activeBook">
        Update "{{ activeBook.title }}" rating:
        <EditRating
          :initialRating="activeBook.rating"
          :bookId="activeBook.id"
          @closeForm="activeBook = null"
        />
      </p>
      <template v-else>
        <p v-for="book in books" :key="book.id">
          {{ book.title }} - {{ book.rating }}
          <button @click="activeBook = book">Edit rating</button>
        </p>
      </template>
    </template>
  </div>
</template>

<style scoped></style>
