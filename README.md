# lobbycal - wordpress plugin and standalone version

## Use in wordpress

To use the plugin in wordpress 

1. install the file lobbycal2press.zip
1. in your wordpress installation, adapt the URL to your lobbycal server account at Settings > Lobbycal2press
1. place the following html fragment in a page, wher you would like the calendar to appear 

```html 
<table id="lobbycal" aria-describedby="lobbycal_info">
	<thead>
		<tr>
			<th>Date</th>
			<th>End</th>
			<th>FirstName</th>
			<th>LastName</th>
			<th>Partners</th>
			<th>Title</th>
			<th>Tags</th>
		</tr>
	</thead>
</table>```