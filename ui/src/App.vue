<template>
  <div>
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
    <!-- Footer -->
    <footer>
      Found this useful ?&nbsp;
      <a href="https://github.com/saurabh47/rent-receipt-generator" target="_blank" rel="noopener"> Give our repo a
        star.
        <div class="github-star-badge">
          <svg class="material-icons" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
          Star
        </div>
      </a>
      <a href="https://github.com/angular/angular" target="_blank" rel="noopener">
        <svg class="material-icons" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" fill="#1976d2" />
          <path d="M0 0h24v24H0z" fill="none" />
        </svg>
      </a>
    </footer>
  </div>
</template>

<script>
import RentGenForm from "./components/RentGenForm.vue";
import { StarFilled } from "@ant-design/icons-vue";

export default {
  name: "App",
  components: {
    RentGenForm,
    StarFilled
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

footer {
  margin-top: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 20px;
}

footer a {
  display: flex;
  align-items: center;
}

.github-star-badge {
  color: #24292e;
  display: flex;
  align-items: center;
  font-size: 12px;
  padding: 3px 10px;
  border: 1px solid rgba(27, 31, 35, .2);
  border-radius: 3px;
  background-image: linear-gradient(-180deg, #fafbfc, #eff3f6 90%);
  margin-left: 4px;
  font-weight: 600;
}

.github-star-badge:hover {
  background-image: linear-gradient(-180deg, #f0f3f6, #e6ebf1 90%);
  border-color: rgba(27, 31, 35, .35);
  background-position: -.5em;
}

.github-star-badge .material-icons {
  height: 16px;
  width: 16px;
  margin-right: 4px;
}

@media screen and (max-width: 600px) {
  .page {
    flex-direction: column;
    align-items: center;
    padding: 10px;
  }
}
</style>
