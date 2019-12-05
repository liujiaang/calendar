<template>
  <div class="cc-calendar">
    <calendarHeader 
      :headOptions="headOptions" 
      @handlePrevMonth = 'handlePrevMonth'
      @handleNextMonth = 'handleNextMonth'
      @handleToday = 'handleToday'>
    </calendarHeader> 
    <ul class="calendar-week clearfix">
      <li v-for="(item, index) in calendarTitleArr" :key="index" class="week-item" 
       :class="[{saturday:index === 5},
        {sunday:index === 6},]">
          {{item}}
        </li>
    </ul>
    <ul class="calendar-view clearfix">
      <li v-for="(item, index) in visibleCalendar" 
        :key="index" 
        class="date-view"
        :class="[
        {'month-class': !isCurrentMonth(item.date)},
        {todayBg: isCurrentDay(item.date)},
        {handleDay: item.clickDay}]"
      >
        <span class="date-day clearfix"
          :class="[{'opacity-class': !isCurrentMonth(item.date)},
          {saturday:item.weekday === 6},
          {sunday:item.weekday === 0}]"
        >
          <span class="pull-left">{{item.day}}</span>
          <span style="padding:0 5px;" class="pull-right" :class="[{festival:item.lunar.isLunarFestival ||item.lunar.isGregorianFestival}]" v-if="item.lunar">{{item.lunar.lunar}}</span>
        </span>
        <span class="calendar-num">
            <!-- 自定义事件 -->
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
  import calendarHeader from './calendarHead.vue';
  import * as utils from './common/utils.js';
  import calendar from './common/calendar.js';
  export default {
    props: {
      options: Object,
    },
    components: {
      calendarHeader
    },
    data() {
      let {year, month, day} = utils.getNewDate(new Date());
      return {
        headOptions: {
          type: 'combination',
          style:{
            todayBtn: 'right',
            combination: 'center',
            checkBtn: 'right',
          },
          date: '',
        },
        calendarTitleArr: [
          '周一',
          '周二',
          '周三',
          '周四',
          '周五',
          '周六',
          '周日'
        ],
        festival: {
          lunar: {
            "1-1": "春节",
            "1-15": "元宵节",
            "5-5": "端午节",
            "7-7": "七夕节",
            "8-15": "中秋节",
            "9-9": "重阳节",
          },
          gregorian: {
            "1-1": "元旦",
            "2-14": "情人节",
            "3-8": "妇女节",
            "3-12": "植树节",
            "4-5": "清明节",
            "5-1": "劳动节",
            "6-1": "儿童节",
            "7-1": "建党节",
            "8-1": "建军节",
            "9-10": "教师节",
            "10-1": "国庆节",
            "12-25": "圣诞节"
          }
        },
        time: {year, month, day},
        calendarList: []
      }
    },
    computed : {
      visibleCalendar () {
        let calendatArr = []
        let {year, month, day} = utils.getNewDate(utils.getDate(this.time.year, this.time.month, 1))
        
        let currentFirstDay = utils.getDate(year, month, 1)

        // 获取当前月第一天星期几
        let weekDay = currentFirstDay.getDay()
        let startTime = currentFirstDay - (weekDay - 1) * 24 * 60 * 60 * 1000
        if(weekDay === 0) {
          startTime = currentFirstDay- 6 * 24 * 60 * 60 * 1000
        }
        let monthDayNum;
        if (weekDay == 5 || weekDay == 6 || weekDay == 0){
          monthDayNum = 42
        } else {
          monthDayNum = 35
        }
        for (let i = 0; i < monthDayNum; i++) {
          calendatArr.push({
            date: new Date(startTime + i * 24 * 60 * 60 * 1000),
            year: new Date(startTime + i * 24 * 60 * 60 * 1000).getFullYear(),
            month:new Date(startTime + i * 24 * 60 * 60 * 1000).getMonth()+1,
            day: utils.formatDate(new Date(startTime + i * 24 * 60 * 60 * 1000).getDate()),
            clickDay: false,
            weekday:new Date(startTime + i * 24 * 60 * 60 * 1000).getDay(),
            lunar:this.getLunarInfo(new Date(startTime + i * 24 * 60 * 60 * 1000).getFullYear(),new Date(startTime + i * 24 * 60 * 60 * 1000).getMonth()+1,new Date(startTime + i * 24 * 60 * 60 * 1000).getDate())
          })
        }
        //  这里还可以set一些自定义事件


        this.headOptions.date = `${utils.englishMonth(month)} ${year}`
        // console.log(calendatArr)
        return calendatArr
      }
    },
    methods: {
      // 获取农历信息
      getLunarInfo(y, m, d) {
        let lunarInfo = calendar.solar2lunar(y, m, d);
        let lunarValue = lunarInfo.IDayCn;
        // console.log(y, m, d,lunarInfo,'lunarValue')
        let isLunarFestival = false;
        let isGregorianFestival = false;
        if (this.festival.lunar[lunarInfo.lMonth + "-" + lunarInfo.lDay] !=undefined) {
          lunarValue = this.festival.lunar[lunarInfo.lMonth + "-" + lunarInfo.lDay];
          isLunarFestival = true;
        } else if (this.festival.gregorian[m + "-" + d] != undefined) {
          lunarValue = this.festival.gregorian[m + "-" + d];
          isGregorianFestival = true;
        }
        return {
          lunar: lunarValue,
          isLunarFestival: isLunarFestival,
          isGregorianFestival: isGregorianFestival
        };
      },
      // 是否是当前月
      isCurrentMonth (date) {
        let {year: currentYear, month: currentMonth} = utils.getNewDate(utils.getDate(this.time.year, this.time.month, 1));
        let {year, month} = utils.getNewDate(date);
        return currentYear == year && currentMonth == month
      },
      // 是否是今天 
      isCurrentDay (date) {
        let {year: currentYear, month: currentMonth, day: currentDay} = utils.getNewDate(new Date());
        let {year, month, day} = utils.getNewDate(date);
        return currentYear == year && currentMonth == month && currentDay == day;
      },
      // 上一个月
      handlePrevMonth () {
        let prevMonth = utils.getDate(this.time.year,this.time.month,1);
        prevMonth.setMonth(prevMonth.getMonth() - 1);
        this.time = utils.getNewDate(prevMonth);
        this.headOptions.date = `${utils.englishMonth(this.time.month)} ${this.time.year}`;
        this.$emit('handlePrevMonth');
      },
      // 下一个月
      handleNextMonth () {
        let nextMonth = utils.getDate(this.time.year,this.time.month,1); 
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        this.time = utils.getNewDate(nextMonth);
        this.headOptions.date = `${utils.englishMonth(this.time.month)} ${this.time.year}`;
        this.$emit('handleNextMonth');
      },
      // 点击回到今天
      handleToday () {
        this.time = utils.getNewDate(new Date());
        // this.returnDate();
        // this.$emit('handleToday');
      },
      // 点击某一天
      handleClickDay (item) {
        
        // this.$emit('handleClickDay', item);
        this.visibleCalendar.map( x => { 
          x.clickDay = false;
        });
        this.$set(item, 'clickDay', true);
        this.$forceUpdate();
      }
    },
    created () {

    }
  }
</script>

<style lang="less">
  .clearfix:before,
  .clearfix:after {
    content: " ";
    display: table;
  }
  .clearfix:after {
    clear: both;
  }
  .pull-right {
  float: right !important;
}

.pull-left {
  float: left !important;
}
  .cc-calendar {
    padding: 23px 30px 30px;
    width: 100%;
    margin: 0 auto;
    height: 100%;
    // background: #F9FAFC;
    box-sizing: border-box;
    .calendar-week {
      width: 100%;
      height: 46px;
      line-height: 46px;
      border: 1px solid #E4E7EA;
      border-right: none;
      .week-item {
        float: left;
        width: 14.18%;
        text-align: center;
        font-size: 14px;
        color: #424953;
        background: #fff;
        border-right: 1px solid #E4E7EA;
        font-weight: 600;
      }
      .saturday{
        color: #409eff;
      }
      .sunday{
        color:rgb(233, 116, 116);
      }
    }
    .calendar-view {
      width: 100%;
      border-left: 1px solid #E4E7EA;
      .date-view {
        float: left;
        width: 14.18%;
        height: 100px;
        background: #fff;
        border-right: 1px solid #E4E7EA;
        border-bottom: 1px solid #E4E7EA;
        
        .date-day {
          padding: 8px 8px 0;
          display: block;
          width: 90%;
          font-size: 14px;
          font-weight: bold;
          color: #7F8794;
        }
        .holiday {
          color: rgb(233, 116, 116);
          
        }
        .saturday{
          color: #409eff;
        }
        .sunday{
          color:rgb(233, 116, 116);
        }
        .festival{
          background: rgb(233, 116, 116);
          color:#fff;
        }
        .calendar-num {
          cursor: pointer;
          margin-top: 6px;
          display: block;
          width: 100%;
          text-align: center;
          font-size: 14px;
          color: #424953;
        }
        .calendar-num:hover{
          color: #409eff;
        }
      }
      .opacity-class {
        opacity: .5;
      }
      .month-class {
        background-image: linear-gradient(45deg,rgba(000, 000, 000, .03) 25%,transparent 25%,transparent 50%,rgba(000, 000, 000, .03) 50%,rgba(000, 000, 000, .03) 75%,transparent 75%,transparent);
        background-size: 20px 20px;
      }
      .todayBg {
        background: rgb(252, 246, 203);
      }
      .handleDay {
        background: #409eff !important;
        .date-day {
          color: #BCCFFF !important;
        }
        .calendar-num {
          color: #fff !important;
        }
      }
    }
  }
</style>
