class Slide {

    constructor() {
        this.urlPhp = "tools.php?param=liste_all";
        this.titreSite = document.title;
        this.pageActive = 0;
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
        this.auteur = "Geoffroy Stolaric";   
    };

    bindTest = function (url = null){        
        let that = this;
        let results = [];
        that.testajax[0].addEventListener('click', function(e){
            e.stopPropagation();
            e.preventDefault();      
            console.log(that.contenu);
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
    
    ajaxContent = async function(url = null, callback){
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
                   let file = obj[element].file;
                   let titrePage = obj[element].titrePage;
                   let content = obj[element].content;
                   let fileName = obj[element].fileName;
                   infos.file = file;
                   infos.titrePage = titrePage;
                   infos.content = content;
                   infos.url = fileName;
                   datas[element] = infos;
                };
                callback(datas, that);
            }
        };
        xhr.onerror = function(){
            console.log("la requête a echoué");
        };        
    };

    init = function(){
        let that = this;
        let depart = 0;
        that.ajaxContent(that.urlPhp, getDatas); 
        function getDatas(content, Slide){ 

            let error = function(content){
                let error = {
                    message:"",
                    reponse:false
                };
                if(content.length === 0){
                    Slide.setElementVisibility(Slide.paginationButtons[0], false);
                    Slide.setElementVisibility(Slide.paginationButtons[1], false);
                    error = {
                        message:"élement(s) manquant(s) dans le dossier files",
                        reponse:true
                    }
                }
                return error;
            };
      
            let getRequest = function(content){
                let queryString = window.location.search;
                let searchParams = new URLSearchParams(queryString);
                let pageRequest = null;
                if(searchParams.has("request") === true){
                    pageRequest = searchParams.get("request").split("/")[2];             
                }               
                let request = null;                   
                for (var element = 0, l = content.length; element < l; element++) {              
                    if(pageRequest === content[element].url){                      
                        request = element;
                    }
                };

                if(request === null){     
                    switch(depart){
                        case depart === undefined :
                            depart = 0;
                            break;
                        case depart > content.length : 
                            depart = content.length - 1;
                        break;
                        default :
                            if (isNaN(depart)){
                            depart = 0;
                            }
                        break;
                    }
                }else{
                    depart = request;
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

            let setSlide = function(content){
                let nbElements = content.length;
                Slide.content.innerHTML="";
                for (var element = 0, l = nbElements; element < l; element++) {
                    var textnode = document.createTextNode(content[element].content)
                    var div = document.createElement("DIV");     
                    div.innerHTML = content[element].content;
                    Slide.setElementVisibility(div, false);
                    Slide.content.appendChild(div);         
                    div.setAttribute("title", content[element].titrePage);
                    div.setAttribute("class","rect");
                    div.setAttribute("url",content[element].url);
                    Slide.setElementVisibility(div, false);
                    if(element === Slide.pageActive){
                        Slide.setElementVisibility(div, true);
                    }                   
                };   
                if(error(Slide.contenu).reponse === true){
                    alert(error(Slide.contenu).message);
                    return;
                }
            };
            
            let setNavMenu = function(content){
                let nbElements = content.length;
                Slide.setElementVisibility(Slide.navigation[0], false);
                Slide.navigation[0].querySelectorAll('ul')[0].innerHTML="";
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

            let display = function(element){
                document.title = window.history.state.title;       
                Slide.setElementVisibility(Slide.paginationButtons[0], true);
                Slide.setElementVisibility(Slide.paginationButtons[1], true);
                if(element === 0){
                    Slide.setElementVisibility(Slide.paginationButtons[0], false);
                    that.paginationButtons[1].setAttribute("href",Slide.contenu[element+1].url);
                } 
                if(element === (Slide.contenu.length - 1)){
                    Slide.setElementVisibility(Slide.paginationButtons[1], false);
                    that.paginationButtons[0].setAttribute("href",Slide.contenu[element-1].url);
                }   
                setSlide(Slide.contenu);                           
                Slide.setStateNavigation(element);
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
            setSlide(Slide.contenu);
            setNavMenu(Slide.contenu); 
            let request = getRequest(Slide.contenu);
            Slide.pageActive = request;
            setDatas(Slide.pageActive); 
            display(Slide.pageActive);    
            bindPagination(Slide.pageActive);
            navHistory();
            Slide.bindSwitchMenu(); 
            Slide.bindTest();
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
