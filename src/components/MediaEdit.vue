<template>
    <div class="Monitor">
        <div style="width: 100%;height: calc(100vh - 70px);">
            <div ref="CardHeight">
                <div :style="{width: '100%'}">
                    <Card shadow class="Card">
                        <div style="display: flex;align-items: center;justify-content: flex-end">
                            <div class="cols" style="font-size: 16px;">
                                {{!id ? '自媒体基本信息添加' : '自媒体基本信息编辑'}}
                            </div>
                            <Icon type="md-close" style="font-size: 20px;cursor: pointer;" @click="onBack()"/>
                        </div>
                    </Card>
                </div>
            </div>
            <div :style="{width: '100%', marginTop: '10px'}">
                <Card shadow class="Card top" :style="{height: 'calc(100vh - 150px)', overflowY: 'auto'}">
                    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100" style="width: 50%">
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
                        <FormItem label="自媒体号" prop="number_id">
                            <Select
                                    placeholder="请输入自媒体号进行搜索"
                                    v-model="formValidate.number_id"
                                    filterable
                                    remote
                                    clearable
                                    :remote-method="LoadMediaNumberList"
                                    :loading="loadingNumber" style="width: 380px">
                                <Option v-for="(option, index) in NumberList" :value="option.id" :key="index">{{option.name}}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="账号名称" prop="name">
                            <Input v-model="formValidate.name" clearable placeholder="请输入账号名称" style="width: 380px;"></Input>
                        </FormItem>
                        <FormItem label="用户ID" prop="user_id">
                            <Input v-model="formValidate.user_id" clearable placeholder="请输入用户ID" style="width: 380px;"></Input>
                        </FormItem>
                        <FormItem label="是否加V">
                            <RadioGroup v-model="formValidate.isVerified">
                                <Radio label="0">是</Radio>
                                <Radio label="1">否</Radio>
                            </RadioGroup>
                        </FormItem>
                        <FormItem label="疑似水号">
                            <RadioGroup v-model="formValidate.isZombie">
                                <Radio label="0">是</Radio>
                                <Radio label="1">否</Radio>
                            </RadioGroup>
                        </FormItem>
                        <FormItem label="是否更新">
                            <RadioGroup v-model="formValidate.isUpdate">
                                <Radio label="0">是</Radio>
                                <Radio label="1">否</Radio>
                            </RadioGroup>
                        </FormItem>
                        <FormItem label="是否采集">
                            <RadioGroup v-model="formValidate.isCrawl">
                                <Radio label="0">是</Radio>
                                <Radio label="1">否</Radio>
                            </RadioGroup>
                        </FormItem>
                        <FormItem label="是否审核">
                            <RadioGroup v-model="formValidate.state">
                                <Radio label="1">是</Radio>
                                <Radio label="0">否</Radio>
                            </RadioGroup>
                        </FormItem>
<!--                        <FormItem label="头像Logo" prop="avatar_url">-->
                        <FormItem label="头像Logo">
                            <Upload
                                    :before-upload="handleUpload"
                                    action="//jsonplaceholder.typicode.com/posts/">
                                <Button icon="ios-cloud-upload-outline">上传头像</Button>
                            </Upload>
                            <div v-if="file !== null">Upload file: {{ file.name }}</div>
                            <Input v-model="formValidate.avatar_url" clearable  style="display: none"></Input>
                        </FormItem>
                        <FormItem label="账号地址" prop="personal_url">
                            <Input v-model="formValidate.personal_url" clearable placeholder="请输入账号地址" style="width: 380px;"></Input>
                        </FormItem>
                        <FormItem label="新媒体联盟" v-show="false">
                            <Select v-model="formValidate.city" clearable filterable multiple style="width: 380px;">
                                <Option value="beijing">New York</Option>
                                <Option value="shanghai">London</Option>
                                <Option value="shenzhen">Sydney</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="所属行业" prop="industry">
                            <Cascader :data="IndustryList" placeholder="请选择所属行业" clearable style="width: 380px" filterable v-model="formValidate.industry" :load-data="IndustryLoadDataChildren" change-on-select></Cascader>
                        </FormItem>
                        <FormItem label="所属地域" prop="cityCode">
                            <Cascader :data="AreaList" placeholder="请选择地域" style="width: 380px" filterable v-model="formValidate.cityCode" :load-data="AreaLoadDataChildren" change-on-select ></Cascader>
                        </FormItem>
                        <FormItem label="粉丝数" prop="followers_count">
                            <Input v-model="formValidate.followers_count" clearable placeholder="请输入粉丝数" style="width: 380px;"></Input>
                        </FormItem>
                        <FormItem label="广告价值" prop="advprice">
                            <Input v-model="formValidate.advprice" clearable placeholder="请输入广告价值" style="width: 380px;"></Input>
                        </FormItem>
                        <FormItem label="单条价值" prop="first_price">
                            <Input v-model="formValidate.first_price" clearable placeholder="请输入单条价值" style="width: 380px;"></Input>
                        </FormItem>
                        <FormItem label="标签" prop="tags">
                            <Cascader :data="LabelList"  placeholder="请选择标签" clearable style="width: 380px" filterable v-model="formValidate.tags" :load-data="LabelLoadDataChildren" change-on-select></Cascader>
                        </FormItem>
                        <FormItem label="简介">
                            <Input v-model="formValidate.description" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入简介" style="width: 380px;"></Input>
                        </FormItem>
                        <FormItem label="备注">
                            <Input v-model="formValidate.note" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注" style="width: 380px;"></Input>
                        </FormItem>
                        <FormItem>
                            <Button type="primary" @click="handleSubmit('formValidate')">保存</Button>
                            <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
                        </FormItem>
                    </Form>

                </Card>
            </div>
        </div>
    </div>
</template>

<script>
  import api from "../api/api";
  export default {
    name: "MediaEdit",
    data() {
      return {
        loadingNumber: false,
        loadingplatform_id: false,
        NumberList: [],
        PlatformList: [],
        IndustryList: [],
        AreaList: [],
        LabelList: [],

        file: null,
        loadingStatus: false,


        formValidate: {
          platform_id: '',
          number_id: '',
          name: '',
          user_id: '',
          avatar_url: '',
          personal_url: '',
          industry: [],
          cityCode: [],
          tags: [],
          followers_count: '',
          advprice: '',
          first_price: '',
          isVerified: '1',
          isZombie: '0',
          isUpdate: '0',
          isCrawl: '0',
          state: '1',
          note: '',
          description: '',
        },
        ruleValidate: {
          platform_id: [
            { required: true, message: '自媒体平台不能为空' }
          ],
          number_id: [
            { required: true, message: '自媒体号不能为空' }
          ],
          name: [
            { required: true, message: '账号名称不能为空', trigger: 'blur' }
          ],
          user_id: [
            { required: true, message: '用户ID不能为空', trigger: 'blur' }
          ],
          // avatar_url: [
          //   { required: true, message: '用户ID不能为空', trigger: 'blur' }
          // ],
          personal_url: [
            { required: true, message: '账号地址不能为空', trigger: 'blur' }
          ],
          industry: [
            { required: true, message: '所属行业不能为空' },
            { type: 'array',  message: '所属行业只能是数组' }
          ],
          cityCode: [
            { required: true, message: '地域不能为空' },
            { type: 'array', message: '地域只能是数组' }
          ],
          followers_count: [
            { required: true, message: '粉丝数不能为空', trigger: 'blur' }
          ],
          advprice: [
            { required: true, message: '广告价值不能为空', trigger: 'blur' }
          ],
          first_price: [
            { required: true, message: '单条价值不能为空', trigger: 'blur' }
          ],
          tags: [
            { required: true, message: '标签不能为空' },
            { type: 'array', message: '标签只能是数组' }
          ]
        },
      };
    },
    computed: {
      id () {
        return this.$route.query.id
      }
    },
    methods: {
      // 自媒体号 搜索
      LoadMediaNumberList (query) {
        if (query !== '') {
          let form = {
            pageNum: 1,
            pageSize: 1000,
            name: query,
            tableName: 'md_we_media_number',
            orderByClause: 'gmt_create DESC',
            isDeleteFlag: true,
          }
          this.loadingNumber = true;
          this.LoadMediaList(form)
        } else {
          this.NumberList = [];
        }
      },
      // 自媒体平台
      LoadMediaPlatformIdList (query) {
        let form = {
          pageNum: 1,
          pageSize: 1000,
          tableName: 'md_media_wemeida_platform',
          orderByClause: 'gmt_create DESC',
          isDeleteFlag: true,
        }
        this.LoadMediaList(form)

      },
      // 搜索接口
      async LoadMediaList (record) {
        try {
          let data = await api.MediaNumberList(record)
          if (data.code === 200) {
            let dataList = JSON.parse(data.data)
            if (record.tableName === 'md_we_media_number') {
              this.NumberList = dataList.dataList
            } else if (record.tableName === 'md_media_wemeida_platform') {
              this.PlatformList = dataList.dataList
            }
            this.loadingNumber = false;
            this.loadingplatform_id = false;
          }
        }
        catch (e) {
          console.log(e)
        }
      },

      //  行业的二级
      IndustryLoadDataChildren (item, callback) {
        item.loading = true;
        if (item.level === 1) {
          this.LoadMediaIndustryList(item.id, item, callback)
        }
      },
      // 行业
      async LoadMediaIndustryList (record, item, callback) {
        try {
          let data = await api.MediaIndustryList(record)
          if (data.code === 200) {
            let dataList = JSON.parse(data.data)
            if (record === 0) {
              let reduceDataFunc = (data, level) => {
                data.map((m, i) => {
                  m.value = m.id
                  m.label = m.name
                  m.loading = false
                  m.children = []
                  m.level = level
                  if (m.children.length > 0) {
                    reduceDataFunc(m.children, level + 1)
                  }
                })
              }
              reduceDataFunc(dataList, 1)
              this.IndustryList = dataList
            } else {
              let dataList = JSON.parse(data.data)
              let reduceDataFunc = (data, level) => {
                data.map((m, i) => {
                  m.value = m.id
                  m.label = m.name
                })
              }
              reduceDataFunc(dataList, 1)
              item.children = dataList
              item.loading = false;
              callback();
            }
          }
        }
        catch (e) {
          console.log(e)
        }
      },

      // 地域的二级
      AreaLoadDataChildren (item, callback) {
        item.loading = true;
        this.LoadMediaAreaList(item.id, item, callback)
      },

      // 地域
      async LoadMediaAreaList (record, item, callback) {
        try {
          let data = await api.MediaAreaList(record)
          if (data.code === 200) {
            let dataList = JSON.parse(data.data)
            if (record === 0) {
              let reduceDataFunc = (data, level) => {
                data.map((m, i) => {
                  m.value = m.id
                  m.label = m.name
                  m.loading = false
                  m.children = []
                  m.level = level
                  if (m.children.length > 0) {
                    reduceDataFunc(m.children, level + 1)
                  }
                })
              }
              reduceDataFunc(dataList, 1)
              this.AreaList = dataList
            } else {
              let reduceDataFunc = (data, level) => {
                data.map((m, i) => {
                  m.level = m.level + 1
                  if (m.level < 4) {
                    m.value = m.id
                    m.label = m.name
                    m.loading = false
                    m.children = []
                    if (m.children.length > 0) {
                      reduceDataFunc(m.children, level + 1)
                    }
                  } else {
                    m.value = m.id
                    m.label = m.name
                  }
                })
              }
              reduceDataFunc(dataList, 1)
              item.children = dataList
              item.loading = false;
              callback();
            }

          }
        }
        catch (e) {
          console.log(e)
        }
      },

      // 标签的二级
      LabelLoadDataChildren (item, callback) {
        item.loading = true;
        if (item.level === 1) {
          this.LoadMediaLabelList(item.id, item, callback)
        }
      },

      //  标签
      async LoadMediaLabelList (record, item, callback) {
        try {
          let data = await api.MediaLabelList(record)
          if (data.code === 200) {
            let dataList = JSON.parse(data.data)
            if (record === 0) {
              let reduceDataFunc = (data, level) => {
                data.map((m, i) => {
                  m.value = m.id
                  m.label = m.name
                  m.loading = false
                  m.children = []
                  m.level = level
                  if (m.children.length > 0) {
                    reduceDataFunc(m.children, level + 1)
                  }
                })
              }
              reduceDataFunc(dataList, 1)
              this.LabelList = dataList
            } else {
              let reduceDataFunc = (data, level) => {
                data.map((m, i) => {
                  m.value = m.id
                  m.label = m.name
                })
              }
              reduceDataFunc(dataList, 1)
              item.children = dataList
              item.loading = false;
              callback();
            }

          }
        }
        catch (e) {
          console.log(e)
        }
      },


      async LoadData () {
        try {
          let data = await api.MediaDetailsItem({id: this.id, indexCode: 'md_new_wemedia'})
          console.log(data)
        }
        catch (e) {
          console.log(e)
        }
      },
      // 返回
      onBack () {
        this.$router.go(-1)
      },
      // 保存
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            let data = {}
            data = this.formValidate
            data.indexCode = 'md_new_wemedia'
            data.industry = JSON.stringify(data.industry)
            data.cityCode = JSON.stringify(data.cityCode)
            data.tags = JSON.stringify(data.tags)
            console.log(data)
            this.addEditLoadData(data)
          } else {
            this.$Message.error('按要求填写，必填字段');
          }
        })
      },
      // 添加编辑的提交
      async addEditLoadData (record) {
        try {
          let data = await api.MediaDetailsItem(record)
          if (data.code === 200) {
            console.log(data)
          }
        }
        catch (e) {
          console.log(e)
        }
      },
      handleReset (name) {
        this.$refs[name].resetFields();
      },

      getHeight () {
        this.$nextTick(() => {
          let height = this.$refs.CardHeight.clientHeight + 100
          this.CardHeightNum =  height
        })
        return 'calc(100vh - '  + this.CardHeightNum +'px)'
      },
      handleUpload (file) {
        this.file = file;
        console.log(file)
        return false;
      },
      upload () {
        this.loadingStatus = true;
        setTimeout(() => {
          this.file = null;
          this.loadingStatus = false;
          this.$Message.success('Success')
        }, 1500);
      }
    },
    created() {
      this.LoadData()
      this.LoadMediaIndustryList(0) // 行业
      this.LoadMediaAreaList(0) // 地域
      this.LoadMediaLabelList(0) // 标签
      this.LoadMediaNumberList() //自媒体号
      this.LoadMediaPlatformIdList() // 自媒体平台
    },

    mounted() {

    },
    updated() {
    }
  }
</script>

<style lang="scss">
    @import "../css/reset.css";
    .Card {
        i:hover{
            color: #0077CB;
        }
    }
    .ivu-cascader-menu{
        min-width: 200px;
    }
</style>
