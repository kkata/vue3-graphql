<script setup lang="ts">
import { ref } from "vue";
import { useQuery } from "@vue/apollo-composable";
import ALL_BOOKS_QUERY from "./graphql/allBooks.query.gql";

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

// ref. https://v4.apollo.vuejs.org/api/use-query.html https://issuecloser.com/blog/getting-started-with-vue-query-and-typescript
//
const { result, loading, error } = useQuery<Books>(ALL_BOOKS_QUERY, () => ({
  search: searchTerm.value,
}));
</script>

<template>
  <div>
    <input type="text" v-model="searchTerm" />
    <p v-if="loading">Loading...</p>
    <p v-else-if="error">Error: {{ error }}</p>
    <template v-else>
      <p v-if="result" v-for="book in result.allBooks" :key="book.id">
        {{ book.title }}
      </p>
    </template>
  </div>
</template>

<style scoped></style>
