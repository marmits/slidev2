class Slide {

    constructor() {
        this.titreSite = document.title;
        this.pageActive = 0;
        this.elems = document.querySelectorAll('#content div');
        this.switchMenu = document.querySelectorAll('a.switch');
        this.paginationButtons = document.querySelectorAll('.pagination ul li a');
        this.navigation = document.querySelectorAll('.navigation');
        this.nbElements = this.elems.length;
        this.oPageInfo = {
            page:null,
            title: null,
            url: location.href
        };
    }

    error = function(){
        let that = this;
        let error = {
            message:"",
            reponse:false
        };
        
        if(that.elems.length === 0){
            that.setElementVisibility(that.paginationButtons[0], false);
            that.setElementVisibility(that.paginationButtons[1], false);
            error = {
                message:"élement(s) manquant(s) dans <div id=\"content\">\najouter:\n<div class=\"rect\" title=\"un titre\" url=\"uneurl\">un contenu</div>",
                reponse:true
            }
        }
        return error;
    };

    getRequest = function(){
        let that = this;            
        let queryString = window.location.search;
        let searchParams = new URLSearchParams(queryString);
        let pageRequest = null;
        if(searchParams.has("request") === true){
            pageRequest = searchParams.get("request").split("/")[2];        
        }
        let page = null;
        for (var element = 0, l = that.elems.length; element < l; element++) {
            if(pageRequest === that.elems[element].getAttribute("url")){
                page = element;
            }
        };
        return page;
    };

    setDatas = function(element){
        let that = this;        
        let titleSlide = that.elems[element].getAttribute("title");
        let urlSlide = that.elems[element].getAttribute("url");                   
        that.oPageInfo.title = that.titreSite + " - " + titleSlide;
        that.oPageInfo.url = urlSlide;
        that.oPageInfo.page=element;
        history.pushState(that.oPageInfo, that.oPageInfo.title, that.oPageInfo.url);
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
                this.classList.add("close");
            } else {
                that.setElementVisibility(navigation, false);
                this.classList.remove("close");
            }
            
            
        });
    };

    navigationDisplay = function(element){
        let that = this;        
        that.setElementVisibility(that.navigation[0], false);
        let page = window.history.state.page;
        that.navigation[0].querySelectorAll('ul')[0].innerHTML="";
        let i = 0;
        that.elems.forEach(function(contenu){
            
            var textnode = document.createTextNode(contenu.getAttribute("title"));              
            var li = document.createElement("LI");                 
            var a = document.createElement("A");      
            a.appendChild(textnode);                      
            that.navigation[0].querySelectorAll('ul')[0].appendChild(li).appendChild(a);          
            a.setAttribute("href", contenu.getAttribute("url"));
            a.setAttribute("class","");
            if(element === i){
                a.setAttribute("class","active");
            }
            that.bindNavigation(a, i);
        i++;
        });        
    }

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

    bindPagination = function(compteur){
        let that = this;
        that.paginationButtons.forEach(function(button){
            button.addEventListener('click', function(e){
                e.stopPropagation();
                e.preventDefault();
                if((button.getAttribute("class") === "prev") && (that.pageActive !== 0)){
                    that.pageActive--;
                } 
                if((button.getAttribute("class") === "next") && (that.pageActive !== (that.nbElements - 1))){
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
    }

    display = function(element){
        let that = this;
        document.title = window.history.state.title;       
        that.setElementVisibility(that.paginationButtons[0], true);
        that.setElementVisibility(that.paginationButtons[1], true);

        for (var i = 0, l = that.nbElements; i < l; i++){
            that.setElementVisibility(that.elems[i], false);
        }

        that.setElementVisibility(that.elems[element], true);
        
        if(element === 0){
            that.setElementVisibility(that.paginationButtons[0], false);
        } else {
            that.paginationButtons[0].setAttribute("href",that.elems[element-1].getAttribute("url"));
        }
        if(element === (that.nbElements - 1)){
            that.setElementVisibility(that.paginationButtons[1], false);
        } else {
            that.paginationButtons[1].setAttribute("href",that.elems[element+1].getAttribute("url"));
        }
        that.setStateNavigation(element);
    };

    init = function(){
        let that = this;
        let depart = 0;
        if(that.error().reponse === true){
            alert(that.error().message);
            return;
        }
        let request = that.getRequest();
        if(request === null){     
            switch(depart){
                case depart === undefined :
                    depart = 0;
                break;
                case depart > that.nbElements : 
                    depart = that.nbElements - 1;
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

        that.pageActive = depart; 
        that.setDatas(depart);                
        that.display(depart);
        that.navigationDisplay(depart); 
        that.bindPagination();
        that.navHistory();
        that.bindSwitchMenu(); 
    };

    create = function (nom) {
        let that = this;
        that.titreSite = nom;
        window.addEventListener ? addEventListener("load", that.init(), false) : window.attachEvent ? attachEvent("onload", that.init()) : (onload = that.init());        
    }
};

const slideLuiggi = new Slide();
if(slideLuiggi !== undefined){
     slideLuiggi.create("Luiggi's Slide");    
}
