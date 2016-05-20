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
 * Make teamate portfolio links
 */
$results = "<ul>";
foreach ($teamates as $member){
	$results .= createPortfolioLinks($member);	
}
$results .= "</ul>";
$file = fopen("../cache/portfolioLinks.html","w");
fwrite($file,$results);
fclose($file);

/**
 * Make each memebers sandbox (projects) links
 */
foreach ($teamates as $member){
	$file = fopen("../cache/s-".$member.".html","w");
	fwrite($file,createSandboxLinks($member));
	fclose($file);
}

echo "Done."
?>