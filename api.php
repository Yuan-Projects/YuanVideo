<?php
$dir = "C:/Users/Kang/Videos/English";
$destDir = "D:/xampp/htdocs/test";
/**
 * Get all .mp4 files in a specific directory.
 */ 
function getFiles($dir){
  $result = array();
  if ($handle = opendir($dir)) {
    while(false !== ($entry = readdir($handle))) {
      if ($entry != "." && $entry != ".." && strrchr($entry, '.') == ".mp4") {
	array_push($result, $entry);
      }
    }
    closedir($handle);
  }
  sort($result, SORT_NATURAL | SORT_FLAG_CASE);
  return $result;
}

function copyFile($fileName) {
  global $dir, $destDir; 
  $sourceFullName = $dir.'/'.$fileName;
  $destFullName = $destDir.'/'.$fileName; 
  if (!file_exists($destFullName)) {
    copy($sourceFullName,$destFullName);  
  }
}

function getVideoUrl($fileName) {
  return "http://192.168.1.101/test/" . rawurlencode($fileName);
}
//var_dump(getFiles($dir));
//echo json_encode(getFiles($dir));
//echo getVideoUrl("Intermediate Levels - Lesson 15 Christmas.mp4");

if (isset($_GET['q'])) {
  $request = $_GET['q'];
  switch($request) {
    case "loadVideo":
	$filename = rawurldecode($_GET['file']);
	copyFile($filename);
	echo getVideoUrl($filename);
	exit;
      break;
    default:
      echo json_encode(getFiles($dir));
      break;
  }
}
echo json_encode(getFiles($dir));
