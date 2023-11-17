<template>
  <div>
    <div v-if="!todoList && todoList.length">
      <TheLoader />
    </div>
    <div v-else>
      <section class="filter">
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
      <section class="todo-list">
        <draggable :list="displayedRecord" :move="handleDraggable" @end="handleDragEnd">
          <article
          v-for="todo in displayedRecord"
          :key="todo.id"
          :draggable="true"
          data-todo-item
        >
          <div class="form-control">
            <input
              :id="todo.id"
              type="checkbox"
              :checked="todo.completed"
              @change="handleCompletion(todo.id, $event.target.checked)"
              class="checkbox-input"
            />
            <label :for="todo.id">
              <span class="checkbox"></span>
            </label>
            <span>{{ todo.todo }}</span>
          </div>
          <div class="action-buttons">
            <button class="edit" @click="initializeEditTodoModal(todo.id, todo.todo)">&#9998;</button>
            <button class="del" @click="initializedeleteTodoModal(todo.id, todo.completed)">&times;</button>
          </div>
        </article>
        </draggable>
      </section>
      <!-- PAGE NAVIGATION BUTTONS AND ARROW ICONS -->
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
          :class="{
            inactive: page === Math.ceil(todoList.length / perPage),
          }"
          >&gt;</span
        >
      </section>
    </div>
  </div>
</template>

<script>
import IBaseConfig from '@service/index'
import draggable from 'vuedraggable'
import { ref, computed, watch, reactive } from "vue";
import TheLoader from "@/components/loader/TheLoader.vue";
import TheModal from '../TheModal.vue';

export default {
  components: {
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

    // DRAGGABLE ELEMENTS
    const fromId = ref(null)
    const toId = ref(null)

    function handleDraggable(event) {
      fromId.value = event.draggedContext.element.id
      toId.value = event.relatedContext.element.id
    }

    function handleDragEnd() {
      const fromTodoId = todoList.value.findIndex(todo => todo.id === fromId.value)
      const toTodoId = todoList.value.findIndex(todo => todo.id === toId.value)

      if (fromTodoId === toTodoId) return

      const sortedList = [...todoList.value]
      sortedList.splice(toTodoId, 0, sortedList.splice(fromTodoId, 1)[0])
      emit('sortedList', sortedList)
    }

    function setPage(val) {
      page.value = val;
    }

    // TODO FILTER
    const filter = ref(0);
    const totalPages = computed(() => {
      return Math.ceil(filteredTodos.value.length / perPage.value);
    });

    watch(page, (newVal) => {
      if (newVal < 1) page.value = 1;
      if (newVal > totalPages.value) page.value = totalPages.value;
    });

    watch(
      [filter, perPage],
      (newVal, oldVal) => {
        if (newVal !== oldVal) {
          page.value = 1;
        }
      },
      { immediate: true }
    );

    // MODAL
    const showModal = ref(false)
    const modalSubmissionState = ref(false)
    const modalOptions = reactive({ action: '', header: '', inputValue: '', id: null })

    // INITIALIZE MODAL OPTIONS
    function initializeModalOptions(todoId, action, headerText, todoName=null) {
      showModal.value = true
      modalOptions.action = action
      modalOptions.header = headerText
      modalOptions.inputValue = todoName
      modalOptions.id = todoId
    }
    // DELETE AND UPDATE TODO
    async function initializedeleteTodoModal(todoId, isTodoCompleted) {
      const headerText = `${ isTodoCompleted ? 'Are you sure?' : 'Are you sure? This task has not been completed' }`
      initializeModalOptions(todoId, 'delete', headerText)
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

    function initializeEditTodoModal(todoId, todoName) {
      initializeModalOptions(todoId, 'edit', 'Update your task', todoName)
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

    async function handleCompletion(todoId, completed) {
      try {
        const resp = await IBaseConfig.put(`${todoId}`, {
          completed,
        });
        if (resp?.errors) throw resp
        
        const todoList = [...props.todoListCopy].map((todo) => ({
          ...todo,
          completed: todo.id === todoId ? completed : todo.completed
        }))
        emit('updateTodoList', todoList)
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
      displayedRecord,
      setPage,
      initializedeleteTodoModal,
      initializeEditTodoModal,
      handleCompletion,
      resolveModalAction,
      modalOptions
    };
  },
};
</script>

<style lang="scss" scoped>
@import './index.scss'
</style>
