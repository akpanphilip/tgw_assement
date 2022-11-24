<template>
  <div>
    <div class="container-fluid">
      <!-- Page Heading -->
      <div class="d-sm-flex align-items-center justify-content-between mb-4">
        <Button size="small" @click="addModal = true">
          <Icon type="md-add" />
          Add Tag
        </Button>
      </div>
      <!-- add tag modal -->
      <Modal
        v-model="addModal"
        title="Add Tag"
        :mask-closable="false"
        :closable="false"
      >
          <Input
            v-model="data.categoryName"
            name="tagName"
            placeholder="Add Tag name"
          />
          <!-- frontend image validation -->
          <Upload type="drag" action="/api/upload" class="mt-2" name="file"
            :headers="{'x-csrf-token' :token}"
            :on-success="handleSuccess"
            :max-size="2048"
            :format="['jpg', 'jpeg', 'png']"
            :on-exceeded-size="handleMaxSize"
            :on-format-error="handleFormatError"
            ref="uploads"
          >
              <div style="padding:20px 0">
                <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                <p>Click or drag files here to upload</p>
              </div>
          </Upload>
          <div class="demo-upload-list" v-if="data.iconImage">
            <img :src="`/uploads/${data.iconImage}`" style="width: 200px;">
                <div class="demo-upload-list-cover">
                    <Icon type="ios-trash-outline" @click="deleteImage"></Icon>
                </div>
          </div>
          <span class="text-danger" v-if="errors && errors.tagName">
            {{ errors.tagName[0] }}
          </span>

          <div slot="footer">
              <Button type="default" @click="addModal = false">Close</Button>
                <Button type="primary" @click="addCategory" :disabled="isAdding" :loading="isAdding">{{ isAdding ? "Adding.." : "Add Category" }}</Button>
          </div>

      </Modal>

      <!-- edit tag -->
      <Modal
        v-model="editModal"
        title="Edit Tag"
        :mask-closable="false"
        :closable="false"
      >
        <Input
          v-model="editData.tagName"
          name="tagName"
          placeholder="Add Tag name"
        />
        <span class="text-danger" v-if="errors && errors.tagName">
          {{ errors.tagName[0] }}
        </span>

        <div slot="footer">
          <Button type="default" @click="editModal = false">Close</Button>
          <Button
            type="primary"
            @click="editTag"
            :disabled="isAdding"
            :loading="isAdding"
          >
            {{ isAdding ? 'Editing...' : 'Edit tag' }}
          </Button>
        </div>
      </Modal>
      <div class="card shadow mb-4">
        <div class="card-header py-3">
          <h6 class="m-0 font-weight-bold text-primary">CATEGORY</h6>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table
              class="table table-bordered"
              id="dataTable"
              width="100%"
              cellspacing="0"
            >
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Icon Image</th>
                  <th>Category name</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tfoot>
                <tr>
                  <th>ID</th>
                  <th>Icon Image</th>
                  <th>Category name</th>
                  <th>Action</th>
                </tr>
              </tfoot>
              <tbody>
                <tr v-for="(category, i) in categoryLists" :key="i">
                  <td>{{ i + 1 }}</td>
                  <td class="table_image">
                      <img :src="category.iconImage" alt="">
                  </td>
                  <td>{{ category.categoryName }}</td>
                  <td>
                    <Button
                      type="info"
                      size="small"
                      @click="showEditModal(category, i)"
                    >
                      Edit
                    </Button>
                    <Button
                      type="error"
                      size="small"

                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <!-- /.container-fluid -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      categoryLists: {},
      addModal: false,
      data: {
        categoryName: '',
        iconImage: '',
      },
      addModal: false,
      isAdding: false,
      errors: {},
      editModal: false,
      editData: {
        categoryName: '',
        id: '',
      },
      token: '',
      index: -1,
    }
  },
  methods: {
    addCategory() {
        if(this.data.categoryName.trim()=='')
            this.$toaster.success('Category name is required')
        if(this.data.iconImage.trim()=='')
            this.$toaster.success('Icon image is required')
        // to save with full path
        this.data.iconImage = `/uploads/${this.data.iconImage}`
    axios
        .post('/api/add_category', {
          categoryName: this.data.categoryName,
          iconImage: this.data.iconImage,
        })
        .then((res) => {
          this.$toaster.success('Successfully added category')
          console.log(res)
          this.addModal = false
        //   make them empty so that we can reupload back again
          this.data.categoryName = ''
          this.data.iconImage = ''
          this.errors = ''
          this.getCategory()
        })
        .catch((error) => {
          if (error.response.status == 422) {
              if(data.errors.categoryName){
                  this.e(data.errors.categoryName[0])
              }
                if(data.errors.iconImage){
                  this.e(data.errors.iconImage[0])
              }
            // this.errors = error.response.data.errors
            // console.log('error')
          }else{
              this.swr()
          }
        })
    },
    getCategory() {
      axios
        .get('/api/get_category')
        .then((response) => {
          this.categoryLists = response.data
          // console.log(response.data)
        })
        .catch((errors) => {
          console.log(errors)
        })
    },
    editTag() {
      axios
        .put('/api/edit_tag/' + this.editData.id, {
          tagName: this.editData.tagName,
        })
        .then((res) => {
          this.tags[this.index].tagName = this.editData.tagName
          this.$toaster.success('Successfully edited tag')
          console.log(res)
          this.editModal = false
          this.editData.tagName = ''
          this.errors = ''
        })
        .catch((error) => {
          if (error.response.status == 422) {
            this.errors = error.response.data.errors
            console.log('error')
          }
        })
    },
    showEditModal(tag, index) {
      let obj = {
        id: tag.id,
        tagName: tag.tagName,
      }
      this.editData = obj
      this.editModal = true
      this.index = index
    },
    deleteTag(tag_id) {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      }).then((result) => {
        if (result.isConfirmed) {
            axios.delete("/api/delete_tag/" + tag_id)
            .then((response)=>{
                this.getTag()
                console.log(response)
            }).catch((errors)=>{
                console.log(errors)
            })
          Swal.fire('Deleted!', 'Your Tag has been deleted.', 'success')
        }
      })
    },
    handleSuccess(res, file){
        this.data.iconImage = res
    },
    handleFormatError(file){
        this.$Notice.warning({
            title: 'The file format is incorrect',
            desc: 'FIle format of' + file.name + 'is incorrect, please select jpg or png.'
        });
    },
    handleMaxSize(file){
        this.$Notice.warning({
            title: 'Exceeding file size limit',
            desc: 'File ' + file.name + 'is too large, no more than 2M.'
        });
    },
    deleteImage(){
        let image = this.data.iconImage
        this.data.iconImage = ''
        this.$refs.uploads.clearFiles()
        axios
            .delete('api/deleteImage', {imageName: image})
            .then((res)=>{
            })
            .catch((error)=>{
                this.data.iconImage = image
                console.log(error)
                this.swr()
            });
    },
  },
  mounted() {
      this.token = window.Laravel.csrfToken
    this.getCategory()
  },
}
</script>
