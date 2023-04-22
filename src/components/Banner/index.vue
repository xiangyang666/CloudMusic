<template>
	<el-carousel :interval="4000" type="card" height="230px">
		<el-carousel-item v-for="(item, index) in bannerList.data" :key="index">
			<el-image style="width:100%;height:100%;border-radius: 20px;" :src="item.imageUrl" />
			<!-- 下面这个是点击图片跳转详情页的，由于id错误，只有部分图片可以跳转到对应详情页，在这也不写了 -->
			<!-- <el-image @click="handleDetail(item)" style="width:100%;height:100%;border-radius: 20px;" :src="item.imageUrl" /> -->
		</el-carousel-item>
	</el-carousel>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import { getRecommendList } from '@/api/home'
import { useRouter } from 'vue-router';

const router = useRouter()

let bannerList = reactive({
	data: {}
})
onMounted(async () => {
	// 获取轮播图数据
	const { data } = await getRecommendList(0)
	bannerList.data = data.banners
})

const handleDetail = (item) => {
	console.log(item)
	router.push({
		name: 'musicDetail',
		params: {
			id: item.targetId
		}
	})
}
</script>

<script>
export default {
	name: ''
}
</script>

<style lang="scss" scoped>
.title {
	font-size: 30px;
}

.el-carousel {
	max-width: 1124px;
	min-width: 1124px;
	position: relative;
	left: 50%;
	transform: translateX(-50%);
}

.el-carousel__item {
	color: #475669;
	opacity: 1;
	line-height: 200px;
	margin: 0;
	text-align: center;
}

.el-carousel__item:nth-child(2n) {
	background-color: unset;
}

.el-carousel__item:nth-child(2n + 1) {
	background-color: unset;
}
</style>