<template>
    <div>
        <div class="loading"></div>
        <b-img src="@img/foo.jpg" width="100px"></b-img>
        <img src="@img/foo.jpg" width="100" />
        <b-img src="@img/car.svg" width="100px"></b-img>
        <b-img src="@img/decimal.svg"></b-img>
    </div>
</template>

<style lang="less" scoped>
    .loading {
        background-image : url("loading.gif");
        background-repeat: no-repeat;
        margin           : 0 auto;
        width            : 200px;
        height           : 200px;
    }
</style>
