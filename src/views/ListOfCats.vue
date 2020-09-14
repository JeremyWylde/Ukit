<template>
  <div class="listOfCats" style="width: 70%;margin: 0 auto">
    <p v-if="filter === null || filter.length === 0">Список котиков пуст</p>
    <b-table v-else
             :paginated="isPaginated"
             :per-page="perPage"
             :current-page="currentPage"
             :pagination-position="paginationPosition"
             aria-next-label="Next page"
             aria-previous-label="Previous page"
             aria-page-label="Page"
             aria-current-label="Current page"
             :data="filter"
             hoverable>

      <b-table-column v-for="(column, index) in columns"
                      v-if="column !== undefined"
                      v-slot="props"
                      :searchable="column.searchable"
                      :debounce-search="1000"
                      :key="column.field+index"
                      :field="column.field"
                      :label="column.label">
        <img v-if="column.field === 'photo'"
             style="width: 64px"
             :src="props.row['photo']"/>
        <div @click="inspect(props.row['id'])" v-else>
          {{props.row[column.field]}}
        </div>
      </b-table-column>


      <b-table-column v-slot="props">
        <div>
          <button class="button is-medium is-danger"
                  @click="deleteCat(props.row['id'])">
            <b-icon
                    icon="delete"
                    size="is-small">
            </b-icon>
          </button>
        </div>
      </b-table-column>

    </b-table>

    <b-button type="is-success"
              tag="router-link"
              to="/cat">Добавить котика
    </b-button>

    <b-field
            label="Фильтрация котиков по половому признаку">
      <b-select v-model="searchSex"
                placeholder="Выберите пол">
        <option value="male">Male</option>
        <option value="female">Female</option>
      </b-select>
      <b-button @click="cancelFilter"
              type="is-primary">Снять фильтр
      </b-button>
    </b-field>
  </div>
</template>

<script>
    export default {
        data: () => ({
            columns: [
                {
                    field: 'name',
                    label: 'Имя'
                },
                {
                    field: 'breed',
                    label: 'Порода',
                    searchable: true,
                },
                {
                    field: 'color',
                    label: 'Окрас',
                    searchable: true,
                },
                {
                    field: 'sex',
                    label: 'Пол',
                    fil: true
                },
                {
                    field: 'comment',
                    label: 'Комментарий'
                },
                {
                    field: 'age',
                    label: 'Возраст'
                },
                {
                    field: 'photo',
                    label: 'Фото'
                },
            ],
            cats: [],
            searchSex: undefined,
            isPaginated: false,
            paginationPosition: 'bottom',
            currentPage: 1,
            perPage: 10
        }),
        mounted() {
            this.$store.dispatch('getCats')
            this.cats = this.$store.getters.getListOfCats

            if (this.cats.length > this.perPage)
                this.isPaginated = true
        },
        methods: {
            inspect(id) {
                this.$router.push({name: 'editCat', params: {id}})
            },
            deleteCat(id) {
                this.$buefy.dialog.confirm({
                    title: 'Удаление котика',
                    message: 'Вы уверенны что хотите <b>удалить</b> котика?',
                    confirmText: 'Подтвердить',
                    cancelText: 'Отмена',
                    type: 'is-danger',
                    hasIcon: true,
                    onConfirm: () => {
                        this.$store.dispatch('deleteCat', {id})
                        if (this.cats.length <= this.perPage)
                            this.isPaginated = false
                        this.$buefy.toast.open({
                            message: 'Котик удален',
                            type: 'is-success'
                        })
                    }
                })
            },
            cancelFilter() {
                this.searchSex = undefined
            }
        },
        computed: {
            filter: function() {
                let data = []
                if (this.searchSex !== undefined) {
                    for (let i = 0; i < this.cats.length; i++) {
                        if (this.cats[i].sex === this.searchSex)
                            data.push(this.cats[i])
                    }
                    return data
                } else {
                    return this.cats
                }
            }
        },
    }
</script>
