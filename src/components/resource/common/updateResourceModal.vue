<template>
    <Form :label-width="150">
      <FormItem label="上传更新文件" prop='title'>
        <Upload 
            ref='upload'
            :data="ApiTransfer('/File/Upload',uploadMessage)"
            :on-success="uploadSuccess"
            :action="ApiTransfer('/File/Upload')"
             style="margin-top:0"  
              >
              <Button  type="ghost" icon="ios-cloud-upload-outline">选择要导入的文件</Button>
            </Upload>
      </FormItem>   
    </Form>
</template>
<script>
    export default {
        data() {
            return {
                baseUrl:baseUrl,
                uploadMessage: {
                    userid: JSON.parse(window.sessionStorage.getItem('bg_user_info')).Id,
                    customType: 'content'
                },
                file: null
            }
        },
        props: ['showModal', ],
        methods: {
            first() {
                this.$refs.upload.clearFiles()
            },
            returnData() {
                console.log(this.updateId)

            },
            uploadSuccess(response, file, fileList) {
                if (fileList.length > 1) {
                    fileList.shift()
                }
                //                console.log(response.Data.Id)
                this.uploadId = response.Data.Id
                //                 console.log(this.uploadId)
                this.$emit('setParentData', response.Data.Id);
            },
        },
        watch: {
            'showModal': {
                handler: function(nv) {
                    this.first();
                },
                deep: true
            },
        }

    }

</script>
<style lang="less">


</style>
