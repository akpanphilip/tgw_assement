<template>
    <div>
        <title>TGW | Register</title>
        <div class="formBox">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-md-4 offset-md-4">
                        <div class="formMain">
                            <div class="form-header">WELCOME TO TGW</div>
                            <form
                                @submit="register"
                                action="javascript:void(0)"
                            >
                                <div class="form-group mb-3">
                                    <label for="">Username</label>
                                    <Input
                                        type="text"
                                        class="inputForm"
                                        v-model="data.username"
                                    />
                                    <small
                                        class="text-danger"
                                        v-if="errors && errors.username"
                                    >
                                        {{ errors.username[0] }}
                                    </small>
                                </div>
                                <div class="form-group mb-3">
                                    <label for="">Name</label>
                                    <Input type="text" v-model="data.name" />
                                    <small
                                        class="text-danger"
                                        v-if="errors && errors.name"
                                    >
                                        {{ errors.name[0] }}
                                    </small>
                                </div>
                                <div class="form-group mb-3">
                                    <label for="">Password</label>
                                    <Input
                                        type="password"
                                        v-model="data.password"
                                        password
                                    />
                                    <small
                                        class="text-danger"
                                        v-if="errors && errors.password"
                                    >
                                        {{ errors.password[0] }}
                                    </small>
                                </div>
                                <div class="form-group mb-3">
                                    <label for="">Picture</label>
                                    <Upload
                                        type="drag"
                                        action="/api/upload"
                                        class="mt-2"
                                        name="avatar"
                                        :headers="{ 'x-csrf-token': token }"
                                        :on-success="handleSuccess"
                                        :max-size="2048"
                                        :format="['jpg', 'jpeg', 'png']"
                                        :on-exceeded-size="handleMaxSize"
                                        :on-format-error="handleFormatError"
                                        ref="uploads"
                                    >
                                        <div style="padding: 20px 0">
                                            <Icon
                                                type="ios-cloud-upload"
                                                size="52"
                                                style="color: #3399ff"
                                            ></Icon>
                                            <p>
                                                Click or drag files here to
                                                upload
                                            </p>
                                        </div>
                                    </Upload>
                                    <div
                                        class="demo-upload-list"
                                        v-if="data.avatar"
                                    >
                                        <img
                                            :src="`/uploads/${data.avatar}`"
                                            style="width: 200px"
                                        />
                                        <div class="demo-upload-list-cover">
                                            <Icon
                                                type="ios-trash-outline"
                                                @click="deleteImage"
                                            ></Icon>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <button
                                        type="submit"
                                        :disabled="processing"
                                        class="submitBtn"
                                        @click="register"
                                    >
                                        {{
                                            processing
                                                ? "Please wait"
                                                : "SUBMIT"
                                        }}
                                    </button>
                                </div>
                                <div class="d-flex justify-content-end">
                                    <router-link to="login" class="linkText"
                                        >Already have an account?</router-link
                                    >
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            data: {
                username: "",
                name: "",
                password: "",
                avatar: "",
            },
            errors: {},
            token: "",
            processing: false,
        };
    },
    methods: {
        register() {
            this.processing = true;
            if (this.data.avatar.trim() == "")
                this.$toaster.error("Profile Image is required");
            if (this.data.avatar.trim() != "")
                this.data.avatar = `/uploads/${this.data.avatar}`;
            axios
                .post("api/register", {
                    username: this.data.username,
                    name: this.data.name,
                    password: this.data.password,
                    avatar: this.data.avatar,
                })
                .then((response) => {
                    console.log(response.data);
                    this.data.name =
                        this.data.username =
                        this.data.name =
                        this.data.password =
                        this.data.avatar =
                            "";
                    this.errors = {};
                    this.$router.push("/login");
                    this.$toaster.success("ACCOUNT CREATED SUCCESSFULLY!");
                })
                .catch((errors) => {
                    this.errors = errors.response.data.errors;
                    console.log(errors.response.data.errors);
                })
                .finally(() => {
                    this.processing = false;
                });
        },
        handleSuccess(res, file) {
            this.data.avatar = res;
        },
        handleFormatError(file) {
            this.$Notice.warning({
                title: "The file format is incorrect",
                desc:
                    "FIle format of" +
                    file.name +
                    "is incorrect, please select jpg or png.",
            });
        },
        handleMaxSize(file) {
            this.$Notice.warning({
                title: "Exceeding file size limit",
                desc: "File " + file.name + "is too large, no more than 2M.",
            });
        },
        deleteImage() {
            let image = this.data.avatar;
            this.data.avatar = "";
            this.$refs.uploads.clearFiles();
            axios
                .delete("api/deleteImage", { imageName: image })
                .then((res) => {})
                .catch((error) => {
                    this.data.avatar = image;
                    console.log(error);
                    this.swr();
                });
        },
    },
    mounted() {
        this.token = window.Laravel.csrfToken;
    },
};
</script>
