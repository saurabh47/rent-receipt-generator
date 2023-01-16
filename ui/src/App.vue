<template>
  <div class="page">
    <div class="content">
      <h1>Generate FREE Rent Receipts</h1>
      <ul>
        <li>Avoid last minute hassle of arranging rent receipts</li>
        <li>Fill the required details Print the receipt in PDF Format</li>
        <li>
          Get the receipt signed from your landlord or Select Signature File
          <star-filled />
        </li>
        <li>Submit it to your company's HR department</li>

        <li>No water mark / branding <star-filled /></li>
        <li>Generate Receipt Per Month or Single Receipt <star-filled /></li>
      </ul>
    </div>
    <div class="rent-form">
      <rent-gen-form></rent-gen-form>
    </div>
  </div>
</template>

<script>
import RentGenForm from "./components/RentGenForm.vue";
import { StarOutlined, StarFilled, StarTwoTone } from "@ant-design/icons-vue";

export default {
  name: "App",
  components: {
    RentGenForm,
    StarFilled,
    StarTwoTone,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #e4e4e7;
  font-size: 22px;
  padding-top: 60px;
  background: #0c0c0d;
}
h1 {
  color: #e4e4e7 !important;
}
.content {
  text-align: left;
}
.page {
  display: flex;
  justify-content: space-around;
}
body {
  background: #0c0c0d !important;
}

.anticon-star {
  color: gold !important;
}

@media screen and (max-width: 600px) {
  .page {
    flex-direction: column;
    align-items: center;
    padding: 10px;
  }
}
</style>
