var cName, clastprice, csymbol, cchange, cchangep, haveinfor;
var myInterval;

function addfavorlist(addword) {
    var tem_tr =document.createElement('tr');
    var tem_td;
    var tema =document.createElement('a');
    tem_td =document.createElement('td');
    
    $(tema).attr("href","#");
    $(tema).attr("onclick","startsearch('"+addword+"')");
    $(tema).append(addword);
    $(tem_td).append(tema);
    $(tem_tr).append(tem_td);
    
    $("#favoritelist").append(tem_tr);

    $.ajax({
        type:"GET",
        //async: false,
        url: "http://571test-env.us-west-1.elasticbeanstalk.com/index.php",
        dataType: "json",
        data: {
            symbol: addword
        },
        success: function( data ) {
                
                $.each(data,function(key,val){
                    tem_td =document.createElement('td');
                    if(key=="Name"||key=="Last Price"||key=="Market Cap")
                    {
                        $(tem_td).append(val);
                        $(tem_tr).append(tem_td);
                    }
                    else if(key=="Change")
                    {
                        if(data.ChangePercent>=0)
                        {
                            $(tem_td).attr("style","color:green");
                            $(tem_td).append(val+' ('+data.ChangePercent+"% ) <img src='up.png'>");
                        }
                        else
                        {
                            $(tem_td).attr("style","color:red");
                            $(tem_td).append(val+' ('+data.ChangePercent+"% ) <img src='down.png'>");
                        }
                        $(tem_tr).append(tem_td);
                    }
                });
                
                tem_td =document.createElement('td')
                $(tem_td).append('<button type="button" id="'+data.Symbol+'" class="btn btn-default"><span class="glyphicon glyphicon-trash" aria-hidden="true" style="margin:3px"></span></button>');
                $(tem_tr).append(tem_td);
                $(tem_tr).attr("id","tr"+data.Symbol);
                            
                $("#"+data.Symbol).click(function(){
                    var temarray=JSON.parse(localStorage.getItem("favor_list"));
                    for(var i=0;i<temarray.length;i++)
                    {
                        if(temarray[i]==this.id)
                        {
                            if(csymbol==this.id)
                                $("#instar").attr("style","position:absolute; font-size: 15px; left:2px; top:3px; color:white");
                            temarray.splice(i,1);
                            localStorage.setItem("favor_list", JSON.stringify(temarray));
                        }
                    }
                    $("#tr"+data.Symbol).remove();
                });
            }
        });
}

function renewfavorite() {
    $("#favoritelist").html("<tr></tr>");

    if (localStorage.getItem("favor_list") != null)
    {
        var temarray=JSON.parse(localStorage.getItem("favor_list"));
        for(var i=0;i<temarray.length;i++)
        {
            addfavorlist(temarray[i]);
        }
    }   
};


function startsearch(searchword) {
    $('#Errormessage').html("&nbsp;");
    $('#next1b').removeAttr("disabled");
    $('#next1a').attr("href","#myCarousel");
    
    if(searchword!="")
        {
            $("#submit").attr('type', 'button');
            
            $.ajax({
                url: "http://dev.markitondemand.com/MODApis/Api/v2/Quote/jsonp",
                dataType: "jsonp",
                data: {
                    symbol: searchword
                },
                success: function( data ) {                    
                    if(data.Status != "SUCCESS")                    
                        $('#Errormessage').html("Select a valid entry");
                    else
                    {                        
                        cName=data.Name;
                        clastprice=data.LastPrice;
                        csymbol=data.Symbol;
                        cchange=data.Change;
                        cchangep=data.ChangePercent;
                        $.ajax({
                            type:"GET",
                            url: "http://571test-env.us-west-1.elasticbeanstalk.com/index.php",
                            dataType: "json",
                            data: {
                                symbol: searchword
                            },                            
                            success: function( data ) {
                                //start input quote data---------------------------------
                                
                                //first tab----------------------------------
                                var tem_tr;
                                var tem_td;
                                $("#stock_details").html("");
                                $.each(data,function(key,val){
                                    if(key=="Change")
                                    {
                                        tem_tr =document.createElement('tr');
                                        tem_td =document.createElement('td');
                                        $(tem_td).append("<b>Change (Change Percent)</b>");
                                        $(tem_tr).append(tem_td);
                                        tem_td =document.createElement('td');
                                        if(data.ChangePercent>=0)
                                        {
                                            $(tem_td).attr("style","color:green");
                                            $(tem_td).append(val+" ( "+data.ChangePercent+"% ) <img src='up.png'>");
                                        }
                                        else
                                        {
                                            $(tem_td).attr("style","color:red");
                                            $(tem_td).append(val+" ( "+data.ChangePercent+"% ) <img src='down.png'>");
                                        }                                        
                                        $(tem_tr).append(tem_td);
                                    }
                                    else if(key=="ChangeYTD")
                                    {
                                        tem_tr =document.createElement('tr');
                                        tem_td =document.createElement('td');
                                        $(tem_td).append("<b>Change YTD (Change Percent YTD)</b>");
                                        $(tem_tr).append(tem_td);
                                        tem_td =document.createElement('td');
                                        if(data.ChangePercentYTD>=0)
                                        {
                                            $(tem_td).attr("style","color:green");
                                            $(tem_td).append(val+" ( "+data.ChangePercentYTD+"% ) <img src='up.png'>");
                                        }
                                        else
                                        {
                                            $(tem_td).attr("style","color:red");
                                            $(tem_td).append(val+" ( "+data.ChangePercentYTD+"% ) <img src='down.png'>");
                                        }
                                        $(tem_tr).append(tem_td);
                                    }
                                    else if(key!="ChangePercentYTD"&&key!="ChangePercent"&&key!="BINGSEAR")
                                    {
                                        tem_tr =document.createElement('tr');
                                        tem_td =document.createElement('td');
                                        $(tem_td).append("<b>"+key+"</b>");
                                        $(tem_tr).append(tem_td);
                                        tem_td =document.createElement('td');
                                        $(tem_td).append(val);
                                        $(tem_tr).append(tem_td);
                                    }
                                    $("#stock_details").append(tem_tr);
                                })
                                
                                //store information in local storage
                                
                                
                                $('#stock_pic').html("<img src='http://chart.finance.yahoo.com/t?s="+searchword+"&lang=en-US&width=800&height=600' width='100%' height=auto>");
                                
                                 
                                //third tab----------------------------------
                                //third tab----------------------------------
                                //third tab----------------------------------
                                $("#News").html("");
                                for(var i=0;i<data.BINGSEAR.length;i++)
                                {                               
                                    var tem_div =document.createElement('div');
                                    
                                    $(tem_div).attr("class","well");
                                    
                                    
                                    var aurl =document.createElement('a');
                                    $(aurl).attr('href',data.BINGSEAR[i]['Url']);
                                    $(aurl).attr('target',"_blank");
                                    $(aurl).append(data.BINGSEAR[i]['Title']);
                                    $(tem_div).append(aurl);
                                    
                                    var temp =document.createElement('p');
                                    $(temp).append(data.BINGSEAR[i]['Content']);
                                    $(tem_div).append(temp);
                                    
                                    temp =document.createElement('p');
                                    $(temp).append("<b>Publisher: "+data.BINGSEAR[i]['Publisher']+"</b");
                                    $(tem_div).append(temp);
                                    
                                    temp =document.createElement('p');
                                    $(temp).append("<b>Date: "+data.BINGSEAR[i]['Date']+"</b");
                                    $(tem_div).append(temp);
                                    
                                    
                                    $("#News").append(tem_div);
                                }  
                                
                                
                                
                            }
                        });
                        
                        $('#myCarousel').carousel(1);
                        
                        if(localStorage.getItem("favor_list")!=null)
                        {
                            var isinlist=false;
                            var temarray=JSON.parse(localStorage.getItem("favor_list"));
                            for(var i=0;i<temarray.length;i++)
                            {
                                if(temarray[i]==csymbol)
                                {
                                    isinlist=true;
                                    $("#instar").attr("style","position:absolute; font-size: 15px; left:2px; top:3px; color:yellow");
                                }
                            }
                            if(isinlist==false)
                            {
                                $("#instar").attr("style","position:absolute; font-size: 15px; left:2px; top:3px; color:white");
                            }
                        }
                        else
                        {
                            $("#instar").attr("style","position:absolute; font-size: 15px; left:2px; top:3px; color:white");
                        }
                        
                        //second tab----------------------------------
                        //second tab----------------------------------
                        //second tab----------------------------------
                        
                        var paramet=
                            {
                                "Normalized":false,
                                "NumberOfDays":1095,
                                "DataPeriod":"Day",
                                "Elements":[{
                                    "Symbol":searchword,
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
                            $('#hg_graph').highcharts('StockChart', {
                                               
                                chart: {
                                    width: $("#standdd").width()-40,
                                    height: 600,
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
                        }});
                        
                        
                                              
                       
                
                    }
                }
            });
                             
        }
        else
            $("#submit").attr('type', 'submit');
}


// when page start dooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo
//--------------------------------------------------

$(function() {
    $('[data-tool="tooltip"]').tooltip();
    myInterval = 0;
    renewfavorite();
    
    $( "#input_quote" ).autocomplete({
        source: function( request, response ) {
            $.ajax({
                url: "http://dev.markitondemand.com/MODApis/Api/v2/Lookup/jsonp",
                dataType: "jsonp",
                data: {
                    input: request.term
                },
                success: function( data ) {
                    response( $.map(data, function(obj) {
                        return {
                            label: obj.Symbol+" - "+obj.Name+" ( "+obj.Exchange+" )",
                            value: obj.Symbol,
                        };
                    }));
                }
            });
        },
        select: function( event, ui ) {
            $( "#input_quote" ).val(ui.item.value);
        },
        open: function() {
            $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
        },
        close: function() {
            $( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
        }
    });
    
    $("#submit").click(function(){
        startsearch($('#input_quote').val());
       
            
    });
    
    $("#clear").click(function(){
        $('#Errormessage').html("&nbsp;");
        $("#input_quote").val('');
        $('#next1b').removeAttr("href");
        $('#next1b').attr("disabled","disabled");
        $('#myCarousel').carousel(0);
        //localStorage.clear();
        //renewfavorite();
    });
    
    $("#shareBtn").click(function(){
        
        FB.ui(
            {
                method: 'feed',
                display: 'popup',
                link: 'http://dev.markitondemand.com/',
                picture: "http://chart.finance.yahoo.com/t?s="+csymbol+"&lang=en-US&width=400&height=300",
                name: 'Current Stock Price of '+cName+' is $'+Math.round(clastprice*100)/100,
                caption: 'Last Traded Price: $'+Math.round(clastprice*100)/100+', Change: '+Math.round(cchange*100)/100+' ('+Math.round(cchangep*100)/100+'%)',
                description: 'Stock Information of '+cName+' ('+csymbol+')'
            },
            function(response) {
                if (response && !response.error_message) {
                    alert('Posted Successfully');
                } else {
                    alert('Not posted');
                }
            }
        );
    });
    
    $("#favoritebtn").click(function(){
        
        if(localStorage.getItem("favor_list")!=null)
        {
            var isinlist=false;
            var temarray=JSON.parse(localStorage.getItem("favor_list"));
            for(var i=0;i<temarray.length;i++)
            {
                if(temarray[i]==csymbol)
                {
                    isinlist=true;
                    temarray.splice(i,1);
                    $("#instar").attr("style","position:absolute; font-size: 15px; left:2px; top:3px; color:white");
                    $("#tr"+csymbol).remove();
                    localStorage.setItem("favor_list", JSON.stringify(temarray));
                }
            }
            if(isinlist==false)
            {
                $("#instar").attr("style","position:absolute; font-size: 15px; left:2px; top:3px; color:yellow");
                addfavorlist(csymbol);
                temarray.push(csymbol);
                localStorage.setItem("favor_list", JSON.stringify(temarray));
            }
        }
        else
        {
            var temarray = [];
            $("#instar").attr("style","position:absolute; font-size: 15px; left:2px; top:3px; color:yellow");
            addfavorlist(csymbol);
            temarray.push(csymbol);
            localStorage.setItem("favor_list", JSON.stringify(temarray));
        }
        //renewfavorite();
    });
        
    $('#autoref').change(function(){
        if($(this).prop('checked'))
            myInterval = setInterval( "renewfavorite()", 5000 );
        else
            clearInterval(myInterval);
    });
    
    $( window ).resize(function(){
        $('#hg_graph').highcharts().setSize($("#standdd").width()-40,600,false);
    });
    
});