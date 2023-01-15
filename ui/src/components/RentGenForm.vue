<template>
  <a-card class="card" size="small">
    <a-form
      :model="formState"
      name="basic"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 16 }"
      autocomplete="off"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
    >
      <a-form-item
        label="Monthly Rent"
        name="monthlyRent"
        :rules="[{ required: true, message: 'Please enter Monthly Rent!' }]"
      >
        <a-input-number
          style="width: 100%"
          :min="1"
          v-model:value="formState.monthlyRent"
          :formatter="
            (value) => `Rs. ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          "
          :parser="(value) => value.replace(/\Rs.\s?|(,*)/g, '')"
        />
      </a-form-item>
      <a-form-item
        label="Your Name"
        name="userName"
        :rules="[{ required: true, message: 'Please enter Your Name!' }]"
      >
        <a-input v-model:value="formState.userName" />
      </a-form-item>

      <a-form-item
        label="Owner Name"
        name="ownerName"
        :rules="[{ required: true, message: 'Please enter Owner Name!' }]"
      >
        <a-input v-model:value="formState.ownerName" />
      </a-form-item>

      <a-form-item
        label="Address"
        name="address"
        :rules="[{ required: true, message: 'Please enter Address!' }]"
      >
        <a-textarea v-model:value="formState.address" />
      </a-form-item>

      <a-form-item label="Owner's PAN no" name="ownersPan" :rules="[]">
        <a-input v-model:value="formState.ownersPan" />
      </a-form-item>
      <a-form-item
        label="Duration"
        name="duration"
        :rules="[{ required: true, message: 'Select the Duration!' }]"
      >
        <a-range-picker v-model:value="formState.duration" picker="month" />
      </a-form-item>

      <a-form-item
        label="Your Email Id"
        name="userEmail"
        :rules="[{ required: false, message: 'Please enter Email Id!' }]"
      >
        <a-input v-model:value="formState.userEmail" />
      </a-form-item>

      <a-form-item :wrapper-col="{ offset: 4, span: 16 }">
        <a-button type="primary" shape="round" html-type="submit"
          >Generate Receipts</a-button
        >
      </a-form-item>
    </a-form>
  </a-card>
</template>
<script>
import { defineComponent, reactive } from "vue";
import moment from "moment";
import { message } from "ant-design-vue";

const messageKey = "updatable";

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  currencyDisplay: "code",
});

export default defineComponent({
  setup() {
    const formState = reactive({
      userName: "",
      ownerName: "",
      address: "",
      monthlyRent: null,
      ownersPan: "",
      userEmail: null,
      duration: null,
    });
    const onFinish = async (values) => {
      console.log("Success:", values);

      let startDate = new Date(values.duration.at(0).$d);
      let endDate = new Date(values.duration.at(1).$d);

      startDate = moment(startDate).startOf("month");
      endDate = moment(endDate).startOf("month");
      endDate.add(1, "month");

      message.loading({ content: "Generating Receipts...", messageKey });

      while (startDate.isBefore(endDate)) {
        console.log(startDate.format("MMM YYYY"));
        await fetch(process.env.VUE_APP_API_BASE_URL + "/generate-receipts", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userName: values.userName,
            ownerName: values.ownerName,
            address: values.address,
            monthlyRent: formatter
              .format(values.monthlyRent)
              .replace("INR", "Rs."),
            ownersPan: values.ownersPan,
            userEmail: values.userEmail,
            receiptMonth: startDate.format("MMM YYYY"),
            startDate: startDate.format("DD MMM YYYY"),
            endDate: moment(startDate).endOf("month").format("DD MMM YYYY"),
            receiptDate: moment(startDate)
              .add(1, "month")
              .format("DD MMM YYYY"),
          }),
        })
          .then((res) => res.blob())
          .then((blob) => {
            // const file = window.URL.createObjectURL(blob);
            // window.location.assign(file);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "filename.pdf";
            document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
            a.click();
            a.remove(); //afterwards we remove the element again
          });
        startDate.add(1, "month");
      }

      message.success({
        content: "Generated Receipts!",
        messageKey,
        duration: 2,
      });

      //   console.log(await generatePDF.json());
    };
    const onFinishFailed = (errorInfo) => {
      console.log("Failed:", errorInfo);
    };
    return {
      formState,
      onFinish,
      onFinishFailed,
    };
  },
});
</script>

<style scoped>
.card {
  width: 500px;
  padding: 30px;
  border-radius: 10px;
  /* Add shadows to create the "card" effect */
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
}

/* On mouse-over, add a deeper shadow */
.card:hover {
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
}

/* Add some padding inside the card container */
.container {
  padding: 2px 16px;
}
.ant-btn {
  margin-top: 15px;
}

.ant-picker {
  width: 100%;
}

@media screen and (max-width: 600px) {
  .card {
    width: 100%;
  }
}
</style>