class Slide {

    constructor() {
        this.urlPhp = "tools.php?param=liste_all";
        this.urlDir = "tools.php?param=liste_directory";
        this.urlInfos = "tools.php?param=getInfos";
        this.titreSite = document.title;
        this.pageActive = 0;
        this.dirActif = null;
        this.content = document.getElementById('content');
        this.switchMenu = document.querySelectorAll('a.switch');
        this.paginationButtons = document.querySelectorAll('.pagination ul li a');
        this.navigation = document.querySelectorAll('.navigation');
        this.testajax = document.querySelectorAll('a.testajax');
        this.oPageInfo = {
            page:null,
            title: null,
            url: location.href
        };
        this.contenu = [];  
        this.directories = [];  
        this.dirPath = "test dir path"; 
        this.auteur = "Geoffroy Stolaric";   
    };

    bindTest = function (url = null){        
        let that = this;
        let results = [];
        that.testajax[0].addEventListener('click', function(e){
            e.stopPropagation();
            e.preventDefault();      
            that.ajaxDirectories(url, getDirectories);
            function getDirectories(content, Slide){
                console.log(content);
            }
        });   
    };

    setElementVisibility = function(element,visible){
        if(typeof visible === "boolean" && element instanceof HTMLElement){
            if(visible === true){
                if (element.classList.contains("hidden")){
                    element.classList.remove("hidden");
                }
            }else{
                if (!element.classList.contains("hidden")){
                    element.classList.add("hidden");
                }
            }
        }
    };

    bindSwitchMenu = function(){
        let that = this;
        let navigation = that.navigation[0];
        that.switchMenu[0].addEventListener('click', function(e){
            e.stopPropagation();
            e.preventDefault();  
            if(navigation.classList.contains("hidden")){
                that.setElementVisibility(navigation, true);
                that.content.classList.add("small");
                this.classList.add("close");
            } else {
                that.setElementVisibility(navigation, false);
                that.content.classList.remove("small");
                this.classList.remove("close");               
            }
        });
    };

    setStateNavigation = function(page){
        let that = this;
        // forEachNav method, could be shipped as part of an Object Literal/Module
        var forEachNav = function (array, callback, scope) {
          for (var i = 0; i < array.length; i++) {
            callback.call(scope, i, array[i]); // passes back stuff we need
          }
        };

        // Usage:
        // optionally change the scope as final parameter too, like ECMA5
        var linksList = that.navigation[0].querySelectorAll('ul')[0].getElementsByTagName("a");
        forEachNav(linksList, function (index, value) {
            value.setAttribute("class","");            
        });

        if(linksList.length > 0){
            linksList[page].setAttribute("class","active");
        }
    };

    ajaxDirectories = async function(url = null, callback){
        let that = this;
        let datas = [];
        var xhr=new XMLHttpRequest();
        xhr.open("GET",url);
        xhr.responseType = "json";
        xhr.send();
        xhr.onload = function(){
            if (xhr.status != 200){ 
                console.log("Erreur " + xhr.status + " : " + xhr.statusText);
            }else{ 
                let datas = [];
                let status = xhr.status;
                let obj = JSON.parse(JSON.stringify(xhr.response));

                for (var element = 0, l = obj.length; element < l; element++) {

                    let infos = {};
                    let titrePage = obj[element];
                    infos.titrePage = titrePage;
                    infos.url = titrePage;
                    datas[element] = infos;
                   
                };
                that.directories = datas;
                callback(datas, that);
            }
        };
        xhr.onerror = function(){
            console.log("la requête a echoué");
        };        
    };

    ajaxInfos = async function(url = null, callback){

        let that = this;
        let datas = [];
        var xhr=new XMLHttpRequest();
        xhr.open("GET",url);
        xhr.responseType = "json";
        xhr.send();
        xhr.onload = function(){
            if (xhr.status != 200){ 
                console.log("Erreur " + xhr.status + " : " + xhr.statusText);
            }else{ 
                let datas = [];
                let status = xhr.status;
                let obj = JSON.parse(JSON.stringify(xhr.response));
                callback(obj, that);
            }
        };
        xhr.onerror = function(){
            console.log("la requête a echoué");
        };        
    };

    ajaxFile = async function(url = null, callback){
        
        let that = this;
        let datas = [];
        let infos = {};
        let obj = null;
        var xhr=new XMLHttpRequest();
        xhr.open("GET",url);
        xhr.responseType = "json";
        xhr.send();
        xhr.onload = function(){
            if (xhr.status != 200){ 
                console.log("Erreur " + xhr.status + " : " + xhr.statusText);
            }else{ 
                let status = xhr.status;
                let obj = JSON.parse(JSON.stringify(xhr.response));
                if(obj !== null){
                    for (var element = 0, l = obj.length; element < l; element++) {
                        infos = obj[element];
                        datas[element] = infos;                       
                    };
                    callback(datas, that);
                }
            }
        };
        xhr.onerror = function(){
            console.log("la requête a echoué");
        };        
    };

    error = function(content){
        let that = this;
        let error = {
            message:"",
            reponse:false
        };
        if(content.length === 0){
                                
            that.ajaxInfos(that.urlInfos, getInfos);
            function getInfos(content, Slide){ 

                 that.dirPath = content.pathDir;
                 
            }
            that.setElementVisibility(that.paginationButtons[0], false);
            that.setElementVisibility(that.paginationButtons[1], false);

            error = {
                message:"élement(s) manquant(s) dans le dossier datas\nVeuillez ajouter un dossier et un fichier index.html\ndans le répertoire \"datas\"",
                reponse:true
            }
        }
        return error;
    };
    
    init = function(){
        let that = this;
        let depart = 0;
        
        that.ajaxDirectories(that.urlDir, getDatas);
        function getDatas(content, Slide){ 

            
      
            let getRequest = function(content){
                let queryString = window.location.search;
                let searchParams = new URLSearchParams(queryString);
                let pageRequest = null;
                let pages = [];
                if(searchParams.has("request") === true){
                    pageRequest = searchParams.get("request").split("/")[2];             
                }        
                
                if(pageRequest){
                    Slide.dirActif = pageRequest;
                    for (var element = 0, l = content.length; element < l; element++) {
                        pages[element] = content[element].titrePage;
                    }    

                    depart = pages.indexOf(pageRequest);
                } 

                if(depart === -1){
                    depart = 0;
                    Slide.dirActif = content[0];
                }
                    
                return depart;
            };

            let setDatas = function(element){                   
                let titleSlide = Slide.contenu[element].titrePage;
                let urlSlide = Slide.contenu[element].url;    
                
                Slide.oPageInfo.title = Slide.titreSite + " - " + titleSlide;
                Slide.oPageInfo.url = urlSlide;
                Slide.oPageInfo.page=element;
                history.pushState(Slide.oPageInfo, Slide.oPageInfo.title, Slide.oPageInfo.url);
            };

            let setSlide = function(page){
                let nbElements = content.length; 
                

                Slide.ajaxFile("tools.php?param=liste_file&file="+content[page].url, getHtml);
                
                function getHtml(content, Slide){ 
                    
                    Slide.content.innerHTML="";                            
                    var div = document.createElement("DIV");     
                    div.innerHTML = content[0].content;
                    Slide.setElementVisibility(div, false);
                    Slide.content.appendChild(div);       
                    div.setAttribute("title", content[0].titrePage);
                    div.setAttribute("class","rect");
                    div.setAttribute("url",content[0].fileName);

                    Slide.setElementVisibility(div, true);
                }
                
            };
            
            let setNavMenu = function(content){
                let nbElements = content.length;
                Slide.setElementVisibility(Slide.navigation[0], false);
                Slide.navigation[0].innerHTML="";
                var ul = document.createElement("UL");
                Slide.navigation[0].appendChild(ul);
                let i = 0;
                                
                for (var element = 0, l = nbElements; element < l; element++) {
                    
                    var textnode = document.createTextNode(content[element].titrePage);              
                    var li = document.createElement("LI");                 
                    var a = document.createElement("A");      
                    a.appendChild(textnode);                      
                    Slide.navigation[0].querySelectorAll('ul')[0].appendChild(li).appendChild(a);          
                    a.setAttribute("href", content[element].url);
                    a.setAttribute("class","");

                    if(element === Slide.pageActive){
                        a.setAttribute("class","active");
                    }
                    bindNavigation(a, i);
                i++;
                };     
            };

            let display = function(contenu){
                document.title = window.history.state.title;       
                Slide.setElementVisibility(Slide.paginationButtons[0], true);
                Slide.setElementVisibility(Slide.paginationButtons[1], true);
                if(Slide.pageActive === 0){
                    Slide.setElementVisibility(Slide.paginationButtons[0], false);
                    that.paginationButtons[1].setAttribute("href",Slide.contenu[Slide.pageActive+1].url);
                } 
                if(Slide.pageActive === (Slide.contenu.length - 1)){
                    Slide.setElementVisibility(Slide.paginationButtons[1], false);
                    that.paginationButtons[0].setAttribute("href",Slide.contenu[Slide.pageActive-1].url);
                }   

                setSlide(Slide.pageActive);                           
                Slide.setStateNavigation(Slide.pageActive);
            };

            let bindPagination = function(compteur){
                let page = "";
                Slide.paginationButtons.forEach(function(button){
                    button.addEventListener('click', function(e){
                        e.stopPropagation();
                        e.preventDefault();
                        Slide.setElementVisibility(Slide.elems, false);
                        if((button.getAttribute("class") === "prev") && (Slide.pageActive !== 0)){
                            Slide.pageActive--;
                        } 
                        if((button.getAttribute("class") === "next") && (Slide.pageActive !== (Slide.contenu.length - 1))){
                            Slide.pageActive++;
                        } 
                        setDatas(Slide.pageActive);                
                        display(Slide.pageActive);    
                    });
                });
            };

            let navHistory = function(){
                window.onpopstate=function (oEvent){
                    if(window.history.state !== null){
                        Slide.pageActive = window.history.state.page;
                        display(Slide.pageActive); 
                    }
                };
            };

            let bindNavigation = function(link, page){
                link.addEventListener('click', function(e){
                    e.stopPropagation();
                    e.preventDefault();                  
                    Slide.pageActive = page;   
                    setDatas(page); 
                    display(page);
                });
            };
                              

            Slide.contenu = content;            
            let errorScript = Slide.error(Slide.contenu);
            if(errorScript.reponse === true){
                alert(errorScript.message);
                return;
            }
            let request = getRequest(content);
            Slide.pageActive = request;
            
            setDatas(request);  
            setNavMenu(content); 
            display(content);            
            bindPagination(request);
            navHistory();
            Slide.bindSwitchMenu();
            Slide.bindTest(that.urlDir);
            
        };        
    };

    create = function (nom){
        let that = this;
        that.titreSite = nom;
        window.addEventListener ? addEventListener("load", that.init(), false) : window.attachEvent ? attachEvent("onload", that.init()) : (onload = that.init());        
    };
};

const slideLuiggi = new Slide();
if(slideLuiggi !== undefined){
     slideLuiggi.create("Luiggi's Slide");    
}


