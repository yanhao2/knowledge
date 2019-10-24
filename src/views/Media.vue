<template>
    <div class="Monitor">
        <div style="width: 100%;height: calc(100vh - 70px);">
            <div ref="CardHeight">
                <Card shadow class="Card padding">
                    <div class="CardindustryFlex">
                        <div class="rows alignCenter" v-show="false">
                            <DatePicker :value="create_time" v-model="create_time" format="yyyy-MM-dd HH:mm:ss" type="datetimerange"
                                        placement="bottom-start" placeholder="请选择添加时间段"
                                        style="width: 260px"></DatePicker>
                        </div>

                        <div class="rows alignCenter">
                            <Select
                                    placeholder="全部自媒体平台"
                                    v-model="formData.platform_id"
                                    filterable
                                    remote
                                    clearable
                                    style="width: 260px">
                                <Option v-for="(option, index) in PlatformList" :value="option.id" :key="index">{{option.name}}</Option>
                            </Select>
                        </div>
                        <div class="rows alignCenter">
                            <Cascader :data="IndustryList" placeholder="全部行业" clearable style="width: 260px" filterable v-model="industry" :load-data="IndustryLoadDataChildren" change-on-select></Cascader>
                        </div>
                        <div class="rows alignCenter">
                            <Cascader :data="LabelList"  placeholder="全部标签" clearable style="width: 260px" filterable v-model="tags" :load-data="LabelLoadDataChildren" change-on-select></Cascader>
                        </div>
                        <div class="rows alignCenter">
                            <Cascader :data="AreaList" placeholder="全部地域" style="width: 260px"  v-model="cityCode" :load-data="AreaLoadDataChildren" change-on-select ></Cascader>
                        </div>
                        <div class="rows alignCenter">
                            <Select v-model="formData.lastUserId" placeholder="最后操作人" clearable style="width: 260px">
                                <Option v-for="item in LastList" :value="item.id" :key="item.id">{{ item.name }}({{item.mobilePhone}})
                                </Option>
                            </Select>
                        </div>
                        <div class="rows alignCenter">
                            <Select v-model="formData.state" placeholder="" style="width: 260px">
                                <Option value="100">全部审核状态</Option>
                                <Option value="1">已审核</Option>
                                <Option value="0">未审核</Option>
                            </Select>
                        </div>
                        <div class="rows alignCenter">
                            <Select v-model="formData.isCrawl" placeholder="" style="width: 260px">
                                <Option value="100">全部采集状态</Option>
                                <Option value="1">采集</Option>
                                <Option value="0">未采集</Option>
                            </Select>
                        </div>
                        <div class="rows alignCenter">
                            <Select v-model="onShow" slot="prepend" placeholder="" style="width: 90px">
                                <Option value="0">账号名称</Option>
                                <Option value="1">自媒体号</Option>
                            </Select>
                            <Input v-if="onShow == '0'" v-model="formData.name" placeholder="" clearable style="width: 170px;" class="onShowNameClass"/>
                            <Select v-else placeholder=""
                                    v-model="formData.number_id"
                                    filterable
                                    remote
                                    clearable
                                    :remote-method="LoadMediaNumberList"
                                    :loading="loadingNumber" style="width: 170px;" class="onShowNameClass">
                                <Option  v-for="(option, index) in NumberList" :value="option.id" :key="index">{{option.name}}</Option>
                            </Select>
                        </div>
                        <div class="rows alignCenter" v-show="false">

                        </div>
                        <div class="rows alignCenter">
                            <Button type="primary" icon="ios-search" @click="onReset()">重置搜索</Button>
                            <Button type="primary" icon="ios-search" style="margin-left: 15px" @click="onSearch()">搜索</Button>
                        </div>
                    </div>
                    <div class="CardindustryFlex">
                        <div class="rows alignCenter" style="padding-bottom: 0">
                            <Button type="primary" @click="onMediaEdit({})">添加</Button>
                        </div>
                        <div class="rows alignCenter" style="padding-bottom: 0">
                            <Button type="primary">删除</Button>
                        </div>
                        <div class="rows alignCenter" style="padding-bottom: 0">
                            <Button type="primary">审核</Button>
                        </div>
                        <div class="rows alignCenter" style="padding-bottom: 0">
                            <Button type="primary">添加任务</Button>
                        </div>
                        <div class="rows alignCenter" style="padding-bottom: 0">
                            <Button type="primary">导出</Button>
                        </div>
                        <div class="rows alignCenter" style="padding-bottom: 0">
                            <Button type="primary">导出记录</Button>
                        </div>
                    </div>
                </Card>
            </div>
            <div :style="{width: '100%'}" class="BottomCard">
                <Card shadow class="Card top">
                    <Table :height="this.getHeight()" :loading="loading" highlight-row ref="currentRowTable" @on-current-change="onCurrentChange" :columns="columns" :data="dataList"
                           style="width: 100%">
                        <template slot-scope="{ row, index }" slot="status">
                            <div>{{ Number(row.state) === 0 ? '未审核'  : '已审核'}}</div>
                        </template>
                        <template slot-scope="{ row, index }" slot="action">
                            <div class="TableAction">
                                <Icon type="ios-add-circle-outline" style="margin-right: 5px;font-size: 25px;" />
                                <Icon type="ios-create-outline" style="margin-right: 5px;font-size: 25px;" @click="onMediaEdit(row, index)"/>
                                <Icon type="ios-trash-outline" style="margin-right: 5px;font-size: 25px;" @click="onDetele(row, index)"/>
                                <Icon type="md-list" style="font-size: 25px;"/>
                            </div>
                        </template>
                    </Table>
                    <Page class="padding-layout text-center"
                          :total="formData.total" :current="formData.pageNum"
                          :page-size="formData.pageSize"
                          :page-size-opts="[20, 50, 100]"
                          show-total  show-sizer
                          @on-change="onChangePage"
                          @on-page-size-change="onChangePageSize">
                    </Page>
                </Card>
            </div>
        </div>
    </div>
</template>

<script>
  import api from "../api/api";
  import {formatTs} from '../moment/index'
  export default {
    name: "Monitor",
    data() {
      return {
        CardHeightNum: null,
        winWidth: null,
        mediaPlatformList: [],
        dataList: [],
        IndustryList: [],
        LabelList: [],
        AreaList: [],
        NumberList: [],
        AllianceList: [],
        PlatformList: [],
        create_time: [],
        industry: [],
        cityCode: [],
        tags: [],
        LastList: [],
        onShow: '0',
        loading: false,
        loadingNumber: false,
        loadingAlliance: false,
        loadingplatformId: false,
        modelNumber: '',
        modelAlliance: '',
        MediaItem: {name: '全部'},
        EmotionalItem: {name: '全部'},
        formData: {
          indexCode: 'md_new_wemedia',
          pageNum: 1,
          pageSize: 20,
          number_id: '',
          total: null,
          isCrawl: '100',
          state: '100',
          fansNumber: '',
          fansNumberCodin: '0',
          platform_id: '',
          startTime: '',
          endTime: '',
          lastUserId: '',
        },
      };
    },
    computed: {
      columns () {
        let columns = [];
        columns.push({
          type: 'index',
          width: 70,
          align: 'center',
          title: '序号',
        })
        columns.push({
          align: 'center',
          title: '编码',
          key: 'id',
          sortable: true,
        });
        columns.push({
          title: '账号名称',
          align: 'center',
          key: 'name',
        });
        columns.push({
          title: '自媒体平台',
          align: 'center',
          key: 'platformName',
        });
        columns.push({
          title: '自媒体号',
          align: 'center',
          key: 'numberName',
          sortable: true,
        });
        columns.push({
          title: '账号粉丝量',
          align: 'center',
          sortable: true,
          key:'fansNumber'
        });
        columns.push({
          title: '行业',
          key: 'lastIndustryName',
          align: 'center',
        });
        columns.push({
          title: '所在地',
          align: 'center',
          key: 'lastAreaName',
        });
        columns.push({
          title: '最后修改人',
          align: 'center',
          key: 'lastUserName'
        });
        columns.push({
          title: '审核状态',
          slot: 'status',
          align: 'center',
          filters: [
            {
              label: '未审核',
              value: 0
            },
            {
              label: '已审核',
              value: 1
            },
          ],
          filterMultiple: false,
          filterMethod(value, row) {
            if (value === 0) {
              return Number(row._source.state) === 0;
            } else if (value === 1) {
              return Number(row._source.state) === 1;
            }
          }
        });
        columns.push({
          width: 260,
          title: '操作',
          slot: 'action',
          align: 'center',
        });
        return columns;
      },
    },
    methods: {
      formatTs: formatTs,
      onChangePage (page) {
        this.formData.pageNum = page
        this.LoadData()
      },
      // 数据个数
      onChangePageSize (size) {
        this.formData.pageSize = size
        this.LoadData()
      },
      // 获取列表数据
      async LoadData() {
        try {
          this.loading = true
          this.formData.industry = JSON.stringify(this.industry)
          this.formData.cityCode = JSON.stringify(this.cityCode)
          this.formData.tags = JSON.stringify(this.tags)
          let result = await api.MediaTableList(this.formData)  // 列表数据
          if (result.code === 200) {
            let data = JSON.parse(result.data)
            this.formData.total = Number(data.total)
            this.dataList = data.hits
          } else {
            this.$Message.error(result.msg);
          }
          this.loading = false
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
      // 行业 接口
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
      // 删除
      onDetele (record) {
        this.$Modal.confirm({
          title: '提示',
          content: '<p style="font-weight: bold;">此操作将删除该节点, 是否继续?</p>',
          onOk: () => {
            this.LoadMediaDeteleList(record)
          },
          onCancel: () => {
          }
        });
      },
      // 删除接口
      async LoadMediaDeteleList (record) {
        try {
          let result = await api.MediaDeteleList({user_id: record.id})
          if (result.code === 200) {
            this.$Message.success('删除成功');
            this.LoadData()
          } else {
            this.$Message.error(result.msg);
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

      // 地域 接口
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
      // 标签 接口
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
      // 自媒体号 搜索
      LoadMediaNumberList (query) {
        console.log(query)
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
      // 自媒体平台 搜索
      LoadMediaPlatformIdList (query) {
          let form = {
            pageNum: 1,
            pageSize: 1000,
            tableName: 'md_media_wemeida_platform',
            orderByClause: 'gmt_create DESC',
            isDeleteFlag: true,
          }
          this.loadingplatformId = true;
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
            } else if (record.tableName === 'md_alliance') {
              this.AllianceList = dataList.dataList
            } else if (record.tableName === 'md_media_wemeida_platform') {
              this.PlatformList = dataList.dataList
            }
            this.loadingNumber = false;
            this.loadingAlliance = false;
            this.loadingplatformId = false;
          }
        }
        catch (e) {
          console.log(e)
        }
      },
      // 最后操作人
      async LoadMediaLastList () {
        try {
          let data = await api.MediaLastList('mediaManager_md_query')
          if (data.code === 200) {
            let dataList = JSON.parse(data.data)
            this.LastList = dataList
          }
          console.log(data)
        }
        catch (e) {
          console.log(e)
        }
      },
      // 搜索
      onSearch () {
        this.LoadData()
      },
      // 重置搜索
      onReset () {
        this.formData.indexCode = 'md_new_wemedia'
        this.formData.pageNum = 1
        this.formData.pageSize = 15
        this.formData.number_id = null
        this.formData.industry = []
        this.formData.fansNumberCodin = '0'
        this.formData.fansNumber = ''
        this.formData.platform_id = ''
        this.formData.startTime = ''
        this.formData.endTime = ''
        this.formData.lastUserId = ''
        this.create_time = []
        this.tags = []
        this.cityCode = []
        this.industry = []
        this.formData.state = '100'
        this.formData.isCrawl = '100'
      },

      // 添加和编辑
      onMediaEdit(record) {
        console.log(record)
        if (record.id) {
          this.$router.push({path: '/mediaEdit', query: {id: record.id}})
        } else {
          this.$router.push({path: '/mediaEdit'})
        }
      },

      getHeight() {
        let height
        if (this.CardHeightNum) {
            height =  this.CardHeightNum
        } else {
            this.winSize()
            height =  this.CardHeightNum
        }
        return height
      },

      winSize () {
        this.$nextTick(() => {
          let winHeight = document.documentElement.clientHeight
          let height = this.$refs.CardHeight.clientHeight + 80
          this.CardHeightNum = winHeight - height - 60
        })
      },

      // 选中的某一行表格
      onCurrentChange (currentRow, oldCurrentRow) {
        console.log('选中的某一行表格', currentRow)
      }
    },
    created() {
      this.LoadData() // 列表
      this.LoadMediaIndustryList(0) // 行业
      this.LoadMediaAreaList(0) // 地域
      this.LoadMediaLabelList(0) // 标签
      this.LoadMediaLastList() // 最后操作人
      this.LoadMediaPlatformIdList() // 自媒体平台 搜索
    },

    mounted() {
      this.winSize()
    },
    updated() {
    }
  }
</script>

<style lang="scss">
    @import "../css/reset.css";

    .Monitor {
        .onShowNameClass{
            .ivu-input, .ivu-select-selection{
                border-left: 0px;
            }

        }
        .TableAction {
            i {
                cursor: pointer;
            }
            i:hover{
                color: #0077CB;
            }
        }
        .ivu-table-cell{
            .ivu-table-sort, .ivu-table-filter{
                i{
                    color: #fff;
                }
            }
        }
        .ivu-table-tip {
            overflow-x: hidden;
        }
        .padding{
            .ivu-card-body{
                padding-top: 0;
                padding-bottom: 15px;
            }
        }
        .padding-layout{
            padding: 10px;
            text-align: right;
        }
        .ivu-table-overflowX {
            overflow-x: hidden;
        }

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
            padding: 0;
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
    .ivu-select-single .ivu-select-selection .ivu-select-placeholder{
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
    .ivu-select-input::-moz-placeholder, .ivu-input::-moz-placeholder  { /* Mozilla Firefox 19+ */
        color: #515a6e;
        font-size: 14px;
    }
    .ivu-select-input:-ms-input-placeholder, .ivu-input:-ms-input-placeholder {
        color: #515a6e;
        font-size: 14px;
    }

</style>
