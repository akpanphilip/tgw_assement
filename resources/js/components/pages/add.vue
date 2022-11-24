<template>
  <div>
    <div class="container-fluid">
      <!-- Page Heading -->
      <div class="d-sm-flex align-items-center justify-content-between mb-4">
        <Button size="small" @click="addModal = true">
          <Icon type="md-add" />
          Add Tag
        </Button>
         <p class="text-center">{{currentUser.email}}</p>
         <button class="btn btn-danger" @click="logout">Logout</button>
      </div>
      <!-- add tag modal -->
      <Modal
        v-model="addModal"
        title="Add Tag"
        :mask-closable="false"
        :closable="false"
      >

          <Input
            v-model="data.tagName"
            name="tagName"
            placeholder="Add Tag name"
          />
          <span class="text-danger" v-if="errors && errors.tagName">
            {{ errors.tagName[0] }}
          </span>

          <div slot="footer">
              <Button type="default" @click="addModal = false">Close</Button>
                <Button type="primary" @click="addTag" :disabled="isAdding" :loading="isAdding">{{ isAdding ? "Adding.." : "Add Tag" }}</Button>
          </div>

      </Modal>

      <!-- edit tag -->
      <Modal
        v-model="editModal"
        title="Edit Tag"
        :mask-closable="false"
        :closable="false"
      >
        <!-- <form @submit.prevent="editTag" -->
        <!-- <Input type="text" name="id" v-model="editData.tagId"/> -->
        <Input
          v-model="editData.tagName"
          name="tagName"
          placeholder="Add Tag name"
        />
        <span class="text-danger" v-if="errors && errors.tagName">
          {{ errors.tagName[0] }}
        </span>

        <div slot="footer">
          <!-- <button type="submit" class="btn btn-primary">Edit</button> -->
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
          <h6 class="m-0 font-weight-bold text-primary">TAGS</h6>
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
                  <th>Tagname</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tfoot>
                <tr>
                  <th>ID</th>
                  <th>Tagname</th>
                  <th>Action</th>
                </tr>
              </tfoot>
              <tbody>
                <tr v-for="(tag, i) in tags" :key="i">
                  <td>{{ i + 1 }}</td>
                  <td>{{ tag.tagName }}</td>
                  <td>
                    <Button
                      type="info"
                      size="small"
                      @click="showEditModal(tag, i)"
                    >
                      Edit
                    </Button>
                    <Button
                      type="error"
                      size="small"
                      @click="deleteTag(tag.id)"
                      :loading="tag.isDeleting"
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
        currentUser : {},
        token: localStorage.getItem('token'),
        tags: {},
        addModal: false,
        data: {
            tagName: '',
            id: '',
        },
        addModal: false,
        isAdding: false,
        errors: {},
        editModal: false,
        editData: {
            tagName: '',
            id: '',
        },
        index: -1,
        }
    },
    methods: {
        addTag() {
        axios
            .post('/api/add_tag', {
            tagName: this.data.tagName,
            })
            .then((res) => {
            this.$toaster.success('Successfully added tag')
            console.log(res)
            this.addModal = false
            this.data.tagName = ''
            this.errors = ''
            this.getTag()
            })
            .catch((error) => {
            if (error.response.status == 422) {
                this.errors = error.response.data.errors
                console.log('error')
            }
            })
        },
        getTag() {
        axios
            .get('/api/add_tag')
            .then((response) => {
            this.tags = response.data
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
        logout(){
            axios.post('api/logout').then((response) =>{
                localStorage.removeItem('token')
                this.$router.push('/login')
            }).catch((errors)=>{
                console.log(errors)
            })
        }
    },
    mounted() {
        window.axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
        this.getTag()
         axios.get('api/user').then((response) => {
                this.currentUser = response.data
            }).catch((errors) => {
                console.log(errors)
            })
    }
    }
    </script>
