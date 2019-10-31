<template>
    <div>
      <Modal
        ref="ModalLog"
        v-model="isOperationLogModal"
        class-name="vertical-center-modal" width="60">
        <p slot="header">
          <span>操作日志</span>
        </p>
        <p slot="close"  @click="onCloseModal">
          <Icon type="md-close" style="font-size: 20px;margin-top: 5px"/>
        </p>
        <Table border :columns="columns" :data="dataList" :loading="loading" height="300"></Table>
        <div slot="footer">
          <Button type="primary"  @click="onCloseModal">关闭</Button>
        </div>
      </Modal>
    </div>
</template>

<script>
import api from '../api/api'
    export default {
      name: 'OperationLogModal',
      props: ['isOperationLogModal', 'onCloseModalEvent'],
      data () {
        return {
          loading: false,
          dataList: [],
          columns: [
            {
              title: '操作人',
              key: 'userName'
            },
            {
              title: '处理时间',
              key: 'createTime'
            },
            {
              title: '操作名称',
              key: 'opertionName'
            }
          ],
        }
      },
      computed: {

      },
      methods: {
        async LoadData (record) {
          try{
            let data = {
              pageNum: 1,
              pageSize: 20,
              code: 'md_new_wemedia',
              id: record
            }
            let result = await api.MediaOperationLogList(data)
            if (result.code === 200) {
              this.dataList = JSON.parse(result.data)
            }
          }
          catch (e) {
            console.log(e)
          }
        },
        onCloseModal () {
          this.$emit('onCloseModalEvent')
        }
      },
      created () {
      },
      mounted () {
      },
      updated () {
      }
    }
</script>

<style lang="scss">
  .vertical-center-modal{
    display: flex;
    align-items: center;
    justify-content: center;
    .ivu-modal-content{
      border-radius: 0;
    }
    .ivu-modal{
      top: 0;
    }
  }
</style>
