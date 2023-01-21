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
          aria-label="Please enter Monthly Rent!"
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
        <a-input v-model:value="formState.userName" aria-label="Please enter Your Name!" />
      </a-form-item>

      <a-form-item
        label="Owner Name"
        name="ownerName"
        :rules="[{ required: true, message: 'Please enter Owner Name!' }]"
      >
        <a-input v-model:value="formState.ownerName" aria-label="Please enter Owner Name!" />
      </a-form-item>

      <a-form-item
        label="Address"
        name="address"
        :rules="[{ required: true, message: 'Please enter Address!' }]"
      >
        <a-textarea v-model:value="formState.address" aria-label="Please enter Address!" />
      </a-form-item>

      <a-form-item label="Owner's PAN no" name="ownersPan" :rules="[]">
        <a-input v-model:value="formState.ownersPan" aria-label="Please enter Owner's PAN no"/>
      </a-form-item>
      <a-form-item
        label="Duration"
        name="duration"
        :rules="[{ required: true, message: 'Please select the Duration!' }]"
      >
        <a-range-picker v-model:value="formState.duration" picker="month" aria-label="Please select the Duration!" />
      </a-form-item>

      <a-form-item
        label="Your Email Id"
        name="userEmail"
        :rules="[{ required: false, message: 'Please enter your Email Id!' }]"
      >
        <a-input v-model:value="formState.userEmail" aria-label="Please enter your Email Id!" />
      </a-form-item>

      <a-form-item name="generateType" label="Generate Receipt">
        <a-radio-group v-model:value="formState.generateType" aria-label="Select Receipt Type Single or Receipt per Month">
          <a-radio value="SINGLE">Single</a-radio>
          <a-radio value="RECEIPT_PER_MONTH">Receipt per Month</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item name="ownerSignature" label="Owner's Signature" extra="">
        <a-upload
          v-model:fileList="formState.ownerSignature"
          name="logo"
          :max-count="1"
          list-type="fileList"
          :before-upload="beforeUpload"
          @remove="handleRemove"
          aria-label="Please select Owner's Signature File"
        >
          <a-button class="file-upload-btn">
            <template #icon><UploadOutlined /></template>
            Click to Select file
          </a-button>
        </a-upload>
      </a-form-item>

      <a-form-item :wrapper-col="{
        lg: { offset: 4, span: 16 },
        xs: { span: 24, offset: 0 },
        sm: { span: 16, offset: 8 }}">
        <a-button type="primary" shape="round" html-type="submit"
          >Generate Receipts</a-button
        >
      </a-form-item>
    </a-form>
  </a-card>
</template>
<script>
import { defineComponent, reactive, ref } from "vue";
import moment from "moment";
import { message} from "ant-design-vue";
import { UploadOutlined } from "@ant-design/icons-vue";

const messageKey = "updatable";

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  currencyDisplay: "code",
});

export default defineComponent({
  setup() {
    const fileList = ref([]);

    const formState = reactive({
      userName: "",
      ownerName: "",
      address: "",
      monthlyRent: null,
      ownersPan: "",
      userEmail: null,
      duration: null,
      generateType: "SINGLE",
      ownerSignature: null,
    });

    const getFileName = (receipts) => {
      let fileName = "";
      if (receipts.length == 1) {
        fileName = receipts[0].receiptMonth;
      } else if (receipts.length > 1) {
        fileName =
          receipts[0].receiptMonth + "-" + receipts.at(-1).receiptMonth;
      }
      return fileName.replaceAll(" ", "-") + "-rent-receipt";
    };

    const uploading = ref(false);

    const handleRemove = (file) => {
      fileList.value = null;
    };

    const beforeUpload = (file) => {
      console.log(file);
      fileList.value = file;
      return false;
    };

    const downloadReceipts = async (receipts, base64OwnerSignature) => {
      const config = useRuntimeConfig()

      console.log(config);
      
      await fetch(config.apiBase + "/generate-receipts", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ receipts, ownerSignature: base64OwnerSignature}),
      })
        .then((res) => res.blob())
        .then((blob) => {
          if (!blob) return;
          // const file = window.URL.createObjectURL(blob);
          // window.location.assign(file);
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = getFileName(receipts);
          document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
          a.click();
          a.remove(); //afterwards we remove the element again
        });
    };

    const generateReceiptPerMonth = async (receipts, base64OwnerSignature) => {
      for (const receipt of receipts) {
        await downloadReceipts([receipt], base64OwnerSignature);
      }
    };

    const onFinish = async (values) => {
      console.log("Success:", values);

      let startDate = new Date(values.duration.at(0).$d);
      let endDate = new Date(values.duration.at(1).$d);

      startDate = moment(startDate).startOf("month");
      endDate = moment(endDate).startOf("month");
      endDate.add(1, "month");

      message.loading({ content: "Generating Receipts...", messageKey });
      let base64OwnerSignature;
      let ownerSignature = values.ownerSignature ? values.ownerSignature.at(0) : null;
      if (ownerSignature) {
        console.log("next");
        base64OwnerSignature = "data:" + ownerSignature.type + ";base64,";

       const base64Gen = () => new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = function () {
          // base64OwnerSignature += reader.result
          //   .replace("data:", "")
          //   .replace(/^.+,/, "");
          resolve(reader.result
            .replace("data:", "")
            .replace(/^.+,/, ""));
        };
        reader.readAsDataURL(ownerSignature.originFileObj)
       });

        base64OwnerSignature += await base64Gen();
        console.log(base64OwnerSignature);

        // reader.onload = function () {
        //   base64OwnerSignature += reader.result
        //     .replace("data:", "")
        //     .replace(/^.+,/, "");
        //   console.log(base64OwnerSignature);
        // };
        // reader.readAsDataURL(ownerSignature.originFileObj);
      }

      const receipts = [];

      while (startDate.isBefore(endDate)) {
        console.log(startDate.format("MMM YYYY"));

        receipts.push({
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
          receiptDate: moment(startDate).add(1, "month").format("DD MMM YYYY"),
        });

        startDate.add(1, "month");
      }

      if (values.generateType == "SINGLE") {
        await downloadReceipts(receipts, base64OwnerSignature);
      } else if (values.generateType == "RECEIPT_PER_MONTH") {
        await generateReceiptPerMonth(receipts, base64OwnerSignature);
      }

      message.success({
        content: "Generated Receipts!",
        messageKey,
        duration: 2,
      });
    };

    const onFinishFailed = (errorInfo) => {
      console.log("Failed:", errorInfo);
    };
    return {
      formState,
      onFinish,
      onFinishFailed,
      beforeUpload,
      handleRemove,
    };
  },
  components:{
    UploadOutlined
  }
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
.file-upload-btn {
  margin-top: 0px !important;
  width: 100% !important;
}
:deep() .ant-upload-list-item-name {
  text-align: left !important;
}
:deep() .ant-upload {
  width: 100% !important;
}

@media screen and (max-width: 600px) {
  .card {
    width: 100%;
  }
}
</style>