        <?php
        //header("Access-Control-Allow-Origin: http://cs-server.usc.edu/");
header('Access-Control-Allow-Origin: *');  
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Content-Range, Content-Disposition, Content-Description');
        if(isset($_GET["symbol"]))            
        {
            $jURL = "http://dev.markitondemand.com/MODApis/Api/v2/Quote/json?symbol=".$_GET["symbol"];
            $handle = fopen($jURL,"rb");
            $content = "";
            while (!feof($handle)) {
                    $content .= fread($handle, 10000);
            }
            fclose($handle);
            $content = json_decode($content);
            if($content->{"Status"}=="SUCCESS")
            {
                $response = array();
                foreach($content as $key => $val)
                {
                    if($key!="Status"&&$key!="MSDate")
                    {
                        $myvalue=$val;
                        if($key=="Name"||$key=="Volume"||$key=="Symbol")
                        {
                            $response[$key]=$myvalue;
                        }
                        else if($key=="LastPrice")
                        {
                            $myvalue=round($myvalue,2);
                            $response["Last Price"]="$ ".$myvalue;                        
                        }
                        else if($key=="Change"||$key=="ChangePercent"||$key=="ChangeYTD"||$key=="ChangePercentYTD")
                        {
                            $myvalue=round($myvalue,2);
                            $response[$key]=$myvalue;
                        }
                        else if($key=="Timestamp")
                        {
                            $date= new DateTime($myvalue);
                            $myvalue=date_format($date,'M d Y h:i');
                            $response["Time and Date"]=$myvalue;
                        }
                        else if($key=="MarketCap")
                        {
                            if($myvalue>=100000000)
                            {
                                $myvalue= $myvalue/1000000000;
                                $myvalue=round($myvalue,2);
                                $myvalue .= " Billions";      
                            }
                            else if($myvalue>=100000)
                            {
                                $myvalue= $myvalue/1000000;
                                $myvalue=round($myvalue,2);
                                $myvalue .= " Million";
                            }
                            else
                                $myvalue=round($myvalue,2);
                            $response["Market Cap"]=$myvalue;
                        }
                        else if($key=="High")
                        {
                            $myvalue=round($myvalue,2);
                            $response["High Price"]="$ ".$myvalue;
                            
                        }
                        else if($key=="Low")
                        {
                            $myvalue=round($myvalue,2);
                            $response["Low Price"]="$ ".$myvalue;
                            
                        }
                        else if($key=="Open")
                        {
                            $myvalue=round($myvalue,2);
                            $response["Opening Price"]="$ ".$myvalue;                            
                        }
                    }
                }
                
                //BING SEARCH
                error_reporting(~0);
                ini_set('display_errors', 1);
                
                $username = 'n6jDBT95Wiv3T01mdKKad78v9TDUJtlwTJSolcSC1RQ';
                $password = 'n6jDBT95Wiv3T01mdKKad78v9TDUJtlwTJSolcSC1RQ';
                $myurl = "https://api.datamarket.azure.com/Bing/Search/v1/News?Query=%27".$_GET["symbol"].'%27&$format=json';
                $context = stream_context_create(array(
                    'http' => array(
                        'header'  => "Authorization: Basic " . base64_encode("$username:$password")
                    )
                ));
                
                $data = file_get_contents($myurl, false, $context);
                
                $data=json_decode($data, true);
                
                $temarray= array();
                $resultarr = array();
                foreach($data['d']['results'] as $key => $val)
                {                    
                    $temarray['Url']=$val['Url'];
                    $temarray['Title']=$val['Title']; 
                    $temarray['Content']=$val['Description'];
                    $temarray['Publisher']=$val['Source'];
                    $temarray['Date']=$val['Date'];
                    array_push($resultarr,$temarray);
                }
                                
                
                $response["BINGSEAR"]=$resultarr;
                
                //echo '(function () { })('.json_encode($response).')';
                echo json_encode($response);
            }
            else
            {
                echo "There is no stock information available";
            }
            
        }
        ?>