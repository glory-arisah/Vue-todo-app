<template>
  <div>
    <div class="modal-mask" @click="$emit('close')">
      <div class="modal-wrapper">
        <div class="modal-container" @click.stop="">
          <div class="modal-header">
            <h3>{{ options.header }}</h3>
            <span @click="$emit('close')">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="100"
                height="100"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#f44336"
                  d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"
                ></path>
                <path
                  fill="#fff"
                  d="M29.656,15.516l2.828,2.828l-14.14,14.14l-2.828-2.828L29.656,15.516z"
                ></path>
                <path
                  fill="#fff"
                  d="M32.484,29.656l-2.828,2.828l-14.14-14.14l2.828-2.828L32.484,29.656z"
                ></path>
              </svg>
            </span>
            <slot name="modal-header"></slot>
          </div>
          <div class="modal-body">
            <!-- <p>{{ options.body }}</p> -->
            <div class="input--container" v-if="isInputRequired">
              <input
                ref="input"
                type="text"
                v-model="modalValue"
                @keydown="handleFormSubmission"
                @input="checkError"
              />
              <span
                class="word-count"
                :style="{
                  color:
                    isInputLengthGreaterThanSixty || isInputBlank
                      ? '#d40707'
                      : '#06a15e'
                }"
                >{{ wordCount }}/{{ maxCharacters }}</span
              >
            </div>
            <div class="error-message--container">
              <span v-if="isInputBlank"> * This field cannot be blank </span>
              <span v-else-if="isInputLengthGreaterThanSixty">
                * Exceeded maximum characters
              </span>
            </div>
          </div>
          <div class="modal-footer">
            <div class="action--btns">
              <button class="cancel--btn" @click="$emit('close')">
                Cancel
              </button>
              <button
                class="ok--btn"
                @click="resolveModalAction"
                :class="{ 'disabled--btn': isInputRequired && isError }"
              >
                <span v-if="!modalSubmissionState">OK</span>
                <span v-else><TheLoader /></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TheLoader from './loader/TheLoader.vue'
export default {
  name: 'TheModal',
  data () {
    return {
      modalValue: this.$props.options.inputValue ?? '',
      isError: false,
      maxCharacters: 60
    }
  },
  props: {
    options: {
      type: Object,
      default: () => ({
        action: '',
        header: '',
        inputValue: '',
        id: 0
      })
    },
    modalSubmissionState: {
      type: Boolean,
      default: () => false
    }
  },
  computed: {
    wordCount () {
      return this.modalValue.trim().length
    },
    isInputRequired () {
      return this.$props.options.inputValue !== null
    },
    isInputBlank () {
      return this.isInputRequired && !this.modalValue.replace(/\s+/g, '').length
    },
    isInputLengthGreaterThanSixty () {
      return this.isInputRequired && this.modalValue.trim().length > 60
    }
  },
  components: {
    TheLoader
  },
  emits: ['resolveModalAction'],
  methods: {
    resolveModalAction () {
      if (this.isInputRequired && this.isError) return
      const { action, id } = this.$props.options
      this.$emit('resolveModalAction', { action, value: this.modalValue, id })
    },
    handleFormSubmission (event) {
      if (event.key === 'Enter') {
        this.resolveModalAction()
      }
    },
    checkError () {
      if (
        (!this.modalValue && !this.modalValue.trim().length) ||
        (this.modalValue && this.modalValue.trim().length > 60)
      ) {
        this.isError = true
      } else this.isError = false
    },
    handleEventSubmission (event) {
      this.$props.options.action === 'delete' &&
        this.handleFormSubmission(event)
    }
  },
  mounted () {
    this.$refs.input && this.$refs.input.focus()
    this.checkError()
    window.addEventListener('keyup', event => {
      this.handleEventSubmission(event)
    })
  },
  destroyed () {
    window.removeEventListener('keyup', event =>
      this.handleEventSubmission(event)
    )
  }
}
</script>

<style lang="scss" scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #00000080;
  display: table;
  transition: opacity 0.3s ease;
  .modal-wrapper {
    display: table-cell;
    vertical-align: middle;
    animation-name: animatetop;
    animation-duration: 0.4s;

    @keyframes animatetop {
      from {
        top: -300px;
        opacity: 0;
      }
      to {
        top: 30%;
        opacity: 1;
      }
    }
    .modal-container {
      width: 50%;
      margin: -20rem auto 0px;
      padding: 1rem 50px;
      border-radius: 1rem;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
      transition: all 0.3s ease;
      font-family: Helvetica, Arial, sans-serif;
      .modal-header {
        display: flex;
        justify-content: space-between;
        margin: 0.5rem 0rem 2.8rem;
        h3 {
          color: #232323;
          font-size: 1.75rem;
        }
        span {
          position: relative;
          cursor: pointer;
          svg {
            position: absolute;
            top: 0;
            left: 0;
            font-size: 0.5rem;
            width: 30px;
            height: 30px;
          }
        }
      }
      .modal-body {
        margin: 20px 0;
        .input--container {
          width: 100%;
          input {
            width: 80%;
            height: 40px;
            border-radius: 8px;
            border: 0.5px solid #12937a;
            padding: 14px 8px;
            font-size: 1.18rem;
            margin-right: 1rem;
          }
        }
        .error-message--container {
          margin-bottom: 3.2rem;
          span {
            font-size: 0.8rem;
            color: #a90808;
          }
        }
      }
      .modal-footer {
        .action--btns {
          display: flex;
          justify-content: center;
          button {
            padding: 0.6rem 0.9rem;
            border-radius: 5px;
            font-size: 1.05rem;
            color: #fff;
            font-weight: 600;
            &:hover {
              cursor: pointer;
            }
            &.cancel--btn {
              border: 1px solid #860404;
              background-color: #a20505;
              margin-right: 0.7rem;
              &:hover {
                background-color: #d40707;
              }
            }
            &.ok--btn {
              background-color: #06866e;
              border: 1px solid #06866e;
              margin-left: 0.7rem;
              &:hover {
                background-color: #0abd9c;
              }
              &.disabled--btn {
                background-color: #aeaeae;
                border-color: transparent;
                cursor: not-allowed;
              }
            }
          }
        }
      }
    }
  }
}
</style>
