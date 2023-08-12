<template>
  <div>
    <the-prompt
      v-if="showPrompt === true"
      @response="(val) => setResponse(val)"
    />
    <span class="delete-message" v-show="response === 'yes'"
      >Successfully deleted</span
    >
    <section class="todo-list">
      <template v-if="todoList.length">
        <article
          v-for="todo in displayedRecord"
          :key="todo.id"
          :draggable="true"
        >
          <p>
            <input
              type="checkbox"
              :checked="todo.completed"
              @change="handleCompletion(todo.id, $event.target.checked)"
            /><span>{{ todo.todo }}</span>
          </p>
          <div class="action-buttons">
            <button class="edit" @click="editTodo(todo.id)">
              <font-awesome-icon icon="pencil" />
            </button>
            <button class="del" @click="confirmDelete(todo.id)">
              <font-awesome-icon icon="times" />
            </button>
          </div>
        </article>
      </template>
    </section>
    <section class="page-buttons">
      <span @click="setPage(page - 1)" :class="{ inactive: page === 1 }"
        >&lt;</span
      >
      <button
        v-for="pageNumber in totalPages"
        :key="pageNumber"
        :class="{ active: page === pageNumber }"
        @click="setPage(pageNumber)"
      >
        {{ pageNumber }}
      </button>
      <span
        @click="setPage(page + 1)"
        :class="{ inactive: page === Math.ceil(todoList.length / perPage) }"
        >&gt;</span
      >
    </section>
  </div>
</template>

<script>
import axios from "axios";
import { ref, computed, watch } from "vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTimes, faPencil } from "@fortawesome/free-solid-svg-icons";
import ThePrompt from "./ThePrompt.vue";

library.add(faTimes, faPencil);
export default {
  components: {
    ThePrompt,
  },
  setup(props) {
    // PAGINATION
    const page = ref(1);
    const perPage = ref(10);

    const displayedRecord = computed(() => {
      const startId = perPage.value * (page.value - 1);
      const endId = startId + perPage.value;
      return props.todoList.slice(startId, endId);
    });

    function setPage(val) {
      page.value = val;
    }

    const totalPages = computed(() => {
      return Math.ceil(props.todoList.length / perPage.value);
    });

    // WATCH FOR MINIMUM AND MAXIMUM PAGE NUMBER
    watch(page, (newVal) => {
      if (newVal < 1) page.value = 1;
      if (newVal > totalPages.value) page.value = totalPages.value;
    });

    // WATCH FOR CHANGE IN COMPLETED/UNCOMPLETED FILTER
    watch(
      () => props.filter,
      (newVal, oldVal) => {
        if (newVal !== oldVal) {
          page.value = 1;
        }
      },
      { immediate: true }
    );

    // DELETE TASK PROMPT
    const showPrompt = ref(false);
    const response = ref(null);
    const activeEditId = ref(null);

    function setResponse(val) {
      response.value = val;
      showPrompt.value = false;
      setTimeout(() => (response.value = null), 2500);
    }

    async function deleteTodo(todoId) {
      try {
        const url = `https://dummyjson.com/todos/${todoId}`;
        await axios.delete(url);
      } catch (error) {
        console.error(error);
      }
    }

    function confirmDelete(id) {
      showPrompt.value = true;
      if (response.value === "yes") {
        deleteTodo(id);
      } else return;
    }

    function editTodo(id) {
      activeEditId.value = id;
      this.$router.push({
        name: "form",
        params: { formMode: "update", todoId: activeEditId.value },
      });
    }

    async function handleCompletion(id, value) {
      const url = `https://dummyjson.com/todos/${id}`;
      try {
        await axios.put(url, {
          completed: value,
        });
      } catch (error) {
        console.error(error);
      }
    }

    return {
      page,
      perPage,
      totalPages,
      response,
      showPrompt,
      displayedRecord,
      setPage,
      setResponse,
      confirmDelete,
      deleteTodo,
      editTodo,
      handleCompletion,
    };
  },
  props: ["todoList", "filter"],
};
</script>

<style lang="scss" scoped>
$md: 40em;
// MOBILE
.delete-message {
  position: absolute;
  top: 15%;
  color: #860404;
}
.todo-list {
  margin-top: 2rem;
  article {
    margin-bottom: 1rem;
    input {
      margin-right: 0.5rem;
    }
    button {
      padding: 0.1rem 0.5rem;
      border-radius: 5px;
      color: #fff;
      transition: transform 300ms;
      &:first-child {
        background-color: #059c5a;
        border: 0.5px solid #06b96b;
        &:hover {
          color: #04b47c;
        }
      }
      &:nth-of-type(2) {
        margin-left: 0.5rem;
        border: 1px solid #860404;
        background-color: #c80404;
        color: #fff;
        &:hover {
          border: 1px solid rgb(181, 14, 14);
          color: #c80404;
        }
      }
      &:active {
        transform: translateY(3px);
        transition: transform 300ms;
      }
      &:hover {
        background-color: #efefef;
        cursor: pointer;
      }
    }
  }
}
.page-buttons {
  margin-top: 2rem;
  span {
    color: #059c5a;
    font-weight: bold;
    &:hover {
      cursor: pointer;
    }
    &.inactive {
      color: gray;
      cursor: not-allowed;
    }
  }
  button {
    padding: 0.3rem 0.6rem;
    margin-right: 1.2rem;
    background-color: #fff;
    border: 1px solid #04b47c;
    border-radius: 5px;
    &:first-of-type {
      margin-left: 1.2rem;
    }
    // color: #fff;
    &.active,
    &:hover {
      background-color: #04b47c;
      color: #fff;
      cursor: pointer;
    }
  }
}
// MEDIUM
@media (min-width: $md) {
  .todo-list {
    article {
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
