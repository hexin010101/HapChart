var line = [[1, 4], [0, 2, 3], [1], [1], [0]];
var graphic = [];
radius = [40.5, 33, 19, 17, 20];
data_pos = [[200.16512, 250.1653],
    [600.4152, 200.5551],
    [600.56005, 400.1555],
    [300.515, 400.5616],
    [600, 500]];
function calculate_line(center1, center2, radius1, radius2) {
    if (center2[0] == center1[0]) {
        if (center1[1] > center2[1]) {
            return {
                x1: center1[0],
                x2: center2[0],
                y1: center1[1] - radius1,
                y2: center2[1] + radius2
            }
        } else {
            return {
                x1: center1[0],
                x2: center2[0],
                y1: center1[1] + radius1,
                y2: center2[1] - radius2
            }
        }
    }
    else {

        k = (center2[1] - center1[1]) / (center2[0] - center1[0]);

        delta_x1 = ((radius1 ** 2) / (1 + k ** 2)) ** 0.5;
        delta_y1 = delta_x1 * k;
        delta_x2 = (((radius2 ** 2) / (1 + k ** 2)) ** 0.5) * (-1);
        delta_y2 = delta_x2 * k;


        if (center2[0] < center1[0]) {
            delta_x1 = delta_x1 * (-1);
            delta_y1 = delta_y1 * (-1);
            delta_x2 = delta_x2 * (-1);
            delta_y2 = delta_y2 * (-1);
        }
        s ={
            x1: center1[0] + delta_x1,
            y1: center1[1] + delta_y1,
            x2: center2[0] + delta_x2,
            y2: center2[1] + delta_y2
        }
        return s

}}

for (var i = 0; i < line.length; i++) {
    graphic.push({
        type: 'group',
        children: []
    });
    var k = line[i];
    for (var j = 0; j < k.length; j++) {
        var m = k[j];
        console.log(data_pos[i],data_pos[m],radius[i]*2,radius[m]*2)
        var shape = calculate_line(
            data_pos[i],
            data_pos[m],
            radius[i] * 2,
            radius[m] * 2
        );
        //
        // graphic[i].children.push({
        //     type: 'line',
        //     shape:shape,
        // })
    }
}

