<?php
 // Fill up array with names
$a[]="algebra";
$a[]="archaeology";
$a[]="art";
$a[]="band";
$a[]="biology";
$a[]="botany";
$a[]="calculus";
$a[]="chemistry";
$a[]="computer science";
$a[]="drama";
$a[]="economics";
$a[]="English";
$a[]="French";
$a[]="geography";
$a[]="geology";
$a[]="geometry";
$a[]="German";
$a[]="gym";
$a[]="health";
$a[]="history";
$a[]="home economics";
$a[]="keyboarding";
$a[]="language arts";
$a[]="literature";
$a[]="math";
$a[]="mathematics";
$a[]="music";
$a[]="PE";
$a[]="physical education";
$a[]="physics";
$a[]="psychology";
$a[]="reading";
$a[]="science";
$a[]="social studies";
$a[]="world geography";
$a[]="writing*/";

 //get the q parameter from URL
 $q=$_GET["q"];

 //lookup all hints from array if length of q>0
 if (strlen($q) > 0)
 {
  $hint="";
  for($i=0; $i<count($a); $i++)
  {
   if (strtolower($q)==strtolower(substr($a[$i],0,strlen($q))))
  {
    if ($hint=="")
    {
     $hint=$a[$i];
    }
    else
    {
     $hint=$hint." , ".$a[$i];
    }
   }
  }
 }

// Set output to "no suggestion" if no hint were found
// or to the correct values
if ($hint == "")
 {
  $response="no suggestion";
 }
 else
 {
  $response=$hint;
 }

 //output the response
echo $response;
?>