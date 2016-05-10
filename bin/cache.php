<?php
/**
 * Pull in the scripts that handle working with our SANDBOX area
 */
require ("sandbox.php");

/**
 * Make teamate sandbox links
 */
$file = fopen("../cache/sandboxLinks.html","w");
fwrite($file,createTeamateLinks($teamates));
fclose($file);

/**
 * Make each memebers sandbox (projects) links
 */
foreach ($teamates as $member){
	$file = fopen("../cache/".$member.".html","w");
	fwrite($file,createSandboxLinks($member));
	fclose($file);
}
?>