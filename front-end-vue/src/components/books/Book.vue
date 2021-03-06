<template>
  <div class="row">
    <div class="col-sm-offset-4 col-sm-4">

      <form @submit.prevent="validateBeforeSubmit">

          <div class="form-group" :class="{ 'has-error': $v.title.$error }">
            <label class="control-label" for="title">Title</label>
            <input id="title"
                   v-model.trim="title"
                   @input="$v.title.$touch()"
                   class="form-control" type="text" placeholder="Book title">
            <p class="text-danger" v-show="$v.title.$error">{{ vmsgTitle }}</p>
          </div>

          <div class="form-group" :class="{ 'has-error': $v.author.$error }">
            <label class="control-label" for="author">Author</label>
            <input id="author"
                   v-model.trim="author"
                   @input="$v.author.$touch()"
                   class="form-control" type="text" placeholder="Author">
            <p class="text-danger" v-show="$v.author.$error">{{ vmsgAuthor }}</p>
          </div>

          <div class="form-group" :class="{ 'has-error': $v.mode.$error }">
            <label class="control-label" for="mode">Book type</label>
            <select id="mode"
                    v-model="mode"
                    class="form-control">
              <option disabled value="">Please select one...</option>
              <option value="r">Regular book</option>
              <option value="a">Audio book</option>
              <option value="r-a">Both: Regular and Audio</option>
            </select>
            <p class="text-danger" v-show="$v.mode.$error">{{ vmsgMode }}</p>
          </div>

          <div class="form-group" :class="{ 'has-error': $v.completed.$error }">
            <date-input id="completed"
                        v-model="completed"
                        @input="$v.completed.$touch()">
              <label class="control-label" for="completed">Completed on&nbsp;</label>
            </date-input>
          </div>

        <button type="submit" class="btn btn-default">Submit</button>
        <router-link to="../" append class="btn btn-default">Reject</router-link>
      </form>

    </div>
  </div>
</template>

<script>
  import vh, { bookTitle, author, mode, completed } from '@/helpers/validators'
  import { mapGetters, mapMutations, mapActions } from 'vuex'
  import DateInput from '@/components/DateInput'

  export default {
    components: { DateInput },
    props: ['id'],
    data () {
      return {
        title: '',
        author: '',
        mode: '',
        completed: null
      }
    },
    validations: {
      title: vh.vrules(bookTitle),
      author: vh.vrules(author),
      mode: vh.vrules(mode),
      completed: vh.vrules(completed)
    },
    computed: {
      ...mapGetters('items', ['item']),
      header () { return this.id ? 'Edit book' : 'New book' },
      vmsgTitle () { return vh.vmsg(this.$v.title, bookTitle) },
      vmsgAuthor () { return vh.vmsg(this.$v.author, author) },
      vmsgMode () { return vh.vmsg(this.$v.mode, mode) }
    },
    methods: {
      ...mapMutations('notification', ['notify', 'setStatus']),
      ...mapActions('items', ['create', 'modify']),
      validateBeforeSubmit () {
        this.$v.$touch()
        if (this.$v.$invalid) return
        this.submitForm()
      },
      async submitForm () {
        if (this.id) {
          try {
            await this.modify({ item: { ...this.$data }, id: this.id })
            this.$router.push('/books')
            this.notify({ msg: 'A book has been modified :)', type: 'info' })
          } catch (e) {
            this.notify({ msg: 'Something went wrong when modifying a book :(', type: 'danger' })
          }
        } else {
          try {
            await this.create({ ...this.$data })
            this.$router.push('/books')
            this.notify({ msg: 'New book has been added :)', type: 'info' })
          } catch (e) {
            this.notify({ msg: 'Something went wrong when adding new book :(', type: 'danger' })
          }
        }
      }
    },
    created () {
      // New book
      if (!this.id) return
      const book = this.item(this.id)
      // A book has not been selected for editing
      if (!book) {
        this.$router.push('/books')
        return
      }
      // Edit book
      this.title = book.title
      this.author = book.author
      this.mode = book.mode
      this.completed = book.completed
    },
    mounted () {
      this.setStatus(this.header)
    },
    beforeDestroy () {
      this.setStatus('')
    }
  }
</script>
