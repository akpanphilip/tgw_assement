<template>
    <div>
        <title>TGW | Login</title>
        <div class="formBox">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-md-4 offset-md-4">
                        <div class="formMain">
                            <div class="form-header">WELCOME TO TGW</div>
                            <form @submit="login" action="javascript:void(0)">
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

                                <div class="form-group">
                                    <button class="submitBtn" @click="login">
                                        SUBMIT
                                    </button>
                                </div>
                                <div class="d-flex justify-content-end">
                                    <router-link to="register" class="linkText"
                                        >Don't have an account?</router-link
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
                password: "",
                device_name: "browser",
            },
            errors: {},
        };
    },
    methods: {
        login() {
            axios
                .post("api/login", this.data)
                .then((response) => {
                    localStorage.setItem("token", response.data);
                    this.$router.push("/");
                })
                .catch((errors) => {
                    this.errors = errors.response.data.errors;
                });
        },
    },
};
</script>
