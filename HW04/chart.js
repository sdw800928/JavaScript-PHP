$(function() {
    var csymbol=$('#hg_graph').attr('name');
    
    var paramet=
        {
            "Normalized":false,
            "NumberOfDays":1095,
            "DataPeriod":"Day",
            "Elements":[{
                "Symbol":csymbol,
                "Type":"price",
                "Params":["ohlc"]
            }]
        };
    var params = {
        parameters: JSON.stringify( paramet )
    };    
    $.ajax({      
        
        data: params,
        url: "http://dev.markitondemand.com/MODApis/Api/v2/InteractiveChart/jsonp",
        dataType: "jsonp",
        context: this,
        success: function(json){
            var dates = json.Dates || [];
            var elements = json.Elements || [];
            var chartSeries = [];
            
            if (elements[0]){
                for (var i = 0, datLen = dates.length; i < datLen; i++) {
                    var dat = new Date(dates[i]);// = this._fixDate( dates[i] );
                    var pointData = [
                        Date.UTC(dat.getFullYear(), dat.getMonth(), dat.getDate()),
                        elements[0].DataSeries['close'].values[i]
                    ];
                    chartSeries.push( pointData );
                };
            }
            // Create the chart
            //alert(chartSeries);
            $('#hg_graph').highcharts('StockChart', {
                
                chart: {
                    width: $(window).width(),
                    height: 500,
                },
                
                rangeSelector : {
                    selected : 0,
                    inputEnabled:false,
                    
                    buttons: [{
                        type: 'week',
                        count: 1,
                        text: '1w'
                    }, {
                        type: 'month',
                        count: 1,
                        text: '1m'
                    }, {
                        type: 'month',
                        count: 3,
                        text: '3m'
                    }, {
                        type: 'month',
                        count: 6,
                        text: '6m'
                    }, {
                        type: 'ytd',
                        text: 'YTD'
                    }, {
                        type: 'year',
                        count: 1,
                        text: '1y'
                    }, {
                        type: 'all',
                        text: 'All'
                    }]
                },
                                
                title : {
                    text : csymbol+' Stock Price'
                },
                
                exporting: { enabled: false },
                                                
                yAxis: {
                    tickAmount: 6,    
                    opposite: true,   
                    title: {
                        enabled: true,
                        text: 'Stock Value',
                        style: {
                            fontWeight: 'normal'
                        }
                    }
                },
                
                series : [{
                    name : csymbol+' Stock Price',
                    data : chartSeries,
                    type : 'area',
                    //threshold : null,
                    tooltip : {
                        valueDecimals : 2,
                        valuePrefix: '$ '
                    },
                    fillColor : {
                        linearGradient : {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops : [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    }
                }]
            });
            //$('#Historical').highcharts().reflow();
        }
    });        
});