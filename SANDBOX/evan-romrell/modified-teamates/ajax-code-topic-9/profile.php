<?php
$id = filter_input(INPUT_GET, 'id');

if ($id == 1) {
    $profile = '<h3>Jesus:</h3><img src="http://mario.nintendo.com/img/mario_logo.png" style"float:left">'
            . '<p style="clear:both">This is a test.a;sldkjfa;slkdjf;alskdjf;alskdjf;alksjdf ;alksdjfa;lskdfja;sdlkfja; sdlkfja;sldkfja;skdlfj;asldkfj a;slkdfja;lskdjfa;lskdjf; alksdjf;alksdjf;alksdjf;alk sdjf;alksdjf;alksdjf;alskdjf ;alskdjf;alskdjf;alskdj f;alskdjf;aslkdfj;aslkdjf;aslk dfja;lsdkfja;slkdfj;asl kdjf;askldjfa;slkdjf</p>';
            
} else if ($id == 2) {
    $profile = '<h3>Didiana:</h3><img src="http://www.mariowiki.com/images/thumb/5/5c/Luigi_MP10.png/150px-Luigi_MP10.png" style"float:left">'
           . '<p style="clear:both">This is a test.a;sldkjfa;slkdjf;alskdjf;alskdjf;alksjdf ;alksdjfa;lskdfja;sdlkfja; sdlkfja;sldkfja;skdlfj;asldkfj a;slkdfja;lskdjfa;lskdjf; alksdjf;alksdjf;alksdjf;alk sdjf;alksdjf;alksdjf;alskdjf ;alskdjf;alskdjf;alskdj f;alskdjf;aslkdfj;aslkdjf;aslk dfja;lsdkfja;slkdfj;asl kdjf;askldjfa;slkdjf</p>';
            
} else if ($id == 3) {
    $profile = '<h3>Alicia:</h3><img src="http://www.mariowiki.com/images/thumb/d/d3/MLSS_-_Princess_Peach_Artwork.png/150px-MLSS_-_Princess_Peach_Artwork.png" style"float:left">'
            . '<p style="clear:both">This is a test.a;sldkjfa;slkdjf;alskdjf;alskdjf;alksjdf ;alksdjfa;lskdfja;sdlkfja; sdlkfja;sldkfja;skdlfj;asldkfj a;slkdfja;lskdjfa;lskdjf; alksdjf;alksdjf;alksdjf;alk sdjf;alksdjf;alksdjf;alskdjf ;alskdjf;alskdjf;alskdj f;alskdjf;aslkdfj;aslkdjf;aslk dfja;lsdkfja;slkdfj;asl kdjf;askldjfa;slkdjf</p>';
            
} 
echo $profile;
