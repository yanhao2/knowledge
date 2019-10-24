<template>
    <div>
      <div>
        <div class="header" style="height: 40px;justify-content: flex-start">
          <Input v-model="formData.search" clearable placeholder="请输入内容搜索" style="width: 200px" @on-enter="onSearch" @on-clear="onClear()"></Input>
          <Button type="primary" style="margin-left: 20px;padding: 5px 14px;" @click="onSearch()">搜索</Button>
        </div>
        <div class="content AllMonitorItemContent" :style="{padding: '20px 10px 10px 10px'}" style="position: relative">
          <div class="rows">
            <div class="rowsItems" style="width: 20%">
              <div class="items" style="" :style="{height: 270 + 'px', overflowY: 'auto'}">
                <div class="rows" style="align-items: center" v-for="(item, index) in data1" :key="index"  :class="isSpinShow1Index === index ? 'active' : ''">
                  <div class="title cols"  style="white-space: nowrap;" @click="onChangeData(item)">
                    {{ item.title }}
                  </div>
                  <div class="forward" style="width: 40px;height: 40px;text-align: center;line-height: 40px;" @click="onDataPush(item, 1, index)">
                    <Icon type="ios-arrow-forward" style="font-size: 16px;" v-show="item.isChildren"/>
                  </div>
                </div>
                <Spin fix  v-if="isSpinShow1">
                  <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                  <div>加载中...</div>
                </Spin>
              </div>
            </div>
            <div class="rowsItems" style="width: 20%">
              <div class="items" style="" :style="{height: 270 + 'px', overflowY: 'auto'}">
                <div class="rows" style="align-items: center" v-for="(item, index) in data2" :key="index" :class="isSpinShow2Index === index ? 'active' : ''">
                  <div class="title cols"  style="white-space: nowrap;" @click="onChangeData(item)">
                    {{ item.title }}
                  </div>
                  <div class="forward" style="width: 40px;height: 40px;text-align: center;line-height: 40px;" @click="onDataPush(item, 2, index)">
                    <Icon type="ios-arrow-forward" style="font-size: 16px;" v-show="item.isChildren"/>
                  </div>
                </div>
                <Spin fix  v-if="isSpinShow2">
                  <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                  <div>加载中...</div>
                </Spin>
              </div>
            </div>
            <div class="rowsItems" style="width: 20%">
              <div class="items" style="" :style="{height: 270 + 'px', overflowY: 'auto'}">
                <div class="rows" style="align-items: center" v-for="(item, index) in data3" :key="index" :class="isSpinShow3Index === index ? 'active' : ''">
                  <div class="title cols"  style="white-space: nowrap;" @click="onChangeData(item)">
                    {{ item.title }}
                  </div>
                  <div class="forward" style="width: 40px;height: 40px;text-align: center;line-height: 40px;" @click="onDataPush(item, 3, index)">
                    <Icon type="ios-arrow-forward" style="font-size: 16px;" v-show="item.isChildren"/>
                  </div>
                </div>
                <Spin fix  v-if="isSpinShow3">
                  <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                  <div>加载中...</div>
                </Spin>
              </div>
            </div>
            <div class="rowsItems" style="width: 20%">
              <div class="items" style="" :style="{height: 270 + 'px', overflowY: 'auto'}">
                <div class="rows" style="align-items: center" v-for="(item, index) in data4" :key="index" :class="isSpinShow4Index === index ? 'active' : ''">
                  <div class="title cols"  style="white-space: nowrap;" @click="onChangeData(item)">
                    {{ item.title }}
                  </div>
                  <div class="forward" style="width: 40px;height: 40px;text-align: center;line-height: 40px;"  @click="onDataPush(item, 4, index)">
                    <Icon type="ios-arrow-forward" style="font-size: 16px;" v-show="item.isChildren"/>
                  </div>
                </div>
                <Spin fix  v-if="isSpinShow4">
                  <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                  <div>加载中...</div>
                </Spin>
              </div>
            </div>
            <div class="rowsItems" style="width: 20%">
              <div class="items" style="" :style="{height: 270 + 'px', overflowY: 'auto'}">
                <div class="rows" style="align-items: center" v-for="(item, index) in data5" :key="index" :class="isSpinShow5Index === index ? 'active' : ''">
                  <div class="title cols" style="white-space: nowrap;" @click="onChangeData(item)">
                    {{ item.title }}
                  </div>
                  <div  class="forward" style="width: 40px;height: 40px;text-align: center;line-height: 40px;" @click="onDataPush(item, 5, index)">
                    <Icon type="ios-arrow-forward" style="font-size: 16px;" v-show="item.isChildren"/>
                  </div>
                </div>
                <Spin fix  v-if="isSpinShow5">
                  <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                  <div>加载中...</div>
                </Spin>
              </div>
            </div>
          </div>
          <Spin fix  v-if="spinShow">
            <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
            <div>加载中...</div>
          </Spin>
        </div>
      </div>
    </div>
</template>

<script>
  export default {
    name: "SetClassification",
    props: ['onChangeDataModal'],
    data() {
      return {
        height: null,
        formData: {},
        spinShow: true,
        isSpinShow1: false,
        isSpinShow2: false,
        isSpinShow3: false,
        isSpinShow4: false,
        isSpinShow5: false,
        isSpinShow1Index: null,
        isSpinShow2Index: null,
        isSpinShow3Index: null,
        isSpinShow4Index: null,
        isSpinShow5Index: null,
        isSpinShow6Index: null,
        data1: [
          {
            title: '爱茉莉太平洋1',
            id: 1,
            isShow: false,
            isActive: true,
            isChildren: true,
            children: [
              {
                title: '爱茉莉太平洋1-1',
                id: 2,
                isShow: false,
                isActive: true,
                isChildren: true,
                children: [
                  {
                    title: '爱茉莉太平洋1-1-1',
                    id: 3,
                    isShow: false,
                    isActive: true,
                    isChildren: true,
                    children: [
                      {
                        title: '爱茉莉太平洋1-1-1-1',
                        id: 4,
                        isShow: false,
                        isActive: true,
                        isChildren: true,
                        children: [
                          {
                            title: '爱茉莉太平洋1-1-1-1-1',
                            id: 5,
                            isShow: false,
                            isActive: true,
                            isChildren: false,
                          },
                        ]
                      },
                    ]
                  },
                  {
                    title: '爱茉莉太平洋1-1-2',
                    id: 6,
                    isShow: false,
                    isActive: true,
                    isChildren: false,
                  },
                ],
              },
              {
                title: '爱茉莉太平洋1-2',
                id: 7,
                isShow: false,
                isActive: true,
                isChildren: false,
              },
            ],
          },
          {
            title: '爱茉莉太平洋2',
            id: 8,
            isShow: false,
            isActive: true,
            isChildren: true,
            children: [
              {
                title: '爱茉莉太平洋2-1',
                id: 9,
                isShow: false,
                isActive: true,
                isChildren: false,
              },
              {
                title: '爱茉莉太平洋2-2',
                id: 10,
                isShow: false,
                isActive: true,
                isChildren: false,
              },
            ],
          }
        ],
        data3: [],
        data4: [],
        data5: [],
        data2: [],
        isData1: null,
        isData2: null,
        isData3: null,
        isData4: null,
        isData5: null,
      };
    },
    computed: {},
    methods: {
      // 点击某一项的
      onChangeData (record) {
        this.$emit('onChangeDataModal', record)
      },
      // 删除
      onDelete () {
        this.$Modal.confirm({
          title: '提示',
          content: '<p style="font-weight: bold;">此操作将删除该节点, 是否继续?</p>',
          onOk: () => {
            this.$Message.info('Clicked ok');
          },
          onCancel: () => {
            this.$Message.info('Clicked cancel');
          }
        });
      },
      // 跳转创建监测项
      AddMonitorItem () {
        this.onClose()
        this.$router.push({path: '/AddMonitorItem'})
      },
      // 跳转编辑监测项
      editMonitorItem (record) {
        this.onClose()
        this.$router.push({path: `/editMonitorItem/${record.id}`})
      },
      // 拖拽事件
      log (evt) {
        window.console.log(evt)
      },
      // 关闭弹窗
      onClose () {
        this.data3 = []
        this.data4 = []
        this.data5 = []
        this.data2 = []
        this.isSpinShow1Index = null
        this.isSpinShow2Index = null
        this.isSpinShow3Index = null
        this.isSpinShow4Index = null
        this.isSpinShow5Index = null
        this.isSpinShow6Index = null
      },
      // 搜索
      onSearch () {
        if (!this.formData.search) {
          this.$Message.error({
            background: true,
            content: '请输入你要搜索的内容'
          });
        } else {
          this.$Notice.info({
            title: '调用接口',
            desc:  '调用接口'
          });
        }
      },
      onClear () {
        this.$Notice.info({
          title: '调用接口',
          desc:  '调用接口'
        });
      },
      LoadDta () {
        setTimeout(() => {
          this.spinShow = false
        }, 2700)
      },
      onDataPush (item, index, record) {
        if (index === 1) {
          if (item.isChildren) {
            this.isSpinShow2 = true
            this.isSpinShow1Index = record
            this.data2 = this.data1[this.isSpinShow1Index].children
          }
          setTimeout(() => {
            this.isSpinShow2 = false
          }, 1000)
        } else if (index === 2) {
          if (item.isChildren) {
            this.isSpinShow3 = true
            this.isSpinShow2Index = record
            this.data3 = this.data1[this.isSpinShow1Index].children[this.isSpinShow2Index].children
          }
          setTimeout(() => {
            this.isSpinShow3 = false
          }, 1000)
        } else if (index === 3) {
          if (item.isChildren) {
            this.isSpinShow3Index = record
            this.isSpinShow4 = true
            this.data4 = this.data1[this.isSpinShow1Index].children[this.isSpinShow2Index].children[this.isSpinShow3Index].children
          }
          setTimeout(() => {
            this.isSpinShow4 = false
          }, 1000)
        } else if (index === 4) {
          if (item.isChildren) {
            this.isSpinShow4Index = record
            this.isSpinShow5 = true
            this.data5 = this.data1[this.isSpinShow1Index].children[this.isSpinShow2Index].children[this.isSpinShow3Index].children[this.isSpinShow4Index].children
          }
          setTimeout(() => {
            this.isSpinShow5 = false
          }, 1000)
        } else if (index === 5) {
          this.isSpinShow5Index = record
        }
      }
    },
    created() {
      this.LoadDta()
    },

    mounted() {
      const that = this
      window.onresize = () => {
        return (() => {
          let height = document.documentElement.clientHeight
          that.height = height
        })()
      }
    },
    updated() {
    }
  }
</script>

<style scoped>

</style>
