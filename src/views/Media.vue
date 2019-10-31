<template>
    <div class="Monitor" style="position: relative">
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
                          <Cascader :data="IndustryList" placeholder="全部行业" clearable style="width: 260px" filterable v-model="industry" change-on-select></Cascader>
                      </div>
                      <div class="rows alignCenter">
                          <Cascader :data="LabelList"  placeholder="全部标签" clearable style="width: 260px" filterable v-model="tags" change-on-select></Cascader>
                      </div>

                      <div class="rows alignCenter">
                          <Cascader :data="AreaList" placeholder="全部地域" style="width: 260px"  v-model="cityCode" :load-data="AreaLoadDataChildren" change-on-select ></Cascader>
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
                        <Select v-model="formData.isIpr" placeholder="" style="width: 260px">
                          <Option value="100">全部评估状态</Option>
                          <Option value="1">已评估</Option>
                          <Option value="0">未评估</Option>
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
                      <div class="rows alignCenter">
                          <Button type="primary" icon="ios-search" @click="onReset()">重置搜索</Button>
                          <Button type="primary" icon="ios-search" style="margin-left: 15px" @click="onSearch()">搜索</Button>
                      </div>
                  </div>
                  <div class="CardindustryFlex">
                      <div class="rows alignCenter" style="padding-bottom: 0">
                          <Button type="primary" @click="onMediaEdit({})"> <Icon type="md-add" size="16" style="padding-right: 5px;"/>添加</Button>
                      </div>
                      <div class="rows alignCenter" style="padding-bottom: 0" @click="onListDetele">
                          <Button type="primary"> <Icon type="ios-trash" size="16" style="padding-right: 5px;"/>删除</Button>
                      </div>
                      <div class="rows alignCenter" style="padding-bottom: 0" @click="onReviewList">
                          <Button type="primary"> <Icon type="ios-checkmark-circle-outline" size="16" style="padding-right: 5px;"/>审核</Button>
                      </div>
                      <div class="rows alignCenter" style="padding-bottom: 0" v-show="false">
                          <Button type="primary">添加任务</Button>
                      </div>
                      <div class="rows alignCenter" style="padding-bottom: 0"  v-show="false">
                          <Button type="primary">导出</Button>
                      </div>
                      <div class="rows alignCenter" style="padding-bottom: 0" v-show="false">
                          <Button type="primary">导出记录</Button>
                      </div>
                  </div>
              </Card>
          </div>
          <div :style="{width: '100%'}" class="BottomCard">
              <Card shadow class="Card top" style="position: relative">
                <Table  @on-selection-change="selectChange" ref="currentRowTable" :columns="columns" :data="dataList" :width="getWidth()"
                       style="width: 100%">
                    <template slot-scope="{ row, index }" slot="status">
                        <div>{{ row.state == 'r_0' ? '未审核'  : '已审核'}}</div>
                    </template>
                    <template slot-scope="{ row, index }" slot="action">
                        <div class="TableAction">
                            <Icon type="ios-add-circle-outline"  style="margin-right: 5px;font-size: 25px; color: #0077CB" v-show="false"/>
                            <Icon type="ios-create-outline" style="margin-right: 5px;font-size: 25px; color: #0077CB" @click="onMediaEdit(row, index)"/>
                            <Icon type="ios-trash-outline" style="margin-right: 5px;font-size: 25px; color: #0077CB" @click="onDetele(row, index)"/>
                            <Icon type="md-list" style="font-size: 25px; color: #0077CB" @click="OnOperationLogModal(row, index)"/>
                        </div>
                    </template>
                </Table>
                <Page class="padding-layout text-center"
                      :total="formData.total" :current="formData.pageNum"
                      :page-size="formData.pageSize"
                      :page-size-opts="[15, 30, 50, 100]"
                      show-total  show-sizer
                      @on-change="onChangePage"
                      @on-page-size-change="onChangePageSize">
                </Page>
                <Spin fix v-show="loading">
                  <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                  <div>拼命加载中...</div>
                </Spin>
              </Card>
          </div>
      </div>
      <OperationLogModal
        ref="OperationLogModalRef"
        :isOperationLogModal="isOperationLogModal"
        @onCloseModalEvent="onCloseModal"
      />
      <Modal v-model="isMediaEdit" :class="isActive ? 'MediaEdit' : 'MediaEditIs'" footer-hide  fullscreen>
        <p slot="header">
          <span>{{ModalTitle}}</span>
        </p>
        <p slot="close"  @click="onCloseModalEdit">
          <Icon type="md-close" style="font-size: 20px;margin-top: 5px"/>
        </p>
        <MediaEdit
          :formValidate="formValidate"
          :id="id"
          :IndustryList="IndustryList"
          :LabelList="LabelList"
          :NumberList="NumberList"
          :AreaList="AreaList"
          :PlatformList="PlatformList"
          :loadingNumber="loadingNumber"
          :loadingCompany="loadingCompany"
          :cityName="cityName"
          :industryName="industryName"
          :AuthenticationTypeList="AuthenticationTypeList"
          :AuthenticationCompanyList="AuthenticationCompanyList"
          @LoadMediaNumberListEvent="LoadMediaNumberList"
          @AreaLoadDataChildrenEvent="AreaLoadDataChildren"
          @onCloseModalEvent="onCloseModalEdit"
          @LoadDataEditEvent="LoadDataEdit"
          @LoadMediaAuthenticationTypeListCompanyEvent="LoadMediaAuthenticationTypeListCompany"
        />
      </Modal>
    </div>
</template>

<script>
  import api from "../api/api";
  import {formatTs} from '../moment/index'
  import OperationLogModal from '../components/OperationLogModal'
  import MediaEdit from '../components/MediaEdit'
  export default {
    props: ['isActive'],
    name: "Monitor",
    components: {OperationLogModal, MediaEdit},
    data() {
      return {
        CardHeightNum: null,
        cityName: '请选择地域',
        industryName: '请选择所属行业',
        isOperationLogModal: false,
        tableIndex: null,
        isMediaEdit: false,
        ModalTitle: '',
        formItem: {},
        dataList: [],
        IndustryList: [],
        LabelList: [],
        AreaList: [],
        NumberList: [],
        AllianceList: [],
        PlatformList: [],
        create_time: [],
        AuthenticationTypeList: [],
        AuthenticationCompanyList: [],
        industry: [],
        cityCode: [],
        tags: [],
        LastList: [],
        selectListCheck: [],
        onShow: '0',
        id: null,
        loading: true,
        loadingNumber: false,
        loadingCompany: false,
        loadingAlliance: false,
        loadingplatformId: false,
        modelNumber: '',
        modelAlliance: '',
        MediaItem: {name: '全部'},
        EmotionalItem: {name: '全部'},
        formData: {
          indexCode: 'md_new_wemedia',
          pageNum: 1,
          pageSize: 15,
          number_id: '',
          total: null,
          isCrawl: '100',
          state: '100',
          isIpr: '100',
          fansNumber: '',
          fansNumberCodin: '0',
          platform_id: '',
          startTime: '',
          endTime: '',
          lastUserId: '',
          name: '',
        },
        formValidate: {
          platform_id: '',
          gender: 0,
          user_name: '',
          user_id: '',
          avatar_url: '',
          personal_url: '',
          isverified: 1,
          verified_type: '',
          verified_name: '',
          friends_count: null,
          followers_count: '',
          statuses_count: '',
          read_count: '',
          like_count: '',
          tags: [],
          flag: 'r_1,d_0',
          cityCode: [],
          corp_id: '',
          number_id: '',
          is_zombie: 0,
          category: '',
          advprice: '',
          industry: [],
          is_crawl: 0,
          is_ipr: 0,
          news_posttime: '',
          note: '',
          description: '',
          corp_name: '请选择关联公司',

        },
      };
    },
    computed: {
      columns () {
        let columns = [];
        columns.push( {
          title: '全选',
          type: 'selection',
          width: 52,
          fixed: 'left',
          align: 'center'
        })
        columns.push({
          type: 'index',
          width: 65,
          align: 'center',
          title: '序号',
        })
        columns.push({
          align: 'center',
          title: '编码',
          key: 'id',
          width: 200,
          sortable: true,
          render: (h, params) => {
            let text = params.row.id;
            return h('div', [
              h('Tooltip', {
                props: {
                  placement: 'top',
                  transfer: true
                }
              },[text,h('div',{
                slot:'content',
                style:{
                  worWrap: 'break-word',
                  whiteSpace: 'normal',
                  wordBreak: 'break-all',
                  textAlign: 'center'
                }
              }, text)
              ])
            ])
          }
        });
        columns.push({
          title: '账号名称',
          align: 'center',
          key: 'user_name',
          width: 200,
        });
        columns.push({
          title: '自媒体平台',
          align: 'center',
          key: 'platform_name',
          width: 180,
        });
        columns.push({
          title: '自媒体号',
          align: 'center',
          key: 'number_name',
          sortable: true,
          width: 200,
        });
        columns.push({
          title: '粉丝量',
          align: 'center',
          sortable: true,
          width: 120,
          key:'followers_count'
        });
        columns.push({
          title: '行业',
          key: 'industry_name',
          align: 'center',
          width: 160,
        });
        columns.push({
          title: '所在地',
          align: 'center',
          key: 'location',
          width: 180,
        });
        columns.push({
          title: '审核状态',
          slot: 'status',
          align: 'center',
          width: 120,
        });
        columns.push({
          title: '操作',
          slot: 'action',
          align: 'center',
          width: 140,
          fixed: 'right',
        });
        return columns;
      },
    },
    methods: {
      getWidth () {
        if (Number(this.formData.total) === 0) {
          return window.innerWidth - this.isActive ? 200 : 50;
        }
      },
      formatTs: formatTs,
      OnOperationLogModal (record, index) {
        this.isOperationLogModal = true
        this.$refs.OperationLogModalRef.LoadData(record.id)
      },

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
          // let industryData = this.industry
          // this.industry = industryData
          let formData = {
            index: 'md_new_wemedia',
            from: (this.formData.pageNum - 1) * this.formData.pageSize,
            sortField: 'id',
            pageSize: this.formData.pageSize,
            fieldList:
              [
                {
                  "name": "user_name",
                  "value": this.onShow === '0' ? this.formData.name : '',
                  "relationOperator": "Equal"
                },
                {
                  "name": "is_zombie",
                  "value": this.formData.state === '100' ? ''  : this.formData.state,
                  "relationOperator": "Equal"
                },
                {
                  "name": "is_crawl",
                  "value": this.formData.isCrawl === '100' ? ''  : this.formData.isCrawl,
                  "relationOperator": "Equal"
                },
                {
                  "name": "platform_id",
                  "value": this.formData.platform_id,
                  "relationOperator": "Equal"
                },
                {
                  "name": "number_id",
                  "value": this.onShow === '0' ? '' : this.formData.number_id,
                  "relationOperator": "Equal"
                },
                {
                  "name": "city_id",
                  "value":this.cityCode[2] ? this.cityCode[2] : '',
                  "relationOperator": "Equal"
                },
                {
                  "name": "country_id",
                  "value": this.cityCode[0] ? this.cityCode[0] : '',
                  "relationOperator": "Equal"
                },
                {
                  "name": "region_id",
                  "value": this.cityCode[3] ? this.cityCode[3] : '',
                  "relationOperator": "Equal"},
                {
                  "name": "province_id",
                  "value": this.cityCode[1] ? this.cityCode[1] : '',
                  "relationOperator": "Equal"
                },
                {
                  "name": "tags",
                  "value": this.tags.length > 0 ? this.tags.join(',') : '',
                  "relationOperator": "Equal"
                },
                {
                  "name": "industry",
                  "value": this.industry.length > 0 ? this.industry[this.industry.length - 1] : '',
                  "relationOperator": "Equal"
                },
                {
                  "name": "is_ipr",
                  "value": this.formData.isIpr === '100' ? ''  : this.formData.isIpr,
                  "relationOperator": "Equal"
                },
                {
                  "name":"flag",
                  "value":"d_0",
                  "relationOperator":"Equal"
                }
              ]
          }
          let result = await api.MediaTableList(formData)  // 列表数据
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


      // 行业 接口
      async LoadMediaIndustryList (record, item, callback) {
        try {
          let record = {
            pageNum: 1,
            pageSize: 50,
            tableName: 'dic_industry',
            isDeleteFlag: true,
            pid: 0,
          }
          let data = await api.MediaIndustryList(record)
          if (data.code === 200) {
            let dataList = JSON.parse(data.data)
            let reduceDataFunc = (data, level) => {
              data.map((m, i) => {
                if (m.children) {
                  m.children = m.children
                } else {
                  m.children = []
                }
                m.value = m.id
                m.label = m.name
                m.level = level
                if (m.children.length > 0) {
                  reduceDataFunc(m.children, level + 1)
                }
              })
            }
            reduceDataFunc(dataList.dataList, 1)
            this.IndustryList = dataList.dataList
          }
        }
        catch (e) {
          console.log(e)
        }
      },

      // 认证类型
      LoadMediaAuthenticationTypeList() {
        let data = {
          tableName: 'md_we_media_category',
          pageNum: 1,
          pageSize: 15,
          isDeleteFlag: false
        }
        this.LoadMediaAuthenticationTypeDataList(data)
      },
      // 关联公司
      LoadMediaAuthenticationTypeListCompany(query) {
        let data = {
          tableName: 'ed_company',
          pageNum: 1,
          pageSize: 15,
          isDeleteFlag: false,
          name: query
        }
        this.loadingCompany = true
        this.LoadMediaAuthenticationTypeDataList(data)
      },

      //  接口
      async LoadMediaAuthenticationTypeDataList(record) {
        try {
          let data = await api.MediaAuthenticationTypeList(record)
          if (data.code === 200) {
            let dataList = JSON.parse(data.data)
            if (record.tableName === 'md_we_media_category') {
              this.AuthenticationTypeList = dataList.dataList
            } else {
              this.AuthenticationCompanyList = dataList.dataList
            }
            this.loadingCompany = false
          }
        } catch (e) {
          console.log(e)
        }
      },
      // 删除
      onDetele (record) {
        this.$Modal.confirm({
          title: '提示',
          content: '<p style="font-weight: bold;">此操作将删除该节点, 是否继续?</p>',
          className: 'operation_css',
          onOk: () => {
            this.LoadMediaDeteleList({id: record.id})
          },
          onCancel: () => {
          }
        });
      },
      //  批量删除
      onListDetele () {
        if (this.selectListCheck.length === 0) {
          this.$Message.error('请先选择你要删除的项');
        } else {
          let data = []
          this.selectListCheck.map((v, i) => {
            data.push(v.id)
          })
          this.LoadMediaDeteleList({id: data.join(',')})
        }
      },
      // 删除接口
      async LoadMediaDeteleList (record) {
        try {
          let result = await api.MediaDeteleList(record)
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
      // 批量审核
      onReviewList () {
        if (this.selectListCheck.length === 0) {
          this.$Message.error('请先选择你要审核的项');
        } else {
          let data = []
          let item = this.isCon(this.selectListCheck, 'r_1')
          if (item) {
            this.$Message.error('您选择的项中已经有审核过了');
          } else {
            this.selectListCheck.find((v, i) => {
              if (v.state != 'r_1') {
                data.push(v.id)
              }
            })
            this.LoadReviewList({id: data.join(','),flag: ["r_1","d_0"]})
          }
        }
      },
      isCon(arr, val){
        for(var i = 0; i<arr.length; i++){
          if(arr[i].state == val)
            return true;
        }
        return false;
      },
      // 批量审核 接口
      async LoadReviewList (record) {
        try {
          let result = await api.MediaReviewList(record)
          if (result.code === 200) {
            this.$Message.success('审核成功');
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

      //  标签 接口
      async LoadMediaLabelList() {
        try {
          let record = {
            pageNum: 1,
            pageSize: 50,
            tableName: 'md_label',
            isDeleteFlag: true,
            pid: 0
          }
          let data = await api.MediaLabelList(record)
          if (data.code === 200) {
            let dataList = JSON.parse(data.data)
            let reduceDataFunc = (data, level) => {
              data.map((m, i) => {
                if (m.children) {
                  m.children = m.children
                } else {
                  m.children = []
                }
                m.value = m.id
                m.label = m.name
                m.loading = false
                m.level = level
                if (m.children.length > 0) {
                  reduceDataFunc(m.children, level + 1)
                }
              })
            }
            reduceDataFunc(dataList.dataList, 1)
            this.LabelList = dataList.dataList
          }
        } catch (e) {
          console.log(e)
        }
      },
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
        this.formData.user_name = ''
        this.formData.platform_id = ''
        this.formData.state = '100'
        this.formData.isCrawl = '100'
        this.formData.isIpr = '100'
        this.formData.number_id = null

      },

      // 添加和编辑
      onMediaEdit(record, index) {
        this.ModalTitle = !record.id ? '自媒体基本信息添加' : '自媒体基本信息编辑'
        this.tableIndex = index
        if (record.id) {
          this.LoadDataEdit(record.id)
          this.id = record.id
        } else {
          this.isMediaEdit = true
        }
      },
      async LoadDataEdit (id) {
        try {
          if (id) {
            let form = {
              index: 'md_new_wemedia',
              from: 0,
              pageSize: 1,
              sortField: 'id',
              fieldList: [{"name": "id", "value": id, "relationOperator": "Equal"}]
            }
            let data = await api.MediaDetailsItem(form)

            if (data.code === 200) {
              let dataList = JSON.parse(data.data)
              let formData = dataList.hits[0]
              console.log('formData=======', formData)
              this.formValidate = formData
              this.formValidate.platform_id = Number(formData.platform_id)
              this.formValidate.corp_id = formData.corp_id
              this.formValidate.number_id = String(formData.number_id)
              this.formValidate.corp_id = String(formData.corp_id)
              this.formValidate.category = String(formData.category)
              this.formValidate.advprice = Number(formData.adv_price)
              this.formValidate.is_ipr = !formData.is_ipr ? 0 : formData.is_ipr
              this.formValidate.news_posttime = this.formatTs(formData.news_posttime, 'YYYY-MM-DD HH:mm:ss')

              if (formData.cityList) {
                this.formValidate.cityList = formData.cityList
              } else {
                let list = []
                if (formData.country_id) {
                  list.push(formData.country_id)
                }
                if (formData.province_id) {
                  list.push(formData.province_id)
                }
                if (formData.city_id) {
                  list.push(formData.city_id)
                }
                if (formData.region_id) {
                  list.push(formData.region_id)
                }
                this.formValidate.cityList = list
              }

              if (formData.country_name) {
                this.cityName = formData.country_name
              }
              if (formData.province__name) {
                this.cityName = formData.country_name + ' / ' + formData.province__name
              }
              if (formData.city_name) {
                this.cityName = formData.country_name + ' / ' + formData.province__name + ' / ' + formData.city_name
              }
              if (formData.region_name) {
                this.cityName = formData.country_name + ' / ' + formData.province__name + ' / ' + formData.city_name + ' / ' + formData.region_name
              }

              this.formValidate.isverified = !formData.isverified ? 1 : formData.isverified
              this.formValidate.flag = formData.flag.join(',')
              let industryList = []
              industryList.push(formData.industry)
              this.formValidate.industryList = industryList

              let industryNameList
              if (formData.industry_name) {
                industryNameList = formData.industry_name.split(',')
                if (industryNameList.length > 1) {
                  this.industryName = formData.industry_name.replace(',', ' / ')
                } else {
                  this.industryName = formData.industry_name
                }
                this.formValidate.industry = []
              } else {
                industryNameList = []
              }
              this.formValidate.corp_name = !formData.corp_name ? '请选择关联公司' : this.formValidate.corp_name
              this.isMediaEdit = true
            }
          }
        } catch (e) {
          console.log(e)
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
      selectChange (currentRow, oldCurrentRow) {
        this.selectListCheck = currentRow
      },
      onCloseModal () {
        this.isOperationLogModal = false
      },
      onCloseModalEdit () {
        if (this.id) {
          this.dataList[this.tableIndex].id = this.formValidate.id
          this.dataList[this.tableIndex].user_name = this.formValidate.user_name
          this.dataList[this.tableIndex].platform_name = this.formValidate.platform_name
          this.dataList[this.tableIndex].number_name = this.formValidate.number_name
          this.dataList[this.tableIndex].followers_count = this.formValidate.followers_count
          this.dataList[this.tableIndex].industry_name = this.formValidate.industry_name
          this.dataList[this.tableIndex].location = this.formValidate.location
          this.dataList[this.tableIndex].state = this.formValidate.state
        }
        this.isMediaEdit = false
      }
    },
    created() {
      this.LoadData() // 列表
      this.LoadMediaIndustryList(0) // 行业
      this.LoadMediaAreaList(0) // 地域
      this.LoadMediaLabelList(0) // 标签
      this.LoadMediaLastList() // 最后操作人
      this.LoadMediaAuthenticationTypeList() // 认证类型
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
    .MediaEdit{
      .ivu-modal-wrap{
        .ivu-modal-content{
          .ivu-modal-body{
            padding: 0;
          }
        }
      }

    }
    .MediaEdit{
      .ivu-modal-mask{
        position: fixed;
        overflow: auto;
        top: 50px;
        right: 0px;
        bottom: 0;
        left: 210px;
        background-color: rgb(245, 245, 245);
      }
      .ivu-modal-wrap{
        position: fixed;
        overflow: auto;
        top: 60px;
        right: 15px;
        bottom: 0;
        left: 210px;
      }
    }
    .MediaEditIs{
      .ivu-modal-mask{
        position: fixed;
        overflow: auto;
        top: 50px;
        right: 0px;
        bottom: 0;
        left: 60px;
        background-color: rgb(245, 245, 245);
      }
      .ivu-modal-wrap{
        position: fixed;
        overflow: auto;
        top: 60px;
        right: 15px;
        bottom: 0;
        left: 60px;
      }
    }
    .ivu-modal-wrap{
      display: flex;
      align-items: center;
      .ivu-modal{
        top: 0
      }
    }
    .BottomCard{
      .ivu-table-row{
        .ivu-table-column-center{
          .ivu-table-cell{
            .ivu-tooltip{
              .ivu-tooltip-rel{
                white-space:nowrap;
                overflow:hidden;
                text-overflow:ellipsis;
                width: 200px
              }
            }
          }
        }
      }
    }
    .Monitor {
        .ivu-table td, .ivu-table th{
          height: 38px;
        }
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
                    color: #999;
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
        /*.ivu-table-overflowX {*/
        /*    overflow-x: hidden;*/
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
            padding-top: 0;
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
        /*.ivu-table-sort i{*/
        /*  color: #ddd;*/
        /*}*/
        .ivu-table-sort i.on {
          color: #fff;
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
