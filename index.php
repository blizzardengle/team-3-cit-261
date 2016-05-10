<!DOCTYPE html>
<html>
	<head>
		<title>Team 3 Project Website</title>
		<meta charset="UTF-8">
		<meta name="author" content="Chris Keers">
		<meta name="description" content="Team 3 group website for Brigham Young University - Idaho's Spring 2016 CIT 261 Mobile Application Development class">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<link rel="stylesheet" type="text/css" href="css/style.css">
	</head>
	<body>
		<div id="wrapper">
			<div class="sidebar">
				<div class="logo"><img src="byui-logo.png" alt="BYUI Logo"></div>
				<p>&nbsp;</p>
				<div class="secTitle">Team Sandboxes</div>
				<?php
					echo file_get_contents("cache/sandboxLinks.html");
				?>
				<br>
				<div class="secTitle">Team Project</div>
				<ul>
					<li class="teamateLinks"><a href="PROJECT" target="_blank">View Project Here</a></li>
				</ul>
			</div>
			<div class="content">
				<h1>Welcome</h1>
				<p class="des">You have reached team three's group repository for Brigham Young University - Idaho's Spring 2016 CIT 261 Mobile Application Development class. Please feel free to poke around using the navigation links on the side.</p>
				<div id="output"></div>
			</div>
		</div>
		<script type="text/javascript" src="js/scripts.js"></script>
	</body>
</html>

