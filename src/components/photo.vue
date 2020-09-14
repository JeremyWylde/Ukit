<template>
  <div class="document"
       style="width: 25%">
    <div v-if="imageSrc || src">
      <img v-if="src"
           :src="src"
           style="border: 1px solid black; width: 15rem; height: 15rem">
      <img v-else style="border: 1px solid black; width: 15rem; height: 15rem"
           :src="imageSrc">
    </div>
    <div v-else style="display: flex; align-items: center; justify-content: space-between">Загрузите фото
      <b-field style="margin-left: 5px">
        <b-upload v-model="file"
                  @input="upload"
                  accept="image/png, image/jpeg, image/gif, image/bmp, image/tiff"
                  drag-drop>
          <section class="section-yo">
            <div class="content has-text-centered">
              <p>
                <b-icon
                        icon="plus"
                        size="is-medium">
                </b-icon>
              </p>
            </div>
          </section>
        </b-upload>

      </b-field>

    </div>
  </div>
</template>

<script>
    export default {
        props: ['src'],
        data: () => ({
            file: {},
            imageSrc: null,
        }),
        methods: {
            upload(file) {
                this.$emit('loading')
                if (file) {
                    const reader = new FileReader()
                    reader.readAsDataURL(file)
                    reader.onload = e => {
                        this.imageSrc = e.target.result
                        this.$emit('upload', {
                            file: this.imageSrc,
                        })
                    }
                }
            }
        }
    }
</script>
