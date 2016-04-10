<?php
if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly
/*
 * Plugin Name: lobbycal2press for wordpress
 * Plugin URI: http://lobbycal.transparency.eu
 * Description: Plugin to display meetings from lobbycal.transparency.eu
 * Version: 2.0
 * Author: lobbycal dev
 * Author URI: http://lobbycal.transparency.eu
 * License: GPL
 */
function lobbycal2press_scripts() {
	
	// Load custom scripts
	wp_enqueue_script ( 'jquery', plugin_dir_url ( __FILE__ ) . './js/jquery.js', array (
			'jquery'
	), '2.0', true );wp_enqueue_script ( 'jquery.spring-friendly', plugin_dir_url ( __FILE__ ) . './js/jquery.spring-friendly.js', array (
			'jquery'
	), '2.0', true );
	wp_enqueue_script ( 'jquery.datatables', plugin_dir_url ( __FILE__ ) . './js/jquery.datatables.js', array (
			'jquery' 
	), '2.0', true );
	wp_enqueue_script ( 'moment.min', plugin_dir_url ( __FILE__ ) . './js/moment.min.js', array (
			'jquery' 
	), '2.0', true );
	
	wp_enqueue_script ( 'lobbycal2press', plugin_dir_url ( __FILE__ ) . './js/lobbycal2press.js', array (
			'jquery' 
	), '2.0', true );
	
	// Load custom styles
	
	wp_enqueue_style ( 'lobbycal2press', plugin_dir_url ( __FILE__ ) . './css/custom.css' );
	wp_enqueue_style ( 'lobbycal2press-jqdt', plugin_dir_url ( __FILE__ ) . './css/jquery.datatables.css' );
	// Configure according to settings
	function lc2p_js_variables() {
		$options = get_option ( 'lobbycal2press_settings' );
		?>
<script type="text/javascript">
			var lc2pUrl = '<?php echo $options['lobbycal2press_text_field_apiURL']; ?>';

	        var lc2pShowStart  = '<?php echo $options['lobbycal2press_checkbox_field_start']; ?>';

	        var lc2pShowEnd = '<?php echo $options['lobbycal2press_checkbox_field_end']; ?>';
	        
	        var lc2pDateFormat = '<?php echo $options['lobbycal2press_text_field_dateFormat']; ?>';

	        var lc2pMomentLocale = '<?php echo $options['lobbycal2press_text_field_momentLocale']; ?>';

	        var lc2pShowFirstName  = '<?php echo $options['lobbycal2press_checkbox_field_firstname']; ?>';

	        var lc2pShowLastName  = '<?php echo $options['lobbycal2press_checkbox_field_lastname']; ?>';

	        var lc2pShowTitle = '<?php echo $options['lobbycal2press_checkbox_field_title']; ?>';

	        var lc2pShowPartner  = '<?php echo $options['lobbycal2press_checkbox_field_partner']; ?>';

	        var lc2pShowTags  = '<?php echo $options['lobbycal2press_checkbox_field_tags']; ?>';

	        var lc2pShowTagsTitle  = '<?php echo $options['lobbycal2press_checkbox_field_tagsTitle']; ?>';
	        
	        var lc2pOrder = '<?php echo $options['lobbycal2press_radio_field_order']; ?>';
	        lc2pOrder = (lc2pOrder === undefined) ? 'date asc' : lc2pOrder;
	        lc2pOrder = (lc2pOrder === '') ? 'date asc' : lc2pOrder;
	        var lc2pPerPage  = '<?php echo $options['lobbycal2press_text_field_perPage']; ?>';
	        lc2pPerPage = (lc2pPerPage === undefined) ? 10 : lc2pPerPage;
	        lc2pPerPage = (lc2pPerPage === '') ? 10 : lc2pPerPage;
		</script>
<?php
	}
	add_action ( 'wp_head', 'lc2p_js_variables' );
}

add_action ( 'wp_enqueue_scripts', 'lobbycal2press_scripts' );

add_action ( 'admin_menu', 'lobbycal2press_add_admin_menu' );
add_action ( 'admin_init', 'lobbycal2press_settings_init' );
function lobbycal2press_add_admin_menu() {
	add_options_page ( 'lobbycal2press', 'lobbycal2press', 'manage_options', 'lobbycal2press', 'lobbycal2press_options_page' );
}
function lobbycal2press_settings_init() {
	register_setting ( 'pluginPage', 'lobbycal2press_settings' );
	
	add_settings_section ( 'lobbycal2press_pluginPage_section', __ ( 'Settings for lobbycal2press plugin', 'lobbycal2press' ), 'lobbycal2press_settings_section_callback', 'pluginPage' );
	
	add_settings_field ( 'lobbycal2press_text_field_apiURL', __ ( 'API URL for your MEP ', 'lobbycal2press' ), 'lobbycal2press_text_field_apiURL_render', 'pluginPage', 'lobbycal2press_pluginPage_section' );
	add_settings_field ( 'lobbycal2press_text_field_perPage', __ ( 'Number of meetings to display on a table page', 'lobbycal2press' ), 'lobbycal2press_text_field_perPage_render', 'pluginPage', 'lobbycal2press_pluginPage_section' );
	
	add_settings_field ( 'lobbycal2press_checkbox_field_start', __ ( 'Display column for start date?', 'lobbycal2press' ), 'lobbycal2press_checkbox_field_start_render', 'pluginPage', 'lobbycal2press_pluginPage_section' );
	add_settings_field ( 'lobbycal2press_checkbox_field_title', __ ( 'Display column for title', 'lobbycal2press' ), 'lobbycal2press_checkbox_field_title_render', 'pluginPage', 'lobbycal2press_pluginPage_section' );
	add_settings_field ( 'lobbycal2press_checkbox_field_partner', __ ( 'Display column for partner?', 'lobbycal2press' ), 'lobbycal2press_checkbox_field_partner_render', 'pluginPage', 'lobbycal2press_pluginPage_section' );
	
	add_settings_field ( 'lobbycal2press_checkbox_field_tags', __ ( 'Display column for tags?', 'lobbycal2press' ), 'lobbycal2press_checkbox_field_tags_render', 'pluginPage', 'lobbycal2press_pluginPage_section' );
	add_settings_field ( 'lobbycal2press_checkbox_field_tagsTitle', __ ( 'Display tags with title?', 'lobbycal2press' ), 'lobbycal2press_checkbox_field_tagsTitle_render', 'pluginPage', 'lobbycal2press_pluginPage_section' );
	
	add_settings_field ( 'lobbycal2press_checkbox_field_end', __ ( 'Display column for end date?', 'lobbycal2press' ), 'lobbycal2press_checkbox_field_end_render', 'pluginPage', 'lobbycal2press_pluginPage_section' );
	add_settings_field ( 'lobbycal2press_text_field_dateFormat', __ ( 'Date format <br/> see <a href="http://momentjs.com/"> here </a> for options', 'lobbycal2press' ), 'lobbycal2press_text_field_dateFormat_render', 'pluginPage', 'lobbycal2press_pluginPage_section' );
	add_settings_field ( 'lobbycal2press_text_field_momentLocale', __ ( 'Language for dates <br/>Possible values: en,es,fr,sv,hu,de ... for all supported languages see <a href="http://momentjs.com/"> here </a> options', 'lobbycal2press' ), 'lobbycal2press_text_field_momentLocale_render', 'pluginPage', 'lobbycal2press_pluginPage_section' );
	
	add_settings_field ( 'lobbycal2press_checkbox_field_firstname', __ ( 'Display column for MEP first name?', 'lobbycal2press' ), 'lobbycal2press_checkbox_field_firstname_render', 'pluginPage', 'lobbycal2press_pluginPage_section' );
	
	add_settings_field ( 'lobbycal2press_checkbox_field_lastname', __ ( 'Display column for MEP last name?', 'lobbycal2press' ), 'lobbycal2press_checkbox_field_lastname_render', 'pluginPage', 'lobbycal2press_pluginPage_section' );
	
	add_settings_field ( 'lobbycal2press_radio_field_order', __ ( 'What is the default order when loaded for the first time?', 'lobbycal2press' ), 'lobbycal2press_radio_field_order_render', 'pluginPage', 'lobbycal2press_pluginPage_section' );
	
	add_settings_field ( 'lobbycal2press_textarea_field_example', __ ( 'Use this code to place the calendar in a post or page. Be sure to include the <B>complete<B> snippet. Only columns checked above will be displayed to your visitors ', 'lobbycal2press' ), 'lobbycal2press_textarea_field_example_render', 'pluginPage', 'lobbycal2press_pluginPage_section' );
}
function lobbycal2press_text_field_apiURL_render() {
	$options = get_option ( 'lobbycal2press_settings' );
	?>
<input type='text'
	name='lobbycal2press_settings[lobbycal2press_text_field_apiURL]'
	size="60"
	value='<?php echo $options['lobbycal2press_text_field_apiURL']; ?>'>
<?php
}
function lobbycal2press_textarea_field_example_render() {
	$options = get_option ( 'lobbycal2press_settings' );
	?><textarea id="textarea_example"
	name="lobbycal2press_settings[lobbycal2press_textarea_field_example]"
	rows="14" cols="50">&lt;table id=&quot;lobbycal&quot; aria-describedby=&quot;lobbycal_info&quot;&gt;
	&lt;thead&gt;
		&lt;tr&gt;
			&lt;th&gt;Start&lt;/th&gt;
			&lt;th&gt;End&lt;/th&gt;
			&lt;th&gt;FirstName&lt;/th&gt;
			&lt;th&gt;LastName&lt;/th&gt;
			&lt;th&gt;Partners&lt;/th&gt;
			&lt;th&gt;Title&lt;/th&gt;
			&lt;th&gt;Tags&lt;/th&gt;
		&lt;/tr&gt; 
	&lt;/thead&gt;
&lt;/table&gt; 	
</textarea>

<?php
}
function lobbycal2press_text_field_perPage_render() {
	$options = get_option ( 'lobbycal2press_settings' );
	?>
<input type='text'
	name='lobbycal2press_settings[lobbycal2press_text_field_perPage]'
	size="60"
	value='<?php echo $options['lobbycal2press_text_field_perPage'];  ?>'>
<?php
}
function lobbycal2press_checkbox_field_start_render() {
	$options = get_option ( 'lobbycal2press_settings' );
	?>
<input type='checkbox'
	name='lobbycal2press_settings[lobbycal2press_checkbox_field_start]'
	<?php checked( $options['lobbycal2press_checkbox_field_start'], 1 ); ?>
	value='1'>
<?php
}
function lobbycal2press_checkbox_field_end_render() {
	$options = get_option ( 'lobbycal2press_settings' );
	?>
<input type='checkbox'
	name='lobbycal2press_settings[lobbycal2press_checkbox_field_end]'
	<?php checked( $options['lobbycal2press_checkbox_field_end'], 1 ); ?>
	value='1'>
<?php
}
function lobbycal2press_text_field_dateFormat_render() {
	$options = get_option ( 'lobbycal2press_settings' );
	?>
<input type='text'
	name='lobbycal2press_settings[lobbycal2press_text_field_dateFormat]'
	size="60"
	value='<?php echo $options['lobbycal2press_text_field_dateFormat'];  ?>'>
<?php
}
function lobbycal2press_text_field_momentLocale_render() {
	$options = get_option ( 'lobbycal2press_settings' );
	?>
<input type='text'
	name='lobbycal2press_settings[lobbycal2press_text_field_momentLocale]'
	size="60"
	value='<?php echo $options['lobbycal2press_text_field_momentLocale'];  ?>'>
<?php
}
function lobbycal2press_checkbox_field_title_render() {
	$options = get_option ( 'lobbycal2press_settings' );
	?>
<input type='checkbox'
	name='lobbycal2press_settings[lobbycal2press_checkbox_field_title]'
	<?php checked( $options['lobbycal2press_checkbox_field_title'], 1 ); ?>
	value='1'>
<?php
}
function lobbycal2press_checkbox_field_partner_render() {
	$options = get_option ( 'lobbycal2press_settings' );
	?>
<input type='checkbox'
	name='lobbycal2press_settings[lobbycal2press_checkbox_field_partner]'
	<?php checked( $options['lobbycal2press_checkbox_field_partner'], 1 ); ?>
	value='1'>
<?php
}
function lobbycal2press_checkbox_field_firstname_render() {
	$options = get_option ( 'lobbycal2press_settings' );
	?>
<input type='checkbox'
	name='lobbycal2press_settings[lobbycal2press_checkbox_field_firstname]'
	<?php checked( $options['lobbycal2press_checkbox_field_firstname'], 1 ); ?>
	value='1'>
<?php
}
function lobbycal2press_checkbox_field_lastname_render() {
	$options = get_option ( 'lobbycal2press_settings' );
	?>
<input type='checkbox'
	name='lobbycal2press_settings[lobbycal2press_checkbox_field_lastname]'
	<?php checked( $options['lobbycal2press_checkbox_field_lastname'], 1 ); ?>
	value='1'>
<?php
}
function lobbycal2press_checkbox_field_tags_render() {
	$options = get_option ( 'lobbycal2press_settings' );
	?>
<input type='checkbox'
	name='lobbycal2press_settings[lobbycal2press_checkbox_field_tags]'
	<?php checked( $options['lobbycal2press_checkbox_field_tags'], 1 ); ?>
	value='1'>
<?php
}
function lobbycal2press_checkbox_field_tagsTitle_render() {
	$options = get_option ( 'lobbycal2press_settings' );
	?>
<input type='checkbox'
	name='lobbycal2press_settings[lobbycal2press_checkbox_field_tagsTitle]'
	<?php checked( $options['lobbycal2press_checkbox_field_tagsTitle'], 1 ); ?>
	value='1'>
<?php
}
function lobbycal2press_radio_field_order_render() {
	$options = get_option ( 'lobbycal2press_settings' );
	?>
<input type='radio'
	name='lobbycal2press_settings[lobbycal2press_radio_field_order]'
	<?php checked( $options['lobbycal2press_radio_field_order'], 'startDate asc'); ?>
	value='startDate asc'>
Start date ascending
</input>
<br />
<input type='radio'
	name='lobbycal2press_settings[lobbycal2press_radio_field_order]'
	<?php checked( $options['lobbycal2press_radio_field_order'],  'startDate desc'); ?>
	value='startDate desc'>
Start date descending
</input>
<br />
<input type='radio'
	name='lobbycal2press_settings[lobbycal2press_radio_field_order]'
	<?php checked( $options['lobbycal2press_radio_field_order'], 'endDate asc'); ?>
	value='endDate asc'>
End date ascending
</input>
<br />
<input type='radio'
	name='lobbycal2press_settings[lobbycal2press_radio_field_order]'
	<?php checked( $options['lobbycal2press_radio_field_order'],  'endDate desc'); ?>
	value='endDate desc'>
End date descending
</input>
<br />



<input type='radio'
	name='lobbycal2press_settings[lobbycal2press_radio_field_order]'
	<?php checked( $options['lobbycal2press_radio_field_order'], 'userLastName asc'); ?>
	value='userLastName asc'>
Last name ascending
</input>
<br />
<input type='radio'
	name='lobbycal2press_settings[lobbycal2press_radio_field_order]'
	<?php checked( $options['lobbycal2press_radio_field_order'],  'userLastName desc'); ?>
	value='userLastName desc'>
Last name descending
</input>
<br />


<?php
}
function lobbycal2press_settings_section_callback() {
	echo __ ( 'The URL and at least one field are mandatory for the plugin to work. <br/> Make sure to use the https protocol here if your websites are accessed via https themselves.<br/> The default sorting of meetings is latest first.', 'lobbycal2press' );
}
function lobbycal2press_options_page() {
	?>
<form action='options.php' method='post'>

	<h2>lobbycal2press</h2>
		
		<?php
	settings_fields ( 'pluginPage' );
	do_settings_sections ( 'pluginPage' );
	submit_button ();
	?>
		
	</form>
<?php
}

?>