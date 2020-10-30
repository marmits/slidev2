<?php
set_include_path($_SERVER["DOCUMENT_ROOT"].'/slidev2/');

error_reporting(E_ALL|E_STRICT);
ini_set('display_errors', 1);
date_default_timezone_set('Europe/Paris');
require_once('simple_html_dom.php');





Class Data
{

	private $path;
	private $ListFiles=[];
	private $parametre;

	function __construct($param = null)
	{
		$this->path =  get_include_path()."files/";
		$this->parametre = $param;
	}

	function getPath(){
		return $this->path;
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

	function readFile($file){
		return file_get_contents($file);
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
		$records = array("file"  => $file,"titrePage"  => $h1, "content" => $layout);
		return $records;
	}

	function getAllContent(){
		
		$datas = [];
		foreach ($this->getFiles() as $key => $file) {		
			$datas[$key] = $this->extractContent($this->path, $file);
		}
		return $datas;
	}

	function getFileContent($file){
		
		$datas = [];
		$datas[0] = $this->extractContent($this->path, $file);		
			
		
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
//print_r($datas->getAllContent());

//renvoie les noms des fichiers pour construire le menu
echo json_encode($datas->getResult($file));

// renvoie tous pour test à transformer en inviduel pour le click menu
//echo json_encode($datas->getAllContents());


// a faire ->