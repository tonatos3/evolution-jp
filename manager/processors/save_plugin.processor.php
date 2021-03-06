<?php
if(!defined('IN_MANAGER_MODE') || IN_MANAGER_MODE != 'true') exit();

if(!$modx->hasPermission('save_plugin')) {
    $e->setError(3);
    $e->dumpError();
}

if(isset($_POST['id']) && preg_match('@^[0-9]+$@',$_POST['id'])) $id = $_POST['id'];
$name = $modx->db->escape(trim($_POST['name']));
$description = $modx->db->escape($_POST['description']);
$locked = $_POST['locked']=='on' ? '1' : '0' ;
$plugincode = $modx->db->escape($_POST['post']);
$properties = $modx->db->escape($_POST['properties']);
$disabled = $_POST['disabled']=="on" ? '1' : '0';
$moduleguid = $modx->db->escape($_POST['moduleguid']);
$sysevents = $_POST['sysevents'];

//Kyle Jaebker - added category support
if (empty($_POST['newcategory']) && $_POST['categoryid'] > 0) {
    $category = $modx->db->escape($_POST['categoryid']);
} elseif (empty($_POST['newcategory']) && $_POST['categoryid'] <= 0) {
    $category = '0';
} else {
    include_once($modx->config['core_path'].'categories.inc.php');
    $catCheck = checkCategory($modx->db->escape($_POST['newcategory']));
    if ($catCheck) $category = $catCheck;
    else           $category = newCategory($_POST['newcategory']);
}

if($name=='') $name = 'Untitled plugin';

$tbl_site_plugins = $modx->getFullTableName('site_plugins');
switch ($_POST['mode']) {
    case '101':

        // invoke OnBeforePluginFormSave event
        $modx->invokeEvent('OnBeforePluginFormSave',
                                array(
                                    'mode'  => 'new',
                                    'id'    => ''
                                ));
    
		// disallow duplicate names for new plugins
		$rs = $modx->db->select('COUNT(id)',$tbl_site_plugins,"name='{$name}'");
		$count = $modx->db->getValue($rs);
		if($count > 0) {
			$modx->event->alert(sprintf($_lang['duplicate_name_found_general'], $_lang['plugin'], $name));

			// prepare a few variables prior to redisplaying form...
			$content = array();
			$_REQUEST['a'] = '101';
			$_GET['a'] = '101';
			$_GET['stay'] = $_POST['stay'];
			$content = array_merge($content, $_POST);
			$content['locked'] = $locked;
			$content['plugincode'] = $_POST['post'];
			$content['category'] = $_POST['categoryid'];
			$content['disabled'] = $disabled;
			$content['properties'] = $properties;
			$content['moduleguid'] = $moduleguid;
			$content['sysevents'] = $sysevents;

			include 'header.inc.php';
			include(dirname(dirname(__FILE__)).'/actions/mutate_plugin.dynamic.php');
			include 'footer.inc.php';
			
			exit;
		}

		//do stuff to save the new plugin
		$f = compact('name', 'description', 'plugincode', 'disabled', 'moduleguid', 'locked', 'properties', 'category');
        $newid = $modx->db->insert($f, $tbl_site_plugins);
        if(!$newid) {
            echo "Couldn't get last insert key!";
            exit;
        }
        
        // save event listeners
        saveEventListeners($newid,$sysevents,$_POST['mode']);
        
        // invoke OnPluginFormSave event
        $modx->invokeEvent('OnPluginFormSave',
                                array(
                                    'mode'  => 'new',
                                    'id'    => $newid
                                ));
        
        // empty cache
        $modx->clearCache(); // first empty the cache
        // finished emptying cache - redirect
        if($_POST['stay']!='') {
            $a = ($_POST['stay']=='2') ? "102&id={$newid}":"101";
            $header="Location: index.php?a={$a}&stay=".$_POST['stay'];
        } else {
            $header="Location: index.php?a=76";
        }
        header($header);
        break;
    case '102':

        // invoke OnBeforePluginFormSave event
        $modx->invokeEvent("OnBeforePluginFormSave",
                                array(
                                    'mode'  => 'upd',
                                    'id'    => $id
                                ));
     
        //do stuff to save the edited plugin
        $f = compact('name', 'description', 'plugincode', 'disabled', 'moduleguid', 'locked', 'properties', 'category');
        $rs = $modx->db->update($f, $tbl_site_plugins, "id='{$id}'");
        if(!$rs){
            echo "\$rs not set! Edited plugin not saved!";
        }
        else {
            // save event listeners
            saveEventListeners($id,$sysevents,$_POST['mode']);

            // invoke OnPluginFormSave event
            $modx->invokeEvent('OnPluginFormSave',
                                    array(
                                        'mode'  => 'upd',
                                        'id'    => $id
                                    ));
            
            // empty cache
            $modx->clearCache(); // first empty the cache
            // finished emptying cache - redirect
            if($_POST['stay']!='') {
                $a = ($_POST['stay']=='2') ? "102&id={$id}":"101";
                $header="Location: index.php?a={$a}&stay=".$_POST['stay'];
            } else {
                $header='Location: index.php?a=76';
            }
            header($header);
        }
        break;
    default:
    ?>
        Erm... You supposed to be here now?
    <?php
}


# Save Plugin Event Listeners
function saveEventListeners($id,$sysevents,$mode) {
    global $modx;
    // save selected system events
    $tblSitePluginEvents = $modx->getFullTableName('site_plugin_events');
    $sql = "INSERT INTO {$tblSitePluginEvents} (pluginid,evtid,priority) VALUES ";
    for($i=0;$i<count($sysevents);$i++){
        if ($mode == '101') {
            $prioritySql = "select max(priority) as priority from {$tblSitePluginEvents} where evtid={$sysevents[$i]}";
        } else {
            $prioritySql = "select priority from {$tblSitePluginEvents} where evtid={$sysevents[$i]} and pluginid={$id}";
        }
        $rs = $modx->db->query($prioritySql);
        $prevPriority = $modx->db->getRow($rs);
        if ($mode == '101') {
            $priority = isset($prevPriority['priority']) ? $prevPriority['priority'] + 1 : 1;
        } else {
            $priority = isset($prevPriority['priority']) ? $prevPriority['priority'] : 1;
        }
        if($i>0) $sql.=",";
        $sql.= "(".$id.",".$sysevents[$i].",".$priority.")";
    }
    $modx->db->query("DELETE FROM {$tblSitePluginEvents} WHERE pluginid={$id}");
    if (count($sysevents)>0) $modx->db->query($sql);
}
