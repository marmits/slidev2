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

    create = function (nom){
        let that = this;
        that.titreSite = nom;
        window.addEventListener ? addEventListener("load", that.init(), false) : window.attachEvent ? attachEvent("onload", that.init()) : (onload = that.init());        
    };

    bindTest = function (url = null){
        let that = this;
        let results = [];
        that.testajax[0].addEventListener('click', function(e){
            e.stopPropagation();
            e.preventDefault();      
            console.log(that.directories);
            console.log(that.pageActive);
            
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

    ajaxDirectories = async function(url){
        let that = this;
        let datas = [];
        var xhr=new XMLHttpRequest();
        var res = new Promise(function (resolve, reject) {
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

                    resolve(datas);
                }
            };
            xhr.onerror = function(){
                reject("la requête a echoué");
            };
        });
        return res;        
    };

    ajaxInfos = async function(url){
        let that = this;
        let datas = [];
        var xhr=new XMLHttpRequest();

        var res = new Promise(function (resolve, reject) {
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
                    resolve(obj);
                }
            };
            xhr.onerror = function(){
                reject("la requête a echoué");
            };
        });
        return res;
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

    error = function(content, value){
        let that = this;
        let error = {
            message:"",
            reponse:false
        };
        if(content.length === 0){ 
            that.setElementVisibility(that.paginationButtons[0], false);
            that.setElementVisibility(that.paginationButtons[1], false);
            error = {
                message:"élement(s) manquant(s) dans le dossier datas\nVeuillez ajouter un dossier et un fichier index.html\ndans le répertoire \""+value+"\"",
                reponse:true
            }
        }
        return error;
    };

    getRequest = function(content){
        
        let queryString = window.location.search;
        let searchParams = new URLSearchParams(queryString);
        let pageRequest = null;
        let pages = [];
        var depart = 0;
        var res = new Promise(function (resolve, reject) {
            if(searchParams.has("request") === true){
                pageRequest = searchParams.get("request").split("/")[2];    
                if(pageRequest){
                    
                    for (var element = 0, l = content.length; element < l; element++) {
                        pages[element] = content[element].titrePage;
                    }    

                    depart = pages.indexOf(pageRequest);

                } 
                if(depart === -1){
                    depart = 0;
                }     
            resolve(depart);   
            } else{
                reject("erreur");
            }
            
        }); 
        return res;
    };

    setDatas = function(element){
        let that = this;

        that.pageActive = element;        
        let titleSlide = that.directories[element].titrePage;
        let urlSlide = that.directories[element].url;    
        
        that.oPageInfo.title = that.titreSite + " - " + titleSlide;
        that.oPageInfo.url = urlSlide;
        that.oPageInfo.page = element;

        history.pushState(that.oPageInfo, that.oPageInfo.title, that.oPageInfo.url);
    };

    setSlide = function(page){
        let that = this;
        let nbElements = that.directories.length; 
        that.ajaxFile("tools.php?param=liste_file&file="+that.directories[page].url, getHtml);
        function getHtml(content){ 
            that.content.innerHTML="";                            
            var div = document.createElement("DIV");     
            div.innerHTML = content[0].content;
            that.setElementVisibility(div, false);
            that.content.appendChild(div);       
            div.setAttribute("class","rect");
            div.setAttribute("file",content[0].file);
            that.setElementVisibility(div, true);
        }                
    };
    
    setNavMenu = function(content){
        let that = this;
        let nbElements = content.length;
        that.setElementVisibility(that.navigation[0], false);
        that.navigation[0].innerHTML="";
        var ul = document.createElement("UL");
        that.navigation[0].appendChild(ul);
        let i = 0;
               
        for (var element = 0, l = nbElements; element < l; element++) {
            var textnode = document.createTextNode(content[element].titrePage);              
            var li = document.createElement("LI");                 
            var a = document.createElement("A");      
            a.appendChild(textnode);                      
            that.navigation[0].querySelectorAll('ul')[0].appendChild(li).appendChild(a);          
            a.setAttribute("href", content[element].url);
            a.setAttribute("class","");

            if(element === that.pageActive){
                a.setAttribute("class","active");
            }
            that.bindNavigation(a, i);
        i++;
        };
    };

    display = function(element){
        let that = this;
        document.title = window.history.state.title;       
        that.setElementVisibility(that.paginationButtons[0], true);
        that.setElementVisibility(that.paginationButtons[1], true);

        if(that.pageActive === 0){
            that.setElementVisibility(that.paginationButtons[0], false);            
        } else {
            that.paginationButtons[0].setAttribute("href",that.directories[that.pageActive-1].url);
        }
        if(that.pageActive === (that.directories.length - 1)){
            that.setElementVisibility(that.paginationButtons[1], false);            
        } else {
            that.paginationButtons[1].setAttribute("href",that.directories[that.pageActive+1].url);
        }            
        that.setSlide(that.pageActive);                           
        that.setStateNavigation(that.pageActive);
    };

    bindPagination = function(compteur){
        let that = this;
        let page = "";
        that.paginationButtons.forEach(function(button){
            button.addEventListener('click', function(e){
                e.stopPropagation();
                e.preventDefault();
                that.setElementVisibility(Slide.elems, false);
                if((button.getAttribute("class") === "prev") && (that.pageActive !== 0)){
                    that.pageActive--;
                } 
                if((button.getAttribute("class") === "next") && (that.pageActive !== (that.directories.length - 1))){
                    that.pageActive++;
                } 
                that.setDatas(that.pageActive);                
                that.display(that.pageActive);    
            });
        });
    };

    navHistory = function(){
        let that = this;
        window.onpopstate=function (oEvent){
            if(window.history.state !== null){
                that.pageActive = window.history.state.page;
                that.display(that.pageActive); 
            }
        };
    };

    bindNavigation = function(link, page){
        let that = this;
        link.addEventListener('click', function(e){
            e.stopPropagation();
            e.preventDefault();                  
            that.pageActive = page;   
            that.setDatas(page); 
            that.display(page);
        });
    };
    
    init = function(){
        let that = this;
        let depart = 0;
        
        that.ajaxDirectories(that.urlDir)
       
        .then((datas) =>  {
            that.directories = datas;
            return that.ajaxInfos(that.urlInfos)            
        })
        .then((value) => {
            if(that.error(that.directories, value.pathDir).reponse === true){
                alert(that.error(that.directories, value.pathDir).message);
                return;
            } 
            return that.getRequest( that.directories);
        })        
        .then((element) =>  {   
            if(that.directories.length != 0){
                that.setDatas(element);
                that.setNavMenu(that.directories);
                that.display(element);
                that.bindPagination(element);
                that.navHistory();
                that.bindSwitchMenu();
                that.bindTest(that.urlDir);
            }
        });        
    };
};

const slideLuiggi = new Slide();
if(slideLuiggi !== undefined){
     slideLuiggi.create("Luiggi's Slide");    
};