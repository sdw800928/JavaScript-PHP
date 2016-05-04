<?php

        
        //header("Access-Control-Allow-Origin: http://cs-server.usc.edu/");
        header('Access-Control-Allow-Origin: *');  
        header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Content-Range, Content-Disposition, Content-Description');

        if(isset($_GET["symbol"]))   
        {    
            echo '<html><head>  <meta name="viewport" content="width=device-width, initial-scale=1.0">        <script   src="https://code.jquery.com/jquery-2.2.2.js"   integrity="sha256-4/zUCqiq0kqxhZIyp4G0Gk+AOtCJsY1TA00k5ClsZYE="   crossorigin="anonymous"></script>        <script   src="https://code.jquery.com/ui/1.11.4/jquery-ui.js"   integrity="sha256-DI6NdAhhFRnO2k51mumYeDShet3I8AKCQf/tf7ARNhI="   crossorigin="anonymous"></script>  <script src="https://code.highcharts.com/stock/highstock.js"></script>        <script src="https://code.highcharts.com/stock/modules/exporting.js"></script>  <script src="chart.js"></script>
    </head>   <body>';
            echo "<div id='hg_graph' name='".$_GET["symbol"]."'></div>";
            echo '</body></html>';
        }
        else if(isset($_GET["input"]))   
        {    
            $jURL = "http://dev.markitondemand.com/MODApis/Api/v2/Lookup/json?input=".$_GET["input"];
            $handle = fopen($jURL,"rb");
            $content = "";
            while (!feof($handle)) {
                    $content .= fread($handle, 10000);
            }
            fclose($handle);
            //$content = json_decode($content);
            echo '{"myarray":'.$content."}";
        }
        
    
?>