<template>
  <div>
    <div class="bottomBox">
      <div class="leftBox">
        <p class="name">
          <span style="z-index: 10;width: 185px;">即刻体验智慧体测</span>
        </p>
        <el-button
          type="primary"
          style="padding: 12px 25px"
          @click="centerDialogVisible = true"
        >申 请 体 验</el-button>
      </div>
      <div class="rightBox">
        <img style="width: 210px" src="../assets/img/立刻体验插画@2x.png" alt />
      </div>
    </div>
    <el-dialog :visible.sync="centerDialogVisible" width="30%" center class="modalForm">
      <p class="title">申请体验</p>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="公司名称" prop="companyName">
          <el-input v-model="form.companyName" placeholder="请输入公司名称"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="name">
          <el-input v-model="form.name" placeholder="该联系人方便我们联系您"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="mobile">
          <el-input v-model="form.mobile" placeholder="请输入您的联系电话"></el-input>
        </el-form-item>
        <el-form-item label="电子邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入您的电子邮箱"></el-input>
        </el-form-item>
        <el-form-item label="咨询内容" prop="content">
          <el-input
            type="textarea"
            v-model="form.content"
            :rows="4"
            placeholder="请简述您的需求，以便我们更精确地提供服务"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit('form')" :loading="loading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { postForm } from "../api/getData";

export default {
  name: "postForm",
  data() {
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("手机号不能为空"));
      } else {
        const reg1 = /^1[3|4|5|7|8][0-9]\d{8}$/;
        const reg2 = /^(\d{3,4}-)?\d{7,8}$/;
        if (reg1.test(value) || reg2.test(value)) {
          callback();
        } else {
          return callback(new Error("请输入正确的号码"));
        }
      }
    };
    return {
      form: {
        companyName: "",
        name: "",
        mobile: "",
        email: "",
        content: ""
      },
      loading: false,
      rules: {
        companyName: [
          { required: true, message: "请输入公司名称", trigger: "blur" }
        ],
        name: [
          { required: true, message: "请输入联系人名称", trigger: "blur" }
        ],
        mobile: [
          {
            required: true,
            message: "请输入正确的联系电话",
            validator: checkPhone,
            trigger: ["blur"]
          }
        ],
        email: [
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        content: []
      },
      centerDialogVisible: false
    };
  },
  methods: {
    onSubmit(formName) {
      this.$refs[formName].validate(async (valid, values) => {
        if (valid) {
          this.loading = true;
          const res = await postForm(this.form);
          if (res.status === 200) {
            this.$message.success("提交成功");
            this.loading = false;
            this.centerDialogVisible = false;
          }
        } else {
          console.log("error submit!!");
          this.loading = false;
          this.$message("提交失败！请检查示所填信息是否正确无误");
          this.centerDialogVisible = false;
          return false;
        }
      });
    }
  }
};
</script>

<style lang="less">
.modalForm {
  border-radius: 8px;

  .el-dialog__header {
    padding: 0;
  }
  .el-dialog--center .el-dialog__body {
    padding-top: 0;
  }
  .el-dialog.el-dialog--center {
    border-radius: 8px;
    box-shadow: 0 0 7px 0;
  }

  .title {
    color: #228bfe;
    letter-spacing: 7px;
    font-family: "PingFangSC-Semibold";
    font-weight: bold;
    text-align: center;
    font-size: 18px;
    padding: 20px 0;
  }
}
.bottomBox {
  height: 200px;
  margin-top: 80px;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  .leftBox {
    margin-right: 350px;
  }
  .name {
    font-size: 20px;
    color: #001962;
    font-weight: 600;
    position: relative;
    letter-spacing: 3px;
    z-index: 10;
    background-image: url("../assets/img/云 (1)@2x.png");
    background-position: 170px 15px;
    background-size: 28px;
    background-repeat: no-repeat;
    height: 40px;
    width: 200px;
    margin-bottom: 10px;
  }
}
</style>
