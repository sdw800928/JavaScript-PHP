<HTML>
    <HEAD>
        <title>HW06</title>
        <style type="text/css">
            BODY {
                text-align: center;
            }
            TABLE{
                border-collapse:collapse;
                background-color:WhiteSmoke   ;
            } 
            TD{ 
                border:1px solid #B0B0B0;
                padding-top:3px; 
                padding-bottom:3px; 
            } 
        </style>
        <SCRIPT LANGUAGE="JavaScript">
            function resetpage()
            {
                document.getElementById('Iaminput').value="";
                document.getElementById('canbereset').innerHTML="";
            }
        </SCRIPT>            
    </HEAD>
    <BODY>
        <TABLE align='center' style="text-align:center">
            <TR><TD><p style="font-size:36px; font-weight: bold;">Stock Search</p></TD></TR>
            <TR><TD >
            <FORM METHOD="GET" style="padding:8px;">
            Company Name or Symbol: 
            <?php 
            if(isset($_GET["submit"])||isset($_GET["isInfo"]))
            {
                echo "<INPUT type=\"text\" name=\"companyname\" id=\"Iaminput\" required oninvalid=\"this.setCustomValidity('Please enter Name or Symbol')\" oninput=\"setCustomValidity('')\" value= \"".$_GET["companyname"]."\" /><br>";
            }
            else
            {
                echo "<INPUT type=\"text\" name=\"companyname\" id=\"Iaminput\" required oninvalid=\"this.setCustomValidity('Please enter Name or Symbol')\" oninput=\"setCustomValidity('')\" value= \"\" /><br>";
            }
            ?>
            <INPUT type="submit" name="submit" value="Search"/>
            <INPUT type="button" value="Clear" onClick="resetpage()"/><br>
            <a target="_blank" href="http://www.markit.com/product/markit-on-demand">Powered by Markit on Demand</a>
            </FORM>
            </TD></TR>
        </TABLE>
        <br>
        <?php 
        if(isset($_GET["submit"]))
        {
            echo "<DIV id='canbereset'>";
            $request = "http://dev.markitondemand.com/MODApis/Api/v2/Lookup/xml?input=".$_GET["companyname"];
            $xmlDoc = new DOMDocument();
            $xmlDoc->load($request);
            $x=$xmlDoc->documentElement;
            if( $x->childNodes->length <=0)
            {
                echo "<b> No Record has been found </b>";
            }
            else{
                echo "<TABLE align='center' width='700'>";
                echo "<thead style='font-weight:bold'><TR>";
                echo "<TD>Name</TD><TD>Symbol</TD><TD>Exchange</TD><TD>Details</TD>";
                echo "</TR></thead>";
                foreach ($x->childNodes as $item)
                {
                    $DetailsURL="";
                    echo "<TR>";
                    $result=$item->childNodes;
                    
                    if($item->getElementsByTagName("Name")->item(0)->nodeType==1)
                        echo "<TD> ".$item->getElementsByTagName("Name")->item(0)->nodeValue." </TD>";
                    
                    $Symbol=$item->getElementsByTagName("Symbol")->item(0);
                    if($Symbol->nodeType==1)
                        echo "<TD> ".$Symbol->nodeValue." </TD>";
                    
                    if($item->getElementsByTagName("Exchange")->item(0)->nodeType==1)
                        echo "<TD> ".$item->getElementsByTagName("Exchange")->item(0)->nodeValue." </TD>";
                    
                    echo "<TD> <a href='stock.php?companyname=".$_GET["companyname"]."&isInfo=".$Symbol->nodeValue."'>More Info</a> </TD>";
                    
                    echo "</TR>";
                }
                echo "</TABLE>";
            }
            echo "</DIV>";
        }
        else if(isset($_GET["isInfo"]))
        {
            echo "<DIV id='canbereset'>";
            $jURL = "http://dev.markitondemand.com/MODApis/Api/v2/Quote/json?symbol=".$_GET["isInfo"];
            $handle = fopen($jURL,"rb");
            $content = "";
            while (!feof($handle)) {
                    $content .= fread($handle, 10000);
            }
            fclose($handle);
            $content = json_decode($content);
            if($content->{"Status"}=="SUCCESS")
            {
                echo "<TABLE align='center' width='700'>";
                foreach($content as $key => $val)
                {
                    if($key!="Status"&&$key!="MSDate")
                    {
                        $myvalue=$val;
                        if($key=="Change")
                        {
                            $myvalue=round($myvalue,2);
                            if($myvalue>0)
                                $myvalue .= "<img src='Green_Arrow_Up.png' width='15' height='15'>";
                            else if($myvalue<0)
                                $myvalue .= "<img src='Red_Arrow_Down.png' width='15' height='15'>";
                        }
                        else if($key=="ChangePercent"||$key=="ChangePercentYTD")
                        {
                            $myvalue=round($myvalue,2);
                            $myvalue .= "%";
                            if($myvalue>0)
                                $myvalue .= "<img src='Green_Arrow_Up.png' width='15' height='15'>";
                            else if($myvalue<0)
                                $myvalue .= "<img src='Red_Arrow_Down.png' width='15' height='15'>";
                        }
                        else if($key=="Timestamp")
                        {
                            $date= new DateTime($myvalue);
                            $myvalue=date_format($date,'Y-m-d h:i A');
                        }
                        else if($key=="MarketCap")
                        {
                            if($myvalue>=10000000)
                            {
                                $myvalue= $myvalue/1000000000;
                                $myvalue=round($myvalue,2);
                                $myvalue .= " B";      
                            }
                            else
                            {
                                $myvalue= $myvalue/1000000;
                                $myvalue=round($myvalue,2);
                                $myvalue .= " M";
                            }
                        }
                        else if($key=="Volume")
                        {
                            $myvalue= number_format($myvalue);                        
                        }
                        else if($key=="ChangeYTD")
                        {
                            $myvalue=$content->{"LastPrice"}-$myvalue;
                            $myvalue=round($myvalue,2);
                            if($myvalue>0)
                                $myvalue .= "<img src='Green_Arrow_Up.png' width='15' height='15'>";
                            else if($myvalue<0)
                                $myvalue ="(".$myvalue.")<img src='Red_Arrow_Down.png' width='15' height='15'>";
                        }
                        echo "<TR>";
                        echo "<TD style='font-weight:bold'>".$key."</TD>";
                        echo "<TD>".$myvalue."</TD>";
                        echo "</TR>";
                    }
                }
                echo "</TABLE>";
            }
            else
            {
                echo "There is no stock information available";
            }
            echo "</DIV>";
        }
        ?>
    </BODY>
</HTML>