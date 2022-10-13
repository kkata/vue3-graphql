<script setup lang="ts">
import { computed, ref } from "vue";
import { useQuery } from "@vue/apollo-composable";
import ALL_BOOKS_QUERY from "./graphql/allBooks.query.gql";
import BOOK_SUBSCRIPTION from "./graphql/newBook.subscription.gql";
import FAVORITE_BOOK_QUERY from "./graphql/favoriteBooks.query.gql";
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

type BookSubscription = {
  newBook: Book;
};

type BookSubscriptionVariables = {
  bookSub: Book;
};

type FavoriteBooks = {
  favoriteBooks: Book[];
};

const searchTerm = ref("");
const activeBook = ref<Book | null>(null);
const showNewBookForm = ref(false);

// ref. https://v4.apollo.vuejs.org/api/use-query.html https://issuecloser.com/blog/getting-started-with-vue-query-and-typescript
//
const { result, loading, error, subscribeToMore } = useQuery<Books>(
  ALL_BOOKS_QUERY,
  () => ({
    search: searchTerm.value,
  }),
  () => ({
    debounce: 500,
    // enabled: searchTerm.value.length > 2,
  })
);

subscribeToMore<BookSubscription, BookSubscriptionVariables>(() => ({
  document: BOOK_SUBSCRIPTION,
  updateQuery(previousResult, newResult) {
    const res = {
      allBooks: [
        ...previousResult.allBooks,
        newResult.subscriptionData.data.bookSub,
      ],
    };
    return res;
  },
}));

const books = computed(() => result.value?.allBooks ?? []);

const { result: favBooksResult } = useQuery<FavoriteBooks>(FAVORITE_BOOK_QUERY);
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
    <p v-else-if="error">Something went wrong! Please try again</p>
    <template v-else>
      <p v-if="activeBook">
        Update "{{ activeBook.title }}" rating:
        <EditRating
          :initial-rating="activeBook.rating"
          :book-id="activeBook.id"
          @closeForm="activeBook = null"
        />
      </p>
      <template v-else>
        <section class="list-wrapper">
          <div class="list">
            <h3>All Books</h3>
            <p v-for="book in books" :key="book.id">
              {{ book.title }} - {{ book.rating }}
              <button @click="activeBook = book">Edit rating</button>
            </p>
          </div>
          <div class="list">
            <h3>Favorite Books</h3>
            <p
              v-if="favBooksResult"
              v-for="book in favBooksResult.favoriteBooks"
              :key="book.id"
            >
              {{ book.title }}
            </p>
          </div>
        </section>
      </template>
    </template>
  </div>
</template>

<style scoped>
.list-wrapper {
  display: flex;
  margin: 0 auto;
  max-width: 960px;
}

.list {
  width: 50%;
}
</style>
