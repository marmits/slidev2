<?php
$slide = '/'.basename(__dir__).'/';
set_include_path($_SERVER["DOCUMENT_ROOT"].$slide);
error_reporting(E_ALL|E_STRICT);
ini_set('display_errors', 1);
date_default_timezone_set('Europe/Paris');
require_once('simple_html_dom.php');


Class Data
{
	private $path;
	private $ListFiles=[];
	private $listDir=[];
	private $parametre;

	function __construct($param = null)
	{
		$this->path =  get_include_path()."files/";
		$this->parametre = $param;
		$this->datasDir = get_include_path()."datas/";
	}

	function getPath(){
		return $this->path;
	}

	function getdatasDirPath(){
		return $this->datasDir;
	}

	function getInfos(){
		$datas["pathDir"] = $this->getdatasDirPath();
		return $datas;
	}

	function getFiles(){
		$path = $this->getPath();
		$dp = opendir($path);
		$i=0;
		while ( $file = readdir($dp) ){
			if ($file != '.' && $file != '..'){
				$this->ListFiles[$i]=$file;
				$i++;
			}
		}
		closedir($dp);
		$list_tri = 'ASC';
		if(count($this->ListFiles)!=0){
			if($list_tri == 'DESC'){
				rsort($this->ListFiles);
			}
			else{
				sort($this->ListFiles);
			}
		}
		return $this->ListFiles;
	}

	function getDirectories(){
		$path = $this->datasDir;
		if($dp = opendir($path)){
			$i=0;

			while (false !== ($file = readdir($dp))){
				
				if ($file != '.' && $file != '..'){	
					
					if(is_dir($this->datasDir.$file)){

						$this->listDir[$i]=$file;
						$i++;
					}
				}
			}
			closedir($dp);
			$list_tri = 'ASC';

			if(count($this->listDir)!=0){
				if($list_tri == 'DESC'){
					rsort($this->listDir);
				}
				else{
					sort($this->listDir);
				}
			}
		}		
		return $this->listDir;
	}

	function readFile($file){
		if (file_exists($file)) {
			$contenu = file_get_contents($file);
		} else {
			$contenu = "<h1>\"".$file."\" manquant</h1>";
		}
		return $contenu;
	}

	function extractContent($path, $file){
		$records = [];
		$doc1 = new DOMDocument();
		$contentFile = $this->readFile($path.$file);
		$doc1->loadHTML($contentFile);
		$htmlRecup = $doc1->saveHTML();
		$layout = preg_replace('~<(?:!DOCTYPE|/?(?:html|head|body))[^>]*>\s*~i', '', $htmlRecup);
		$html = str_get_html($htmlRecup);
		$h1 = $html->find('h1', 0)->innertext;	
		$fileName = pathinfo($this->getPath().$file, PATHINFO_FILENAME);
		$records = array("file"  => $path.$file,"titrePage"  => $h1, "content" => $layout, "fileName" => $fileName);
		$records = array("content" => $layout);
		return $records;
	}

	function extractContentLight($path, $file){
		$records = [];
		$doc1 = new DOMDocument();
		$contentFile = $this->readFile($path.$file);
		$doc1->loadHTML($contentFile);
		$htmlRecup = $doc1->saveHTML();
		$layout = preg_replace('~<(?:!DOCTYPE|/?(?:html|head|body))[^>]*>\s*~i', '', $htmlRecup);
		$fileName = pathinfo($this->getPath().$file, PATHINFO_FILENAME);
		$records = array("file"  => $path.$file, "content" => $layout, "fileName" => $fileName);
		return $records;
	}

	function getAllContent(){		
		$datas = [];
		foreach ($this->getFiles() as $key => $file) {		
			$datas[$key] = $this->extractContent($this->path, $file);
		}
		return $datas;
	}

	function getFileContent($dir){
		$datas = [];
		$datas[0] = $this->extractContentLight($this->datasDir.$dir."/", "index.html");			
		return $datas;
	}

	function getFileName(){
		$datas = [];
		foreach ($this->getFiles() as $key => $file) {
			$datas[$key] = array("file"  => $file ,"titrePage" => null, "content" => null);			
		}
		return $datas;
	}

	function getResult($file = null){
		if($this->parametre === "liste_nom_fichier"){
			return $this->getFileName();
		} elseif($this->parametre === "liste_all")  {
			return $this->getAllContent();		
		} elseif($this->parametre === "liste_file")  {
			return $this->getFileContent($file);
		} elseif($this->parametre === "liste_directory")  {
			return $this->getDirectories();
		} elseif($this->parametre === "getInfos")  {
			return $this->getInfos();
		}
	}
}
header('Content-type:application/json;charset=utf-8');
$param = null;
$file = null;
if(isset($_GET["param"])){
	$param = $_GET["param"];
	if(isset($_GET["file"])){
		$file = $_GET["file"];
	}
}
$datas = new Data($param);
echo json_encode($datas->getResult($file));