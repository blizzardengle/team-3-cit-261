<!DOCTYPE html>
<html>
	<head>
		<title>Barebones Framework</title>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<link rel="stylesheet" type="text/css" href="css/barebones.css">
		<link rel="stylesheet" type="text/css" href="css/font-awesome.min.css">
		<script type="text/javascript" src="js/script.js"></script>
	</head>
	<body class="ltr">
		<!-- The entire page should be wrapped in a div -->
		<div class="wrapper">
			<!-- Middle -->
			<div class="row">
				<div class="sidebar sidebar-left">
					<!-- Navigation should not be in a content div place it before or after the sidebar's content div -->
					<nav>
						<a href="" class="home-btn">
						<i class="fa fa-home"></i>
						</a>
						<ul>
							<li class="selected">
								<a href="#" onclick="navigate('CABOODLE/HOME.PHP');">
									<i class="fa fa-dashboard"></i>
									Dashboard
								</a>
							</li>
							<li>
								<a href="#" data-submenu-parent="orders">
									<i class="fa fa-file-text-o"></i>
									Orders
								</a>
							</li>
							<li>
								<a href="#" data-submenu-parent="products">
									<i class="fa fa-cube"></i>
									Products
								</a>
							</li>
							<li>
								<a href="#" data-submenu-parent="reports">
									<i class="fa fa-bar-chart"></i>
									Reports
								</a>
							</li>
							<li>
								<a href="#" data-submenu-parent="system">
									<i class="fa fa-cog"></i>
									System
								</a>
							</li>
						</ul>
						<!-- Sub-menus -->
						<div class="submenu" data-submenu="orders">
							<div class="title">Orders<i class="close fa fa-close"></i></div>
							<ul>
								<li><a href="#" onclick="navigate('');">Create new order</a></li>
								<li><a href="#" onclick="navigate('');">View Order History</a></li>
								<li><a href="#" onclick="navigate('');">Cancel order</a></li>
							</ul>
						</div>
						<div class="submenu" data-submenu="products">
							<div class="title">Products<i class="close fa fa-close"></i></div>
							<ul>
								<li><a href="#" onclick="navigate();">Catalog</a></li>
							</ul>
						</div>
						<div class="submenu" data-submenu="reports">
							<div class="title">Reports<i class="close fa fa-close"></i></div>
							<ul>
								<li><a href="#" onclick="navigate();">All Reports</a></li>
								<li><a href="#" onclick="navigate();">Company Name</a></li>
							</ul>
						</div>
						<div class="submenu" data-submenu="system">
							<div class="title">System<i class="close fa fa-close"></i></div>
							<ul>
								<li><a href="#" onclick="navigate();">Settings</a></li>
								<li><a href="#" onclick="navigate();">User Accounts</a></li>
							</ul>
						</div>
					</nav>
				</div>
				<main>
				<div class="main-content-left">
					<div class="content">
						<!-- HEADER -->
						<div class="row">
							<div class="span-12">
								<div class="content">
									<div id="headerNav" class="row">
										<div id="breadcrumbs">Where Your At Here</div> <div id="logout" title="Logout">Username <i class="fa fa-power-off"></i></div>
									</div>
									<div id="displayArea" class="row">
										...
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				</main>
			</div>
			<!-- Middle canvas -->
			<div class="row" id="pg-content-canvas" aria-hidden="true">
				<div class="sidebar-left">
					<div class="content">
						<!-- Sidebar left, leave empty -->
						<div class="submenu">
							<!-- Sub-menu, leave empty -->
						</div>
					</div>
				</div>
				<div class="main-content-left">
					<div class="content">
						<!-- Middle page content, leave empty -->
					</div>
				</div>
			</div>
		</div>
	</body>
</html>
