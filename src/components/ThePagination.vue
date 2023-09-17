<template>
  <div>
    <the-loader v-show="!todoList && todoList.length" />

    <section class="filter" v-show="todoList.length">
      <TheModal v-if="showModal"
      :options="modalOptions"
      :modalSubmissionState="modalSubmissionState"
      @resolveModalAction="resolveModalAction"
      @close="showModal = false"
      />
      <p>Filters</p>
      <article class="complete-filter">
        <select data-todo-filter v-model="filter">
          <!-- 0 represents all, 1 reps completed, 2 reps not completed -->
          <option selected :value="0">All</option>
          <option :value="1">Completed</option>
          <option :value="2">Not Completed</option>
        </select>
      </article>
      <article class="perpage-filter">
        <select v-model="perPage">
          <option selected :value="6">6</option>
          <option :value="10">10</option>
          <option :value="15">15</option>
        </select>
      </article>
      <article>Total count: {{ todoList.length }}</article>
    </section>
    <!-- TODO LIST SECTION -->
    <section class="todo-list" v-if="todoList.length">
      <draggable :list="displayedRecord" :move="handleDraggable" @end="handleDragEnd">
        <article
        v-for="todo in displayedRecord"
        :key="todo.id"
        :draggable="true"
        data-todo-item
      >
        <p>
          <label class="form-control">
            <input
              type="checkbox"
              :checked="todo.completed"
              @change="handleCompletion(todo.id, $event.target.checked)"
            />
          </label>
          <span>{{ todo.todo }}</span>
        </p>
        <div class="action-buttons">
          <button class="edit" @click="editTodoName(todo.id, todo.todo)">&#9998;</button>
          <button class="del" @click="deleteTodo(todo.id, todo.completed)">&times;</button>
        </div>
      </article>
      </draggable>
    </section>
    <!-- PAGE NAVIGATION BUTTONS AND ARROW ICONS -->
    <section class="page-buttons" v-show="todoList.length">
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
        :class="{
          inactive: page === Math.ceil(todoList.length / perPage),
        }"
        >&gt;</span
      >
    </section>
  </div>
</template>

<script>
import axios from "axios";
import IBaseConfig from '@service/index'
import draggable from 'vuedraggable'
import { ref, computed, watch, reactive } from "vue";
// import ThePrompt from "./ThePrompt.vue";
import TheLoader from "./loader/TheLoader.vue";
import TheModal from './TheModal.vue';

export default {
  components: {
    // ThePrompt,
    TheLoader,
    draggable,
    TheModal
  },
  props: {
    todoListCopy: Array,
  },
  setup(props, { emit }) {
    // FETCH TODO LIST ON CREATE
    const todoList = computed(() => {
      return props.todoListCopy;
    });

    // PAGINATION
    const page = ref(1);
    const perPage = ref(6);
    const filter = ref(0);

    const fromId = ref(null)
    const toId = ref(null)

    const filteredTodos = computed(() => {
      if (!filter.value) return todoList.value;
      else if (filter.value === 1)
        return todoList.value.filter((todo) => todo.completed);
      else return todoList.value.filter((todo) => !todo.completed);
    });

    const displayedRecord = computed(() => {
      const startId = perPage.value * (page.value - 1);
      const endId = startId + perPage.value;
      return filteredTodos.value.slice(startId, endId);
    });

    function handleDraggable(event) {
      fromId.value = event.draggedContext.element.id
      toId.value = event.relatedContext.element.id
    }

    function handleDragEnd() {
      const fromTodoId = todoList.value.findIndex(todo => todo.id === fromId.value)
      const toTodoId = todoList.value.findIndex(todo => todo.id === toId.value)

      if (fromTodoId === toTodoId) return

      const sortedList = todoList.value.slice()
      sortedList.splice(toTodoId, 0, sortedList.splice(fromTodoId, 1)[0])
      emit('sortedList', sortedList)
    }

    function setPage(val) {
      page.value = val;
    }

    const totalPages = computed(() => {
      return Math.ceil(filteredTodos.value.length / perPage.value);
    });

    // WATCH FOR MINIMUM AND MAXIMUM PAGE NUMBER
    watch(page, (newVal) => {
      if (newVal < 1) page.value = 1;
      if (newVal > totalPages.value) page.value = totalPages.value;
    });

    // WATCH FOR CHANGE IN COMPLETED/UNCOMPLETED FILTER
    watch(
      [filter, perPage],
      (newVal, oldVal) => {
        if (newVal !== oldVal) {
          page.value = 1;
        }
      },
      { immediate: true }
    );

    // DELETE TASK PROMPT
    const showPrompt = ref(false);
    const showModal = ref(false)
    const activeEditId = ref(null);
    const modalSubmissionState = ref(false)
    const modalOptions = reactive({ action: '', header: '', inputValue: '', id: null })

    async function deleteTodo(todoId, isTodoCompleted) {
      showModal.value = true
      modalOptions.action = 'delete'
      modalOptions.header = `${ isTodoCompleted ? 'Are you sure?' : 'Are you sure? This task has not been completed' }`
      modalOptions.inputValue = null
      modalOptions.id = todoId
    }

    async function handleDeletedTodo(todoId) {
      try {
        const resp = await IBaseConfig.delete(`${todoId}`)
        if (resp?.errors) {
          throw resp?.errors
        }
      } catch (error) {
        console.error(error);
      }
    }

    function editTodoName(id, todoName) {
      showModal.value = true
      modalOptions.action = 'edit'
      modalOptions.header = `Update your task`
      modalOptions.inputValue = todoName
      modalOptions.id = id
      activeEditId.value = id;
    }

    async function handleEditedTodo(todo, id) {
      try {
        const resp = await IBaseConfig.put(`${id}`, {
          userId: 5,
          todo
        });
        if (resp?.errors) {
          throw resp?.errors
        }
      } catch (error) {
        console.log(error);
        return error
      }
    }

    async function resolveModalAction({ action, value, id }) {
      modalSubmissionState.value = true
      switch(action) {
        case 'edit': {
          if (!value) return;

          const todoList = [...props.todoListCopy].map((todoItem) => ({
            ...todoItem,
            todo: todoItem.id === id ? value : todoItem.todo
          }))
          await handleEditedTodo(value, id)
          emit('updateTodoList', todoList)
          break;
        }
        case 'delete': {
          const todoList = [...props.todoListCopy].filter((todoItem) => todoItem.id !== id)
          await handleDeletedTodo(id)
          emit('updateTodoList', todoList)
          break;
        }

      }
      modalSubmissionState.value = false
      showModal.value = false
      modalOptions.action = ''
      modalOptions.header = ''
      modalOptions.inputValue = ''
      modalOptions.id = null
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
      filteredTodos,
      page,
      perPage,
      totalPages,
      handleDraggable,
      handleDragEnd,
      todoList,
      filter,
      showModal,
      modalSubmissionState,
      // response,
      showPrompt,
      displayedRecord,
      setPage,
      deleteTodo,
      editTodoName,
      handleCompletion,
      resolveModalAction,
      modalOptions
    };
  },
};
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Caladea&display=swap');
$md: 40em;
// MOBILE
.delete-message {
  position: absolute;
  top: 15%;
  color: #860404;
}

.filter {
  display: flex;
  align-items: center;
  margin-top: 1rem;
  p {
    margin-right: 0.5rem;
    font-size: 1.05rem;
  }
  article {
    select {
      font-size: 0.9rem;
      background-color: #fff !important;
      padding: 0.3rem 0.7rem;
      border-radius: 5px;
      border: 1px solid #b4b4b4;
    }
  }
  .complete-filter {
    margin-right: 0.8rem;
  }
}
.todo-list {
  margin-top: 2rem;
  article {
    margin-bottom: 1.5rem;
    box-shadow: 2px 3px 10px #969595;
    padding: 0.8rem;
    border-radius: 10px;
    cursor: grab;

    span {
      font: {
        family: 'Caladea', serif;
        size: 1.05rem
      }
      margin-left: 0.5rem;
    }
    .action-buttons {
      display: flex;
      margin-top: 0.5rem;
      justify-content: flex-end;
      button {
        border-radius: 50%;
        width: 23px;
        height: 23px;
        line-height: 16px;
        background-color: transparent;
        transition: color 200ms, background-color 200ms;
        &.edit {
          border: 1px solid #06a15e;
          color: #059c5a;
          font-size: 17px;
          &:hover {
            color: #fff;
            background-color: #059c5a;
            transition: color 200ms, background-color 200ms;
          }
        }
        &.del {
          margin-left: 0.5rem;
          border: 1px solid #e61616;
          color: #e61616;
          text-shadow: 0 0 1.4px #e61616;
          font: {
            size: 18px;
          }
          &:hover {
            // border: 1px solid rgb(181, 14, 14);
            color: #fff;
            background-color: #e61616;
            transition: color 200ms, background-color 200ms;
          }
        }
        &:active {
        }
        &:hover {
          cursor: pointer;
        }
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
// @media (min-width: $md) {
//   .todo-list {
//     article {
//       display: flex;
//       justify-content: space-between;
//     }
//   }
// }
</style>
