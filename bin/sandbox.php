<?php

$teamates = explode(":",getTeamates());

function getTeamates(){
	$list = "";
	$dirArray = scandir("../SANDBOX");
	foreach($dirArray as $dir){
		if ($dir!="."&&$dir!=".."){
			if(is_dir("../SANDBOX/".$dir)){
				$list .= $dir.":";
			}
		}
	}
	return substr($list,0,strlen($list)-1);
}

function createTeamateLinks($teamArray){
	$list = "<ul>";
	foreach ($teamArray as $member){
		$list .= '<li class="teamateLinks"><a href="SANDBOX/'.$member.'" onclick="loadSandbox(this,\''.$member.'\');">'.str_replace("-"," ",$member).'</a></li>';
	}
	$list .= "</ul>";
	return $list;
}

function createPortfolioLinks($member){
	$list = "";
	$root = "../SANDBOX/".$member;
	$dirArray = scandir($root);
	foreach($dirArray as $file){
		if ($file=="portfolio.txt"||$file=="portfolio.html"){
			$url = file_get_contents($root."/".$file);
			if (strlen($url)>1){
				$list = '<li class="teamateLinks"><a href="'.$url.'" target="_blank">'.str_replace("-"," ",$member).'</a></li>';
			} else {
				$list = '<li class="teamateLinks">'.str_replace("-"," ",$member).'</li>';
			}
		}
	}
	return $list;
}

function createSandboxLinks($member){
	$result = "";
	$root = "../SANDBOX/".$member;
	$dirArray = scandir($root);
	foreach($dirArray as $dir){
		if ($dir!="."&&$dir!=".."&&is_dir($root."/".$dir)){
			// Title
			$result .= '<div class="sandboxTitle">'.str_replace("-"," ",$dir).'</div><br>';
			$children = $dirArray = scandir($root."/".$dir);
			foreach($children as $child){
				// Add all child of parent (projects)
				if ($child!="."&&$child!=".."&&is_dir($root."/".$dir."/".$child)){
					// Make links only if it has a readme
					$readme = $root."/".$dir."/".$child."/readme.md";
					if(file_exists($readme)){
						$result .= readReadme($readme,"SANDBOX/".$member."/".$dir."/".$child)."<br>";
					}
				}
			}
		}
	}
	return $result;
}

function readReadme($file,$path){
	$handle = fopen($file,"r");
	$result = "";
	if ($handle) {
		$counter = 0;
		while (($line = fgets($handle)) !== false) {
			if($counter==0){
				$result .= '<div class="sandboxProject"><div class="title"><a href="'.$path.'" target="_blank">'.trim(str_replace("#","",$line)).'</a></div>';
			} else {
				$result .= $line;
			}
			$counter++;
		}
		fclose($handle);
		$result .= "</div>";
	} else {
		$result = '<div class="sandboxProject"><div class="title"><a href="'.$path.'" target="_blank">'.str_replace("-","",$path).'</a></div></div>';
	} 
	return $result;
}

?>