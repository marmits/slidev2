let Slide = function(){
    
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

    this.error = function(){
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

    this.getRequest = function(){
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

    this.setDatas = function(element){
        let that = this;
        let titleSlide = that.elems[element].getAttribute("title");
        let urlSlide = that.elems[element].getAttribute("url");           

        that.oPageInfo.title = titreSite + " - " + titleSlide;
        that.oPageInfo.url = urlSlide;
        that.oPageInfo.page=element;

        history.pushState(that.oPageInfo, that.oPageInfo.title, that.oPageInfo.url);
    };

    this.setElementVisibility = function(element,visible){
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

    this.bindSwitchMenu = function(){
        let that = this;
        let navigation = that.navigation[0];

        that.switchMenu[0].addEventListener('click', function(e){
            e.stopPropagation();
            e.preventDefault();  
            if(navigation.classList.contains("hidden")){
                that.setElementVisibility(navigation, true);
            } else {
                that.setElementVisibility(navigation, false);
            }
            
            
        });
    };

    this.navigationDisplay = function(element){
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

    this.bindNavigation = function(link, page){
        let that = this;
        link.addEventListener('click', function(e){
            e.stopPropagation();
            e.preventDefault();                  
            pageActive = page;   
            that.setDatas(page); 
            that.display(page);
        });
    };

    this.setStateNavigation = function(page){
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

    this.bindPagination = function(compteur){
        let that = this;
        that.paginationButtons.forEach(function(button){
            button.addEventListener('click', function(e){
                e.stopPropagation();
                e.preventDefault();
                if((button.getAttribute("class") === "prev") && (pageActive !== 0)){
                    pageActive--;
                } 
                if((button.getAttribute("class") === "next") && (pageActive !== (that.nbElements - 1))){
                    pageActive++;
                } 
                that.setDatas(pageActive);                
                that.display(pageActive);               
            });
        });
    };

    this.navHistory = function(){
        let that = this;
        window.onpopstate=function (oEvent){
            if(window.history.state !== null){
                pageActive = window.history.state.page;
                that.display(pageActive); 
            }
        };
    }

    this.display = function(element){
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

    this.init = function(){
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

        pageActive = depart; 
        that.setDatas(depart);                
        that.display(depart);
        that.navigationDisplay(depart); 
        that.bindPagination();
        that.navHistory();
        that.bindSwitchMenu(); 
    };
};

const titreSite = document.title;
var pageActive = 0;
const slideLuiggi = new Slide();
if(slideLuiggi !== undefined){
    window.addEventListener ? addEventListener("load", slideLuiggi.init(), false) : window.attachEvent ? attachEvent("onload", slideLuiggi.init()) : (onload = slideLuiggi.init());
}


