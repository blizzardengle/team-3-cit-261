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

/**
 * Fix file permissions
 */
function chmod_r($path) {
    $dir = new DirectoryIterator($path);
    foreach ($dir as $item) {
        chmod($item->getPathname(), 0777);
        if ($item->isDir() && !$item->isDot()) {
            chmod_r($item->getPathname());
        }
    }
}
chmod_r("../cache");
chmod_r("../PROJECT");
chmod_r("../SANDBOX");

echo "All done."
?>