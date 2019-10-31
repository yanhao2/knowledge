<template>
  <div class="Monitor Emotional">
    <div style="">
      <Card shadow class="Card" style="">
        <div style="display: flex;justify-content: space-between">
          <div style="width: 190px;margin-right: 10px;height: calc(100vh - 170px);overflow: auto" class="Tree">
            <el-tree
              ref="vueTree"
              :data="IndustryList"
              node-key="id"
              :current-node-key="0"
              @node-click="handleNodeClick"
              :highlight-current="true"
              :expand-on-click-node="false"
            >
              <span class="custom-tree-node" slot-scope="{ node, data }">
                  <span>
                     <i class="el-icon-folder-opened" style="margin-right: 10px;"></i>{{ data.label }}
                  </span>
              </span>
            </el-tree>
          </div>
          <div style="flex-grow: 1;width: 80%;" class="BottomCard EmotionalTable">
            <div style="display: flex;align-items: center;margin-bottom: 10px">
              <Button type="primary" @click="onAdd" style="margin-right: 10px;"> <Icon type="md-add" size="16" style="padding-right: 5px;"/>添加</Button>
              <Input  v-model="formLoad.name" placeholder="" clearable style="width: 200px;"/>
              <Button type="primary" icon="ios-search" style="margin-left: 10px" @click="onSearch()">搜索</Button>
            </div>
            <Table :height="CardHeight" @on-selection-change="selectChange" :loading="loading" ref="currentRowTable" :columns="columns" :data="dataList"
                   style="width: 100%">
              <template slot-scope="{ row, index }" slot="emotionValue">
                <div>{{ row.emotionValue === 1  ? '正面'  : row.emotionValue === 0  ?  '中性' : '负面'}}</div>
              </template>
              <template slot-scope="{ row, index }" slot="category">
                <div>{{ row.category === 'n'  ? '名词'  : row.category === 'v'  ?  '动词' : row.category === 'a'  ?  '形容词' : '拟声词'}}</div>
              </template>
              <template slot-scope="{ row, index }" slot="action">
                <div class="TableAction">
                  <Icon type="ios-create-outline" style="margin-right: 5px;font-size: 25px;" @click="onMediaEdit(row, index)"/>
                  <Icon type="ios-trash-outline" style="margin-right: 5px;font-size: 25px;" @click="onDetele(row, index)"/>
                </div>
              </template>
            </Table>
            <Page class="padding-layout text-center"
                  :total="formLoad.total" :current="formLoad.page"
                  :page-size="formLoad.pageSize"
                  :page-size-opts="[15, 30, 50, 100]"
                  show-total  show-sizer
                  @on-change="onChangePage"
                  @on-page-size-change="onChangePageSize">
            </Page>
          </div>
        </div>
      </Card>
    </div>
    <Modal
      v-model="isAddModal"
      class="addModal"
      :title="EmotionalModalTitle">
      <Form ref="formDate" :model="formDate" :rules="ruleValidate" :label-width="80">
        <FormItem label="名称" prop="name">
          <Input v-model="formDate.name" placeholder="请输入名称"></Input>
        </FormItem>
        <FormItem label="情感值" prop="emotionValue">
          <RadioGroup v-model="formDate.emotionValue">
            <Radio :label="1">负面</Radio>
            <Radio :label="0">中性</Radio>
            <Radio :label="-1">正面</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="词性" prop="category">
          <RadioGroup v-model="formDate.category">
            <Radio label="n">名词</Radio>
            <Radio label="v">动词</Radio>
            <Radio label="a">形容词</Radio>
            <Radio label="o">拟声词</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="行业" prop="industry">
          <Cascader :data="IndustryList"  :disabled="modalName === 'edit'" :placeholder="formDate.industry_name" clearable  filterable v-model="formDate.industry" change-on-select></Cascader>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="handleReset('formDate')" >取消</Button>
        <Button type="primary" @click="handleSubmit('formDate')" style="margin-left: 8px">保存</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import api from '../api/api'
  import {formatTs} from '../moment/index'
  export default {
    name: 'Emotional',
    data() {
      return {
        isAddModal: false,
        EmotionalModalTitle: '',
        IndustryList: [], // 行业
        treeIndex: null,
        treeItem: {},
        tableIndex: null,
        selectTableItem: [],
        modalName: null,
        formDate: {
          name: '',
          emotionValue: 1,
          industry: [],
          category: 'n',
          industry_name: '请选择行业'
        },
        ruleValidate: {
          name: [
            { required: true, message: '名称不能为空', trigger: 'blur' }
          ],
          emotionValue: [
            { type: 'number', required: true, message: '情感值不能为空', trigger: 'change' }
          ],
          category: [
            { required: true, message: '词性不能为空', trigger: 'change' }
          ],
          industry: [
            {required: true, type: 'array', min: 1, message: '所属行业不能为空', trigger: 'change'},
            {type: 'array', message: '所属行业只能是数组', trigger: 'change'}
          ],
        },
        CardHeight: null,
        formLoad: {
          page: 1,
          pageSize: 15,
        },
        dataList: [],
        loading: false
      };
    },
    computed: {
      columns () {
        let columns = [];
        columns.push({
          type: 'index',
          width: 65,
          align: 'center',
          title: '序号',
        })
        columns.push({
          align: 'center',
          title: '名称',
          key: 'name',
        });
        columns.push({
          title: '情感值',
          align: 'center',
          slot: 'emotionValue',
        });
        columns.push({
          title: '词性',
          align: 'center',
          slot: 'category',
        });
        columns.push({
          title: '行业',
          align: 'center',
          key: 'industryId',
          sortable: true,
        });
        columns.push({
          title: '更新时间',
          align: 'center',
          sortable: true,
          key: 'gmtCreate',
          width: 180,
          render: (h, params) => {
            let text = this.formatTs(params.row.gmtCreate);
            return h('div', [
             h('div',{
                slot:'content',
                style:{
                  worWrap: 'break-word',
                  whiteSpace: 'normal',
                  wordBreak: 'break-all',
                  textAlign: 'center'
                }
              }, text)
            ])
          }
        });
        columns.push({
          title: '操作',
          slot: 'action',
          align: 'center',
          width: 140
        });
        return columns;
      },
    },
    methods: {
      formatTs: formatTs,
      // 数据的页数
      onChangePage (page) {
        this.formLoad.page = page
        this.LoadData()
      },
      // 数据个数
      onChangePageSize (size) {
        this.formLoad.pageSize = size
        this.LoadData()
      },
      // 点击某一个节点
      handleNodeClick(data) {
        this.treeItem = data
        this.LoadData()
      },
      // 选中的某一行表格
      selectChange (currentRow, oldCurrentRow) {
        this.selectTableItem = currentRow
      },
      // 编辑
      onMediaEdit (record, index) {
        this.tableIndex = index
        this.formDate = record
        this.modalName = 'edit'
        this.formDate.industry = []
        this.formDate.industry.push(record.industryId)
        this.EmotionalModalTitle = '编辑'
        this.isAddModal = true
      },

      // 添加的弹出框
      onAdd () {
        this.EmotionalModalTitle = '添加'
        this.formDate.name = ''
        this.formDate.emotionValue = 1
        this.formDate.industry = []
        this.formDate.industry.push(this.treeItem.id)
        this.formDate.category = 'n'
        this.formDate.industry_name = '请选择行业'
        this.modalName = 'add'
        this.isAddModal = true
      },
      // 弹出框取消
      handleReset(name) {
        if (this.formDate.id === 0) {
          this.$refs[name].resetFields();
        }
        this.isAddModal = false
      },
      // 弹出框保存
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            let data = {
              category: this.formDate.category,
              emotionValue: this.formDate.emotionValue,
              industryId: this.formDate.industry[this.formDate.industry.length - 1],
              name: this.formDate.name,
              id: this.modalName === 'add' ? 0 :  this.formDate.id
            }
            if (this.modalName === 'add') {
              this.AddLoadData(data)
            } else if (this.modalName === 'edit'){
              data.isDeleteFlag = 0
              this.EditLoadData(data)
            }
          } else {
            this.$Message.error('按要求填写，必填字段');
          }
        })
      },
      // 添加提交
      async AddLoadData (recrod) {
        try {
          let result = await api.EmotionalAdd(recrod)
          if (result.code === 200) {
            this.$Message.success('保存成功');
            this.isAddModal = false
            this.LoadData()
          } else {
            this.$Message.error(result.msg);
          }
        }
        catch (e) {
          console.log(e)
        }
      },
      // 编辑提交
      async EditLoadData (recrod) {
        try {
          let edit = await api.EmotionalEdit(recrod)
          if (edit.code === 200) {
            this.$Message.success('保存成功');
            this.LoadData()
            this.isAddModal = false
          } else {
            this.$Message.error(edit.msg);
          }
        }
        catch (e) {
          console.log(e)
        }
      },
      // 获取列表接口
      async LoadData () {
        try {
          this.loading = true
          this.formLoad.industryId = this.treeItem.id
          let result = await api.EmotionalList(this.formLoad)
          if (result.code === 200) {
            let list = JSON.parse(result.data)
            this.dataList = list.list
            this.formLoad.total = list.total
          }
          this.loading = false
        }
        catch (e) {
          console.log(e)
        }
      },

      winSize () {
        this.$nextTick(() => {
          let winHeight = document.documentElement.clientHeight
          this.CardHeight = winHeight - 220
        })
      },

      // 行业 接口
      async LoadMediaIndustryList () {
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
            this.treeItem = this.IndustryList[0]
            this.$nextTick(() => {
              setTimeout( ()=> {
                this.LoadCurrentKey(1)
              },300)
            })
            this.LoadData()
          }
        }
        catch (e) {
          console.log(e)
        }
      },

      // 默认第一个树
      LoadCurrentKey (index) {
        this.$refs['vueTree'].setCurrentKey(index);
      },
      // 搜素
      onSearch () {
        this.LoadData()
      },
      // 删除
      onDetele (record, index) {
        this.$Modal.confirm({
          title: '提示',
          content: '<p style="font-weight: bold;">此操作将删除该节点, 是否继续?</p>',
          className: 'operation_css',
          onOk: () => {
            let data = {
              category: record.category,
              emotionValue: record.emotionValue,
              industryId: record.industryId,
              name: record.name,
              id: record.id,
              isDeleteFlag: 1
            }
            this.EditLoadData(data)
          },
          onCancel: () => {
          }
        });
      },
    },
    created() {
      this.LoadMediaIndustryList(0) // 行业
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
  .ivu-modal-wrap{
    display: flex;
    align-items: center;
    .ivu-modal{
      top: 0
    }
  }
  .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
    background-color: #0077CB;
    color: #fff;
  }
  .el-tree-node__content:hover{
    background-color: #0077CB;
    color: #fff;
  }
  /*.Card {*/
  /*  i:hover {*/
  /*    color: #0077CB;*/
  /*  }*/
  /*}*/
  .el-tree-node:focus>.el-tree-node__content{
    background-color: #0077CB;
    color: #fff;
  }
  .ivu-input{
    border-radius: 0;
  }

  .formTitle {
    padding-bottom: 10px;
    border-bottom: 1px solid #dcdee2;
    margin-bottom: 10px;
  }

  .ivu-cascader-menu {
    min-width: 200px;
  }
  .EmotionalTable {
    .ivu-table:before{
      height: 0;
    }
    .TableAction {
      i {
        cursor: pointer;
      }

      i {
        color: #0077CB;
      }
      i:hover {
        color: #57a3f3;
      }
    }
  }
  .ivu-table th{
    background-color: #0077CB;
    color: #fff;
  }
  .Monitor {

    .onShowNameClass {
      .ivu-input, .ivu-select-selection {
        border-left: 0px;
      }

    }


    .ivu-table-cell {
      .ivu-table-sort, .ivu-table-filter {
        i {
          /*color: #fff;*/
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


    .ivu-card.ivu-card-shadow:hover {
      box-shadow: none;
    }

    .ivu-input-group-prepend {
      background-color: #fff;
    }

    .ivu-card, .ivu-input, .ivu-select-selection {
      border-radius: 0px;
    }

    .BottomCard {
      .ivu-table-header {
        tr {
          th {
            background-color: #0077CB;
            color: #fff;
            font-weight: inherit;
          }
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
      .Emotional{
        .alignCenter{
          padding-top: 0px;
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
  .Emotional{
    .ivu-table-sort i.on {
      color: #fff;
    }
    .ivu-table-sort i:hover{
      color: #fff;
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
