function init() {
    var graphic = [];
    var titles = [];
    var series = [];
    graphic.push(
        {
            type: 'group',
            children: []
        }
    );
    for (var i = 0; i < data_pos.length; i++) {
        titles.push({
            text: '',
            left: data_pos[i][0],
            top: data_pos[i][1] ,
            textAlign: 'center',
            verticalAlign:'middle'


        });
        graphic[0].children.push(
            {
                type: 'text',
                draggable: true,
                zlevel: 150,
                // 平移旋转和缩放
                position: [0, 0],
                rotation: 0,
                scale: [1, 1],
                // 缩放和旋转中心点
                origin: [0, 0],

                invisible: false,
                style: {
                    // 填充色
                    fill: '#000',
                    // 笔画颜色
                    stroke: null,
                    lineWidth: 0,
                    shadowColor: undefined,

                    text: title[i],


                    x: data_pos[i][0] + radius[i] * 2.2,
                    y: data_pos[i][1] - radius[i] * 2
                }
            }
        );

        series.push({
            type: 'pie',
            z: 50,
            radius:[radius[i]*1.5, radius[i] * 2],
            center: data_pos[i],
            avoidLabelOverlap: false,
            itemStyle: {
                opacity: 1.0,
                borderColor :'red',
                // borderWidth :2,
                // 柱条的描边类型，默认为实线，支持 'solid', 'dashed', 'dotted'
                // borderType:'dotted',
                // 线性渐变，前四个参数分别是 x0, y0, x2, y2, 范围从 0 - 1，相当于在图形包围盒中的百分比，如果 globalCoord 为 `true`，则该四个值是绝对的像素位置
                // color: {
                //     type: 'linear',
                //     x: 0,
                //     y: 0,
                //     x2: 0,
                //     y2: 1,
                //     colorStops: [{
                //         offset: 0, color: 'yellow' // 0% 处的颜色
                //     }, {
                //         offset: 1, color: 'blue' // 100% 处的颜色
                //     }],
                //     global: false // 缺省为 false
                // },
// 径向渐变，前三个参数分别是圆心 x, y 和半径，取值同线性渐变
//                 color: {
//                     type: 'radial',
//                     x: 0.5,
//                     y: 0.5,
//                     r: 0.5,
//                     colorStops: [{
//                         offset: 0, color: 'red' // 0% 处的颜色
//                     }, {
//                         offset: 1, color: 'blue' // 100% 处的颜色
//                     }],
//                     global: false // 缺省为 false
//                 },
// 纹理填充
//                 color: {
//                     image: imageDom, // 支持为 HTMLImageElement, HTMLCanvasElement，不支持路径字符串
//                     repeat: 'repeat' // 是否平铺, 可以是 'repeat-x', 'repeat-y', 'no-repeat'
//                 }
            },
            minAngle: 0,
            label: {
                normal: {
                    show: false,
                    position: 'left'
                },
                emphasis: {
                    show: true,
                    textStyle: {
                        fontSize: radius[i] / 2,
                        fontWeight: 'bold'
                    }
                }
            },
            encode: {
                itemName: 'TraitLabels',
                value: dataset.source[0][i + 1]

            },
        });
        graphic.push({
            type: 'ring',
            position: [data_pos[i][0], data_pos[i][1]],
            shape: {
                r: radius[i] * 1.5
            },

            invisible: true,
            draggable: true,
            z: 100,
            // ondrag:echarts.util.curry(onmousedrag,i),
            // onmousedown: echarts.util.curry(onmousedown, i),
            onmouseup: echarts.util.curry(onmouseup, i),

        });

    }
    for (var i = 0; i < line.length; i++) {
        graphic.push({
            type: 'group',
            children: []
        });
        var k = line[i];
        for (var j = 0; j < k.length; j++) {
            var m = k[j];
            // console.log(data_pos[i],data_pos[m],radius[i]*2,radius[m]*2)
            center1 = data_pos[i];
            center2 = data_pos[m];
            radius1 = radius[i] * 2;
            radius2 = radius[m] * 2;
            if (center2[0] == center1[0]) {
                if (center1[1] > center2[1]) {

                    x1 = center1[0],
                        x2 = center2[0],
                        y1 = center1[1] - radius1,
                        y2 = center2[1] + radius2
                } else {

                    x1 = center1[0],
                        x2 = center2[0],
                        y1 = center1[1] + radius1,
                        y2 = center2[1] - radius2
                }

            } else {

                sss = (center2[1] - center1[1]) / (center2[0] - center1[0]);
                delta_x1 = ((radius1 ** 2) / (1 + sss ** 2)) ** 0.5;
                delta_y1 = delta_x1 * sss;
                delta_x2 = (((radius2 ** 2) / (1 + sss ** 2)) ** 0.5) * (-1);
                delta_y2 = delta_x2 * sss;
                if (center2[0] < center1[0]) {
                    delta_x1 = delta_x1 * (-1);
                    delta_y1 = delta_y1 * (-1);
                    delta_x2 = delta_x2 * (-1);
                    delta_y2 = delta_y2 * (-1);
                }
                x1 = center1[0] + delta_x1;
                x2 = center2[0] + delta_x2;
                y1 = center1[1] + delta_y1;
                y2 = center2[1] + delta_y2
            }
            bbbbb = line[i].indexOf(m)
            graphic[data_pos.length + i + 1].children.push({
                type: 'group',

                children: [
                    {
                        type: 'line',
                        shape: {
                            x1: x1,
                            x2: x2,
                            y1: y1,
                            y2: y2,
                        },
                        style:{
                            lineWidth:0.5

                        },

                    },
                    {
                        type: 'text',
                        // left:(x1+x2)/2,
                        // top:(y1+y2)/2+5,
                        zlevel: 100,

                        style: {

                            text: gap[i][bbbbb],
                            x: (x1 + x2) / 2,
                            y: (y1 + y2) / 2

                        }

                    }
                ]

            })


        }
    }

    function calculate_line(center1, center2, radius1, radius2) {
        // 讨论斜率不存在时候的情况

        if (center2[0] == center1[0]) {
            if (center111[1] > center222[1]) {

                x1 = center1[0],
                    x2 = center2[0],
                    y1 = center1[1] - radius1,
                    y2 = center2[1] + radius2

            } else {

                x1 = center1[0],
                    x2 = center2[0],
                    y1 = center1[1] + radius1,
                    y2 = center2[1] - radius2

            }
        }

        k = (center2[1] - center1[1]) / (center2[0] - center1[0]);

        delta_x1 = ((radius1 ** 2) / (1 + k ** 2)) ** 0.5;
        delta_y1 = delta_x1 * k;
        delta_x2 = (((radius2 ** 2) / (1 + k ** 2)) ** 0.5) * (-1);
        delta_y2 = delta_x2 * k;


        if (center2[0] < center1[0]) {
            delta_x1 = delta_x1 * (-1);
            delta_y1 = delta_y1 * (-1);
            delta_x2 = delta_x2 * (-1);
            delta_y2 = delta_y2 * (-1)
        }
        return {
            x1: center1[0] + delta_x1,
            y1: center1[1] + delta_y1,
            x2: center2[0] + delta_x2,
            y2: center2[1] + delta_y2
        }
    }

    option = {
        title: titles.concat([{
            text: 'Haplotype plot',

            left: '10%',
            top: '5%',
        }]),
        // color: ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],

        id: 'chart_canvas',


        tooltip: {},
        legend: {
            type: 'scroll',
            orient: 'horizontal',
            selected:{

            }
        },
        dataset: dataset,
        graphic: graphic,
        toolbox: {
            show: true,
            feature: {
                mark: {show: true},

                saveAsImage: {
                    show: true,
                    pixelRatio:5,

                }
            }
        },

        series: series
    };

    function onmouseup(dataIndex) {
        data_pos[dataIndex] = this.position;
        option.series[dataIndex].center = this.position;
        option.graphic[1 + dataIndex].position = this.position;

        option.graphic[0].children[dataIndex].style.x = this.position[0] + radius[dataIndex] * 2.2;
        option.graphic[0].children[dataIndex].style.y = this.position[1] - radius[dataIndex] * 2;
        option.title[dataIndex].left = this.position[0];
        option.title[dataIndex].top = this.position[1] - 10;

        b = option.graphic[dataIndex + data_pos.length + 1].children;
        var f = line[dataIndex];
        for (var i = 0; i < b.length; i++) {
            // var line = [[1, 4], [0, 2, 3], [1], [1], [0]];
            // dataIndex = 1
            // f = [0,2,3]
            sss = line[f[i]].indexOf(dataIndex);
            ssss = option.graphic[1 + data_pos.length + f[i]].children[sss].children;

            center1 = data_pos[sss];
            center2 = this.position;
            shape = calculate_line(center1 = this.position,
                center2 = data_pos[f[i]],
                radius1 = radius[dataIndex] * 2,
                radius2 = radius[f[i]] * 2)
            ssss[0].shape = shape;
            ssss[1].style.x = (shape.x1 + shape.x2) / 2;
            ssss[1].style.y = (shape.y1 + shape.y2) / 2;

            option.graphic[1 + data_pos.length + f[i]].children[sss].children = ssss;


            b[i].children[0].shape = shape;
            b[i].children[1].style.x = (shape.x1 + shape.x2) / 2;
            b[i].children[1].style.y = (shape.y1 + shape.y2) / 2;

        }
        console.log(option.legend);
        option.graphic[1 + dataIndex + data_pos.length].children = b;
        myChart.setOption(option);
    }
}

option = {};

function start() {
    option = {};

    myChart = echarts.init(document.getElementById('main'),);
    init();
    myChart.setOption(option);
}





