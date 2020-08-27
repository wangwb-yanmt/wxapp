// pages/add/add.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('chooseMessageFile'),
    // 窗口页面高度
    windowHeight: 0,
    // scroll-view的高度
    scrollViewHeight: 0,
    //表单提交的数据
    formData:{},
    //选择上传的文件
    files: [],
    //企业状态数组
    corpStatusArray: [
      {id:10,text:'在业'},
      {id:11,text:'停业'}
    ],
    //企业状态数组选择的下标，默认不选
    index:-1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 先取出窗口页面高度 windowHeight
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
            windowHeight: res.windowHeight
        });
      }
    });
    // 构造元素选择器
    let query = wx.createSelectorQuery().in(this);
    query.select('#titleRow').boundingClientRect();
    query.select('#buttonRow').boundingClientRect();
    // 执行上面所指定的请求，结果会按照顺序存放于一个数组中，在callback的第一个参数中返回
    query.exec((res) => {
        // 分别取出navbar和header的高度
        let titleRowHeight = res[0].height;
        let buttonRowHeight = res[1].height;
        // 做个减法
        let scrollViewHeight = this.data.windowHeight - titleRowHeight - buttonRowHeight;
        // 算出来之后存到data对象里面
        this.setData({
            scrollViewHeight: scrollViewHeight
        });
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //表单提交
  formSubmit: function (e) {
    //获取表单中的数据
    var formData = e.detail.value;
    //获取上传的文件数据
    let files = this.data.files;
    //校验
    if(files.length==0){
      wx.showToast({
        title: '文件不能为空',
        icon:'none',
        duration:2000
      })
      return;
    }
    //提交表单数据
    wx.request({
      url: 'http://192.168.120.208:7777/TestController/lookFormData',
      method: 'POST',
      data: formData,
      header:{
        'content-type': 'application/x-www-form-urlencoded'
      },
      success:function(res){
        var data = res.data;
        if(data.success){
          wx.showToast({
            title: '提交成功',
            icon:'success',
            success:function(){
              setTimeout(function () {
                //要延时执行的代码
                wx.navigateBack({
                  delta: 0
                })
              }, 1000)
            }
          })
        } else {
          wx.showToast({
            title: '提交失败'
          })
        }
      }
    })
  },
  //表单重置
  formReset: function (e) {
    console.log('form发生了reset事件，携带数据为：', e.detail.value)
    this.setData({
      index:-1
    });
  },
  //选择文件并展示
  chooseFile:function() {
    var that = this;
    let files = that.data.files;
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success (res) {
        console.log(res.tempFiles[0]);
        let fileName = res.tempFiles[0].name;//文件名
        let filePath = res.tempFiles[0].path;//文件本地临时路径
        let fileSize = res.tempFiles[0].size;//文件字节大小
        if(fileName.indexOf(".pdf")<0){
          wx.showToast({
            title: '上传文件必须为pdf文件格式',
            icon:'none',
            duration:2000
          })
          return;
        }
        //上传
        wx.uploadFile({
          url: 'http://192.168.120.208:7777/UploadController/upload1', //仅为示例，非真实的接口地址
          filePath: filePath,
          name: 'file',
          formData: {
            'fileName': fileName
          },
          success (res){
            var resultData = JSON.parse(res.data);
            console.log("上传文件返回结果："+resultData);
            if(resultData.success){
              var uploadFilePath = resultData.path;
              files.push({fileName:fileName,filePath:filePath,uploadFilePath:uploadFilePath});
              that.setData({
                files:files
              });
            } else {
              wx.showToast({
                title: fileName+'上传失败',
                icon:'none'
              })
            }
          }
        })
      }
    })
  },
  //删除选择的文件
  deleteFile:function(event){
    var delfilename = event.currentTarget.dataset.filename;
    console.log("要删除的文件名是："+delfilename);
    var that = this;
    let files = that.data.files;
    let length = files.length;
    wx.showModal({
      title: '提示',
      content: '确定删除吗？',
      success (res) {
        if (res.confirm) {
          //逆向循环，防止元素删除不全
          for (let index = length-1; index >=0; index--) {
            if(files[index].fileName == delfilename){
              files.splice(index,1);
            }
          }
          //循环结束后重新赋值
          that.setData({
            files:files
          });
        } else if (res.cancel) {
          console.log("用户点击取消");
        }
      }
    })
  },
  //绑定选择器选择事件
  bindPickerChange: function(e) {
    this.setData({
      //选择的数组下标
      index: e.detail.value
    })
  }



})