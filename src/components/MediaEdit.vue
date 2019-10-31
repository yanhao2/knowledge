<template>
  <div class="Monitor">
    <div style="width: 100%;">
<!--      :style="{height: 'calc(100vh - 150px)', overflowY: 'auto'}"-->
      <Card shadow class="Card top" >
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="150">
          <div class="formTitle">基本信息</div>
          <FormItem label="账号名称" prop="user_name">
            <Input v-model="formValidate.user_name" clearable placeholder="请输入账号名称" style="width: 380px;"></Input>
          </FormItem>
          <FormItem label="账号地址">
            <Input type="textarea" v-model="formValidate.personal_url" clearable placeholder="请输入平台主页"
                   style="width: 380px;"></Input>
          </FormItem>
          <FormItem label="性别" prop="gender">
            <RadioGroup v-model="formValidate.gender">
              <Radio :label="0">男</Radio>
              <Radio :label="1">女</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="头像Logo">
            <div style="display: flex;">
              <Upload
                :before-upload="handleUpload"
                action="">
                <Button icon="ios-cloud-upload-outline">上传头像</Button>
              </Upload>
<!--              <div v-if="file !== null">Upload file: {{ file.name }}</div>-->
<!--              <img :src="formValidate.avatar_url" alt="" style="width: 60px;margin-left: 10px"-->
<!--                   v-show="formValidate.avatar_url">-->
              <Input v-model="formValidate.avatar_url" clearable style="display: none"></Input>
            </div>
          </FormItem>
          <FormItem label="用户ID" prop="user_id">
            <Input v-model="formValidate.user_id" clearable placeholder="请输入用户ID" style="width: 380px;"></Input>
          </FormItem>
          <FormItem label="自媒体号" prop="number_id">
            <Select
              :placeholder="formValidate.number_name"
              v-model="formValidate.number_id"
              filterable
              remote
              clearable
              :remote-method="LoadMediaNumberList"
              :loading="loadingNumber" style="width: 380px">
              <Option v-for="(option, index) in NumberList" :value="String(option.id)" :key="index">{{option.name}}</Option>
            </Select>
          </FormItem>
          <FormItem label="自媒体平台" prop="platform_id">
            <Select
              placeholder="请输入自媒体平台进行搜索"
              v-model="formValidate.platform_id"
              filterable
              remote
              clearable
              style="width: 380px">
              <Option v-for="(option, index) in PlatformList" :value="option.id" :key="index">{{option.name}}</Option>
            </Select>
          </FormItem>
          <FormItem label="是否认证" prop="isverified">
            <RadioGroup v-model="formValidate.isverified">
              <Radio :label="0">是</Radio>
              <Radio :label="1">否</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="粉丝数" prop="followers_count">
            <Input v-model="formValidate.followers_count" clearable placeholder="请输入粉丝数"
                   style="width: 380px;"></Input>
          </FormItem>
          <FormItem label="关注数" prop="friends_count">
            <Input v-model="formValidate.friends_count" clearable placeholder="请输入关注数" style="width: 380px;"></Input>
          </FormItem>

          <FormItem label="作品数" prop="statuses_count">
            <Input v-model="formValidate.statuses_count" clearable placeholder="请输入作品数" style="width: 380px;"></Input>
          </FormItem>
          <FormItem label="阅读数" prop="read_count">
            <Input v-model="formValidate.read_count" clearable placeholder="请输入阅读数" style="width: 380px;"></Input>
          </FormItem>
          <FormItem label="点赞数" prop="like_count">
            <Input v-model="formValidate.like_count" clearable placeholder="请输入点赞数" style="width: 380px;"></Input>
          </FormItem>
          <FormItem label="个人描述">
            <Input v-model="formValidate.description" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                   placeholder="请输入个人描述" style="width: 380px;"></Input>
          </FormItem>
          <FormItem label="备注">
            <Input v-model="formValidate.note" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注"
                   style="width: 380px;"></Input>
          </FormItem>
          <FormItem label="用户所在地">
            <Input v-model="formValidate.location" clearable placeholder="请输入用户所在地" style="width: 380px;"></Input>
          </FormItem>
          <div class="formTitle">标注信息</div>
          <FormItem label="所属地域" prop="cityCode">
            <Cascader :data="AreaList" :placeholder="cityName" style="width: 380px" filterable
                      v-model="formValidate.cityCode"  :load-data="AreaLoadDataChildren" @on-change="onChangeCityCode" change-on-select></Cascader>
          </FormItem>
          <FormItem label="所属行业" prop="industry">
            <Cascader :data="IndustryList" v-model="formValidate.industry" :placeholder="industryName" clearable @on-change="onChangeIndustry" change-on-select style="width: 380px"></Cascader>
          </FormItem>
          <FormItem label="关联公司" prop="corp_id">
            <Select
              :placeholder="formValidate.corp_name"
              v-model="formValidate.corp_id"
              filterable
              remote
              clearable
              :remote-method="LoadMediaAuthenticationTypeListCompany"
              :loading="loadingCompany"
              style="width: 380px">
              <Option v-for="(option, index) in AuthenticationCompanyList" :value="option.code" :key="index">
                {{option.fullName}}
              </Option>
            </Select>
          </FormItem>
          <FormItem label="标签" prop="tags">
            <el-cascader
              style="width: 380px"
              :options="LabelList"
              :props="props"
              v-model="formValidate.tags"
              placeholder="请选择标签"
              clearable></el-cascader>
          </FormItem>
          <FormItem label="广告价值" prop="advprice">
            <Input v-model="formValidate.advprice" clearable placeholder="请输入广告价值" style="width: 380px;"></Input>
          </FormItem>
          <FormItem label="疑似水号" prop="is_zombie">
            <RadioGroup v-model="formValidate.is_zombie">
              <Radio :label="1">是</Radio>
              <Radio :label="0">否</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="是否采集" prop="is_crawl">
            <RadioGroup v-model="formValidate.is_crawl">
              <Radio :label="1">是</Radio>
              <Radio :label="0">否</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="是否评估" prop="is_ipr">
            <RadioGroup v-model="formValidate.is_ipr">
              <Radio :label="1">是</Radio>
              <Radio :label="0">否</Radio>
            </RadioGroup>
          </FormItem>


          <FormItem label="认证类型" prop="category">
            <Select
              placeholder="请选择认证类型"
              v-model="formValidate.category"
              filterable
              remote
              clearable
              style="width: 380px">
              <Option v-for="(option, index) in AuthenticationTypeList" :value="String(option.id)" :key="index">
                {{option.name}}
              </Option>
            </Select>
          </FormItem>
          <FormItem label="认证描述">
            <Input v-model="formValidate.verified_type" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                   placeholder="请输入认证描述" style="width: 380px;"></Input>
          </FormItem>
          <FormItem label="认证账号">
            <Input v-model="formValidate.verified_name" clearable placeholder="请输入认证账号" style="width: 380px;"></Input>
          </FormItem>


          <FormItem label="标志位" prop="flag">
            <RadioGroup v-model="formValidate.flag">
              <Radio label="r_1,d_0">审核</Radio>
              <Radio label="r_0,d_1">未审</Radio>
            </RadioGroup>
          </FormItem>


          <FormItem label="发文时间" prop="news_posttime">
            <DatePicker :value="formValidate.news_posttime" v-model="formValidate.news_posttime"
                        format="yyyy-MM-dd HH:mm:ss" type="datetime"
                        placement="bottom-start" placeholder="请选择发文时间段"
                        style="width: 380px"></DatePicker>
          </FormItem>


          <FormItem>
            <Button type="primary" @click="handleSubmit('formValidate')">保存</Button>
            <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
          </FormItem>
        </Form>
      </Card>
    </div>
  </div>
</template>

<script>
  import api from "../api/api";
  import {formatTs, formatNumber} from '../moment/index'
  export default {
    name: "MediaEdit",
    props: [
      'formValidate',
      'id',
      'loadingNumber',
      'loadingCompany',
      'IndustryList',
      'LabelList',
      'NumberList',
      'PlatformList',
      'AuthenticationTypeList',
      'AuthenticationCompanyList',
      'AreaList',
      'LoadMediaNumberListEvent',
      'cityName',
      'industryName',
      'LoadMediaAuthenticationTypeListCompanyEvent',
      'onCloseModalEvent',
      'AreaLoadDataChildrenEvent',
      'LoadDataEditEvent'
    ],
    data() {
      return {
        props: { multiple: true, checkStrictly: true },

        ruleValidate: {
          platform_id: [
            {type: 'number', required: true, message: '自媒体平台不能为空', trigger: 'change'}
          ],
          user_name: [
            {required: true, message: '账号名称不能为空', trigger: 'blur'}
          ],
          user_id: [
            {required: true, message: '用户ID不能为空', trigger: 'blur'}
          ],
          gender: [
            {required: true, message: '性别不能为空'}
          ],
          isverified: [
            {required: true, message: '是否认证不能为空'}
          ],
          friends_count: [
            {required: true, message: '关注数不能为空'}
          ],
          followers_count: [
            {required: true, message: '粉丝数不能为空'}
          ],
          statuses_count: [
            {required: true, message: '作品数不能为空'}
          ],
          read_count: [
            {required: true, message: '阅读数不能为空'}
          ],
          like_count: [
            {required: true, message: '点赞数不能为空'}
          ],
          tags: [
            {required: true, type: 'array', min: 1, message: '标签不能为空', trigger: 'change'},
            {type: 'array', message: '标签只能是数组', trigger: 'change'}
          ],
          flag: [
            {required: true, message: '标志位不能为空', trigger: 'change'}
          ],
          cityCode: [
            {required: true, type: 'array', min: 1, message: '地域不能为空', trigger: 'change'},
            {type: 'array', message: '地域只能是数组', trigger: 'change'}
          ],
          corp_id: [
            {required: true, message: '关联公司不能为空', trigger: 'change'}
          ],
          is_zombie: [
            {type: 'number', required: true, message: '疑似水号不能为空', trigger: 'change'}
          ],
          category: [
            {required: true,  message: '认证类型不能为空', trigger: 'change'}
          ],
          advprice: [
            {required: true, message: '广告价值不能为空'}
          ],
          number_id: [
            {required: true, message: '自媒体号不能为空', trigger: 'change' }
          ],
          industry: [
            {required: true, type: 'array', min: 1, message: '所属行业不能为空', trigger: 'change'},
            {type: 'array', message: '所属行业只能是数组', trigger: 'change'}
          ],
          is_crawl: [
            {required: true, message: '是否采集不能为空'}
          ],
          is_ipr: [
            {required: true, message: '是否评估不能为空'}
          ],
          news_posttime: [
            {required: true, message: '发文时间不能为空'}
          ],
        },
      };
    },
    computed: {
    },
    methods: {
      formatTs: formatTs,
      formatNumber: formatNumber,
      // 自媒体号 搜索
      LoadMediaNumberList (query) {
        this.$emit('LoadMediaNumberListEvent', query)
      },
      // 地域的二级
      AreaLoadDataChildren (item, callback) {
        this.$emit('AreaLoadDataChildrenEvent', item, callback)
      },
      // 关联公司
      LoadMediaAuthenticationTypeListCompany(query) {
        this.$emit('LoadMediaAuthenticationTypeListCompanyEvent', query)
      },
      //  所属行业 change
      onChangeIndustry (value, selectedData) {
        this.formValidate.industry = value
      },
      //  所属地域 change
      onChangeCityCode (value, selectedData) {
        this.formValidate.cityCode = value
      },

      // 返回
      onBack() {
        this.$router.go(-1)
      },
      // 保存
      handleSubmit(name) {
        let tags = []
        if (this.id) {
          if (this.formValidate.tags.length > 0) {
            this.formValidate.tags.map((v, i) => {
              if (Array.isArray(v)) {
                tags.push(v[v.length - 1])
              } else {
                tags = this.formValidate.tags
              }
            })
          }
          if (this.formValidate.industry.length === 0) {
            this.formValidate.industry =  this.formValidate.industryList
          } else {
            this.formValidate.industry = this.formValidate.industry
          }
          if (this.formValidate.cityCode.length ===  0) {
            this.formValidate.cityCode = this.formValidate.cityList
          } else {
            this.formValidate.cityCode = this.formValidate.cityCode
          }
        }

        this.$refs[name].validate((valid) => {
          if (valid) {
            let data = {}
            if (this.id) {
              data = {
                id: this.id,
                platform_id: this.formValidate.platform_id,
                gender: this.formValidate.gender,
                user_name: this.formValidate.user_name,
                user_id: this.formValidate.user_id,
                avatar_url: this.formValidate.avatar_url,
                personal_url: this.formValidate.personal_url,
                isverified: this.formValidate.isverified,
                verified_type: this.formValidate.verified_type,
                verified_name: this.formValidate.verified_name,
                friends_count: Number(this.formValidate.friends_count),
                followers_count: Number(this.formValidate.followers_count),
                statuses_count: Number(this.formValidate.statuses_count),
                read_count: Number(this.formValidate.read_count),
                like_count: Number(this.formValidate.like_count),
                tags: tags,
                flag: this.formValidate.flag.split(','),
                corp_id: this.formValidate.corp_id,
                number_id: Number(this.formValidate.number_id),
                is_zombie: Number(this.formValidate.is_zombie),
                category: Number(this.formValidate.category),
                adv_price: Number(this.formValidate.advprice),
                industry: this.formValidate.industry.length > 0 ? this.formValidate.industry[this.formValidate.industry.length - 1] : '',
                is_crawl: Number(this.formValidate.is_crawl),
                is_ipr: Number(this.formValidate.is_ipr),
                news_posttime: this.formatNumber(this.formValidate.news_posttime, 'YYYY-MM-DD HH:mm:ss'),
                note: this.formValidate.note,
                description: '',
                country_id: this.formValidate.cityCode[0], // 国家
                province_id: this.formValidate.cityCode[1], // 省份
                city_id: this.formValidate.cityCode[2], // 城市
                region_id: this.formValidate.cityCode[3], // 区域
              }
            } else {
              data = {
                platform_id: this.formValidate.platform_id,
                gender: this.formValidate.gender,
                user_name: this.formValidate.user_name,
                user_id: this.formValidate.user_id,
                avatar_url: this.formValidate.avatar_url,
                personal_url: this.formValidate.personal_url,
                isverified: this.formValidate.isverified,
                verified_type: this.formValidate.verified_type,
                verified_name: this.formValidate.verified_name,
                friends_count: Number(this.formValidate.friends_count),
                followers_count: Number(this.formValidate.followers_count),
                statuses_count: Number(this.formValidate.statuses_count),
                read_count: Number(this.formValidate.read_count),
                like_count: Number(this.formValidate.like_count),
                tags: tags,
                flag: this.formValidate.flag.split(','),
                corp_id: Number(this.formValidate.corp_id),
                number_id: Number(this.formValidate.number_id),
                is_zombie: Number(this.formValidate.is_zombie),
                category: Number(this.formValidate.category),
                adv_price: Number(this.formValidate.advprice),
                industry: this.formValidate.industry.length > 0 ? this.formValidate.industry[this.formValidate.industry.length - 1] : '',
                is_crawl: Number(this.formValidate.is_crawl),
                is_ipr: Number(this.formValidate.is_ipr),
                news_posttime: this.formatNumber(this.formValidate.news_posttime, 'YYYY-MM-DD HH:mm:ss'),
                note: this.formValidate.note,
                description: '',
                country_id: this.formValidate.cityCode[0], // 国家
                province_id: this.formValidate.cityCode[1], // 省份
                city_id: this.formValidate.cityCode[2], // 城市
                region_id: this.formValidate.cityCode[3], // 区域
              }
            }
            this.formValidate.cityCode = []
            this.addEditLoadData(data)
          } else {
            this.$Message.error('按要求填写，必填字段');
          }
        })
      },
      // 添加编辑的提交
      async addEditLoadData(record) {
        try {
          let data = await api.MediaAddEditItem(record)
          let title = this.id ? '添加' : '编辑'
          if (data.code === 200) {
            if (this.id) {
              this.$emit('LoadDataEditEvent', this.id)
            }
            this.$Modal.confirm({
              title: '提示',
              okText: '返回上一层',
              cancelText: '继续' + title,
              content: '<p style="font-weight: bold;">您' + title + '成功, 是否继续?</p>',
              onOk: () => {
                this.$emit('onCloseModalEvent')
              },
              onCancel: () => {
                if (!this.id) {
                  this.handleReset('formValidate')
                }
              }
            });
          } else {
            this.$Message.error(data.msg);
          }
        } catch (e) {
          console.log(e)
        }
      },
      handleReset(name) {
        this.$refs[name].resetFields();
      },

      handleUpload(file) {
        this.file = file;
        console.log(file)
        return false;
      },
    },
    created () {
    },

    mounted() {

    },
    updated() {
    }
  }
</script>

<style lang="scss">
  @import "../css/reset.css";
  .ivu-modal-mask{
    z-index: 0!important;
  }
  .el-cascader {
    .el-input__inner{
      border-radius: 0;
    }
  }
  .demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
  }
  @keyframes ani-demo-spin {
    from { transform: rotate(0deg);}
    50%  { transform: rotate(180deg);}
    to   { transform: rotate(360deg);}
  }
  .Card {
    /*i:hover {*/
    /*  color: #0077CB;*/
    /*}*/
  }

  .formTitle {
    padding-bottom: 10px;
    border-bottom: 1px solid #dcdee2;
    margin-bottom: 10px;
  }

  .ivu-cascader-menu {
    min-width: 200px;
  }

  .Monitor {
    .onShowNameClass {
      .ivu-input, .ivu-select-selection {
        border-left: 0px;
      }

    }

    .TableAction {
      i {
        cursor: pointer;
      }

      i:hover {
        color: #0077CB;
      }
    }

    .ivu-table-cell {
      .ivu-table-sort, .ivu-table-filter {
        i {
          color: #fff;
        }
      }
    }

    .ivu-table-tip {
      overflow-x: hidden;
    }

    .padding {
      .ivu-card-body {
        padding-top: 0;
        padding-bottom: 15px;
      }
    }

    .padding-layout {
      padding: 10px;
      text-align: right;
    }

    /*.ivu-table-overflowX {*/
    /*  overflow-x: hidden;*/
    /*}*/

    .ivu-card.ivu-card-shadow:hover {
      box-shadow: none;
    }

    .ivu-input-group-prepend {
      background-color: #fff;
    }

    .ivu-card, .ivu-input, .ivu-select-selection {
      border-radius: 0px;
    }

    .BottomCard .ivu-card-body {

      .ivu-table-wrapper {
        /*border-left: 1px solid #e8eaec;*/
        /*border-top: 1px solid #e8eaec;*/
        /*border-right: 1px solid #e8eaec;*/

        .ivu-table th {
          background-color: #0077CB;
          color: #fff;
          font-weight: inherit;
        }
      }
    }

    .Card {
      box-shadow: none;

      .ivu-card-head {
        border-bottom: 0px;
      }

      .CardindustryFlex {
        display: flex;
        flex-wrap: wrap;

        .alignCenter {
          align-items: center;
          padding-right: 15px;
          cursor: pointer;
          padding-top: 15px;

          .text {
            white-space: nowrap;
          }

          .ivu-dropdown-rel {
            margin-left: 10px;
            padding: 6px 10px;
            background-color: rgba(18, 212, 201, 0.3);
          }

          .DropdownList {
            color: rgba(18, 212, 201, 1);
            white-space: nowrap;
          }
        }
      }

      .timeSearch {
        display: flex;
        align-items: center;
        margin-top: 20px;

        .ivu-radio-group-button .ivu-radio-wrapper:first-child, .ivu-radio-group-button .ivu-radio-wrapper:last-child {
          border-radius: 0;
        }
      }

      .platform {
        display: flex;
        flex-wrap: wrap;
        margin-top: 20px;
      }
    }

    .top {
      .ivu-card-head {
        border-bottom: 1px solid #e8eaec;
      }
    }
  }

  .ivu-select-single .ivu-select-selection .ivu-select-placeholder {
    color: #515a6e;
    font-size: 14px;
  }

  .ivu-select-input::-webkit-input-placeholder, .ivu-input::-webkit-input-placeholder {
    color: #515a6e;
    font-size: 14px;
  }

  .ivu-select-input:-moz-placeholder, .ivu-input:-moz-placeholder {
    color: #515a6e;
    font-size: 14px;
  }

  .ivu-select-input::-moz-placeholder, .ivu-input::-moz-placeholder { /* Mozilla Firefox 19+ */
    color: #515a6e;
    font-size: 14px;
  }

  .ivu-select-input:-ms-input-placeholder, .ivu-input:-ms-input-placeholder {
    color: #515a6e;
    font-size: 14px;
  }
</style>
