<template>
  <form class="create-form"
        style="width: 70%;margin: 0 auto"
        @submit.prevent="submitHandler">

    <b-field label="Кличка"
             :type="nameFieldType"
             :message="nameFieldErrorMessage">
      <b-input :class="{invalid: ($v.name.$dirty && !$v.name.required)}"
               v-model.trim="name"></b-input>
    </b-field>

    <b-field label="Порода">
      <b-input v-model="breed"></b-input>
    </b-field>

    <b-field label="Окрас">
      <b-input v-model="color"></b-input>
    </b-field>

    <b-field label="Пол"
             :type="sexFieldType"
             :message="sexFieldErrorMessage">
      <b-select :class="{invalid: ($v.sex.$dirty && !$v.sex.required)}"
                v-model="sex"
                :selected="sex"
                placeholder="Выбирите пол">
        <option value="male">Мужской</option>
        <option value="female">Женский</option>
      </b-select>
    </b-field>

    <b-field label="Возраст">
      <b-numberinput v-model="age"
                     :min="0"></b-numberinput>
    </b-field>

    <b-field label="Коментарий">
      <b-input v-model="comment"
               maxlength="200"
               type="textarea"></b-input>
    </b-field>

    <Photo :src="photo"
           @loading="startLoading"
           @upload="uploadHandler"/>

    <b-button v-if="!edit" type="is-primary"
              :loading="loading"
              native-type="submit"
    >Создать котика
    </b-button>

    <b-button v-else
              type="is-primary"
              :loading="loading"
              native-type="submit"
    >Редактировать котика
    </b-button>

  </form>
</template>

<script>
    import Photo from "@/components/photo";
    import {required, minLength, integer} from 'vuelidate/lib/validators'

    export default {
        components: {
            Photo
        },
        data: () => ({
            name: '',
            nameFieldType: '',
            nameFieldErrorMessage: '',
            breed: '',
            color: '',
            sex: undefined,
            sexFieldType: '',
            sexFieldErrorMessage: '',
            age: 0,
            comment: '',
            photo: '',
            edit: false,
            loading: false,
        }),
        validations: {
            name: {required, minLength: minLength(2)},
            sex: {required},
            age: {integer}
        },
        methods: {
            submitHandler() {
                if (!this.$v.name.required) {
                    this.nameFieldType = 'is-danger'
                    this.nameFieldErrorMessage = 'Заполните поле'
                    this.$v.$touch();
                    return
                } else {
                    this.nameFieldType = 'is-success'
                    this.nameFieldErrorMessage = ''
                }
                if (!this.$v.name.minLength) {
                    this.nameFieldType = 'is-danger'
                    this.nameFieldErrorMessage = 'Имя не может быть меньше 2 символов'
                    this.$v.$touch();
                    return
                } else {
                    this.nameFieldType = 'is-success'
                    this.nameFieldErrorMessage = ''
                }

                if (!this.$v.sex.required) {
                    this.sexFieldType = 'is-danger'
                    this.sexFieldErrorMessage = 'Выбирите пол'
                    this.$v.$touch();
                    return
                } else {
                    this.sexFieldType = 'is-success'
                    this.sexFieldErrorMessage = ''
                }

                const cat = {
                    id: Math.floor((Math.random() * this.$store.getters.getLengthOfCats + 1) * 100 ),
                    name: this.name,
                    breed: this.breed,
                    color: this.color,
                    sex: this.sex,
                    age: this.age,
                    comment: this.comment,
                    photo: this.photo
                }
                if (this.edit) {
                    cat.id = this.$route.params.id
                    this.$store.dispatch('editCat', {cat})
                    this.$router.push('/')
                    this.$buefy.toast.open({
                        message: 'Котик отредактирован',
                        type: 'is-success'
                    })
                } else {
                    this.$store.dispatch('addCat', {cat})
                    this.$router.push('/')
                    this.$buefy.toast.open({
                        message: 'Котик добавлен',
                        type: 'is-success'
                    })
                }
            },
            uploadHandler(file) {
                this.photo = file.file
                this.loading = false
            },
            startLoading() {
                this.loading = true
            },
        },
        mounted() {
            if (this.$route.params.id !== undefined) {
                this.edit = true
                const id = this.$route.params.id
                const cats = this.$store.getters.getListOfCats

                for(let i=0; i<cats.length; i++) {
                    if(id === cats[i].id) {
                        this.name = cats[i].name
                        this.breed = cats[i].breed
                        this.color = cats[i].color
                        this.sex = cats[i].sex
                        this.age = cats[i].age
                        this.comment = cats[i].comment
                        this.photo = cats[i].photo
                    }
                }
            }
        },
    }
</script>
