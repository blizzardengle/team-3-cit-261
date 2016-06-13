<div class="h-five">Add New Shipping Company</div><br>
<form action="shipping-company.php" method="post" enctype="multipart/form-data" class="u-fill-75 u-align-middle">
	<div class="row">
		<div class="span-6">
			<div class="content">
				<label>Name: <input type="text" name="name" maxlength="50"></label>
			</div>
		</div>
		<div class="span-6">
			<div class="content">
				<label>Friendly ID: <input type="text" name="id" maxlength="20"></label>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="span-12">
			<div class="content">
				<label>Description: <textarea name="description" maxlength="150"></textarea></label>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="span-12">
			<div class="content u-text-center">
				<input type="button">
				<input type="submit">
			</div>
		</div>
	</div>
</form>