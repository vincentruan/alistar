<template>
  <div class="app-container">
    <div class="block">
      <el-form
        ref="form"
        :model="form"
      >
        <el-input
          ref="content"
          v-model="form.content"
          type="hidden"
        />
        <el-row :gutter="20">
          <el-col :span="24">
            <el-button
              icon="el-icon-plus"
              size="mini"
              type="primary"
              @click="save"
            >
              {{ $t('button.submit') }}
            </el-button>
            <el-button
              icon="el-icon-back"
              size="mini"
              @click.native="back"
            >
              {{ $t('button.back') }}
            </el-button>
          </el-col>
          <el-col :span="12">
            <el-row :gutter="20">
              <el-col :span="24">
                <el-input
                  v-model="form.title"
                  minlength="1"
                  placeholder="文章标题"
                  style="font-size: 1.2rem;margin:.2rem 0rem;"
                />
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-select
                  v-model="form.idChannel"
                  placeholder="选择栏目"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-col>
              <el-col :span="16">
                <el-input
                  v-model="form.author"
                  minlength="1"
                  placeholder="作者"
                  style="margin-bottom:.2rem;"
                />
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-form-item
              v-if="ifUpload"
              label="题图"
            >
              <el-upload
                class="upload-demo"
                drag
                :action="uploadUrl"
                :headers="uploadHeaders"
                :before-upload="handleBeforeUpload"
                :on-success="handleUploadSuccess"
              >
                <i class="el-icon-upload" />
                <div class="el-upload__text">
                  上传图片
                </div>
              </el-upload>
            </el-form-item>
            <img
              v-if="ifUpload!==true"
              :src="articleImg"
              style="height:8rem;"
            >
            <el-button
              v-if="ifUpload!==true"
              icon="el-icon-edit"
              @click.native="uploadImg"
            >
              修改题图
            </el-button>
          </el-col>
        </el-row>
        <br>
      </el-form>
      <div
        :class="{fullscreen:fullscreen}"
        class="tinymce-container editor-container"
      >
        <textarea
          :id="tinymceId"
          class="tinymce-textarea"
        />
        <div class="editor-custom-btn-container">
          <editorImage
            color="#1890ff"
            class="editor-upload-btn"
            @successCBK="imageSuccessCBK"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./edit.js"></script>

<style scoped>
  .tinymce-container {
    position: relative;
    line-height: normal;
  }

  .tinymce-container >>> .mce-fullscreen {
    z-index: 10000;
  }

  .tinymce-textarea {
    visibility: hidden;
    z-index: -1;
  }

  .editor-custom-btn-container {
    position: absolute;
    right: 4px;
    top: 4px;
    /*z-index: 2005;*/
  }

  .fullscreen .editor-custom-btn-container {
    z-index: 10000;
    position: fixed;
  }

  .editor-upload-btn {
    display: inline-block;
  }
</style>
