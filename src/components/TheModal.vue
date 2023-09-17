<template>
  <div>
      <div class="modal-mask" @click="$emit('close')">
        <div class="modal-wrapper">
          <div class="modal-container" @click.stop="">
            <div class="modal-header">
              <h3>{{ options.header }}</h3>
              <span @click="$emit('close')">&times;</span>
              <slot name="modal-header"></slot>
            </div>
            <div class="modal-body">
              <!-- <p>{{ options.body }}</p> -->
              <div class="input--container" v-if="isInputRequired">
                <input ref="input"
                  type="text"
                  v-model="modalValue"
                  @keydown="handleFormSubmission"
                  @input="checkError"
                />
                <span class="word-count">{{ wordCount }}/{{ maxCharacters }}</span>
              </div>
              <div class="error-message--container">
                <span v-if="isInputRequired && isError">
                  * This field cannot be blank
                </span>
              </div>
            </div>
            <div class="modal-footer">
              <div class="action--btns">
                <button class="cancel--btn" @click="$emit('close')">Cancel</button>
                <button class="ok--btn" @click="resolveModalAction" :class="{ 'disabled--btn' : isInputRequired && isError }">
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
import TheLoader from './loader/TheLoader.vue';
  export default {
    name: 'TheModal',
    data() {
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
      wordCount() {
        return this.modalValue.trim().length;
      },
      isInputRequired() {
        return this.$props.options.inputValue !== null
      }
    },
    components: {
      TheLoader
    },
    methods: {
      resolveModalAction() {
        if (this.isInputRequired && this.isError) return
        const { action, id } = this.$props.options
        this.$emit('resolveModalAction', { action, value: this.modalValue, id })
      },
      handleFormSubmission(event) {
        if (event.key === 'Enter') {
          this.resolveModalAction()
        }
      },
      checkError() {
      if (this.modalValue && this.modalValue.trim().length) this.isError = false;
      else this.isError = true;
      },
      handleEventSubmission(event) {
        if (event.key === 'Enter') {
          this.resolveModalAction()
        }
      }
    },
    mounted() {
      this.$refs.input && this.$refs.input.focus()
      window.addEventListener('keyup', (event) => this.handleEventSubmission(event))
      this.checkError()
    },
    destroyed() {
      window.removeEventListener('keyup', (event) => this.handleEventSubmission(event))
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
        padding: 2rem 50px;
        border-radius: 1rem;
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
        transition: all 0.3s ease;
        font-family: Helvetica, Arial, sans-serif;
        .modal-header {
          display: flex;
          justify-content: space-between;
          margin: 0.5rem 0rem 3.2rem;
          h3 {
            color: #232323;
            font-size: 1.75rem;
          }
          span {
            font-size: 1.1rem;
            padding: 0.5rem;
            background-color: #d40707;
            color: #fff;
            width: 30px;
            height: 30px;
            line-height: 15px;
            border-radius: 50%;
            text-align: center;
            cursor: pointer;
          }
        }
        .modal-body {
          margin: 20px 0;
          .input--container {
            width: 100%;
            input {
              width: 70%;
              height: 40px;
              border-radius: 8px;
              border: 0.5px solid #12937a;
              padding: 24px 8px;
              font-size: 1.18rem;
              margin-right: 1rem;
            }
          }
          .error-message--container{
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
                cursor: pointer
              }
              &.cancel--btn {
                border: 1px solid #860404;
                background-color: #a20505;
                margin-right: .7rem;
                &:hover {
                  background-color: #d40707;
                }
              }
              &.ok--btn {
                background-color: #06866e;
                border: 1px solid #06866e;
                margin-left: .7rem;
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
  // .modal-overlay {
  //   position: absolute;
  //   z-index: 999;
  //   top: 0;
  //   left: 0;
  //   width: 100%;
  //   height: 100%;
  //   background-color: #000;
  //   opacity: 0.3;
  // }
</style>
