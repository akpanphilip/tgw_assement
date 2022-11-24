<template>
    <div>
        <title>TGW</title>
        <nav class="navbar navbar-expand-lg">
            <div class="container">
                <a class="navbar-brand fw-bold" href="#">TGW</a>
                <button
                    class="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div
                    class="collapse navbar-collapse offset-lg-4"
                    id="navbarNav"
                >
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <a
                                class="nav-link active"
                                aria-current="page"
                                href="#"
                                >TGW</a
                            >
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Home</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">About</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Services</a>
                        </li>
                        <li
                            class="dropdown notification-list offset-lg-10 mt-2"
                        >
                            <div class="dropdown">
                                <a
                                    class="dropdown-toggle text-dark d-flex align-items-center"
                                    role="button"
                                    href=""
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <div
                                        class="avatarImg mr-2"
                                        style="margin-right: 7px"
                                    >
                                        <img
                                            :src="currentUser.picture"
                                            alt=""
                                            class="mr-4"
                                        />
                                    </div>
                                    {{ currentUser.username }}
                                    <i class="mdi mdi-chevron-down"></i>
                                </a>
                                <ul class="dropdown-menu">
                                    <li>
                                        <a
                                            class="dropdown-item"
                                            href="#"
                                            @click="logout"
                                            >Logout</a
                                        >
                                    </li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>

        <!-- banner -->
        <div class="banner">
            <div class="imageBox">
                <img :src="currentUser.picture" alt="" class="mr-4" />
            </div>
            <div class="info">
                <div class="row name-text">
                    <div class="col-md-3">Username</div>
                    <div class="col-md-6">{{ currentUser.username }}</div>
                </div>
                <div class="row name-text w-100">
                    <div class="col-md-3">Name</div>
                    <div class="col-md-6">{{ currentUser.name }}</div>
                </div>
            </div>
        </div>
        <!-- <p class="user">User Profile</p> -->
    </div>
</template>
<script>
export default {
    data() {
        return {
            currentUser: {},
            token: localStorage.getItem("token"),
            tokenAvatar: "",
        };
    },
    methods: {
        logout() {
            axios
                .post("api/logout")
                .then((response) => {
                    localStorage.removeItem("token");
                    this.$router.push("/login");
                })
                .catch((errors) => {
                    console.log(errors);
                });
        },
    },
    mounted() {
        this.tokenAvatar = window.Laravel.csrfToken;
        window.axios.defaults.headers.common[
            "Authorization"
        ] = `Bearer ${this.token}`;
        axios
            .get("api/user")
            .then((response) => {
                this.currentUser = response.data;
            })
            .catch((errors) => {
                console.log(errors);
            });
    },
};
</script>
