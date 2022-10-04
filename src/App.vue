<script setup lang="ts">
import { useQuery } from "@vue/apollo-composable";
import gql from "graphql-tag";

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

const ALL_BOOKS_QUERY = gql`
  query AllBooks {
    allBooks {
      id
      title
      rating
    }
  }
`;

// ref. https://v4.apollo.vuejs.org/api/use-query.html https://issuecloser.com/blog/getting-started-with-vue-query-and-typescript
//
const { result, loading, error } = useQuery<Books, Error>(ALL_BOOKS_QUERY);

console.log(result);
</script>

<template>
  <div>
    <p v-if="loading">Loading...</p>
    <p v-if="error">Error: {{ error }}</p>
    <p v-if="result" v-for="book in result.allBooks" :key="book.id">
      {{ book.title }}
    </p>
  </div>
</template>

<style scoped></style>
