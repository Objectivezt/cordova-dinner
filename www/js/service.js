angular.module('ServiceModule',[])

  .service('homePage',function (homePageData) {
    var hotGreens = [];
    return{
      homePageInit : function () {
        hotGreens = homePageData.all();
        return hotGreens
      }
    }
  })
  .service('setting',function (settingData) {
    var setting = [];
    return{
      settingInit : function () {
        console.log(setting)
        setting = settingData.all();
        return setting
      }
    }
  })
  .service('mess',function(messData){
    var mess = [];
    console.log(mess);
    console.log(messData.all());
    return {
      messInit : function(){
        console.log(mess);
        mess = messData.all();
        return mess;
      }
    }
  })//获取食堂列表messData数据
  .service('order', function (getDetailData) {
    var orderNames = ['广州', '深圳', '北京', '上海'];
    var order = [];
    return {
      initOrder: function () {
        if(order.length==0){
          if(localStorage.getItem('data')==null){//没有本地数据，用默认的
            for(var j =0; j<orderNames.length;j++){
              this.add(orderNames[j]);
            }
            localStorage.setItem('data',JSON.stringify(orderNames));
            return order;
          }
          else{
            var datalist=JSON.parse(localStorage.getItem('data'));
            for(var i =0;i< datalist.length;i++){
              this.add(datalist[i]);
            }
            console.log(order);
            return order;
          }//初始化城市参数，检查本地有没有数据有就用，没有数据的话就用默认的
        }else return order;//看看order里面有没有数据，没有的话就新建，有就直接返回
      },
      // remove: function (city) {
      //   order.splice(order.indexOf(city), 1);
      // },//删除城市
      add: function (name) {
        var newer = {
          name: '',
          today: {tem: 0, air: 0, wet: 0, ico: '',state:''},
          current:[]
        };
        newer.name = name;
        newer.today=getDetailData.getToday(name);
        newer.current=getDetailData.getCurrent(name);
        order.push(newer);
      }//添加城市
      // check: function (name) {
      //   for (var i in order)
      //     if (order[i].name == name)return true;
      //   return false;
      // },//检测城市是否已经存在
      // saveData:function () {
      //   var namelist=[];
      //   for(var i in order){
      //     namelist.push(order[i].name);
      //   }
      //   localStorage.setItem('data',JSON.stringify(namelist));
      // }//把数据保存到本地去
    };
  })//城市气象数据和相关方法
  .factory('homePageData',function ($http) {
    var greenData = [
      /*
       * {cgreensHref:'#/details',
       * greensImg:'img/banner1.jpg',
       * greensName:'鱼香肉丝',
       * greensDescription:'鱼香肉丝（英文名：Stir-fried Pork Strips in Fish Sauce）是一道特色传统名菜，以鱼香调味而得名，属川菜。相传',
       * greensPrice:'22'},
       */
    ];
    $http({
      method: 'GET',
      url: 'http://localhost:8198/greensDataIndex'
    }).then(function successCallback(response) {
      console.log(response);
      var tmpGreensData = {};
      console.log(response.data);
      tmpGreensData = response.data;
      for (var i = 0; i < tmpGreensData.length; i++) {
        greenData.push({
          greensHref: '#/details/'+tmpGreensData[i].gid,
          greensImg: tmpGreensData[i].images,
          greensName: tmpGreensData[i].g_nickname,
          greensDescription: tmpGreensData[i].g_desciption,
          greensPrice: tmpGreensData[i].price
        })
      }
    }, function errorCallback(response) {});
    return{
      all: function () {
        return greenData;
      }
    }
  })
  .factory('messData',function($http){
    var messData = [
      // {
      //   messPerson:'管理员',
      //   messPersonImg:'img/logo.png',
      //   messName:'南区一食堂',
      //   messIntroduce:'南区1食堂的描述',
      //   messImg:'img/banner_1.jpg ',
      //   messHref:'#/shop?id=001',
      //   messHrefDescription:' '
      // },
    ];
    $http({
      method: 'GET',
      url: 'http://localhost:8198/messData'
    }).then(function successCallback(res) {
      console.log(res);
      var tmpmessData = {};
      console.log(res.data);
      tmpmessData = res.data;
      for (var i = 0; i < tmpmessData.length; i++) {
        messData.push({
          messPerson: '工作人员'+tmpmessData[i].mid,
          messHref: '#/shop/'+tmpmessData[i].mid,
          messName: tmpmessData[i].m_nickname,
          messPersonImg: tmpmessData[i].m_image,
          messHrefDescription: tmpmessData[i].m_description,
          messImg: tmpmessData[i].m_image
        })
      }
    }, function errorCallback(res) {

    });
    return {
      all : function(){
        return messData;
      }
    }
  })
  .factory('settingData',function ($http) {
      var settingData = [];
      $http({
        method:'GET',
        url:'http://localhost:8198/setting'
      }).then(function  successCallback(res) {
        var tmpsettingData = {};
        tmpsettingData = res.data;
        console.log(tmpsettingData);
        for(var i = 0; i< tmpsettingData.length; i++){
          settingData.push({
            settingUser: tmpsettingData[i].username,
            settingClass: tmpsettingData[i].classid,
            settingGrade: tmpsettingData[i].grade
          })
        }

      });
    return {
      all : function(){
        return settingData;
      }
    }
  })
  .factory('localstorage',['$window',function ($window) {
    return{
      set:function (key,value) {
        $window.localStorage[key] = value;
      },
      get:function (key,defaultValue) {
        return $window.localStorage[key] || defaultValue;
      },
      setObject:function(key, value){
        $window.localStorage[key] = JSON.stringify(value);
      },
      getObject:function (key) {
        return JSON.parse($window.localStorage[key] || '{}');
      },
      removeObject:function(key){
        return $window.localStorage.removeItem(key);
      },
      clearLocalStorage:function(){
        return $window.localStorage.clear();
      }
    }
  }])//创建localStorage模型

  .factory('getDetailData', function ($http, stringSearch) {
    return{
      getToday:function (name) {
        var dataTemp={tem: 0, air: 0, wet: 0, ico: '',state:''};
        if(stringSearch.incommon(name)!=null){//检查是否同音城市，是的话发送id，不是的话发送拼音
            var id=stringSearch.incommon(name);
            $http.jsonp("http://api.openweathermap.org/data/2.5/weather?id="+id+"&units=metric&lang=zh_cn&callback=JSON_CALLBACK&appid=663b25ec9d6054da0d3de36387574924")
              .success(function (data) {
                dataTemp.tem=Math.round(data.main.temp);
                dataTemp.wet=data.main.humidity;
                dataTemp.state=data.detail[0].description;
                dataTemp.air=data.wind.speed;
                dataTemp.ico=stringSearch.setIco(data.detail[0].id);
            })
        }else{
            var string=stringSearch.searchString(name);
            if(string=='')return null;
            $http.jsonp("http://api.openweathermap.org/data/2.5/weather?q="+string+"&units=metric&lang=zh_cn&callback=JSON_CALLBACK&appid=663b25ec9d6054da0d3de36387574924")
              .success(function (data) {
                dataTemp.tem=Math.round(data.main.temp);
                dataTemp.wet=data.main.humidity;
                dataTemp.state=data.weather[0].description;
                dataTemp.air=data.wind.speed;
                dataTemp.ico=stringSearch.setIco(data.weather[0].id);
              })
        }
        return dataTemp;
      },//获取当天的气象数据
      getCurrent:function (name) {
          var currentTemp=[];
        if(stringSearch.incommon(name)!=null){//检查是否同音城市，是的话发送id，不是的话发送拼音
          var id=stringSearch.incommon(name);
          $http.jsonp("http://api.openweathermap.org/data/2.5/forecast/daily?id="+id+"&units=metric&cnt=6&lang=zh_cn&callback=JSON_CALLBACK&appid=663b25ec9d6054da0d3de36387574924")
            .success(function (data) {
              for(var i=1;i<=5;i++)
              {
               var ico=stringSearch.setIco(data.list[i].detail[0].id)+'_low';
                currentTemp.push(ico)
              }
            })
        }else{
          var string=stringSearch.searchString(name);
          if(string=='')return null;
          $http.jsonp("http://api.openweathermap.org/data/2.5/forecast/daily?q="+string+"&units=metric&cnt=6&lang=zh_cn&callback=JSON_CALLBACK&appid=663b25ec9d6054da0d3de36387574924")
            .success(function (data) {
              for(var i=1;i<=5;i++)
              {
                var ico=stringSearch.setIco(data.list[i].weather[0].id)+'_low';
                currentTemp.push(ico)
              }
            })
        }
        return currentTemp;
      }//获取最近五天的数据

    };

  })//发送网络请求获得气象数据
  .factory('stringSearch', function () {
      var stringCollection = [
        {name: '北京', string: 'beijing'},{name: '天津', string: 'tianjin'},{name: '重庆', string: 'chongqing'},{name: '上海', string: 'shanghai'},
        {name: '香港', string: 'hongkong'},{name: '澳门', string: 'macau'},
        {name: '长春', string: 'changchun'}, {name: '吉林', string: 'jilin'}, {name: '四平', string: 'siping'}, {name: '辽源', string: 'liaoyuan'}, {
          name: '通化',
          string: 'tonghua'
        }, {name: '白山', string: 'baishan'}, {name: '松原', string: 'songyuan'}, {name: '白城', string: 'baicheng'},
        {name: '哈尔滨', string: 'haerbin'}, {name: '大庆', string: 'daqing'}, {name: '齐齐哈尔', string: 'qiqihaer'}, {
          name: '佳木斯',
          string: 'jiamusi'
        }, {name: '鸡西', string: 'jixi'}, {name: '鹤岗', string: 'hegang'}, {name: '双鸭山', string: 'shuangyashan'}, {
          name: '牡丹江',
          string: 'mudanjiang'
        }, {name: '伊春', string: 'yichun'}, {name: '七台河', string: 'qitaihe'}, {name: '黑河', string: 'heihe'}, {name: '绥化', string: 'suihua'},
        {name: '沈阳', string: 'shenyang'}, {name: '大连', string: 'dalian'}, {name: '鞍山', string: 'anshan'}, {name: '抚顺', string: 'fushun'}, {
          name: '本溪',
          string: 'benxi'
        }, {name: '丹东', string: 'dandong'}, {name: '锦州', string: 'jinzhou'}, {name: '营口', string: 'yingkou'}, {
          name: '阜新',
          string: 'fuxin'
        }, {name: '辽阳', string: 'liaoyang'}, {name: '盘锦', string: 'panjin'}, {name: '铁岭', string: 'tieling'}, {
          name: '朝阳',
          string: 'chaoyang'
        }, {name: '葫芦岛', string: 'huludao'},
        {name: '石家庄', string: 'shijiazhuang'}, {name: '唐山', string: 'tangshan'}, {name: '邯郸', string: 'handan'}, {
          name: '秦皇岛',
          string: 'qinhuangdao'
        }, {name: '保定', string: 'baoding'}, {name: '张家口', string: 'zhangjiakou'}, {name: '承德', string: 'chengde'}, {
          name: '廊坊',
          string: 'langfang'
        }, {name: '沧州', string: 'cangzhou'}, {name: '衡水', string: 'hengshui'}, {name: '邢台', string: 'xingtai'},
        {name: '济南', string: 'jinan'}, {name: '青岛', string: 'qingdao'}, {name: '淄博', string: 'zibo'}, {name: '枣庄', string: 'zaozhuang'}, {
          name: '东营',
          string: 'dongying'
        }, {name: '烟台', string: 'yantai'}, {name: '潍坊', string: 'weifang'}, {name: '济宁', string: 'jining'}, {
          name: '泰安',
          string: 'taian'
        }, {name: '威海', string: 'weihai'}, {name: '日照', string: 'rizhao'}, {name: '莱芜', string: 'laiwu'}, {
          name: '临沂',
          string: '临沂'
        }, {name: '德州', string: 'dezhou'}, {name: '聊城', string: 'liaocheng'}, {name: '菏泽', string: 'heze'}, {name: '滨州', string: 'binzhou'},
        {name: '南京', string: 'nanjing'}, {name: '镇江', string: 'zhenjiang'}, {name: '常州', string: 'changzhou'}, {name: '无锡', string: 'wuxi'}, {
          name: '苏州',
          string: 'suzhou'
        }, {name: '徐州', string: 'xuzhou'}, {name: '连云港', string: 'lianyungang'}, {name: '淮安', string: 'huaian'}, {
          name: '盐城',
          string: 'yancheng'
        }, {name: '扬州', string: 'yangzhou'}, {name: '泰州', string: 'taizhou'}, {name: '南通', string: 'nantong'}, {name: '宿迁', string: 'suqian'},
        {name: '合肥', string: 'hefei'}, {name: '蚌埠', string: 'bengbu'}, {name: '芜湖', string: 'wuhu'}, {name: '淮南', string: 'huainan'}, {
          name: '亳州',
          string: 'bozhou'
        }, {name: '阜阳', string: 'fuyang'}, {name: '淮北', string: 'huaibei'}, {name: '宿州', string: 'suzhou'}, {
          name: '滁州',
          string: 'chuzhou'
        }, {name: '安庆', string: 'anqing'}, {name: '巢湖', string: 'chaohu'}, {name: '马鞍山', string: 'maanshan'}, {
          name: '宣城',
          string: 'xuancheng'
        }, {name: '黄山', string: 'huangshan'}, {name: '池州', string: '池州'}, {name: '铜陵', string: 'tongling'},
        {name: '杭州', string: 'hangzhou'}, {name: '嘉兴', string: 'jiaxing'}, {name: '湖州', string: 'huzhou'}, {name: '宁波', string: 'ningbo'}, {
          name: '金华',
          string: 'jinhua'
        }, {name: '温州', string: 'wenzhou'}, {name: '丽水', string: 'lishui'}, {name: '绍兴', string: 'shaoxing'}, {
          name: '衢州',
          string: 'quzhou'
        }, {name: '舟山', string: 'zhoushan'}, {name: '台州', string: 'taizhou'},
        {name: '福州', string: 'fuzhou'}, {name: '厦门', string: 'xiamen'}, {name: '泉州', string: 'quanzhou'}, {name: '三明', string: 'sanming'}, {
          name: '南平',
          string: 'nanping'
        }, {name: '漳州', string: 'zhangzhou'}, {name: '莆田', string: 'putian'}, {name: '宁德', string: 'ningde'}, {name: '龙岩', string: 'longyan'},
        {name: '广州', string: 'guangzhou'}, {name: '深圳', string: 'shenzhen'}, {name: '汕头', string: 'shantou'}, {name: '惠州', string: 'huizhou'}, {
          name: '珠海',
          string: 'zhuhai'
        }, {name: '揭阳', string: 'jieyang'}, {name: '佛山', string: 'foshan'}, {name: '河源', string: 'heyuan'}, {
          name: '阳江',
          string: 'yangjiang'
        }, {name: '茂名', string: 'maoming'}, {name: '湛江', string: 'zhanjiang'}, {name: '梅州', string: 'meizhou'}, {
          name: '肇庆',
          string: 'zhaoqing'
        }, {name: '韶关', string: 'shaoguan'}, {name: '潮州', string: 'chaozhou'}, {name: '东莞', string: 'dongguan'}, {
          name: '中山',
          string: 'zhongshan'
        }, {name: '清远', string: 'qingyuan'}, {name: '江门', string: 'jiangmen'}, {name: '汕尾', string: 'shanwei'}, {name: '云浮', string: 'yunfu'},
        {name: '海口', string: 'haikou'}, {name: '三亚', string: 'sanya'},
        {name: '昆明', string: 'kunming'}, {name: '曲靖', string: 'qujing'}, {name: '玉溪', string: 'yuxi'}, {name: '保山', string: 'baoshan'}, {
          name: '昭通',
          string: 'zhaotong'
        }, {name: '丽江', string: 'lijiang'}, {name: '普洱', string: 'puer'}, {name: '临沧', string: 'lincang'},
        {name: '贵阳', string: 'guiyang'}, {name: '六盘水', string: 'liupanshui'}, {name: '遵义', string: 'zunyi'}, {name: '安顺', string: 'anshun'},
        {name: '成都', string: 'chengdu'}, {name: '绵阳', string: 'mianyang'}, {name: '德阳', string: 'deyang'}, {name: '广元', string: 'guangyuan'}, {
          name: '自贡',
          string: 'zigong'
        }, {name: '攀枝花', string: 'panzhihua'}, {name: '乐山', string: 'leshan'}, {name: '南充', string: 'nanchong'}, {
          name: '内江',
          string: 'neijiang'
        }, {name: '遂宁', string: 'suining'}, {name: '广安', string: 'guangan'}, {name: '泸州', string: 'luzhou'}, {
          name: '达州',
          string: 'dazhou'
        }, {name: '眉山', string: 'meishan'}, {name: '宜宾', string: 'yibin'}, {name: '雅安', string: 'yaan'}, {name: '资阳', string: 'ziyang'},
        {name: '长沙', string: 'changsha'}, {name: '株洲', string: 'zhuzhou'}, {name: '湘潭', string: 'xiangtan'}, {name: '衡阳', string: 'hengyang'}, {
          name: '岳阳',
          string: 'yueyang'
        }, {name: '郴州', string: 'chenzhou'}, {name: '永州', string: 'yongzhou'}, {name: '邵阳', string: 'shaoyang'}, {
          name: '怀化',
          string: 'huaihua'
        }, {name: '常德', string: 'changde'}, {name: '益阳', string: 'yiyang'}, {name: '张家界', string: 'zhangjiajie'}, {name: '娄底', string: 'loudi'},
        {name: '武汉', string: 'wuhan'}, {name: '襄樊', string: 'xiangfan'}, {name: '宜昌', string: 'yichang'}, {name: '黄石', string: 'huangshi'}, {
          name: '鄂州',
          string: 'ezhou'
        }, {name: '随州', string: 'suizhou'}, {name: '荆州', string: 'jingzhou'}, {name: '荆门', string: 'jingmen'}, {
          name: '十堰',
          string: 'shiyan'
        }, {name: '孝感', string: 'xiaogan'}, {name: '黄冈', string: 'huanggang'}, {name: '咸宁', string: 'xianning'},
        {name: '郑州', string: 'zhengzhou'}, {name: '洛阳', string: 'luoyang'}, {name: '开封', string: 'kaifeng'}, {name: '漯河', string: 'luohe'}, {
          name: '安阳',
          string: 'anyang'
        }, {name: '新乡', string: 'xinxiang'}, {name: '周口', string: 'zhoukou'}, {name: '三门峡', string: 'sanmenxia'}, {
          name: '焦作',
          string: 'jiaozuo'
        }, {name: '平顶山', string: 'pingdingshan'}, {name: '信阳', string: 'xinyang'}, {name: '南阳', string: 'nanyang'}, {
          name: '鹤壁',
          string: 'hebi'
        }, {name: '濮阳', string: 'puyang'}, {name: '许昌', string: 'xuchang'}, {name: '商丘', string: 'shangqiu'}, {name: '驻马店', string: 'zhumadian'},
        {name: '太原', string: 'taiyuan'}, {name: '大同', string: 'datong'}, {name: '忻州', string: 'xinzhou'}, {name: '阳泉', string: 'yangquan'}, {
          name: '长治',
          string: 'changzhi'
        }, {name: '晋城', string: 'jincheng'}, {name: '朔州', string: 'shuozhou'}, {name: '晋中', string: 'jinzhong'}, {
          name: '运城',
          string: 'yuncheng'
        }, {name: '临汾', string: 'linfen'}, {name: '吕梁', string: 'lvliang'},
        {name: '西安', string: 'xian'}, {name: '咸阳', string: 'xianyang'}, {name: '铜川', string: 'tongchuan'}, {name: '延安', string: 'yanan'}, {
          name: '宝鸡',
          string: 'baoji'
        }, {name: '渭南', string: 'weinan'}, {name: '汉中', string: 'hanzhong'}, {name: '安康', string: 'ankang'}, {
          name: '商洛',
          string: 'shangluo'
        }, {name: '榆林', string: 'yulin'},
        {name: '兰州', string: 'lanzhou'}, {name: '天水', string: 'tianshui'}, {name: '平凉', string: 'pingliang'}, {
          name: '酒泉',
          string: 'jiuquan'
        }, {name: '嘉峪关', string: 'jiayuguan'}, {name: '金昌', string: 'jinchang'}, {name: '白银', string: 'baiyin'}, {
          name: '武威',
          string: 'wuwei'
        }, {name: '张掖', string: 'zhangye'}, {name: '庆阳', string: 'qingyang'}, {name: '定西', string: 'dingxi'}, {name: '陇南', string: 'longnan'},
        {name: '西宁', string: 'xining'},
        {name: '南昌', string: 'nanchang'}, {name: '九江', string: 'jiujiang'}, {name: '赣州', string: 'ganzhou'}, {name: '吉安', string: 'jian'}, {
          name: '鹰潭',
          string: 'yingtan'
        }, {name: '上饶', string: 'shagnrao'}, {name: '萍乡', string: 'pingxiang'}, {name: '景德镇', string: 'jingdezhen'}, {
          name: '新余',
          string: 'xinyu'
        }, {name: '宜春', string: 'yichun'}, {name: '抚州', string: 'fuzhou'},
        {name: '台北', string: 'taibei'}, {name: '台中', string: 'taizhong'}, {name: '基隆', string: 'jilong'}, {name: '高雄', string: 'gaoxioing'}, {
          name: '台南',
          string: 'tainan'
        }, {name: '新竹', string: 'xinzhu'}, {name: '嘉义', string: 'jiayi'},
        {name: '乌鲁木齐', string: 'wulumuqi'}, {name: '克拉玛依', string: 'kelamayi'},
        {name: '拉萨', string: 'lasa'},
        {name: '银川', string: 'yinchuan'}, {name: '石嘴山', string: 'shizuishan'}, {name: '吴忠', string: 'wuzhong'}, {
          name: '固原',
          string: 'guyuan'
        }, {name: '中卫', string: 'zhongwei'},
        {name: '呼和浩特', string: 'huhehaote'}, {name: '包头', string: 'baotou'}, {name: '乌海', string: 'wuhai'}, {
          name: '赤峰',
          string: 'chifeng'
        }, {name: '通辽', string: 'tongliao'}, {name: '鄂尔多斯', string: 'eerduosi'}, {name: '呼伦贝尔', string: 'hulunbeier'}, {
          name: '巴彦淖尔',
          string: 'bayannaoer'
        }, {name: '乌兰察布', string: 'wulanchabu'},
        {name: '南宁', string: 'nanning'}, {name: '柳州', string: 'liuzhou'}, {name: '桂林', string: 'guilin'}, {name: '梧州', string: 'wuzhou'}, {
          name: '北海',
          string: 'beihai'
        }, {name: '崇左', string: 'chongzuo'}, {name: '来宾', string: 'laibin'}, {name: '贺州', string: 'hezhou'}, {
          name: '玉林',
          string: 'yulin'
        }, {name: '百色', string: 'baise'}, {name: '河池', string: 'hechi'}, {name: '钦州', string: 'qinzhou'}, {
          name: '防城港',
          string: 'fangchenggang'
        }, {name: '贵港', string: 'guigang'}

      ];
      var commonList=[
        {name:'宿州',id:1279945},
        {name:'苏州',id:1886760},
        {name:'伊春',id:2033413},
        {name:'宜春',id:1786746},
        {name:'泰州',id:1793505},
        {name:'台州',id:1793505},
        {name:'玉林',id:1785781},
        {name:'榆林',id:1785777}
      ];
      return{
        searchString:function (name) {
          for(var i in stringCollection)
            if(stringCollection[i].name==name)return stringCollection[i].string;
          return '';
        },//根据城市名字获得拼音
        /*testCommon:function(){
          var commonList=[];
          for(var i=0 ;i< stringCollection.length;i++){
            for(var j =i+1;j<stringCollection.length;j++)
              if(stringCollection[i].string==stringCollection[j].string&&commonList.indexOf(stringCollection[j].name)<0){
                if(commonList.indexOf(stringCollection[i].name)<0)commonList.push(stringCollection[i].name);
                commonList.push(stringCollection[j].name);
              }
          }
          console.log(commonList);
      },*///测试名字相同的城市的
        incommon:function (name) {//检查是否同音城市，是则返回id，否则返回null
          for(var i in commonList)
            if(commonList[i].name==name)return commonList[i].id;
          return null;
        },
        setIco:function (stateID) {//设置图标的函数，没地方放，放这里了
          if(stateID!=0){
            if(200<=stateID&&stateID<300)return 'thunder';
            if(300<=stateID&&stateID<600)return 'raining';
            if(stateID==800)return 'sunny';
            if(stateID==801)return 'cloudy';
            if(700<=stateID&&stateID<800)return 'overcast';
            if(801<stateID&&stateID<900)return 'overcast';
            if(600<=stateID&&stateID<700)return 'snow';
          }
          return '';
        }
      }
  });//城市拼音数据

