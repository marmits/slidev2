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
		$list_tri = 'DESC';

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

	function getAllContent(){
		$doc1 = new DOMDocument();
		$datas = [];
		foreach ($this->getFiles() as $key => $value) {
			$contentFile = $this->readFile($this->path.$value);

			$doc1->loadHTML($contentFile);
			$htmlRecup = $doc1->saveHTML();
			$layout = preg_replace('~<(?:!DOCTYPE|/?(?:html|head|body))[^>]*>\s*~i', '', $htmlRecup);
			$html = str_get_html($htmlRecup);
			$h1 = $html->find('h1', 0)->innertext;	
			$datas[$key] = array("nom"  => $value,"titrePage"  => $h1, "content" => $layout);
			
		}
		return $datas;
	}

	function getFileName(){
		$datas = [];
		foreach ($this->getFiles() as $key => $value) {
			$datas[$key] = array("file"  => $value);
			
		}
		return $datas;
	}

	function getResult(){
		if($this->parametre === "liste_nom_fichier"){
			return $this->getFileName();
		} elseif($this->parametre === "liste_all")  {
			return $this->getAllContent();
		}
	}


}
header('Content-type:application/json;charset=utf-8');
$param = null;
if(isset($_GET["param"])){
	$param = $_GET["param"];
}
$datas = new Data($param);
//print_r($datas->getAllContent());

//renvoie les noms des fichiers pour construire le menu
echo json_encode($datas->getResult());

// renvoie tous pour test à transformer en inviduel pour le click menu
//echo json_encode($datas->getAllContents());


// a faire ->
