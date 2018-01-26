<template>
    <Form :model="copyRightData" :label-width="150" >
<!--
      <FormItem label="是否有版权" prop='hasCopyRight'>
        <RadioGroup v-model="copyRightData.hasCopyRight">
            <Radio label="1">是</Radio>
            <Radio label="0">否</Radio>
        </RadioGroup>
      </FormItem>
-->

      <FormItem label="是否有电子版权" prop='hasElectronCopyRight'>
        <RadioGroup v-model="copyRightData.hasElectronCopyRight">
            <Radio label="1">是</Radio>
            <Radio label="0">否</Radio>
        </RadioGroup>
      </FormItem>

    </Form>
</template>
<script>
    export default {
        data() {
            return {
                //验证规则
                activityDesc: '新书上架，8折起！'
            }
        },
        props: ['copyRightData'],
        methods: {
            returnData() {
                this.$emit('setParentData', this.copyRightData);
            },

            change(status) {

            }
        },

        watch: {
            'copyRightData': {
                handler: function(nv) {
                    this.returnData();
                },
                deep: true
            },
        }
    }

</script>
<style lang="less">


</style>
